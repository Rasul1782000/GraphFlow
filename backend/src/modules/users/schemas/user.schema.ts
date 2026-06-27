import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
    @Prop({ required: true, unique: true, index: true })
    email: string;

    @Prop({ required: true, unique: true, index: true })
    username: string;

    @Prop({ required: true })
    password_hash: string;

    @Prop()
    full_name?: string;

    @Prop()
    avatar_url?: string;

    @Prop({ type: String, enum: ['user', 'admin', 'pro'], default: 'user' })
    role: string;

    @Prop({ default: false })
    is_verified: boolean;

    @Prop()
    refresh_token?: string;

    @Prop()
    last_login_at?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
