import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsDocument = News & Document;

@Schema({ timestamps: { createdAt: 'createdAt' } })
export class News {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    source: string;

    @Prop()
    url?: string;

    @Prop()
    imageUrl?: string;

    @Prop({ type: [String] })
    relatedSymbols?: string[];

    @Prop({ required: true, index: true })
    publishedAt: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);
