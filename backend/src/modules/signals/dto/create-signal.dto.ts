import { IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSignalDto {
    @ApiProperty({ description: 'Symbol ID' })
    @IsString()
    symbol_id: string;

    @ApiProperty({ description: 'Signal source identifier' })
    @IsString()
    source: string;

    @ApiProperty({ enum: ['buy', 'sell', 'neutral'] })
    @IsEnum(['buy', 'sell', 'neutral'])
    type: string;

    @ApiProperty({ description: 'Signal strength (0-100)' })
    @IsNumber()
    strength: number;

    @ApiProperty({ description: 'Timeframe for the signal' })
    @IsString()
    timeframe: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    entry_price?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    stop_loss?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    take_profit?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    risk_reward?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    expires_at?: string;
}
