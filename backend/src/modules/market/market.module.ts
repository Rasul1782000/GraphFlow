import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Symbol, SymbolSchema } from './schemas/symbol.schema';
import { Ohlcv, OhlcvSchema } from './schemas/ohlcv.schema';
import { News, NewsSchema } from './schemas/news.schema';
import { MarketService } from './market.service';
import { MarketGateway } from './market.gateway';
import { MarketController } from './market.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Symbol.name, schema: SymbolSchema },
            { name: Ohlcv.name, schema: OhlcvSchema },
            { name: News.name, schema: NewsSchema }
        ])
    ],
    controllers: [MarketController],
    providers: [MarketService, MarketGateway],
    exports: [MarketService, MarketGateway, MongooseModule]
})
export class MarketModule { }
