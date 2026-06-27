import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import { Portfolio, PortfolioDocument } from './schemas/portfolio.schema';
import { Position, PositionDocument } from './schemas/position.schema';
import { Trade, TradeDocument } from './schemas/trade.schema';
import { CreatePositionDto } from './dto/create-position.dto';
import { ClosePositionDto } from './dto/close-position.dto';

@Injectable()
export class PortfolioService {
    constructor(
        @InjectModel(Portfolio.name) private readonly portfolioModel: Model<PortfolioDocument>,
        @InjectModel(Position.name) private readonly positionModel: Model<PositionDocument>,
        @InjectModel(Trade.name) private readonly tradeModel: Model<TradeDocument>,
        @InjectConnection() private readonly connection: Connection,
    ) { }

    async getUserPortfolios(userId: string) {
        return this.portfolioModel.find({ user_id: new Types.ObjectId(userId) })
            .sort({ created_at: -1 })
            .exec();
    }

    async createPortfolio(userId: string, data: Partial<Portfolio>) {
        const portfolio = new this.portfolioModel({ ...data, user_id: new Types.ObjectId(userId) });
        return portfolio.save();
    }

    async openPosition(portfolioId: string, userId: string, dto: CreatePositionDto) {
        const portfolio = await this.portfolioModel.findOne({
            _id: new Types.ObjectId(portfolioId),
            user_id: new Types.ObjectId(userId),
        });
        if (!portfolio) throw new NotFoundException('Portfolio not found');

        const total = dto.quantity * dto.price;
        const fee = total * 0.001; // 0.1% fee

        if (portfolio.current_cash < total + fee) {
            throw new BadRequestException('Insufficient cash balance');
        }

        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            // Deduct cash
            portfolio.current_cash -= total + fee;
            await portfolio.save({ session });

            // Create position
            const position = new this.positionModel({
                portfolio_id: portfolio._id,
                symbol_id: new Types.ObjectId(dto.symbol_id),
                side: dto.side || 'long',
                quantity: dto.quantity,
                avg_entry_price: dto.price,
                stop_loss: dto.stop_loss,
                take_profit: dto.take_profit,
            });
            const savedPosition = await position.save({ session });

            // Record trade
            const trade = new this.tradeModel({
                position_id: savedPosition._id,
                portfolio_id: portfolio._id,
                symbol_id: new Types.ObjectId(dto.symbol_id),
                type: dto.side === 'short' ? 'short' : 'buy',
                quantity: dto.quantity,
                price: dto.price,
                total,
                fee,
            });
            await trade.save({ session });

            await session.commitTransaction();
            return { position: savedPosition, trade, remaining_cash: portfolio.current_cash };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async closePosition(portfolioId: string, positionId: string, userId: string, dto: ClosePositionDto) {
        const position = await this.positionModel.findOne({
            _id: new Types.ObjectId(positionId),
            portfolio_id: new Types.ObjectId(portfolioId),
            status: 'open'
        });
        if (!position) throw new NotFoundException('Open position not found');

        const portfolio = await this.portfolioModel.findOne({
            _id: new Types.ObjectId(portfolioId),
            user_id: new Types.ObjectId(userId)
        });
        if (!portfolio) throw new NotFoundException('Portfolio not found');

        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            const total = position.quantity * dto.exit_price;
            const fee = total * 0.001;

            const pnl = position.side === 'long'
                ? (dto.exit_price - position.avg_entry_price) * position.quantity - fee
                : (position.avg_entry_price - dto.exit_price) * position.quantity - fee;

            position.status = 'closed';
            position.closed_at = new Date();
            position.realized_pnl = pnl;
            position.unrealized_pnl = 0;
            await position.save({ session });

            portfolio.current_cash += total - fee;
            await portfolio.save({ session });

            const trade = new this.tradeModel({
                position_id: position._id,
                portfolio_id: portfolio._id,
                symbol_id: position.symbol_id,
                type: position.side === 'short' ? 'cover' : 'sell',
                quantity: position.quantity,
                price: dto.exit_price,
                total,
                fee,
                notes: dto.notes,
            });
            await trade.save({ session });

            await session.commitTransaction();
            return { position, trade, pnl, remaining_cash: portfolio.current_cash };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getPortfolioMetrics(portfolioId: string, userId: string) {
        const portfolio = await this.portfolioModel.findOne({
            _id: new Types.ObjectId(portfolioId),
            user_id: new Types.ObjectId(userId)
        }).exec();

        if (!portfolio) throw new NotFoundException('Portfolio not found');

        const openPositions = await this.positionModel.find({
            portfolio_id: portfolio._id,
            status: 'open'
        }).populate('symbol_id').exec();

        const closedTrades = await this.tradeModel.find({
            portfolio_id: portfolio._id
        }).exec();

        const closedPositions = await Promise.all(
            closedTrades.map(t => this.positionModel.findById(t.position_id).exec())
        );

        const totalRealizedPnl = closedPositions.reduce((sum, position) => {
            if (position && position.realized_pnl) {
                return sum + position.realized_pnl;
            }
            return sum;
        }, 0);

        const positionValue = openPositions.reduce(
            (sum, p) => sum + p.quantity * (p.current_price || p.avg_entry_price), 0
        );

        const totalValue = portfolio.current_cash + positionValue;
        const totalPnl = totalValue - portfolio.initial_cash;
        const totalPnlPct = (totalPnl / portfolio.initial_cash) * 100;

        return {
            portfolio,
            metrics: {
                total_value: totalValue,
                cash_balance: portfolio.current_cash,
                position_value: positionValue,
                total_pnl: totalPnl,
                total_pnl_percent: totalPnlPct,
                realized_pnl: totalRealizedPnl,
                open_positions: openPositions.length,
                total_trades: closedTrades.length,
            },
        };
    }
}
