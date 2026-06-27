import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAlertDto {
    @ApiProperty({ description: 'Symbol ID' })
    @IsString()
    symbol_id: string;

    @ApiProperty({ description: 'Alert name' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Condition type', enum: ['price_above', 'price_below', 'percent_change'] })
    @IsString()
    condition_type: string;

    @ApiProperty({ description: 'Condition value' })
    @IsNumber()
    condition_value: number;

    @ApiPropertyOptional({ default: 'in_app' })
    @IsOptional()
    @IsString()
    notification_type?: string;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    is_recurring?: boolean;
}
