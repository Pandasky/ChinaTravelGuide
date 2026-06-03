import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateAdminUserDto,
  UpdateUserAdminDto,
  UserFilterDto,
  BulkUserActionDto,
} from '../dto/admin-user.dto';

@Injectable()
export class AdminUserService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: UserFilterDto) {
    const {
      search,
      isAdmin,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = '1',
      limit = '20',
    } = filters;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isAdmin !== undefined) {
      where.isAdmin = isAdmin;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          country: true,
          isAdmin: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              orders: true,
              subscriptions: true,
              chatSessions: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: parseInt(limit),
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        country: true,
        isAdmin: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            subscriptions: true,
            chatSessions: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserDetails(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            guide: {
              select: {
                id: true,
                title: true,
                coverImage: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        chatSessions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            _count: {
              select: { messages: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(dto: CreateAdminUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        isAdmin: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  }

  async update(id: string, dto: UpdateUserAdminDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check email uniqueness if updating email
    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        country: true,
        isAdmin: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Soft delete - just deactivate
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'User deactivated successfully' };
  }

  async bulkAction(dto: BulkUserActionDto) {
    const { userIds, action } = dto;

    switch (action) {
      case 'activate':
        await this.prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { isActive: true },
        });
        return { message: `${userIds.length} users activated` };

      case 'deactivate':
        await this.prisma.user.updateMany({
          where: { id: { in: userIds } },
          data: { isActive: false },
        });
        return { message: `${userIds.length} users deactivated` };

      case 'delete':
        // Note: Hard delete, use with caution
        await this.prisma.user.deleteMany({
          where: { id: { in: userIds } },
        });
        return { message: `${userIds.length} users deleted` };

      default:
        throw new Error('Invalid action');
    }
  }

  async toggleAdmin(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isAdmin: !user.isAdmin },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
      },
    });

    return {
      user: updatedUser,
      message: `Admin status ${updatedUser.isAdmin ? 'granted' : 'revoked'}`,
    };
  }
}
