import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Symbol } from '../market/entities/symbol.entity';
import { ScreenerFilterDto } from './dto/screener-filter.dto';

@Injectable()
export class ScreenerService {
    constructor(
        @InjectRepository(Symbol) private readonly symbolRepo: Repository<Symbol>,
    ) { }

    async screen(dto: ScreenerFilterDto) {
        const qb = this.symbolRepo.createQueryBuilder('s')
            .where('s.is_active = :active', { active: true });

        if (dto.asset_class?.length) {
            qb.andWhere('s.asset_class IN (:...classes)', { classes: dto.asset_class });
        }
        if (dto.sector?.length) {
            qb.andWhere('s.sector IN (:...sectors)', { sectors: dto.sector });
        }
        if (dto.min_market_cap != null) {
            qb.andWhere('s.market_cap >= :minMc', { minMc: dto.min_market_cap });
        }
        if (dto.max_market_cap != null) {
            qb.andWhere('s.market_cap <= :maxMc', { maxMc: dto.max_market_cap });
        }
        if (dto.search) {
            qb.andWhere('(s.ticker LIKE :q OR s.name LIKE :q)', { q: `%${dto.search}%` });
        }

        const sortField = dto.sort_by || 'market_cap';
        const sortDir = (dto.sort_dir?.toUpperCase() as 'ASC' | 'DESC') || 'DESC';
        qb.orderBy(`s.${sortField}`, sortDir)
            .limit(dto.limit || 100)
            .offset(dto.offset || 0);

        const [items, total] = await qb.getManyAndCount();
        return { items, total, page: Math.floor((dto.offset || 0) / (dto.limit || 100)) + 1 };
    }
}
