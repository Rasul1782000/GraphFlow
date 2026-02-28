import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Symbol } from '../../market/entities/symbol.entity';

@Entity('watchlists')
export class Watchlist {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => User, (user) => user.id)
    user: User;

    @ManyToMany(() => Symbol)
    @JoinTable({
        name: 'watchlist_symbols',
        joinColumn: { name: 'watchlist_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'symbol_id', referencedColumnName: 'id' }
    })
    symbols: Symbol[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
