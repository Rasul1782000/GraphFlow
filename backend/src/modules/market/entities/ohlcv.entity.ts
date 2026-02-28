import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Symbol } from './symbol.entity';

@Entity('ohlcv')
export class Ohlcv {
    @PrimaryGeneratedColumn('increment') id: number;
    @Column() symbol_id: number;
    @Column() timeframe: string;
    @Column() open_time: Date;
    @Column('decimal', { precision: 20, scale: 8 }) open: number;
    @Column('decimal', { precision: 20, scale: 8 }) high: number;
    @Column('decimal', { precision: 20, scale: 8 }) low: number;
    @Column('decimal', { precision: 20, scale: 8 }) close: number;
    @Column('decimal', { precision: 30, scale: 8 }) volume: number;
    @Column() close_time: Date;

    @ManyToOne(() => Symbol)
    @JoinColumn({ name: 'symbol_id' })
    symbol: Symbol;
}
