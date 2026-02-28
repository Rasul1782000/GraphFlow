import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Watchlist])],
    exports: [TypeOrmModule],
})
export class WatchlistModule { }
