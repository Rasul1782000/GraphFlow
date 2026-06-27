import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { MarketModule } from '../market/market.module';
import { WatchlistModule } from '../watchlist/watchlist.module';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { SignalsModule } from '../signals/signals.module';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
    imports: [
        UsersModule,
        MarketModule,
        WatchlistModule,
        PortfolioModule,
        SignalsModule,
        AlertsModule
    ],
    providers: [SeedService],
    exports: [SeedService],
})
export class SeedModule { }
