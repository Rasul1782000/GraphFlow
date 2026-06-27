import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWatchlistDto {
    @ApiProperty({ description: 'Watchlist name' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Watchlist description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'Array of symbol IDs' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    symbols?: string[];
}
