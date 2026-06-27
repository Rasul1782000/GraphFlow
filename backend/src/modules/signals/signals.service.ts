import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Signal, SignalDocument } from './schemas/signal.schema';
import { CreateSignalDto } from './dto/create-signal.dto';
import { SignalFilterDto } from './dto/signal-filter.dto';

@Injectable()
export class SignalsService {
    constructor(
        @InjectModel(Signal.name) private readonly signalModel: Model<SignalDocument>,
    ) {}

    async findAll(filters: SignalFilterDto) {
        const query: any = {};

        if (filters.symbol_id) {
            query.symbol_id = new Types.ObjectId(filters.symbol_id);
        }
        if (filters.type) {
            query.type = filters.type;
        }
        if (filters.source) {
            query.source = filters.source;
        }
        if (filters.timeframe) {
            query.timeframe = filters.timeframe;
        }

        const limit = filters.limit || 50;
        const offset = filters.offset || 0;

        const [items, total] = await Promise.all([
            this.signalModel
                .find(query)
                .populate('symbol_id', 'ticker name asset_class')
                .sort({ created_at: -1 })
                .limit(limit)
                .skip(offset)
                .exec(),
            this.signalModel.countDocuments(query).exec(),
        ]);

        return { items, total, page: Math.floor(offset / limit) + 1 };
    }

    async findOne(id: string) {
        const signal = await this.signalModel
            .findById(id)
            .populate('symbol_id', 'ticker name asset_class exchange')
            .exec();

        if (!signal) {
            throw new NotFoundException(`Signal ${id} not found`);
        }
        return signal;
    }

    async create(dto: CreateSignalDto) {
        const signal = new this.signalModel({
            ...dto,
            symbol_id: new Types.ObjectId(dto.symbol_id),
            expires_at: dto.expires_at ? new Date(dto.expires_at) : undefined,
        });
        return signal.save();
    }

    async getRecentSignals(limit = 10) {
        return this.signalModel
            .find()
            .populate('symbol_id', 'ticker name asset_class')
            .sort({ created_at: -1 })
            .limit(limit)
            .exec();
    }

    async getSignalStats() {
        const now = new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const [total, last24hCount, last7dCount, byType] = await Promise.all([
            this.signalModel.countDocuments().exec(),
            this.signalModel.countDocuments({ created_at: { $gte: last24h } }).exec(),
            this.signalModel.countDocuments({ created_at: { $gte: last7d } }).exec(),
            this.signalModel.aggregate([
                { $group: { _id: '$type', count: { $sum: 1 } } },
            ]).exec(),
        ]);

        return {
            total,
            last_24h: last24hCount,
            last_7d: last7dCount,
            by_type: byType.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {} as Record<string, number>),
        };
    }
}
