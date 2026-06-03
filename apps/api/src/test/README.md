# Testing Guide

This directory contains all tests for the ChinaWise API.

## Test Structure

```
src/
├── test/
│   ├── factories/        # Test data factories
│   ├── utils/           # Test utilities
│   └── e2e/             # End-to-end tests
├── auth/__tests__/      # Auth module unit tests
├── guides/__tests__/    # Guides module unit tests
├── users/__tests__/     # Users module unit tests
└── payment/__tests__/   # Payment module unit tests
```

## Running Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:cov

# Run E2E tests
pnpm test:e2e

# Run specific test file
pnpm test -- auth.service.spec.ts

# Debug tests
pnpm test:debug
```

## Test Factories

Factories help create test data consistently:

```typescript
import { UserFactory } from '../factories/user.factory';
import { GuideFactory } from '../factories/guide.factory';

// Create a user
const user = await UserFactory.create({
  email: 'test@example.com',
  isAdmin: true,
});

// Create an admin
const admin = await UserFactory.createAdmin();

// Create a guide
const guide = await GuideFactory.create({
  title: 'Test Guide',
  price: 9.99,
});

// Cleanup after tests
await UserFactory.cleanup();
await GuideFactory.cleanup();
```

## Writing Unit Tests

Example service test:

```typescript
describe('MyService', () => {
  let service: MyService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MyService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MyService>(MyService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should do something', async () => {
    // Arrange
    mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

    // Act
    const result = await service.findById('1');

    // Assert
    expect(result.id).toBe('1');
  });
});
```

## Writing E2E Tests

Example E2E test:

```typescript
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
  });
});
```

## Best Practices

1. **Use Factories**: Always use factories for creating test data
2. **Cleanup**: Clean up test data after tests run
3. **Isolation**: Each test should be independent
4. **Naming**: Use descriptive test names: `should do X when Y`
5. **Assertions**: Test one thing per test, use specific assertions
6. **Mocking**: Mock external services (Stripe, PayPal, etc.)

## Coverage Goals

- Services: > 80%
- Controllers: > 70%
- Overall: > 75%

Exclusions:
- DTOs
- Entity definitions
- Configuration files
- Test utilities
