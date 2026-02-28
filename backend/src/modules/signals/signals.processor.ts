import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Signal } from './entities/signal.entity';
import { MarketGateway } from '../market/market.gateway';

@Processor('signals')
export class SignalsProcessor {
    private readonly logger = new Logger('SignalsProcessor');

    constructor(
        @InjectRepository(Signal) private readonly signalRepo: Repository<Signal>,
        private readonly gateway: MarketGateway,
    ) { }

    @Process('generate-signal')
    async handleGenerateSignal(job: Job<{ symbolId: number; ticker: string; ohlcv: any[] }>) {
        const { symbolId, ticker, ohlcv } = job.data;

        const signal = this.calculateMomentumSignal(ohlcv);
        if (!signal) return;

        const savedSignal = await this.signalRepo.save({
            symbol_id: symbolId,
            source: 'graphflow_momentum_v1',
            type: signal.type,
            strength: signal.strength,
            timeframe: '1h',
            entry_price: signal.entry,
            stop_loss: signal.stop,
            take_profit: signal.tp,
            risk_reward: signal.rr,
            description: signal.description,
            expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000),
        });

        this.gateway.broadcastSignal({ ...savedSignal, ticker });
        this.logger.log(`Signal generated for ${ticker}: ${signal.type} (strength: ${signal.strength})`);
        return savedSignal;
    }

    private calculateMomentumSignal(ohlcv: any[]) {
        if (ohlcv.length < 50) return null;
        const closes = ohlcv.map(c => c.close);
        const last = closes[closes.length - 1];

        // RSI calculation
        const rsi = this.calculateRSI(closes, 14);
        // EMA calculation
        const ema20 = this.calculateEMA(closes, 20);
        const ema50 = this.calculateEMA(closes, 50);

        const trend = ema20 > ema50 ? 'bullish' : 'bearish';
        const atr = this.calculateATR(ohlcv, 14);

        if (rsi < 35 && trend === 'bullish') {
            return {
                type: 'buy' as const,
                strength: Math.round(70 + (35 - rsi)),
                entry: last,
                stop: last - atr * 1.5,
                tp: last + atr * 3,
                rr: 2.0,
                description: `Oversold bounce in uptrend. RSI: ${rsi.toFixed(1)}, EMA trend: bullish`,
            };
        }
        if (rsi > 65 && trend === 'bearish') {
            return {
                type: 'sell' as const,
                strength: Math.round(70 + (rsi - 65)),
                entry: last,
                stop: last + atr * 1.5,
                tp: last - atr * 3,
                rr: 2.0,
                description: `Overbought in downtrend. RSI: ${rsi.toFixed(1)}, EMA trend: bearish`,
            };
        }
        return null;
    }

    private calculateRSI(closes: number[], period = 14): number {
        const changes = closes.slice(-period - 1).map((c, i, arr) =>
            i === 0 ? 0 : c - arr[i - 1]
        ).slice(1);
        const gains = changes.map(c => (c > 0 ? c : 0));
        const losses = changes.map(c => (c < 0 ? Math.abs(c) : 0));
        const avgGain = gains.reduce((a, b) => a + b) / period;
        const avgLoss = losses.reduce((a, b) => a + b) / period;
        if (avgLoss === 0) return 100;
        const rs = avgGain / avgLoss;
        return 100 - 100 / (1 + rs);
    }

    private calculateEMA(closes: number[], period: number): number {
        const k = 2 / (period + 1);
        let ema = closes.slice(0, period).reduce((a, b) => a + b) / period;
        for (let i = period; i < closes.length; i++) {
            ema = closes[i] * k + ema * (1 - k);
        }
        return ema;
    }

    private calculateATR(ohlcv: any[], period = 14): number {
        const trs = ohlcv.slice(-period - 1).map((c, i, arr) => {
            if (i === 0) return c.high - c.low;
            const prev = arr[i - 1];
            return Math.max(c.high - c.low, Math.abs(c.high - prev.close), Math.abs(c.low - prev.close));
        }).slice(1);
        return trs.reduce((a, b) => a + b) / period;
    }
}
