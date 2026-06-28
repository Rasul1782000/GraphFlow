import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WatchlistService } from './watchlist.service';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto, AddSymbolDto } from './dto/update-watchlist.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('watchlist')
@Controller('watchlist')
@ApiBearerAuth('JWT')
export class WatchlistController {
    constructor(private readonly watchlistService: WatchlistService) {}

    @Get()
    @ApiOperation({ summary: 'Get all watchlists for current user' })
    findAll(@CurrentUser() user: any) {
        return this.watchlistService.findByUser(user.sub);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get watchlist by ID' })
    findOne(@Param('id') id: string) {
        return this.watchlistService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new watchlist' })
    create(@CurrentUser() user: any, @Body() dto: CreateWatchlistDto) {
        return this.watchlistService.create(user.sub, dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a watchlist' })
    update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateWatchlistDto) {
        return this.watchlistService.update(id, user.sub, dto);
    }

    @Post(':id/symbols')
    @ApiOperation({ summary: 'Add a symbol to watchlist' })
    addSymbol(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: AddSymbolDto) {
        return this.watchlistService.addSymbol(id, user.sub, dto.symbol_id);
    }

    @Delete(':id/symbols/:symbolId')
    @ApiOperation({ summary: 'Remove a symbol from watchlist' })
    removeSymbol(@Param('id') id: string, @Param('symbolId') symbolId: string, @CurrentUser() user: any) {
        return this.watchlistService.removeSymbol(id, user.sub, symbolId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a watchlist' })
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.watchlistService.remove(id, user.sub);
    }
}
