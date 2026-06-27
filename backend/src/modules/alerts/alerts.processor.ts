import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Alert, AlertDocument } from './schemas/alert.schema';
import { MarketGateway } from '../market/market.gateway';

@Processor('alerts')
export class AlertsProcessor {
    private readonly logger = new Logger('AlertsProcessor');

    constructor(
        @InjectModel(Alert.name) private readonly alertModel: Model<AlertDocument>,
        private readonly gateway: MarketGateway,
    ) { }

    @Process('check-alert')
    async handleCheckAlert(job: Job<{ alertId: string; currentPrice: number }>) {
        const { alertId, currentPrice } = job.data;
        const alert = await this.alertModel.findOne({
            _id: new Types.ObjectId(alertId),
            is_active: true
        }).populate('symbol_id');

        if (!alert) return;

        const triggered = this.evaluateCondition(alert, currentPrice);
        if (!triggered) return;

        // Trigger the alert
        alert.triggered_at = new Date();
        alert.trigger_count += 1;
        if (!alert.is_recurring) alert.is_active = false;
        await alert.save();

        // Notify via WebSocket
        this.gateway.broadcastAlert(alert.user_id.toString(), {
            alertId: alert._id,
            name: alert.name,
            symbol: (alert.symbol_id as any)?.ticker,
            condition: alert.condition_type,
            value: alert.condition_value,
            price: currentPrice,
            triggeredAt: alert.triggered_at,
        });

        this.logger.log(`Alert triggered: ${alert.name} for user ${alert.user_id}`);
    }

    private evaluateCondition(alert: Alert, price: number): boolean {
        const val = alert.condition_value;
        switch (alert.condition_type) {
            case 'price_above': return price >= val;
            case 'price_below': return price <= val;
            case 'percent_change': return false; // handled elsewhere
            default: return false;
        }
    }
}
