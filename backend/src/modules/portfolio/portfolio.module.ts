import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Portfolio, PortfolioSchema } from './schemas/portfolio.schema';
import { Position, PositionSchema } from './schemas/position.schema';
import { Trade, TradeSchema } from './schemas/trade.schema';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { MarketModule } from '../market/market.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Portfolio.name, schema: PortfolioSchema },
            { name: Position.name, schema: PositionSchema },
            { name: Trade.name, schema: TradeSchema }
        ]),
        MarketModule
    ],
    controllers: [PortfolioController],
    providers: [PortfolioService],
    exports: [PortfolioService, MongooseModule]
})
export class PortfolioModule { }
