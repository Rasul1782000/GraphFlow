import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Symbol } from './entities/symbol.entity';
import { Ohlcv } from './entities/ohlcv.entity';
import { GetOhlcvDto } from './dto/get-ohlcv.dto';
import { MarketGateway } from './market.gateway';
import axios from 'axios';
import { forwardRef } from '@nestjs/common';

@Injectable()
export class MarketService {
    private readonly logger = new Logger('MarketService');

    constructor(
        @InjectRepository(Symbol) private readonly symbolRepo: Repository<Symbol>,
        @InjectRepository(Ohlcv) private readonly ohlcvRepo: Repository<Ohlcv>,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        @Inject(forwardRef(() => MarketGateway))
        private readonly gateway: MarketGateway,
    ) { }

    async getSymbols(assetClass?: string) {
        const cacheKey = `symbols:${assetClass || 'all'}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) return cached as Symbol[];

        const query = this.symbolRepo.createQueryBuilder('s').where('s.is_active = :a', { a: true });
        if (assetClass) query.andWhere('s.asset_class = :ac', { ac: assetClass });
        const symbols = await query.orderBy('s.market_cap', 'DESC').getMany();

        await this.cache.set(cacheKey, symbols, 300);
        return symbols as Symbol[];
    }

    async getOhlcv(symbol: string, dto: GetOhlcvDto) {
        const sym = await this.symbolRepo.findOne({ where: { ticker: symbol.toUpperCase() } });
        if (!sym) throw new NotFoundException(`Symbol ${symbol} not found`);

        const cacheKey = `ohlcv:${symbol}:${dto.timeframe}:${dto.limit}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) return cached;

        const data = await this.ohlcvRepo.find({
            where: { symbol_id: sym.id, timeframe: dto.timeframe },
            order: { open_time: 'DESC' },
            take: dto.limit || 500,
        });

        const result = data.reverse().map(c => ({
            time: Math.floor(new Date(c.open_time).getTime() / 1000),
            open: parseFloat(c.open as any),
            high: parseFloat(c.high as any),
            low: parseFloat(c.low as any),
            close: parseFloat(c.close as any),
            volume: parseFloat(c.volume as any),
        }));

        await this.cache.set(cacheKey, result, 30);
        return result;
    }

    async getQuote(symbol: string) {
        const cacheKey = `quote:${symbol}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) return cached;

        // Fetch from external API (Alpha Vantage / Binance)
        try {
            const isCrypto = symbol.endsWith('USDT');
            let quote;
            if (isCrypto) {
                const { data } = await axios.get(
                    `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
                );
                quote = {
                    symbol,
                    price: parseFloat(data.lastPrice),
                    change: parseFloat(data.priceChange),
                    changePercent: parseFloat(data.priceChangePercent),
                    volume: parseFloat(data.volume),
                    high24h: parseFloat(data.highPrice),
                    low24h: parseFloat(data.lowPrice),
                };
            } else {
                // Alpha Vantage fallback
                const { data } = await axios.get(
                    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
                );
                const q = data['Global Quote'];
                quote = {
                    symbol,
                    price: parseFloat(q['05. price']),
                    change: parseFloat(q['09. change']),
                    changePercent: parseFloat(q['10. change percent']),
                    volume: parseInt(q['06. volume']),
                    high24h: parseFloat(q['03. high']),
                    low24h: parseFloat(q['04. low']),
                };
            }
            await this.cache.set(cacheKey, quote, 15);
            return quote;
        } catch (err) {
            this.logger.error(`Failed to fetch quote for ${symbol}: ${err.message}`);
            throw err;
        }
    }

    async getTopMovers(limit = 10) {
        const cacheKey = `movers:${limit}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) return cached;

        const symbols = await this.getSymbols();
        const quotes = await Promise.allSettled(
            symbols.slice(0, 50).map(s => this.getQuote(s.ticker))
        );
        const valid = quotes
            .filter(r => r.status === 'fulfilled')
            .map((r: any) => r.value)
            .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
            .slice(0, limit);

        await this.cache.set(cacheKey, valid, 60);
        return valid;
    }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async broadcastLivePrices() {
        const cryptoSymbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
        for (const symbol of cryptoSymbols) {
            try {
                const quote = await this.getQuote(symbol);
                this.gateway.broadcastTicker(symbol, quote);
            } catch (err) {
                this.logger.warn(`Broadcast failed for ${symbol}`);
            }
        }
    }
}
