import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('GraphFlow API (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        app.setGlobalPrefix('api/v1');
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Auth endpoints', () => {
        const testUser = {
            email: `e2e_${Date.now()}@test.com`,
            username: `test_${Date.now()}`,
            full_name: 'E2E Test User',
            password: 'TestPass123!',
        };

        let accessToken: string;
        let refreshToken: string;

        it('POST /api/v1/auth/register - should register a user', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/auth/register')
                .send(testUser)
                .expect(201);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('accessToken');
            expect(res.body.data).toHaveProperty('refreshToken');
            expect(res.body.data.user.email).toBe(testUser.email);

            accessToken = res.body.data.accessToken;
            refreshToken = res.body.data.refreshToken;
        });

        it('POST /api/v1/auth/register - should reject duplicate email', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/auth/register')
                .send(testUser)
                .expect(409);
        });

        it('POST /api/v1/auth/login - should login', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/auth/login')
                .send({ email: testUser.email, password: testUser.password })
                .expect(200);

            expect(res.body.data).toHaveProperty('accessToken');
            accessToken = res.body.data.accessToken;
            refreshToken = res.body.data.refreshToken;
        });

        it('POST /api/v1/auth/login - should reject invalid credentials', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/auth/login')
                .send({ email: testUser.email, password: 'wrong' })
                .expect(401);
        });

        it('GET /api/v1/auth/me - should return user with valid token', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(res.body.data.email).toBe(testUser.email);
        });

        it('GET /api/v1/auth/me - should reject without token', async () => {
            await request(app.getHttpServer())
                .get('/api/v1/auth/me')
                .expect(401);
        });

        it('POST /api/v1/auth/refresh - should refresh tokens', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/auth/refresh')
                .send({ refresh_token: refreshToken })
                .expect(200);

            expect(res.body.data).toHaveProperty('accessToken');
            expect(res.body.data).toHaveProperty('refreshToken');
        });

        it('POST /api/v1/auth/logout - should logout', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);
        });
    });

    describe('Market endpoints', () => {
        it('GET /api/v1/market/symbols - should return symbols', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/market/symbols')
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('GET /api/v1/market/symbols?assetClass=stock - should filter by asset class', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/market/symbols?assetClass=stock')
                .expect(200);

            expect(res.body.success).toBe(true);
        });
    });
});
