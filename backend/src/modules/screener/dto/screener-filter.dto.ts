export class ScreenerFilterDto {
    asset_class?: string[];
    sector?: string[];
    min_market_cap?: number;
    max_market_cap?: number;
    search?: string;
    sort_by?: string;
    sort_dir?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
}
