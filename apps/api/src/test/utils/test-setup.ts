import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

export interface TestContext {
  app: INestApplication;
}

export async function setupTestModule(module: any): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [module],
  }).compile();
}

export async function setupTestApp(module: any): Promise<INestApplication> {
  const moduleFixture = await setupTestModule(module);
  const app = moduleFixture.createNestApplication();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.init();
  return app;
}

export function createAuthHeader(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getAuthToken(
  app: INestApplication,
  email: string,
  password: string,
): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email, password });

  return response.body.accessToken;
}

export function generateTestEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substring(2, 7)}@example.com`;
}

export function generateTestData(overrides: Record<string, any> = {}): Record<string, any> {
  return {
    email: generateTestEmail(),
    password: 'password123',
    name: 'Test User',
    ...overrides,
  };
}
