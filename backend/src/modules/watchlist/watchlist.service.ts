import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Watchlist, WatchlistDocument } from './schemas/watchlist.schema';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';

@Injectable()
export class WatchlistService {
    constructor(
        @InjectModel(Watchlist.name) private readonly watchlistModel: Model<WatchlistDocument>,
    ) {}

    async findByUser(userId: string) {
        return this.watchlistModel
            .find({ user_id: new Types.ObjectId(userId) })
            .populate('symbols', 'ticker name asset_class exchange market_cap')
            .sort({ createdAt: -1 })
            .exec();
    }

    async findOne(id: string) {
        const watchlist = await this.watchlistModel
            .findById(id)
            .populate('symbols', 'ticker name asset_class exchange market_cap logo_url')
            .exec();

        if (!watchlist) {
            throw new NotFoundException(`Watchlist ${id} not found`);
        }
        return watchlist;
    }

    async create(userId: string, dto: CreateWatchlistDto) {
        const watchlist = new this.watchlistModel({
            name: dto.name,
            description: dto.description,
            user_id: new Types.ObjectId(userId),
            symbols: dto.symbols?.map(s => new Types.ObjectId(s)) || [],
        });
        return watchlist.save();
    }

    async update(id: string, userId: string, dto: UpdateWatchlistDto) {
        const updateData: any = { ...dto };
        if (dto.symbols) {
            updateData.symbols = dto.symbols.map(s => new Types.ObjectId(s));
        }

        const watchlist = await this.watchlistModel.findOneAndUpdate(
            { _id: new Types.ObjectId(id), user_id: new Types.ObjectId(userId) },
            { $set: updateData },
            { new: true },
        ).populate('symbols', 'ticker name asset_class exchange market_cap');

        if (!watchlist) {
            throw new NotFoundException(`Watchlist ${id} not found`);
        }
        return watchlist;
    }

    async addSymbol(id: string, userId: string, symbolId: string) {
        const watchlist = await this.watchlistModel.findOneAndUpdate(
            {
                _id: new Types.ObjectId(id),
                user_id: new Types.ObjectId(userId),
            },
            {
                $addToSet: { symbols: new Types.ObjectId(symbolId) },
            },
            { new: true },
        ).populate('symbols', 'ticker name asset_class exchange market_cap');

        if (!watchlist) {
            throw new NotFoundException(`Watchlist ${id} not found`);
        }
        return watchlist;
    }

    async removeSymbol(id: string, userId: string, symbolId: string) {
        const watchlist = await this.watchlistModel.findOneAndUpdate(
            {
                _id: new Types.ObjectId(id),
                user_id: new Types.ObjectId(userId),
            },
            {
                $pull: { symbols: new Types.ObjectId(symbolId) },
            },
            { new: true },
        ).populate('symbols', 'ticker name asset_class exchange market_cap');

        if (!watchlist) {
            throw new NotFoundException(`Watchlist ${id} not found`);
        }
        return watchlist;
    }

    async remove(id: string, userId: string) {
        const watchlist = await this.watchlistModel.findOneAndDelete({
            _id: new Types.ObjectId(id),
            user_id: new Types.ObjectId(userId),
        });

        if (!watchlist) {
            throw new NotFoundException(`Watchlist ${id} not found`);
        }
        return { deleted: true };
    }
}
