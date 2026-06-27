import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Symbol } from '../../market/schemas/symbol.schema';

export type WatchlistDocument = Watchlist & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Watchlist {
    @Prop({ required: true })
    name: string;

    @Prop()
    description?: string;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
    user_id: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: Symbol.name }] })
    symbols: Types.ObjectId[];
}

export const WatchlistSchema = SchemaFactory.createForClass(Watchlist);
