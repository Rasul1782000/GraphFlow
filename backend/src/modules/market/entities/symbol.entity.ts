import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('symbols')
export class Symbol {
    @PrimaryGeneratedColumn() id: number;
    @Column({ unique: true }) ticker: string;
    @Column() name: string;
    @Column() asset_class: string;
    @Column({ nullable: true }) exchange: string;
    @Column({ default: 'USD' }) currency: string;
    @Column({ default: true }) is_active: boolean;
    @Column('decimal', { precision: 20, scale: 2, nullable: true }) market_cap: number;
    @Column({ nullable: true }) sector: string;
    @Column('text', { nullable: true }) description: string;
    @Column('text', { nullable: true }) logo_url: string;
    @CreateDateColumn() created_at: Date;
    @UpdateDateColumn() updated_at: Date;
}
