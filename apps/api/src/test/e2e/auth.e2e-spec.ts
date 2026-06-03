import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';
import { UserFactory } from '../factories/user.factory';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await UserFactory.cleanup();
    await app.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: `e2e-test-${Date.now()}@example.com`,
          password: 'password123',
          name: 'E2E Test User',
        })
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toContain('@example.com');
    });

    it('should fail with duplicate email', async () => {
      const email = `duplicate-${Date.now()}@example.com`;

      // First registration
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email,
          password: 'password123',
        });

      // Duplicate registration
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email,
          password: 'password123',
        })
        .expect(409);
    });

    it('should fail with invalid data', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123', // Too short
        })
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const email = `login-test-${Date.now()}@example.com`;
      const password = 'password123';

      // Create user first
      await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email,
          password,
          name: 'Login Test',
        });

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email, password })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe(email);
    });

    it('should fail with invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user profile', async () => {
      const email = `me-test-${Date.now()}@example.com`;
      const password = 'password123';

      // Register
      const registerRes = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email,
          password,
          name: 'Me Test',
        });

      const token = registerRes.body.accessToken;

      // Get me
      const response = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.email).toBe(email);
      expect(response.body).toHaveProperty('_count');
    });

    it('should fail without token', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/me')
        .expect(401);
    });
  });
});
