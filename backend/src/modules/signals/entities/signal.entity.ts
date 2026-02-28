import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Symbol } from '../../market/entities/symbol.entity';

@Entity('signals')
export class Signal {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column() symbol_id: number;
    @Column() source: string;
    @Column() type: 'buy' | 'sell' | 'neutral';
    @Column() strength: number;
    @Column() timeframe: string;
    @Column('decimal', { precision: 20, scale: 8, nullable: true }) entry_price: number;
    @Column('decimal', { precision: 20, scale: 8, nullable: true }) stop_loss: number;
    @Column('decimal', { precision: 20, scale: 8, nullable: true }) take_profit: number;
    @Column('decimal', { precision: 5, scale: 2, nullable: true }) risk_reward: number;
    @Column('text', { nullable: true }) description: string;
    @Column('json', { nullable: true }) metadata: any;
    @Column({ nullable: true }) expires_at: Date;
    @CreateDateColumn() created_at: Date;

    @ManyToOne(() => Symbol)
    @JoinColumn({ name: 'symbol_id' })
    symbol: Symbol;
}
