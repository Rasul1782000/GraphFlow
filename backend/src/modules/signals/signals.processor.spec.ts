import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SignalsProcessor } from './signals.processor';
import { MarketGateway } from '../market/market.gateway';
import { Job } from 'bull';

describe('SignalsProcessor', () => {
    let processor: SignalsProcessor;
    let signalModel: any;
    let gateway: jest.Mocked<MarketGateway>;

    const mockSave = jest.fn();
    const mockToObject = jest.fn();

    function createMockSignalModel() {
        const MockModel = jest.fn().mockImplementation(() => ({
            save: mockSave,
            toObject: mockToObject,
        })) as any;
        MockModel.create = jest.fn();
        return MockModel;
    }

    beforeEach(async () => {
        mockSave.mockReset();
        mockToObject.mockReset();
        const mockGateway = {
            broadcastSignal: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SignalsProcessor,
                { provide: getModelToken('Signal'), useValue: createMockSignalModel() },
                { provide: MarketGateway, useValue: mockGateway },
            ],
        }).compile();

        processor = module.get<SignalsProcessor>(SignalsProcessor);
        signalModel = module.get(getModelToken('Signal'));
        gateway = module.get(MarketGateway) as jest.Mocked<MarketGateway>;
    });

    function generateOHLCV(config: { count: number; startPrice: number; trend: 'up' | 'down' | 'flat'; finalDip?: boolean; finalSpike?: boolean }): any[] {
        const data: any[] = [];
        let price = config.startPrice;
        for (let i = 0; i < config.count; i++) {
            let change: number;
            if (config.finalDip && i >= config.count - 5) {
                change = -(Math.random() * 80 + 120);
            } else if (config.finalSpike && i >= config.count - 5) {
                change = Math.random() * 80 + 120;
            } else if (config.trend === 'up') {
                change = Math.random() * 40 + 20;
            } else if (config.trend === 'down') {
                change = -(Math.random() * 40 + 20);
            } else {
                change = (Math.random() - 0.5) * 40;
            }
            price += change;
            data.push({
                open: price - change,
                high: Math.max(price, price - change) + Math.abs(change) * 0.3,
                low: Math.min(price, price - change) - Math.abs(change) * 0.3,
                close: price,
                volume: Math.random() * 10000,
            });
        }
        return data;
    }

    describe('handleGenerateSignal', () => {
        it('should skip signal generation with insufficient data', async () => {
            const job = {
                data: {
                    symbolId: '507f1f77bcf86cd799439011',
                    ticker: 'BTCUSDT',
                    ohlcv: generateOHLCV({ count: 10, startPrice: 50000, trend: 'up' }),
                },
            } as Job;

            const result = await processor.handleGenerateSignal(job);
            expect(result).toBeUndefined();
        });

        it('should generate buy signal in uptrend with low RSI', async () => {
            const ohlcv = generateOHLCV({ count: 60, startPrice: 50000, trend: 'up', finalDip: true });

            mockSave.mockResolvedValue({
                toObject: () => ({
                    _id: '507f1f77bcf86cd799439011',
                    symbol_id: '507f1f77bcf86cd799439011',
                    source: 'graphflow_momentum_v1',
                    type: 'buy',
                    strength: 75,
                    entry_price: ohlcv[ohlcv.length - 1].close,
                }),
            });

            const job = {
                data: {
                    symbolId: '507f1f77bcf86cd799439011',
                    ticker: 'BTCUSDT',
                    ohlcv,
                },
            } as Job;

            const result = await processor.handleGenerateSignal(job);
            expect(result).toBeDefined();
            expect(gateway.broadcastSignal).toHaveBeenCalled();
        }, 10000);

        it('should generate sell signal in downtrend with high RSI', async () => {
            const ohlcv = generateOHLCV({ count: 60, startPrice: 50000, trend: 'down', finalSpike: true });

            mockSave.mockResolvedValue({
                toObject: () => ({
                    _id: '507f1f77bcf86cd799439012',
                    symbol_id: '507f1f77bcf86cd799439011',
                    type: 'sell',
                    strength: 75,
                }),
            });

            const job = {
                data: {
                    symbolId: '507f1f77bcf86cd799439011',
                    ticker: 'BTCUSDT',
                    ohlcv,
                },
            } as Job;

            const result = await processor.handleGenerateSignal(job);
            expect(result).toBeDefined();
            expect(gateway.broadcastSignal).toHaveBeenCalled();
        }, 10000);
    });

    describe('RSI calculation', () => {
        it('should return 100 when all gains have no losses', () => {
            const closes = Array.from({ length: 20 }, (_, i) => 100 + i);
            const rsi = (processor as any).calculateRSI(closes, 14);
            expect(rsi).toBe(100);
        });

        it('should return 0 when all losses have no gains', () => {
            const closes = Array.from({ length: 20 }, (_, i) => 100 - i);
            const rsi = (processor as any).calculateRSI(closes, 14);
            expect(rsi).toBe(0);
        });

        it('should return 50 for equal gains and losses', () => {
            const closes = [100, 101, 100, 101, 100, 101, 100, 101, 100, 101, 100, 101, 100, 101, 100, 101, 100, 101, 100, 101];
            const rsi = (processor as any).calculateRSI(closes, 14);
            expect(rsi).toBeCloseTo(50, 0);
        });
    });

    describe('EMA calculation', () => {
        it('should calculate EMA correctly', () => {
            const closes = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
            const ema = (processor as any).calculateEMA(closes, 5);
            expect(ema).toBeCloseTo(18, 0);
        });
    });

    describe('ATR calculation', () => {
        it('should calculate positive ATR', () => {
            const ohlcv = Array.from({ length: 20 }, (_, i) => ({
                high: 100 + i + 5,
                low: 100 + i - 5,
                close: 100 + i,
            }));
            const atr = (processor as any).calculateATR(ohlcv, 14);
            expect(atr).toBeGreaterThan(0);
        });
    });
});
