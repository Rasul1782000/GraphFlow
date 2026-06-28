import { config } from 'dotenv';
config({ path: '.env.local' });

import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

// Minimal schemas for seeding
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    full_name: String,
    role: { type: String, enum: ['user', 'admin', 'pro'], default: 'user' },
    is_verified: { type: Boolean, default: false },
    refresh_token: String,
    last_login_at: Date,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const SymbolSchema = new mongoose.Schema({
    ticker: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    asset_class: { type: String, enum: ['stock', 'crypto', 'forex', 'etf'], required: true },
    exchange: String,
    currency: { type: String, required: true },
    sector: String,
    market_cap: Number,
    is_active: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Symbol = mongoose.model('Symbol', SymbolSchema);

async function seed() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/graphflow';
    await mongoose.connect(uri);
    console.log(`Connected to ${uri}`);

    // Seed users
    if ((await User.countDocuments()) === 0) {
        const hash = await bcrypt.hash('admin123', 10);
        await User.create([
            { email: 'admin@graphflow.app', username: 'admin', password_hash: hash, full_name: 'Admin', role: 'admin', is_verified: true },
            { email: 'demo@graphflow.app', username: 'demouser', password_hash: hash, full_name: 'Demo User', role: 'user', is_verified: true },
        ]);
        console.log('Seeded users');
    }

    // Seed symbols
    if ((await Symbol.countDocuments()) === 0) {
        await Symbol.create([
            { ticker: 'AAPL', name: 'Apple Inc.', asset_class: 'stock', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology', market_cap: 3000000000000 },
            { ticker: 'MSFT', name: 'Microsoft Corp', asset_class: 'stock', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology', market_cap: 3200000000000 },
            { ticker: 'GOOGL', name: 'Alphabet Inc.', asset_class: 'stock', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology', market_cap: 2000000000000 },
            { ticker: 'NVDA', name: 'NVIDIA Corp', asset_class: 'stock', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology', market_cap: 2800000000000 },
            { ticker: 'TSLA', name: 'Tesla Inc.', asset_class: 'stock', exchange: 'NASDAQ', currency: 'USD', sector: 'Automotive', market_cap: 800000000000 },
            { ticker: 'BTCUSDT', name: 'Bitcoin / USDT', asset_class: 'crypto', exchange: 'Binance', currency: 'USDT', market_cap: 1200000000000 },
            { ticker: 'ETHUSDT', name: 'Ethereum / USDT', asset_class: 'crypto', exchange: 'Binance', currency: 'USDT', market_cap: 400000000000 },
            { ticker: 'SOLUSDT', name: 'Solana / USDT', asset_class: 'crypto', exchange: 'Binance', currency: 'USDT', market_cap: 80000000000 },
            { ticker: 'EURUSD', name: 'Euro / US Dollar', asset_class: 'forex', exchange: 'FX', currency: 'USD' },
            { ticker: 'GBPUSD', name: 'British Pound / US Dollar', asset_class: 'forex', exchange: 'FX', currency: 'USD' },
            { ticker: 'SPY', name: 'SPDR S&P 500 ETF', asset_class: 'etf', exchange: 'NYSE', currency: 'USD', sector: 'Broad Market', market_cap: 500000000000 },
            { ticker: 'QQQ', name: 'Invesco QQQ Trust', asset_class: 'etf', exchange: 'NASDAQ', currency: 'USD', sector: 'Technology', market_cap: 300000000000 },
        ]);
        console.log('Seeded symbols');
    }

    await mongoose.disconnect();
    console.log('Seed complete');
}

seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
