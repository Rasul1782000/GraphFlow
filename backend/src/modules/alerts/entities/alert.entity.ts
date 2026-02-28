import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Symbol } from '../../market/entities/symbol.entity';

@Entity('alerts')
export class Alert {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column('varchar', { length: 36 })
    user_id: string;
    @Column() symbol_id: number;
    @Column() name: string;
    @Column() condition_type: string;
    @Column('decimal', { precision: 20, scale: 8 }) condition_value: number;
    @Column({ default: 'in_app' }) notification_type: string;
    @Column({ default: true }) is_active: boolean;
    @Column({ default: false }) is_recurring: boolean;
    @Column({ default: 0 }) trigger_count: number;
    @Column({ nullable: true }) triggered_at: Date;
    @CreateDateColumn() created_at: Date;
    @UpdateDateColumn() updated_at: Date;

    @ManyToOne(() => Symbol)
    @JoinColumn({ name: 'symbol_id' })
    symbol: Symbol;
}
