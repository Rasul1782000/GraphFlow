import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type PortfolioDocument = Portfolio & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Portfolio {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
    user_id: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop()
    description?: string;

    @Prop({ default: 'USD' })
    currency: string;

    @Prop({ type: Number, default: 100000 })
    initial_cash: number;

    @Prop({ type: Number, default: 100000 })
    current_cash: number;

    @Prop({ default: false })
    is_default: boolean;

    @Prop({ default: true })
    is_paper: boolean;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
