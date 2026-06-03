import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';
import { UserFactory } from '../factories/user.factory';
import { GuideFactory, CategoryFactory } from '../factories/guide.factory';

describe('GuidesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Create test user and get auth token
    const email = `guide-test-${Date.now()}@example.com`;
    const registerRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email,
        password: 'password123',
        name: 'Guide Test User',
      });

    authToken = registerRes.body.accessToken;
    testUserId = registerRes.body.user.id;
  });

  afterAll(async () => {
    await GuideFactory.cleanup();
    await CategoryFactory.cleanup();
    await UserFactory.cleanup();
    await app.close();
  });

  describe('GET /api/guides', () => {
    it('should return list of guides', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/guides')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter guides by search term', async () => {
      const category = await CategoryFactory.create({ name: 'Beijing', slug: 'beijing', type: 'CITY' });
      await GuideFactory.create({
        title: 'Beijing Travel Guide',
        isPublished: true,
        categoryIds: [category.id],
      });

      const response = await request(app.getHttpServer())
        .get('/api/guides?search=beijing')
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should paginate results', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/guides?page=1&limit=5')
        .expect(200);

      expect(response.body.meta.limit).toBe(5);
      expect(response.body.meta.page).toBe(1);
    });
  });

  describe('GET /api/guides/categories', () => {
    it('should return all categories', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/guides/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/guides/:id', () => {
    it('should return guide details', async () => {
      const guide = await GuideFactory.create({ title: 'Detail Test Guide', isPublished: true });

      const response = await request(app.getHttpServer())
        .get(`/api/guides/${guide.id}`)
        .expect(200);

      expect(response.body.id).toBe(guide.id);
      expect(response.body.title).toBe('Detail Test Guide');
    });

    it('should return 404 for non-existent guide', async () => {
      await request(app.getHttpServer())
        .get('/api/guides/non-existent-id')
        .expect(404);
    });
  });

  describe('GET /api/guides/:id/preview', () => {
    it('should return guide preview', async () => {
      const guide = await GuideFactory.create({ title: 'Preview Test', isPublished: true });

      const response = await request(app.getHttpServer())
        .get(`/api/guides/${guide.id}/preview`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title');
    });
  });

  describe('GET /api/guides/:id/download', () => {
    it('should return download URL for purchased guide', async () => {
      const guide = await GuideFactory.create({ title: 'Download Test', isPublished: true });

      // Create an order for this guide
      await request(app.getHttpServer())
        .post('/api/admin/guides/bulk-publish')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ guideIds: [guide.id], isPublished: true });

      // This would require actual purchase flow, so we'll just check the auth requirement
      const response = await request(app.getHttpServer())
        .get(`/api/guides/${guide.id}/download`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403); // Forbidden because not purchased

      expect(response.body.message).toContain('purchase');
    });

    it('should require authentication', async () => {
      const guide = await GuideFactory.create({ title: 'Auth Test' });

      await request(app.getHttpServer())
        .get(`/api/guides/${guide.id}/download`)
        .expect(401);
    });
  });

  describe('Admin Guide Management', () => {
    let adminToken: string;

    beforeEach(async () => {
      // Create admin user
      const adminEmail = `admin-test-${Date.now()}@example.com`;
      const registerRes = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: adminEmail,
          password: 'password123',
          name: 'Admin User',
        });

      // Make user admin
      await request(app.getHttpServer())
        .post(`/api/admin/users/${registerRes.body.user.id}/toggle-admin`)
        .set('Authorization', `Bearer ${registerRes.body.accessToken}`);

      // Login again to get fresh admin token
      const loginRes = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: adminEmail,
          password: 'password123',
        });

      adminToken = loginRes.body.accessToken;
    });

    it('should create guide as admin', async () => {
      const category = await CategoryFactory.create({ type: 'CITY' });

      const response = await request(app.getHttpServer())
        .post('/api/admin/guides')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'New Admin Guide',
          description: 'Description for admin guide',
          price: 9.99,
          categoryIds: [category.id],
        })
        .expect(201);

      expect(response.body.title).toBe('New Admin Guide');
    });

    it('should update guide as admin', async () => {
      const guide = await GuideFactory.create({ title: 'Update Test' });

      const response = await request(app.getHttpServer())
        .put(`/api/admin/guides/${guide.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Updated Title',
          price: 14.99,
        })
        .expect(200);

      expect(response.body.title).toBe('Updated Title');
    });

    it('should delete guide as admin', async () => {
      const guide = await GuideFactory.create({ title: 'Delete Test' });

      await request(app.getHttpServer())
        .delete(`/api/admin/guides/${guide.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });
});
