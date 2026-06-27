import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Portfolio } from './portfolio.schema';
import { Position } from './position.schema';
import { Symbol } from '../../market/schemas/symbol.schema';

export type TradeDocument = Trade & Document;

@Schema({ timestamps: { createdAt: 'executed_at' } })
export class Trade {
    @Prop({ type: Types.ObjectId, ref: Position.name, required: true, index: true })
    position_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Portfolio.name, required: true, index: true })
    portfolio_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Symbol.name, required: true, index: true })
    symbol_id: Types.ObjectId;

    @Prop({ required: true })
    type: string; // 'buy' or 'sell'

    @Prop({ type: Number, required: true })
    quantity: number;

    @Prop({ type: Number, required: true })
    price: number;

    @Prop({ type: Number, required: true })
    total: number;

    @Prop({ type: Number, default: 0 })
    fee: number;

    @Prop()
    notes?: string;

    @Prop()
    signal_id?: string;
}

export const TradeSchema = SchemaFactory.createForClass(Trade);
