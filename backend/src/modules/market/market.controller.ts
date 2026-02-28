import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MarketService } from './market.service';
import { GetOhlcvDto } from './dto/get-ohlcv.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('market')
@Controller('market')
export class MarketController {
    constructor(private readonly marketService: MarketService) { }

    @Public()
    @Get('symbols')
    @ApiOperation({ summary: 'Get available trading symbols' })
    getSymbols(@Query('assetClass') assetClass?: string) {
        return this.marketService.getSymbols(assetClass);
    }

    @Public()
    @Get('ohlcv/:symbol')
    @ApiOperation({ summary: 'Get historical OHLCV data' })
    getOhlcv(@Param('symbol') symbol: string, @Query() dto: GetOhlcvDto) {
        return this.marketService.getOhlcv(symbol, dto);
    }

    @Public()
    @Get('quote/:symbol')
    @ApiOperation({ summary: 'Get real-time quote' })
    getQuote(@Param('symbol') symbol: string) {
        return this.marketService.getQuote(symbol);
    }

    @Public()
    @Get('top-movers')
    @ApiOperation({ summary: 'Get top market movers' })
    getTopMovers(@Query('limit') limit?: number) {
        return this.marketService.getTopMovers(limit);
    }
}
