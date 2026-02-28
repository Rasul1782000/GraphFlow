import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { AlertsProcessor } from './alerts.processor';
import { MarketModule } from '../market/market.module';

@Module({
    imports: [TypeOrmModule.forFeature([Alert]), MarketModule],
    providers: [AlertsProcessor],
})
export class AlertsModule { }
