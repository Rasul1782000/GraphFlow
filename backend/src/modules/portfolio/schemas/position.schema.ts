import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Portfolio } from './portfolio.schema';
import { Symbol } from '../../market/schemas/symbol.schema';

export type PositionDocument = Position & Document;

@Schema({ timestamps: { createdAt: 'opened_at' } })
export class Position {
    @Prop({ type: Types.ObjectId, ref: Portfolio.name, required: true, index: true })
    portfolio_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Symbol.name, required: true, index: true })
    symbol_id: Types.ObjectId;

    @Prop({ required: true })
    side: string; // 'buy' or 'sell'

    @Prop({ type: Number, required: true })
    quantity: number;

    @Prop({ type: Number, required: true })
    avg_entry_price: number;

    @Prop({ type: Number })
    current_price?: number;

    @Prop({ type: Number })
    stop_loss?: number;

    @Prop({ type: Number })
    take_profit?: number;

    @Prop({ type: Number, default: 0 })
    realized_pnl: number;

    @Prop({ type: Number, default: 0 })
    unrealized_pnl: number;

    @Prop({ default: 'open' })
    status: string; // 'open' or 'closed'

    @Prop()
    closed_at?: Date;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
