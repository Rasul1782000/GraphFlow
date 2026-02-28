import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MarketModule } from './modules/market/market.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { SignalsModule } from './modules/signals/signals.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { WatchlistModule } from './modules/watchlist/watchlist.module';
import { ScreenerModule } from './modules/screener/screener.module';
import { SeedModule } from './modules/seed/seed.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env'],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const host = config.get('DB_HOST', 'localhost');
                const port = config.get<number>('DB_PORT', 3306);
                const username = config.get('DB_USER');
                const password = config.get('DB_PASSWORD');
                const database = config.get('DB_NAME');

                console.log(`🔌 Attempting to connect to ${host}:${port} as user "${username}" (DB: ${database})`);

                return {
                    type: 'mysql',
                    host,
                    port,
                    username: username || 'root', // Fallback to root if DB_USER is missing
                    password: password || '',
                    database,
                    entities: [__dirname + '/modules/**/entities/*.entity{.ts,.js}'],
                    synchronize: config.get('NODE_ENV') !== 'production',
                    logging: config.get('NODE_ENV') === 'development' ? ['error', 'warn'] : ['error'],
                    timezone: 'Z',
                    charset: 'utf8mb4',
                    extra: { connectionLimit: 20 },
                };
            },
        }),
        CacheModule.register({
            isGlobal: true,
            ttl: 60,
            max: 100, // Memory store fallback for local dev without Redis
            store: 'memory', // Explicitly use memory store for local cache
        }),
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                redis: {
                    host: config.get('REDIS_HOST', 'localhost'),
                    port: config.get<number>('REDIS_PORT', 6379),
                    password: config.get('REDIS_PASSWORD'),
                },
            }),
        }),
        ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
        ScheduleModule.forRoot(),
        AuthModule, UsersModule, MarketModule, PortfolioModule,
        SignalsModule, AlertsModule, WatchlistModule, ScreenerModule, SeedModule,
    ],
})
export class AppModule { }
