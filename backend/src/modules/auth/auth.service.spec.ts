import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PortfolioService } from '../portfolio/portfolio.service';

jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn(),
}));

import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
    let service: AuthService;
    let usersService: jest.Mocked<UsersService>;
    let jwtService: jest.Mocked<JwtService>;
    let configService: jest.Mocked<ConfigService>;
    let portfolioService: jest.Mocked<PortfolioService>;

    const mockUser = {
        _id: 'user_1',
        id: 'user_1',
        email: 'test@example.com',
        username: 'testuser',
        password_hash: 'hashed_password',
        role: 'user',
        refresh_token: null,
    };

    beforeEach(async () => {
        const mockUsersService = {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            updateRefreshToken: jest.fn(),
            clearRefreshToken: jest.fn(),
        };

        const mockJwtService = {
            signAsync: jest.fn(),
            verify: jest.fn(),
        };

        const mockConfigService = {
            get: jest.fn(),
        };

        const mockPortfolioService = {
            createPortfolio: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
                { provide: ConfigService, useValue: mockConfigService },
                { provide: PortfolioService, useValue: mockPortfolioService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get(UsersService) as jest.Mocked<UsersService>;
        jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
        configService = module.get(ConfigService) as jest.Mocked<ConfigService>;
        portfolioService = module.get(PortfolioService) as jest.Mocked<PortfolioService>;
    });

    describe('register', () => {
        const registerDto = {
            email: 'new@example.com',
            username: 'newuser',
            full_name: 'New User',
            password: 'SecurePass123!',
        };

        it('should register a new user and return tokens', async () => {
            usersService.findByEmail.mockResolvedValue(null);
            usersService.create.mockResolvedValue(mockUser as any);
            jwtService.signAsync.mockResolvedValue('access_token');
            configService.get.mockImplementation((key: string, defaultValue?: string) => {
                const map: Record<string, string> = {
                    JWT_SECRET: 'secret',
                    JWT_EXPIRES_IN: '15m',
                    JWT_REFRESH_SECRET: 'refresh_secret',
                    JWT_REFRESH_EXPIRES_IN: '7d',
                };
                return map[key] ?? defaultValue ?? null;
            });

            const result = await service.register(registerDto);

            expect(usersService.findByEmail).toHaveBeenCalledWith('new@example.com');
            expect(usersService.create).toHaveBeenCalled();
            expect(portfolioService.createPortfolio).toHaveBeenCalledWith(
                mockUser.id,
                expect.objectContaining({ name: 'Main Trading Terminal' })
            );
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
            expect(result).toHaveProperty('user');
        });

        it('should throw ConflictException if email already exists', async () => {
            usersService.findByEmail.mockResolvedValue(mockUser as any);
            await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('login', () => {
        const loginDto = { email: 'test@example.com', password: 'SecurePass123!' };

        it('should login and return tokens', async () => {
            usersService.findByEmail.mockResolvedValue(mockUser as any);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            jwtService.signAsync.mockResolvedValue('access_token');
            configService.get.mockImplementation((key: string, defaultValue?: string) => {
                const map: Record<string, string> = {
                    JWT_SECRET: 'secret',
                    JWT_EXPIRES_IN: '15m',
                    JWT_REFRESH_SECRET: 'refresh_secret',
                    JWT_REFRESH_EXPIRES_IN: '7d',
                };
                return map[key] ?? defaultValue ?? null;
            });

            const result = await service.login(loginDto);
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
            expect(result).toHaveProperty('user');
        });

        it('should throw UnauthorizedException for invalid email', async () => {
            usersService.findByEmail.mockResolvedValue(null);
            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException for invalid password', async () => {
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);
            usersService.findByEmail.mockResolvedValue(mockUser as any);
            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('refresh', () => {
        it('should refresh tokens with valid refresh token', async () => {
            const refreshToken = 'valid_refresh_token';
            const payload = { sub: 'user_1', email: 'test@example.com' };

            usersService.findById.mockResolvedValue({
                ...mockUser,
                refresh_token: refreshToken,
            } as any);
            jwtService.verify.mockReturnValue(payload);
            jwtService.signAsync.mockResolvedValue('new_access_token');
            configService.get.mockImplementation((key: string, defaultValue?: string) => {
                const map: Record<string, string> = {
                    JWT_SECRET: 'secret',
                    JWT_EXPIRES_IN: '15m',
                    JWT_REFRESH_SECRET: 'refresh_secret',
                    JWT_REFRESH_EXPIRES_IN: '7d',
                };
                return map[key] ?? defaultValue ?? null;
            });

            const result = await service.refresh(refreshToken);
            expect(result).toHaveProperty('accessToken');
        });

        it('should throw UnauthorizedException for invalid refresh token', async () => {
            jwtService.verify.mockImplementation(() => { throw new Error(); });
            await expect(service.refresh('invalid')).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('logout', () => {
        it('should clear refresh token', async () => {
            const result = await service.logout('user_1');
            expect(usersService.clearRefreshToken).toHaveBeenCalledWith('user_1');
            expect(result).toEqual({ message: 'Logged out successfully' });
        });
    });
});
