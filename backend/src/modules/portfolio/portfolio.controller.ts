import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { ClosePositionDto } from './dto/close-position.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('portfolio')
@Controller('portfolio')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class PortfolioController {
    constructor(private readonly portfolioService: PortfolioService) { }

    @Get()
    @ApiOperation({ summary: 'Get all portfolios for current user' })
    getPortfolios(@CurrentUser() user: any) {
        return this.portfolioService.getUserPortfolios(user.sub);
    }

    @Get(':id/metrics')
    @ApiOperation({ summary: 'Get performance metrics for a specific portfolio' })
    getMetrics(@Param('id') id: string, @CurrentUser() user: any) {
        return this.portfolioService.getPortfolioMetrics(id, user.sub);
    }

    @Post(':id/positions')
    @ApiOperation({ summary: 'Open a new position' })
    openPosition(
        @Param('id') id: string,
        @Body() dto: CreatePositionDto,
        @CurrentUser() user: any,
    ) {
        return this.portfolioService.openPosition(id, user.sub, dto);
    }

    @Post(':portfolioId/positions/:positionId/close')
    @ApiOperation({ summary: 'Close an existing position' })
    closePosition(
        @Param('portfolioId') portfolioId: string,
        @Param('positionId') positionId: string,
        @Body() dto: ClosePositionDto,
        @CurrentUser() user: any,
    ) {
        return this.portfolioService.closePosition(portfolioId, positionId, user.sub, dto);
    }
}
