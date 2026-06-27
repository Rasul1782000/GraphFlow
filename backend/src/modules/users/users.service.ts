import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }

    async create(data: Partial<User>): Promise<UserDocument> {
        return new this.userModel(data).save();
    }

    async updateRefreshToken(id: string, token: string) {
        await this.userModel.findByIdAndUpdate(id, { refresh_token: token }).exec();
    }

    async clearRefreshToken(id: string) {
        await this.userModel.findByIdAndUpdate(id, { refresh_token: null }).exec();
    }
}
