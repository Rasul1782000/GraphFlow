import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Symbol } from '../../market/schemas/symbol.schema';

export type SignalDocument = Signal & Document;

@Schema({ timestamps: { createdAt: 'created_at' } })
export class Signal {
    @Prop({ type: Types.ObjectId, ref: Symbol.name, required: true, index: true })
    symbol_id: Types.ObjectId;

    @Prop({ required: true })
    source: string;

    @Prop({ required: true, enum: ['buy', 'sell', 'neutral'] })
    type: string;

    @Prop({ type: Number, required: true })
    strength: number;

    @Prop({ required: true })
    timeframe: string;

    @Prop({ type: Number })
    entry_price?: number;

    @Prop({ type: Number })
    stop_loss?: number;

    @Prop({ type: Number })
    take_profit?: number;

    @Prop({ type: Number })
    risk_reward?: number;

    @Prop()
    description?: string;

    @Prop({ type: Object })
    metadata?: any;

    @Prop({ index: { expireAfterSeconds: 0 } })
    expires_at?: Date;
}

export const SignalSchema = SchemaFactory.createForClass(Signal);
