import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Symbol } from '../market/entities/symbol.entity';
import { News } from '../market/entities/news.entity';
import { Watchlist } from '../watchlist/entities/watchlist.entity';
import { Portfolio } from '../portfolio/entities/portfolio.entity';
import { Position } from '../portfolio/entities/position.entity';
import { Trade } from '../portfolio/entities/trade.entity';
import { Signal } from '../signals/entities/signal.entity';
import { Alert } from '../alerts/entities/alert.entity';
import { SeedService } from '@/modules/seed/seed.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Symbol, News, Watchlist, Portfolio, Position, Trade, Signal, Alert]),
    ],
    providers: [SeedService],
    exports: [SeedService],
})
export class SeedModule { }
