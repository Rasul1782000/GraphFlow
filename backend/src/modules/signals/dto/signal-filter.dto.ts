import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SignalFilterDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    symbol_id?: string;

    @ApiPropertyOptional({ enum: ['buy', 'sell', 'neutral'] })
    @IsOptional()
    @IsEnum(['buy', 'sell', 'neutral'])
    type?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    source?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    timeframe?: string;

    @ApiPropertyOptional({ default: 50 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    offset?: number;
}
