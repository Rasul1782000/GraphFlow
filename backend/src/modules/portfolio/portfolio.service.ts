import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { Position } from './entities/position.entity';
import { Trade } from './entities/trade.entity';
import { CreatePositionDto } from './dto/create-position.dto';
import { ClosePositionDto } from './dto/close-position.dto';

@Injectable()
export class PortfolioService {
    constructor(
        @InjectRepository(Portfolio) private readonly portfolioRepo: Repository<Portfolio>,
        @InjectRepository(Position) private readonly positionRepo: Repository<Position>,
        @InjectRepository(Trade) private readonly tradeRepo: Repository<Trade>,
        private readonly dataSource: DataSource,
    ) { }

    async getUserPortfolios(userId: string) {
        return this.portfolioRepo.find({
            where: { user_id: userId },
            relations: ['positions', 'positions.symbol'],
            order: { created_at: 'DESC' },
        });
    }

    async createPortfolio(userId: string, data: Partial<Portfolio>) {
        const portfolio = this.portfolioRepo.create({ ...data, user_id: userId });
        return this.portfolioRepo.save(portfolio);
    }

    async openPosition(portfolioId: string, userId: string, dto: CreatePositionDto) {
        const portfolio = await this.portfolioRepo.findOne({
            where: { id: portfolioId, user_id: userId },
        });
        if (!portfolio) throw new NotFoundException('Portfolio not found');

        const total = dto.quantity * dto.price;
        const fee = total * 0.001; // 0.1% fee

        if (portfolio.current_cash < total + fee) {
            throw new BadRequestException('Insufficient cash balance');
        }

        return this.dataSource.transaction(async (manager) => {
            // Deduct cash
            portfolio.current_cash -= total + fee;
            await manager.save(portfolio);

            // Create position
            const position = manager.create(Position, {
                portfolio_id: portfolioId,
                symbol_id: dto.symbol_id,
                side: dto.side || 'long',
                quantity: dto.quantity,
                avg_entry_price: dto.price,
                stop_loss: dto.stop_loss,
                take_profit: dto.take_profit,
            });
            const savedPosition = await manager.save(position);

            // Record trade
            const trade = manager.create(Trade, {
                position_id: savedPosition.id,
                portfolio_id: portfolioId,
                symbol_id: dto.symbol_id,
                type: dto.side === 'short' ? 'short' : 'buy',
                quantity: dto.quantity,
                price: dto.price,
                total,
                fee,
            });
            await manager.save(trade);

            return { position: savedPosition, trade, remaining_cash: portfolio.current_cash };
        });
    }

    async closePosition(portfolioId: string, positionId: string, userId: string, dto: ClosePositionDto) {
        const position = await this.positionRepo.findOne({
            where: { id: positionId, portfolio_id: portfolioId, status: 'open' },
        });
        if (!position) throw new NotFoundException('Open position not found');

        const portfolio = await this.portfolioRepo.findOne({ where: { id: portfolioId, user_id: userId } });
        if (!portfolio) throw new NotFoundException('Portfolio not found');

        return this.dataSource.transaction(async (manager) => {
            const total = position.quantity * dto.exit_price;
            const fee = total * 0.001;

            const pnl = position.side === 'long'
                ? (dto.exit_price - position.avg_entry_price) * position.quantity - fee
                : (position.avg_entry_price - dto.exit_price) * position.quantity - fee;

            position.status = 'closed';
            position.closed_at = new Date();
            position.realized_pnl = pnl;
            position.unrealized_pnl = 0;
            await manager.save(position);

            portfolio.current_cash += total - fee;
            await manager.save(portfolio);

            const trade = manager.create(Trade, {
                position_id: positionId,
                portfolio_id: portfolioId,
                symbol_id: position.symbol_id,
                type: position.side === 'short' ? 'cover' : 'sell',
                quantity: position.quantity,
                price: dto.exit_price,
                total,
                fee,
                notes: dto.notes,
            });
            await manager.save(trade);

            return { position, trade, pnl, remaining_cash: portfolio.current_cash };
        });
    }

    async getPortfolioMetrics(portfolioId: string, userId: string) {
        const portfolio = await this.portfolioRepo.findOne({
            where: { id: portfolioId, user_id: userId },
            relations: ['positions', 'positions.symbol'],
        });
        if (!portfolio) throw new NotFoundException('Portfolio not found');

        const openPositions = portfolio.positions.filter(p => p.status === 'open');
        const closedTrades = await this.tradeRepo.find({ where: { portfolio_id: portfolioId } });
        const totalRealizedPnl = closedTrades.reduce((sum, t) => {
            if (t.type === 'sell' || t.type === 'cover') {
                const rel = portfolio.positions.find(p => p.id === t.position_id);
                return sum + (rel?.realized_pnl || 0);
            }
            return sum;
        }, 0);

        const positionValue = openPositions.reduce(
            (sum, p) => sum + p.quantity * (parseFloat(p.current_price as any) || parseFloat(p.avg_entry_price as any)), 0
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
