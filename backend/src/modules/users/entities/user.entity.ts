import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
    UpdateDateColumn, OneToMany
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 255, unique: true })
    email: string;

    @Column('varchar', { length: 100, unique: true })
    username: string;

    @Column('varchar', { length: 255 })
    @Exclude()
    password_hash: string;

    @Column('varchar', { length: 200, nullable: true })
    full_name?: string;

    @Column('text', { nullable: true })
    avatar_url?: string;

    @Column('enum', { enum: ['user', 'admin', 'pro'], default: 'user' })
    role: 'user' | 'admin' | 'pro';

    @Column('boolean', { default: false })
    is_verified: boolean;

    @Column('text', { nullable: true })
    @Exclude()
    refresh_token: string | null;

    @Column('datetime', { nullable: true })
    last_login_at?: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
