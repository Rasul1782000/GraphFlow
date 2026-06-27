import { Module } from '@nestjs/common';
import { ScreenerService } from './screener.service';
import { ScreenerController } from './screener.controller';
import { MarketModule } from '../market/market.module';

@Module({
    imports: [MarketModule],
    controllers: [ScreenerController],
    providers: [ScreenerService],
    exports: [ScreenerService]
})
export class ScreenerModule { }
