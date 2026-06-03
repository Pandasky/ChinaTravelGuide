import { Controller, Get, Put, Body, UseGuards, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Put('password')
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(userId, dto);
  }

  @Get('guides')
  async getMyGuides(@CurrentUser('id') userId: string) {
    return this.usersService.getMyGuides(userId);
  }

  @Get('orders')
  async getMyOrders(@CurrentUser('id') userId: string) {
    return this.usersService.getMyOrders(userId);
  }

  @Get('subscriptions')
  async getMySubscriptions(@CurrentUser('id') userId: string) {
    return this.usersService.getMySubscriptions(userId);
  }

  @Get('subscription/current')
  async getCurrentSubscription(@CurrentUser('id') userId: string) {
    return this.usersService.getCurrentSubscription(userId);
  }

  @Post('subscription/cancel')
  async cancelSubscription(@CurrentUser('id') userId: string) {
    return this.usersService.cancelSubscription(userId);
  }
}
