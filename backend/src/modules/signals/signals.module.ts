import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Signal, SignalSchema } from './schemas/signal.schema';
import { SignalsProcessor } from './signals.processor';
import { SignalsService } from './signals.service';
import { SignalsController } from './signals.controller';
import { MarketModule } from '../market/market.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Signal.name, schema: SignalSchema }]),
        MarketModule
    ],
    controllers: [SignalsController],
    providers: [SignalsProcessor, SignalsService],
    exports: [MongooseModule, SignalsService]
})
export class SignalsModule { }
