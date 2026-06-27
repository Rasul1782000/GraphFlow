import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Alert, AlertSchema } from './schemas/alert.schema';
import { AlertsProcessor } from './alerts.processor';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { MarketModule } from '../market/market.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Alert.name, schema: AlertSchema }]),
        MarketModule
    ],
    controllers: [AlertsController],
    providers: [AlertsProcessor, AlertsService],
    exports: [MongooseModule, AlertsService]
})
export class AlertsModule { }
