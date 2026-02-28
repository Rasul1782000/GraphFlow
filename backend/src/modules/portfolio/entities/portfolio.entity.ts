import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
    JoinColumn, CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Position } from './position.entity';
import { Trade } from './trade.entity';

@Entity('portfolios')
export class Portfolio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 36 })
    user_id: string;

    @Column('varchar', { length: 200 })
    name: string;

    @Column('text', { nullable: true })
    description?: string;

    @Column('varchar', { length: 10, default: 'USD' })
    currency: string;

    @Column('decimal', { precision: 20, scale: 2, default: 100000 })
    initial_cash: number;

    @Column('decimal', { precision: 20, scale: 2, default: 100000 })
    current_cash: number;

    @Column('boolean', { default: false })
    is_default: boolean;

    @Column('boolean', { default: true })
    is_paper: boolean;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Position, p => p.portfolio)
    positions: Position[];

    @OneToMany(() => Trade, t => t.portfolio)
    trades: Trade[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
