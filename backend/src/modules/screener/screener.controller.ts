import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ScreenerService } from './screener.service';
import { ScreenerFilterDto } from './dto/screener-filter.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('screener')
@Controller('screener')
export class ScreenerController {
    constructor(private readonly screenerService: ScreenerService) { }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Filter and screen market symbols' })
    screen(@Query() dto: ScreenerFilterDto) {
        return this.screenerService.screen(dto);
    }
}
