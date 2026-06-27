import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Symbol } from './symbol.schema';

export type OhlcvDocument = Ohlcv & Document;

@Schema()
export class Ohlcv {
    @Prop({ type: Types.ObjectId, ref: Symbol.name, required: true, index: true })
    symbol_id: Types.ObjectId;

    @Prop({ required: true, index: true })
    timeframe: string;

    @Prop({ required: true, index: true })
    open_time: Date;

    @Prop({ type: Number, required: true })
    open: number;

    @Prop({ type: Number, required: true })
    high: number;

    @Prop({ type: Number, required: true })
    low: number;

    @Prop({ type: Number, required: true })
    close: number;

    @Prop({ type: Number, required: true })
    volume: number;

    @Prop({ required: true })
    close_time: Date;
}

export const OhlcvSchema = SchemaFactory.createForClass(Ohlcv);
OhlcvSchema.index({ symbol_id: 1, timeframe: 1, open_time: -1 });
