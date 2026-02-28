import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({}),
        PortfolioModule,
        ConfigModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule { }
