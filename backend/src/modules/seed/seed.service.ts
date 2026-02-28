import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { Symbol } from '../market/entities/symbol.entity';
import { News } from '../market/entities/news.entity';
import { Watchlist } from '../watchlist/entities/watchlist.entity';
import { Portfolio } from '../portfolio/entities/portfolio.entity';
import { Position } from '../portfolio/entities/position.entity';
import { Trade } from '../portfolio/entities/trade.entity';
import { Signal } from '../signals/entities/signal.entity';
import { Alert } from '../alerts/entities/alert.entity';

@Injectable()
export class SeedService implements OnModuleInit {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Symbol)
        private readonly symbolRepo: Repository<Symbol>,
        @InjectRepository(News)
        private readonly newsRepo: Repository<News>,
        @InjectRepository(Watchlist)
        private readonly watchlistRepo: Repository<Watchlist>,
        @InjectRepository(Portfolio)
        private readonly portfolioRepo: Repository<Portfolio>,
        @InjectRepository(Position)
        private readonly positionRepo: Repository<Position>,
        @InjectRepository(Trade)
        private readonly tradeRepo: Repository<Trade>,
        @InjectRepository(Signal)
        private readonly signalRepo: Repository<Signal>,
        @InjectRepository(Alert)
        private readonly alertRepo: Repository<Alert>,
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
        const count = await this.userRepo.count();
        if (count === 0) {
            this.logger.log('Seeding initial users...');
            const adminPassword = await bcrypt.hash('admin123', 10);
            const userPassword = await bcrypt.hash('user123', 10);

            await this.userRepo.save([
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
        const count = await this.symbolRepo.count();
        if (count === 0) {
            this.logger.log('Seeding market symbols...');
            await this.symbolRepo.save([
                { ticker: 'AAPL', name: 'Apple Inc.', asset_class: 'stock', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology', is_active: true },
                { ticker: 'MSFT', name: 'Microsoft Corp', asset_class: 'stock', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology', is_active: true },
                { ticker: 'NVDA', name: 'NVIDIA Corp', asset_class: 'stock', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology', is_active: true },
                { ticker: 'BTCUSDT', name: 'Bitcoin / USDT', asset_class: 'crypto', exchange: 'Binance', currency: 'USDT', is_active: true },
                { ticker: 'ETHUSDT', name: 'Ethereum / USDT', asset_class: 'crypto', exchange: 'Binance', currency: 'USDT', is_active: true },
                { ticker: 'EURUSD', name: 'Euro / US Dollar', asset_class: 'forex', exchange: 'FX', currency: 'USD', is_active: true },
            ]);
        }
    }

    private async seedNews() {
        const count = await this.newsRepo.count();
        if (count === 0) {
            this.logger.log('Seeding market news...');
            await this.newsRepo.save([
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
        const count = await this.watchlistRepo.count();
        if (count === 0) {
            const user = await this.userRepo.findOne({ where: { username: 'demouser' } });
            const symbols = await this.symbolRepo.find({ take: 3 });

            if (user && symbols.length > 0) {
                this.logger.log('Seeding default watchlist for demo user...');
                await this.watchlistRepo.save([
                    {
                        name: 'Core Tech Watchlist',
                        description: 'Major technology companies to monitor',
                        user,
                        symbols,
                    },
                ]);
            }
        }
    }

    private async seedPortfolios() {
        const count = await this.portfolioRepo.count();
        if (count === 0) {
            const user = await this.userRepo.findOne({ where: { username: 'demouser' } });
            if (user) {
                this.logger.log('Seeding portfolio and initial trades for demo user...');
                const portfolio = await this.portfolioRepo.save({
                    name: 'Default Portfolio',
                    description: 'Main trading account',
                    user,
                    currency: 'USD',
                    initial_cash: 100000,
                    current_cash: 95000,
                    is_default: true,
                    is_paper: true,
                });

                const appleSymbol = await this.symbolRepo.findOne({ where: { ticker: 'AAPL' } });
                if (appleSymbol) {
                    const position = await this.positionRepo.save({
                        portfolio,
                        symbol: appleSymbol,
                        side: 'buy',
                        quantity: 10,
                        avg_entry_price: 150.00,
                        current_price: 155.00,
                        status: 'open',
                    });

                    await this.tradeRepo.save({
                        portfolio,
                        position,
                        symbol_id: appleSymbol.id,
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
        const count = await this.signalRepo.count();
        if (count === 0) {
            const btcSymbol = await this.symbolRepo.findOne({ where: { ticker: 'BTCUSDT' } });
            if (btcSymbol) {
                this.logger.log('Seeding trading signals...');
                await this.signalRepo.save({
                    symbol: btcSymbol,
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
        const count = await this.alertRepo.count();
        if (count === 0) {
            const user = await this.userRepo.findOne({ where: { username: 'demouser' } });
            const ethSymbol = await this.symbolRepo.findOne({ where: { ticker: 'ETHUSDT' } });
            if (user && ethSymbol) {
                this.logger.log('Seeding price alerts...');
                await this.alertRepo.save({
                    user_id: user.id,
                    symbol: ethSymbol,
                    name: 'ETH Breakout',
                    condition_type: 'above',
                    condition_value: 3000,
                    is_active: true,
                });
            }
        }
    }
}
