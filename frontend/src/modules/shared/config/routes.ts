import { ComponentType } from 'react';

export type GuardType = 'auth' | 'public' | 'none';

export interface RouteConfig {
    path: string;
    name: string;
    component: ComponentType;
    icon?: string;
    guard?: GuardType;
    layout?: 'dashboard' | 'auth' | 'none';
    parent?: string;
    children?: RouteConfig[];
    isHidden?: boolean;
}

// Auth routes
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { RegisterPage } from '@/modules/auth/pages/RegisterPage';

// Dashboard routes
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage';

// Feature routes
import { MarketsPage } from '@/modules/markets/pages/MarketsPage';
import { PortfolioPage } from '@/modules/portfolio/pages/PortfolioPage';
import { SignalsPage } from '@/modules/signals/pages/SignalsPage';
import { ScreenerPage } from '@/modules/screener/pages/ScreenerPage';
import { TradePage } from '@/modules/trade/pages/TradePage';
import { WatchlistPage } from '@/modules/watchlist/pages/WatchlistPage';
import { AlertsPage } from '@/modules/alerts/pages/AlertsPage';
import { SettingsPage } from '@/modules/settings/pages/SettingsPage';

export const authRoutes: RouteConfig[] = [
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        guard: 'public',
        layout: 'auth',
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage,
        guard: 'public',
        layout: 'auth',
    },
];

export const dashboardRoutes: RouteConfig[] = [
    {
        path: '/',
        name: 'Overview',
        component: DashboardPage,
        icon: 'pi pi-compass',
        guard: 'auth',
        layout: 'dashboard',
    },
    {
        path: '/markets',
        name: 'Market Pulse',
        component: MarketsPage,
        icon: 'pi pi-chart-line',
        guard: 'auth',
        layout: 'dashboard',
        parent: '/',
    },
    {
        path: '/portfolio',
        name: 'Assets',
        component: PortfolioPage,
        icon: 'pi pi-briefcase',
        guard: 'auth',
        layout: 'dashboard',
        parent: '/',
    },
    {
        path: '/signals',
        name: 'Live Alpha',
        component: SignalsPage,
        icon: 'pi pi-bolt',
        guard: 'auth',
        layout: 'dashboard',
        parent: '/',
    },
    {
        path: '/screener',
        name: 'Discovery',
        component: ScreenerPage,
        icon: 'pi pi-search',
        guard: 'auth',
        layout: 'dashboard',
        parent: '/',
    },
    {
        path: '/trade',
        name: 'Execution',
        component: TradePage,
        icon: 'pi pi-directions',
        guard: 'auth',
        layout: 'dashboard',
        parent: '/',
    },
    {
        path: '/watchlist',
        name: 'Focus List',
        component: WatchlistPage,
        icon: 'pi pi-bookmark',
        guard: 'auth',
        layout: 'dashboard',
        parent: '/',
    },
    {
        path: '/alerts',
        name: 'Notifications',
        component: AlertsPage,
        icon: 'pi pi-bell',
        guard: 'auth',
        layout: 'dashboard',
        parent: '/',
    },
    {
        path: '/settings',
        name: 'Terminal Setup',
        component: SettingsPage,
        icon: 'pi pi-cog',
        guard: 'auth',
        layout: 'dashboard',
        parent: '/',
    },
];

export const allRoutes: RouteConfig[] = [...authRoutes, ...dashboardRoutes];

export const getRoutesByLayout = (layout: 'auth' | 'dashboard') =>
    allRoutes.filter(r => r.layout === layout);

export const getRouteByPath = (path: string) =>
    allRoutes.find(r => r.path === path);
