import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('alerts')
@Controller('alerts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class AlertsController {
    constructor(private readonly alertsService: AlertsService) {}

    @Get()
    @ApiOperation({ summary: 'Get all alerts for current user' })
    findAll(@CurrentUser() user: any) {
        return this.alertsService.findByUser(user.sub);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get alert statistics' })
    getStats(@CurrentUser() user: any) {
        return this.alertsService.getAlertStats(user.sub);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get alert by ID' })
    findOne(@Param('id') id: string) {
        return this.alertsService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new alert' })
    create(@CurrentUser() user: any, @Body() dto: CreateAlertDto) {
        return this.alertsService.create(user.sub, dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an alert' })
    update(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: UpdateAlertDto) {
        return this.alertsService.update(id, user.sub, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an alert' })
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.alertsService.remove(id, user.sub);
    }
}
