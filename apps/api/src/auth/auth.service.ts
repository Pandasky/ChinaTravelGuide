import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { OAuthLoginDto } from './dto/oauth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
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
        name: dto.name || dto.email.split('@')[0],
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        country: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user,
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        country: user.country,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
      ...tokens,
    };
  }

  async oauthLogin(dto: OAuthLoginDto) {
    const { provider, providerId, email, name } = dto;

    if (!providerId) {
      throw new UnauthorizedException('Invalid OAuth credentials');
    }

    // Find user by provider ID
    let user = await this.prisma.user.findFirst({
      where: {
        ...(provider === 'google' && { googleId: providerId }),
        ...(provider === 'facebook' && { facebookId: providerId }),
        ...(provider === 'apple' && { appleId: providerId }),
      },
    });

    // If user not found by provider ID, try to find by email and link accounts
    if (!user && email) {
      user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        // Link OAuth account to existing user
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            ...(provider === 'google' && { googleId: providerId }),
            ...(provider === 'facebook' && { facebookId: providerId }),
            ...(provider === 'apple' && { appleId: providerId }),
          },
        });
      }
    }

    // Create new user if not found
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: email || `${providerId}@${provider}.oauth`,
          name: name || `${provider} User`,
          ...(provider === 'google' && { googleId: providerId }),
          ...(provider === 'facebook' && { facebookId: providerId }),
          ...(provider === 'apple' && { appleId: providerId }),
        },
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        country: user.country,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user.id, user.email);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If an account exists, a reset email has been sent' };
    }

    // TODO: Generate reset token and send email
    // For now, just return success message
    return { message: 'If an account exists, a reset email has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    // TODO: Verify reset token and update password
    // For now, throw not found
    throw new NotFoundException('Invalid or expired token');
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        country: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            subscriptions: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async generateTokens(userId: string, email: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId, email },
      {
        secret: this.configService.get<string>('JWT_SECRET') || 'your-secret-key',
        expiresIn: '1d',
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId, email },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret',
        expiresIn: '7d',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
