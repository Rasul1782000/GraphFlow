import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Alert, AlertDocument } from './schemas/alert.schema';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';

@Injectable()
export class AlertsService {
    constructor(
        @InjectModel(Alert.name) private readonly alertModel: Model<AlertDocument>,
    ) {}

    async findByUser(userId: string) {
        return this.alertModel
            .find({ user_id: new Types.ObjectId(userId) })
            .populate('symbol_id', 'ticker name asset_class')
            .sort({ created_at: -1 })
            .exec();
    }

    async findOne(id: string) {
        const alert = await this.alertModel
            .findById(id)
            .populate('symbol_id', 'ticker name asset_class exchange')
            .exec();

        if (!alert) {
            throw new NotFoundException(`Alert ${id} not found`);
        }
        return alert;
    }

    async create(userId: string, dto: CreateAlertDto) {
        const alert = new this.alertModel({
            ...dto,
            user_id: new Types.ObjectId(userId),
            symbol_id: new Types.ObjectId(dto.symbol_id),
        });
        return alert.save();
    }

    async update(id: string, userId: string, dto: UpdateAlertDto) {
        const alert = await this.alertModel.findOneAndUpdate(
            { _id: new Types.ObjectId(id), user_id: new Types.ObjectId(userId) },
            { $set: dto },
            { new: true },
        ).populate('symbol_id', 'ticker name asset_class');

        if (!alert) {
            throw new NotFoundException(`Alert ${id} not found`);
        }
        return alert;
    }

    async remove(id: string, userId: string) {
        const alert = await this.alertModel.findOneAndDelete({
            _id: new Types.ObjectId(id),
            user_id: new Types.ObjectId(userId),
        });

        if (!alert) {
            throw new NotFoundException(`Alert ${id} not found`);
        }
        return { deleted: true };
    }

    async getAlertStats(userId: string) {
        const [total, active, triggered] = await Promise.all([
            this.alertModel.countDocuments({ user_id: new Types.ObjectId(userId) }).exec(),
            this.alertModel.countDocuments({ user_id: new Types.ObjectId(userId), is_active: true }).exec(),
            this.alertModel.countDocuments({
                user_id: new Types.ObjectId(userId),
                triggered_at: { $ne: null },
            }).exec(),
        ]);

        return { total, active, triggered };
    }
}
