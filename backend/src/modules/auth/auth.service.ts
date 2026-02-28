import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

import { PortfolioService } from '../portfolio/portfolio.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
        private readonly portfolioService: PortfolioService,
    ) { }

    async register(dto: RegisterDto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) throw new ConflictException('Email already registered');

        const hash = await bcrypt.hash(dto.password, 12);
        const user = await this.usersService.create({ ...dto, password_hash: hash });

        // Create default portfolio for the new user
        await this.portfolioService.createPortfolio(user.id, {
            name: 'Main Trading Terminal',
            initial_cash: 100000,
            current_cash: 100000,
            currency: 'USD'
        });

        return this.generateTokens(user);
    }


    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const isValid = await bcrypt.compare(dto.password, user.password_hash);
        if (!isValid) throw new UnauthorizedException('Invalid credentials');

        return this.generateTokens(user);
    }

    async refresh(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.usersService.findById(payload.sub);
            if (!user || user.refresh_token !== refreshToken)
                throw new UnauthorizedException('Invalid refresh token');
            return this.generateTokens(user);
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(userId: string) {
        await this.usersService.clearRefreshToken(userId);
        return { message: 'Logged out successfully' };
    }

    private async generateTokens(user: any) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_SECRET'),
                expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
                expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
            }),
        ]);
        await this.usersService.updateRefreshToken(user.id, refreshToken);
        return {
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, username: user.username, role: user.role },
        };
    }
}
