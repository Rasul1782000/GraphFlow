import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { Symbol } from '../../market/entities/symbol.entity';

@Entity('positions')
export class Position {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column('varchar', { length: 36 })
    portfolio_id: string;
    @Column() symbol_id: number;
    @Column() side: string;
    @Column('decimal', { precision: 20, scale: 8 }) quantity: number;
    @Column('decimal', { precision: 20, scale: 8 }) avg_entry_price: number;
    @Column('decimal', { precision: 20, scale: 8, nullable: true }) current_price: number;
    @Column('decimal', { precision: 20, scale: 8, nullable: true }) stop_loss: number;
    @Column('decimal', { precision: 20, scale: 8, nullable: true }) take_profit: number;
    @Column('decimal', { precision: 20, scale: 8, default: 0 }) realized_pnl: number;
    @Column('decimal', { precision: 20, scale: 8, default: 0 }) unrealized_pnl: number;
    @Column({ default: 'open' }) status: string;
    @CreateDateColumn() opened_at: Date;
    @Column({ nullable: true }) closed_at: Date;

    @ManyToOne(() => Portfolio, p => p.positions)
    @JoinColumn({ name: 'portfolio_id' })
    portfolio: Portfolio;

    @ManyToOne(() => Symbol)
    @JoinColumn({ name: 'symbol_id' })
    symbol: Symbol;
}
