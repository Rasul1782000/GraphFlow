import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWatchlistDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'Replace all symbols' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    symbols?: string[];
}

export class AddSymbolDto {
    @ApiProperty({ description: 'Symbol ID to add' })
    @IsString()
    symbol_id: string;
}
