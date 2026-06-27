import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Symbol, SymbolDocument } from '../market/schemas/symbol.schema';
import { News, NewsDocument } from '../market/schemas/news.schema';
import { Watchlist, WatchlistDocument } from '../watchlist/schemas/watchlist.schema';
import { Portfolio, PortfolioDocument } from '../portfolio/schemas/portfolio.schema';
import { Position, PositionDocument } from '../portfolio/schemas/position.schema';
import { Trade, TradeDocument } from '../portfolio/schemas/trade.schema';
import { Signal, SignalDocument } from '../signals/schemas/signal.schema';
import { Alert, AlertDocument } from '../alerts/schemas/alert.schema';

@Injectable()
export class SeedService implements OnModuleInit {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Symbol.name) private readonly symbolModel: Model<SymbolDocument>,
        @InjectModel(News.name) private readonly newsModel: Model<NewsDocument>,
        @InjectModel(Watchlist.name) private readonly watchlistModel: Model<WatchlistDocument>,
        @InjectModel(Portfolio.name) private readonly portfolioModel: Model<PortfolioDocument>,
        @InjectModel(Position.name) private readonly positionModel: Model<PositionDocument>,
        @InjectModel(Trade.name) private readonly tradeModel: Model<TradeDocument>,
        @InjectModel(Signal.name) private readonly signalModel: Model<SignalDocument>,
        @InjectModel(Alert.name) private readonly alertModel: Model<AlertDocument>,
    ) { }

    async onModuleInit() {
        this.logger.log('Starting daily database seeding check...');
        try {
            await this.seedUsers();
            await this.seedSymbols();
            await this.seedNews();
            await this.seedWatchlists();
            await this.seedPortfolios();
            await this.seedSignals();
            await this.seedAlerts();
            this.logger.log('Seed check complete.');
        } catch (error) {
            this.logger.error('Error during database seeding:', error.message);
        }
    }

    private async seedUsers() {
        const count = await this.userModel.countDocuments();
        if (count === 0) {
            this.logger.log('Seeding initial users...');
            const adminPassword = await bcrypt.hash('admin123', 10);
            const userPassword = await bcrypt.hash('user123', 10);

            await this.userModel.insertMany([
                {
                    email: 'admin@graphflow.app',
                    username: 'admin',
                    password_hash: adminPassword,
                    full_name: 'System Administrator',
                    role: 'admin',
                    is_verified: true,
                },
                {
                    email: 'demo@graphflow.app',
                    username: 'demouser',
                    password_hash: userPassword,
                    full_name: 'Demo Account',
                    role: 'user',
                    is_verified: true,
                },
            ]);
        }
    }

    private async seedSymbols() {
        const count = await this.symbolModel.countDocuments();
        if (count === 0) {
            this.logger.log('Seeding market symbols...');
            await this.symbolModel.insertMany([
                { ticker: 'AAPL', name: 'Apple Inc.', asset_class: 'stock', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology', is_active: true, market_cap: 3000000000000 },
                { ticker: 'MSFT', name: 'Microsoft Corp', asset_class: 'stock', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology', is_active: true, market_cap: 3200000000000 },
                { ticker: 'NVDA', name: 'NVIDIA Corp', asset_class: 'stock', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology', is_active: true, market_cap: 2800000000000 },
                { ticker: 'BTCUSDT', name: 'Bitcoin / USDT', asset_class: 'crypto', exchange: 'Binance', currency: 'USDT', is_active: true, market_cap: 1200000000000 },
                { ticker: 'ETHUSDT', name: 'Ethereum / USDT', asset_class: 'crypto', exchange: 'Binance', currency: 'USDT', is_active: true, market_cap: 400000000000 },
                { ticker: 'EURUSD', name: 'Euro / US Dollar', asset_class: 'forex', exchange: 'FX', currency: 'USD', is_active: true },
            ]);
        }
    }

    private async seedNews() {
        const count = await this.newsModel.countDocuments();
        if (count === 0) {
            this.logger.log('Seeding market news...');
            await this.newsModel.insertMany([
                {
                    title: 'Bitcoin Market Outlook 2026',
                    content: 'Experts predict continued adoption of BTC as a reserve asset...',
                    source: 'Financial Times',
                    publishedAt: new Date(),
                    relatedSymbols: ['BTCUSDT'],
                },
                {
                    title: 'Tech Giants Announce Q1 Results',
                    content: 'Earnings reports show strong growth in AI cloud services...',
                    source: 'Reuters',
                    publishedAt: new Date(),
                    relatedSymbols: ['AAPL', 'MSFT'],
                },
            ]);
        }
    }

    private async seedWatchlists() {
        const count = await this.watchlistModel.countDocuments();
        if (count === 0) {
            const user = await this.userModel.findOne({ username: 'demouser' });
            const symbols = await this.symbolModel.find().limit(3).exec();

            if (user && symbols.length > 0) {
                this.logger.log('Seeding default watchlist for demo user...');
                await this.watchlistModel.create({
                    name: 'Core Tech Watchlist',
                    description: 'Major technology companies to monitor',
                    user_id: user._id,
                    symbols: symbols.map(s => s._id),
                });
            }
        }
    }

    private async seedPortfolios() {
        const count = await this.portfolioModel.countDocuments();
        if (count === 0) {
            const user = await this.userModel.findOne({ username: 'demouser' });
            if (user) {
                this.logger.log('Seeding portfolio and initial trades for demo user...');
                const portfolio = await this.portfolioModel.create({
                    name: 'Default Portfolio',
                    description: 'Main trading account',
                    user_id: user._id,
                    currency: 'USD',
                    initial_cash: 100000,
                    current_cash: 95000,
                    is_default: true,
                    is_paper: true,
                });

                const appleSymbol = await this.symbolModel.findOne({ ticker: 'AAPL' });
                if (appleSymbol) {
                    const position = await this.positionModel.create({
                        portfolio_id: portfolio._id,
                        symbol_id: appleSymbol._id,
                        side: 'buy',
                        quantity: 10,
                        avg_entry_price: 150.00,
                        current_price: 155.00,
                        status: 'open',
                    });

                    await this.tradeModel.create({
                        portfolio_id: portfolio._id,
                        position_id: position._id,
                        symbol_id: appleSymbol._id,
                        type: 'buy',
                        quantity: 10,
                        price: 150.00,
                        total: 1500.00,
                        notes: 'Initial seed trade',
                    });
                }
            }
        }
    }

    private async seedSignals() {
        const count = await this.signalModel.countDocuments();
        if (count === 0) {
            const btcSymbol = await this.symbolModel.findOne({ ticker: 'BTCUSDT' });
            if (btcSymbol) {
                this.logger.log('Seeding trading signals...');
                await this.signalModel.create({
                    symbol_id: btcSymbol._id,
                    source: 'Technical Analysis',
                    type: 'buy',
                    strength: 85,
                    timeframe: '1d',
                    entry_price: 50000,
                    stop_loss: 48000,
                    take_profit: 55000,
                    risk_reward: 2.5,
                    description: 'Strong bullish divergence on RSI',
                });
            }
        }
    }

    private async seedAlerts() {
        const count = await this.alertModel.countDocuments();
        if (count === 0) {
            const user = await this.userModel.findOne({ username: 'demouser' });
            const ethSymbol = await this.symbolModel.findOne({ ticker: 'ETHUSDT' });
            if (user && ethSymbol) {
                this.logger.log('Seeding price alerts...');
                await this.alertModel.create({
                    user_id: user._id,
                    symbol_id: ethSymbol._id,
                    name: 'ETH Breakout',
                    condition_type: 'above',
                    condition_value: 3000,
                    is_active: true,
                });
            }
        }
    }
}
