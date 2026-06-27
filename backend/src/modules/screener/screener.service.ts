import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Symbol, SymbolDocument } from '../market/schemas/symbol.schema';
import { ScreenerFilterDto } from './dto/screener-filter.dto';

@Injectable()
export class ScreenerService {
    constructor(
        @InjectModel(Symbol.name) private readonly symbolModel: Model<SymbolDocument>,
    ) { }

    async screen(dto: ScreenerFilterDto) {
        const filter: any = { is_active: true };

        if (dto.asset_class?.length) {
            filter.asset_class = { $in: dto.asset_class };
        }
        if (dto.sector?.length) {
            filter.sector = { $in: dto.sector };
        }
        if (dto.min_market_cap != null || dto.max_market_cap != null) {
            filter.market_cap = {};
            if (dto.min_market_cap != null) filter.market_cap.$gte = dto.min_market_cap;
            if (dto.max_market_cap != null) filter.market_cap.$lte = dto.max_market_cap;
        }
        if (dto.search) {
            const searchRegex = new RegExp(dto.search, 'i');
            filter.$or = [{ ticker: searchRegex }, { name: searchRegex }];
        }

        const sortField = dto.sort_by || 'market_cap';
        const sortDir = dto.sort_dir?.toLowerCase() === 'asc' ? 1 : -1;
        
        const limit = dto.limit || 100;
        const skip = dto.offset || 0;

        const [items, total] = await Promise.all([
            this.symbolModel.find(filter)
                .sort({ [sortField]: sortDir as any })
                .limit(limit)
                .skip(skip)
                .exec(),
            this.symbolModel.countDocuments(filter).exec()
        ]);

        return { items, total, page: Math.floor(skip / limit) + 1 };
    }
}
