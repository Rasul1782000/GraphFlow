import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Watchlist, WatchlistSchema } from './schemas/watchlist.schema';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Watchlist.name, schema: WatchlistSchema }])
    ],
    controllers: [WatchlistController],
    providers: [WatchlistService],
    exports: [MongooseModule, WatchlistService],
})
export class WatchlistModule { }
