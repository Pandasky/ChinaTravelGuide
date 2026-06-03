import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Note: In actual tests, use the PrismaService from the test module
// This is a helper for setting up test data in E2E tests

export interface CreateUserInput {
  email?: string;
  password?: string;
  name?: string;
  isAdmin?: boolean;
  isActive?: boolean;
  googleId?: string;
  facebookId?: string;
  appleId?: string;
}

export class UserFactory {
  static async create(prisma: PrismaClient, data: CreateUserInput = {}): Promise<User> {
    const defaultData = {
      email: `test-${Date.now()}@example.com`,
      password: await bcrypt.hash('password123', 10),
      name: 'Test User',
      isAdmin: false,
      isActive: true,
    };

    const merged = { ...defaultData, ...data };

    return prisma.user.create({
      data: merged,
    });
  }

  static async createAdmin(prisma: PrismaClient, data: CreateUserInput = {}): Promise<User> {
    return this.create(prisma, { ...data, isAdmin: true });
  }

  static async createMany(prisma: PrismaClient, count: number, data: CreateUserInput = {}): Promise<User[]> {
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
      users.push(await this.create(prisma, {
        ...data,
        email: `test-${Date.now()}-${i}@example.com`,
      }));
    }
    return users;
  }

  static async cleanup(prisma: PrismaClient): Promise<void> {
    await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: 'test-',
        },
      },
    });
  }
}
