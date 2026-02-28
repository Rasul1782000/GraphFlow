import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Symbol } from '../market/entities/symbol.entity';
import { ScreenerService } from './screener.service';
import { ScreenerController } from './screener.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Symbol])],
    controllers: [ScreenerController],
    providers: [ScreenerService],
    exports: [ScreenerService]
})
export class ScreenerModule { }
