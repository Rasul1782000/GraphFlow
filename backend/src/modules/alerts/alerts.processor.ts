import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './entities/alert.entity';
import { MarketGateway } from '../market/market.gateway';

@Processor('alerts')
export class AlertsProcessor {
    private readonly logger = new Logger('AlertsProcessor');

    constructor(
        @InjectRepository(Alert) private readonly alertRepo: Repository<Alert>,
        private readonly gateway: MarketGateway,
    ) { }

    @Process('check-alert')
    async handleCheckAlert(job: Job<{ alertId: string; currentPrice: number }>) {
        const { alertId, currentPrice } = job.data;
        const alert = await this.alertRepo.findOne({
            where: { id: alertId, is_active: true },
            relations: ['symbol'],
        });
        if (!alert) return;

        const triggered = this.evaluateCondition(alert, currentPrice);
        if (!triggered) return;

        // Trigger the alert
        alert.triggered_at = new Date();
        alert.trigger_count += 1;
        if (!alert.is_recurring) alert.is_active = false;
        await this.alertRepo.save(alert);

        // Notify via WebSocket
        this.gateway.broadcastAlert(alert.user_id, {
            alertId: alert.id,
            name: alert.name,
            symbol: (alert as any).symbol?.ticker,
            condition: alert.condition_type,
            value: alert.condition_value,
            price: currentPrice,
            triggeredAt: alert.triggered_at,
        });

        this.logger.log(`Alert triggered: ${alert.name} for user ${alert.user_id}`);
    }

    private evaluateCondition(alert: Alert, price: number): boolean {
        const val = parseFloat(alert.condition_value as any);
        switch (alert.condition_type) {
            case 'price_above': return price >= val;
            case 'price_below': return price <= val;
            case 'percent_change': return false; // handled elsewhere
            default: return false;
        }
    }
}
