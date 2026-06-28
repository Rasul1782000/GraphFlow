import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SignalsService } from './signals.service';
import { CreateSignalDto } from './dto/create-signal.dto';
import { SignalFilterDto } from './dto/signal-filter.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('signals')
@Controller('signals')
export class SignalsController {
    constructor(private readonly signalsService: SignalsService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get trading signals with filters' })
    findAll(@Query() filters: SignalFilterDto) {
        return this.signalsService.findAll(filters);
    }

    @Public()
    @Get('recent')
    @ApiOperation({ summary: 'Get recent signals' })
    getRecent(@Query('limit') limit?: number) {
        return this.signalsService.getRecentSignals(limit || 10);
    }

    @Public()
    @Get('stats')
    @ApiOperation({ summary: 'Get signal statistics' })
    getStats() {
        return this.signalsService.getSignalStats();
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get signal by ID' })
    findOne(@Param('id') id: string) {
        return this.signalsService.findOne(id);
    }

    @Post()
    @ApiBearerAuth('JWT')
    @ApiOperation({ summary: 'Create a new signal (admin)' })
    create(@Body() dto: CreateSignalDto) {
        return this.signalsService.create(dto);
    }
}
