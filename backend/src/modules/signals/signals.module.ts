import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Signal } from './entities/signal.entity';
import { SignalsProcessor } from './signals.processor';
import { MarketModule } from '../market/market.module';

@Module({
    imports: [TypeOrmModule.forFeature([Signal]), MarketModule],
    providers: [SignalsProcessor],
})
export class SignalsModule { }
