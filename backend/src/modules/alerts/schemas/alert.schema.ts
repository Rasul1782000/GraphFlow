import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Symbol } from '../../market/schemas/symbol.schema';
import { User } from '../../users/schemas/user.schema';

export type AlertDocument = Alert & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Alert {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
    user_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Symbol.name, required: true, index: true })
    symbol_id: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    condition_type: string;

    @Prop({ type: Number, required: true })
    condition_value: number;

    @Prop({ default: 'in_app' })
    notification_type: string;

    @Prop({ default: true })
    is_active: boolean;

    @Prop({ default: false })
    is_recurring: boolean;

    @Prop({ type: Number, default: 0 })
    trigger_count: number;

    @Prop()
    triggered_at?: Date;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
