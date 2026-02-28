export function formatCurrency(value: number, currency = 'USD', compact = false): string {
    if (value >= 1000 && compact) {
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    }
    const decimals = value < 1 ? (value < 0.01 ? 6 : 4) : value < 100 ? 2 : 2;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
    const prefix = value >= 0 ? '+' : '';
    return `${prefix}${value.toFixed(decimals)}%`;
}

export function formatVolume(value: number): string {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toFixed(0);
}

export function formatRelativeTime(date: string | Date): string {
    const now = Date.now();
    const ts = typeof date === 'string' ? new Date(date).getTime() : date.getTime();
    const diff = Math.floor((now - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}
