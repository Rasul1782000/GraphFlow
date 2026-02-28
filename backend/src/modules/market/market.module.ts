import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Symbol } from './entities/symbol.entity';
import { Ohlcv } from './entities/ohlcv.entity';
import { News } from './entities/news.entity';
import { MarketService } from './market.service';
import { MarketGateway } from './market.gateway';
import { MarketController } from './market.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Symbol, Ohlcv, News])],
    controllers: [MarketController],
    providers: [MarketService, MarketGateway],
    exports: [MarketService, MarketGateway, TypeOrmModule]
})
export class MarketModule { }
