<div align="center">

# 📈 GraphFlow

### **Trade Smarter. Grow Faster.**

A full-stack **multi-asset trading platform** with real-time market data, portfolio management, automated trading signals, and intelligent market screening.

---

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-10.4-e0234e?style=for-the-badge&logo=nestjs)
![MongoDB](https://img.shields.io/badge/MongoDB-9.x-47A248?style=for-the-badge&logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?style=for-the-badge&logo=redis)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socket.io)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker)
![License](https://img.shields.io/badge/License-Apache%202.0-blue?style=for-the-badge)

---

</div>

## 🌟 Overview

GraphFlow is a comprehensive trading platform designed for **stocks, crypto, forex, and ETFs**. It delivers real-time market data via WebSockets, portfolio tracking with P&L analytics, AI-powered momentum-based trading signals, configurable price alerts, a multi-filter market screener, custom watchlists, and TradingView-style candlestick charts — all wrapped in a sleek, dark-themed terminal UI.

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔄 **Real-Time Market Data** | Live price ticker via WebSocket for crypto, stocks, forex |
| 📊 **Portfolio Management** | Track positions, P&L, trade history with MongoDB transactions |
| 🎯 **Trading Signals** | Automated momentum-based signals (RSI + EMA + ATR analysis) |
| 🔔 **Price Alerts** | Configurable alerts with WebSocket push notifications |
| 🔍 **Market Screener** | Filter symbols by asset class, sector, market cap |
| 📈 **Candlestick Charts** | TradingView Lightweight Charts with real-time updates |
| 👁️ **Watchlists** | Custom symbol watchlists with live price feeds |
| 🔐 **JWT Authentication** | Secure auth with access/refresh token rotation |
| 🐳 **Dockerized** | Full-stack containerization with Docker Compose |
| 📱 **Responsive Design** | Full mobile support with slide-out navigation |

---

## 🏗️ Architecture

```
GraphFlow/
├── backend/                      # NestJS REST + WebSocket API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/             # Authentication (register, login, refresh)
│   │   │   ├── users/            # User management
│   │   │   ├── market/           # Market data, OHLCV, quotes, WebSocket gateway
│   │   │   ├── portfolio/        # Portfolios, positions, trades
│   │   │   ├── signals/          # Trading signal generation (Bull queue)
│   │   │   ├── alerts/           # Price alert checking (Bull queue)
│   │   │   ├── watchlist/        # User watchlists
│   │   │   ├── screener/         # Market symbol screener
│   │   │   └── seed/             # Database seeding
│   │   ├── common/               # Guards, decorators, interceptors, filters
│   │   ├── app.module.ts         # Root module
│   │   └── main.ts               # Application entry point
│   ├── db/_legacy/               # Legacy MySQL schema (reference only)
│   ├── scripts/                  # Utility scripts
│   └── test/                     # E2E tests
│
├── frontend/                     # Next.js 14 App Router
│   ├── src/
│   │   ├── modules/              # Modular architecture
│   │   │   ├── auth/             # Login, Register pages
│   │   │   ├── dashboard/        # Dashboard with widgets
│   │   │   ├── markets/          # Market Pulse page
│   │   │   ├── portfolio/        # Assets page
│   │   │   ├── signals/          # Live Alpha page
│   │   │   ├── screener/         # Discovery page
│   │   │   ├── trade/            # Execution page
│   │   │   ├── watchlist/        # Focus List page
│   │   │   ├── alerts/           # Notifications page
│   │   │   ├── settings/         # Terminal Setup page
│   │   │   └── shared/           # Guards, route config
│   │   ├── app/                  # Thin route wrappers
│   │   ├── components/           # Shared UI components
│   │   ├── lib/                  # API clients, utilities
│   │   ├── hooks/                # Custom React hooks (useWebSocket)
│   │   └── store/                # Zustand state management
│   └── pinescript/              # TradingView indicators & strategies
│
├── .github/workflows/            # CI/CD pipelines
└── docker-compose.yml            # Full-stack orchestration
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.x (v20 recommended)
- **MongoDB** >= 6.x (or use Docker)
- **Redis** >= 7.x (or use Docker)
- **Docker** & **Docker Compose** (optional, for containerized setup)

### 🐳 Docker (Recommended)

The fastest way to run the full stack:

```bash
git clone https://github.com/Rasul1782000/GraphFlow.git
cd GraphFlow
docker compose up -d
```

This starts: MongoDB 7, Redis 7, Backend (port 4000), Frontend (port 3000).

### 🔧 Manual Setup

#### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run build
npm run start:dev
```

- API: **http://localhost:4000**
- Swagger: **http://localhost:4000/api/docs**

#### Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

- App: **http://localhost:3000**

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

```bash
# App
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/graphflow

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_token_secret_32_characters
JWT_REFRESH_EXPIRES_IN=7d

# Market Data APIs
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
BINANCE_API_KEY=your_binance_api_key
BINANCE_SECRET_KEY=your_binance_secret_key
YAHOO_FINANCE_RAPID_API_KEY=your_yahoo_finance_rapid_api_key

# SMTP (email notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
```

### Frontend (`frontend/.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=GraphFlow
```

---

## 📡 API Reference

All endpoints are prefixed with `/api/v1`.

### 🔐 Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | Public | Register a new account |
| `POST` | `/auth/login` | Public | Login and receive JWT tokens |
| `POST` | `/auth/refresh` | Public | Refresh access token |
| `POST` | `/auth/logout` | JWT | Logout and invalidate refresh token |
| `GET` | `/auth/me` | JWT | Get current authenticated user |

### 📊 Market Data

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/market/symbols` | Public | Get available trading symbols |
| `GET` | `/market/ohlcv/:symbol` | Public | Get historical OHLCV data |
| `GET` | `/market/quote/:symbol` | Public | Get real-time quote |
| `GET` | `/market/top-movers` | Public | Get top market movers |

### 💼 Portfolio

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/portfolio` | JWT | Get all portfolios |
| `GET` | `/portfolio/:id/metrics` | JWT | Get performance metrics |
| `POST` | `/portfolio/:id/positions` | JWT | Open a new position |
| `POST` | `/portfolio/:pid/positions/:posid/close` | JWT | Close a position |

### 🎯 Signals

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/signals` | Public | Get signals with filters |
| `GET` | `/signals/recent` | Public | Get recent signals |
| `GET` | `/signals/stats` | Public | Get signal statistics |
| `GET` | `/signals/:id` | Public | Get signal by ID |

### 🔔 Alerts

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/alerts` | JWT | Get all alerts |
| `POST` | `/alerts` | JWT | Create a new alert |
| `PATCH` | `/alerts/:id` | JWT | Update an alert |
| `DELETE` | `/alerts/:id` | JWT | Delete an alert |

### 👁️ Watchlist

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/watchlist` | JWT | Get all watchlists |
| `POST` | `/watchlist` | JWT | Create a watchlist |
| `POST` | `/watchlist/:id/symbols` | JWT | Add symbol to watchlist |
| `DELETE` | `/watchlist/:id/symbols/:sid` | JWT | Remove symbol from watchlist |
| `DELETE` | `/watchlist/:id` | JWT | Delete watchlist |

### 🔍 Screener

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/screener` | Public | Screen symbols with filters |

### 🔌 WebSocket Events

Connect to the `/market` namespace:

| Event | Direction | Payload |
|-------|-----------|---------|
| `subscribe_ticker` | Client → Server | `{ symbols: string[] }` |
| `unsubscribe_ticker` | Client → Server | `{ symbols: string[] }` |
| `ticker_update` | Server → Client | `{ symbol, price, change, volume, bid, ask }` |
| `new_signal` | Server → Client | Full signal object |
| `alert_triggered` | Server → Client | `{ alertId, name, symbol, price, condition }` |

---

## 🖥️ Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Overview** | Dashboard with positions, movers, signals, portfolio summary |
| `/markets` | **Market Pulse** | Symbol grid with live prices, asset class filters |
| `/portfolio` | **Assets** | Portfolio metrics, positions, trade history |
| `/signals` | **Live Alpha** | Signal timeline with entry/SL/TP levels |
| `/screener** | **Discovery** | Multi-filter symbol screener |
| `/trade` | **Execution** | Candlestick chart + order form with side toggle |
| `/watchlist` | **Focus List** | Custom watchlists with real-time quotes |
| `/alerts` | **Notifications** | Price alert CRUD with toggle switches |
| `/settings` | **Terminal Setup** | Profile, preferences, security |
| `/login` | **Login** | Email/password authentication |
| `/register` | **Register** | New account creation |

---

## 🧩 Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **NestJS 10** | Node.js framework (MVC, modular) |
| **TypeScript 5.5** | Type safety |
| **MongoDB + Mongoose 9** | Primary database |
| **Redis + Bull 4** | Job queues for signals & alerts |
| **Socket.IO 4** | WebSocket real-time market data |
| **Passport.js** | JWT authentication strategy |
| **Swagger** | API documentation |
| **Axios** | External API calls (Binance, Alpha Vantage) |
| **Helmet + Compression** | Security headers & gzip |
| **Jest + Supertest** | Unit & E2E testing |

### Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 14 (App Router)** | React framework |
| **TypeScript 5.6** | Type safety |
| **PrimeReact 10** | UI component library |
| **Zustand** | State management with localStorage persistence |
| **Socket.IO Client** | WebSocket connection |
| **Lightweight Charts** | TradingView candlestick charts |
| **Chart.js** | Sparkline/mini charts |
| **TanStack React Query** | Server state management |
| **Axios** | HTTP client with interceptor-based token refresh |
| **next-themes** | Theme management |

### PineScript (TradingView)

| Script | Type | Description |
|--------|------|-------------|
| `graphflow_momentum.pine` | Indicator | Momentum composite (RSI + MACD + Stochastic) |
| `graphflow_smart_money_concepts.pine` | Indicator | SMC (BOS, CHoCH, FVG, Order Blocks) |
| `graphflow_breakout_strategy.pine` | Strategy | Donchian breakout with ATR-based stops |

### DevOps & CI/CD

| Technology | Purpose |
|------------|---------|
| **Docker** | Multi-stage container builds |
| **Docker Compose** | Local orchestration (MongoDB, Redis, backend, frontend) |
| **GitHub Actions** | CI (lint, type-check, test, build) + CD (Docker push, SSH deploy) |
| **CodeQL** | Weekly security analysis |
| **CodeRabbit AI** | Automated code reviews |

---

## 🛡️ Security Features

- **JWT Authentication** with access + refresh token rotation
- **Password Hashing** with bcryptjs (12 rounds)
- **Rate Limiting** via `@nestjs/throttler` (100 req/60s)
- **Helmet** for HTTP security headers
- **CORS** restricted to frontend origin
- **Input Validation** with `class-validator` (whitelist + transform)
- **MongoDB Transactions** for atomic portfolio operations
- **Axios Interceptor** with automatic token refresh on 401

---

## 📦 Available Scripts

### Backend

```bash
npm run build           # Build TypeScript to dist/
npm run start           # Start production server
npm run start:dev       # Development mode with watch
npm run start:debug     # Debug mode
npm run start:prod      # node dist/main
npm run test            # Run unit tests (Jest)
npm run test:cov        # Tests with coverage report
npm run test:e2e        # End-to-end tests
```

### Frontend

```bash
npm run dev             # Start Next.js dev server
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking (tsc --noEmit)
```

### Docker

```bash
docker compose up -d    # Start all services (detached)
docker compose down     # Stop all services
docker compose build    # Rebuild images
docker compose logs -f  # Follow logs
```

---

## 🗺️ Roadmap

- [x] Docker & docker-compose setup
- [x] CI/CD with GitHub Actions
- [x] E2E test suite
- [ ] Email notification service
- [ ] Advanced charting indicators
- [ ] Social trading features
- [ ] Multi-language support
- [ ] Dark/Light theme toggle

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### ⭐ Star this repository if you find it useful!

**Built with ❤️ by [Rasul](https://github.com/Rasul1782000)**

</div>
