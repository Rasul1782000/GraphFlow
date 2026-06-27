import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SymbolDocument = Symbol & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Symbol {
    @Prop({ required: true, unique: true, index: true })
    ticker: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    asset_class: string;

    @Prop()
    exchange?: string;

    @Prop({ default: 'USD' })
    currency: string;

    @Prop({ default: true })
    is_active: boolean;

    @Prop({ type: Number })
    market_cap?: number;

    @Prop()
    sector?: string;

    @Prop()
    description?: string;

    @Prop()
    logo_url?: string;
}

export const SymbolSchema = SchemaFactory.createForClass(Symbol);
