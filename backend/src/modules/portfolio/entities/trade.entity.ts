import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { Position } from './position.entity';

@Entity('trades')
export class Trade {
    @PrimaryGeneratedColumn('uuid') id: string;
    @Column('varchar', { length: 36 })
    position_id: string;
    @Column('varchar', { length: 36 })
    portfolio_id: string;
    @Column() symbol_id: number;
    @Column() type: string;
    @Column('decimal', { precision: 20, scale: 8 }) quantity: number;
    @Column('decimal', { precision: 20, scale: 8 }) price: number;
    @Column('decimal', { precision: 20, scale: 8 }) total: number;
    @Column('decimal', { precision: 20, scale: 8, default: 0 }) fee: number;
    @Column('text', { nullable: true }) notes: string;
    @Column({ nullable: true }) signal_id: string;
    @CreateDateColumn() executed_at: Date;

    @ManyToOne(() => Portfolio, p => p.trades)
    @JoinColumn({ name: 'portfolio_id' })
    portfolio: Portfolio;

    @ManyToOne(() => Position)
    @JoinColumn({ name: 'position_id' })
    position: Position;
}
