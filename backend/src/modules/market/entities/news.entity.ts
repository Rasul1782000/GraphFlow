import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('market_news')
export class News {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @Column()
    source: string;

    @Column({ nullable: true })
    url: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ type: 'simple-array', nullable: true })
    relatedSymbols: string[];

    @Column()
    publishedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
