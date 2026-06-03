import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AdminDashboardService } from './services/admin-dashboard.service';
import { AdminUserService } from './services/admin-user.service';
import { AdminOrderService } from './services/admin-order.service';
import { AdminGuideService } from './services/admin-guide.service';
import { AdminContentService } from './services/admin-content.service';
import {
  CreateGuideAdminDto,
  UpdateGuideAdminDto,
  BulkPublishGuidesDto,
} from './dto/admin-guide.dto';
import {
  CreateAdminUserDto,
  UpdateUserAdminDto,
  UserFilterDto,
  BulkUserActionDto,
} from './dto/admin-user.dto';
import { OrderFilterDto, UpdateOrderStatusDto } from './dto/admin-order.dto';
import { DateRangeDto } from './dto/admin-analytics.dto';
import {
  CreateFAQDto,
  UpdateFAQDto,
  CreateTestimonialDto,
  UpdateTestimonialDto,
  UpdateSiteSettingDto,
} from './dto/admin-content.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly dashboardService: AdminDashboardService,
    private readonly userService: AdminUserService,
    private readonly orderService: AdminOrderService,
    private readonly guideService: AdminGuideService,
    private readonly contentService: AdminContentService,
  ) {}

  // ============ Dashboard ============

  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.dashboardService.getDashboardStats();
  }

  @Get('dashboard/analytics/revenue')
  async getRevenueAnalytics(@Query() query: DateRangeDto) {
    return this.dashboardService.getRevenueAnalytics(
      query.startDate ? new Date(query.startDate) : undefined,
      query.endDate ? new Date(query.endDate) : undefined,
    );
  }

  @Get('dashboard/analytics/top-guides')
  async getTopSellingGuides(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.dashboardService.getTopSellingGuides(limit);
  }

  @Get('dashboard/analytics/user-growth')
  async getUserGrowth(@Query() query: DateRangeDto) {
    return this.dashboardService.getUserGrowth(
      query.startDate ? new Date(query.startDate) : undefined,
      query.endDate ? new Date(query.endDate) : undefined,
    );
  }

  @Get('dashboard/analytics/ai-usage')
  async getAIUsageStats() {
    return this.dashboardService.getAIUsageStats();
  }

  // ============ User Management ============

  @Get('users')
  async getUsers(@Query() filters: UserFilterDto) {
    return this.userService.findAll(filters);
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('users/:id/details')
  async getUserDetails(@Param('id') id: string) {
    return this.userService.findUserDetails(id);
  }

  @Post('users')
  async createUser(@Body() dto: CreateAdminUserDto) {
    return this.userService.create(dto);
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserAdminDto) {
    return this.userService.update(id, dto);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post('users/bulk-action')
  async bulkUserAction(@Body() dto: BulkUserActionDto) {
    return this.userService.bulkAction(dto);
  }

  @Post('users/:id/toggle-admin')
  async toggleAdmin(@Param('id') id: string) {
    return this.userService.toggleAdmin(id);
  }

  // ============ Order Management ============

  @Get('orders')
  async getOrders(@Query() filters: OrderFilterDto) {
    return this.orderService.findAll(filters);
  }

  @Get('orders/:id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get('orders/stats/overview')
  async getOrderStats() {
    return this.orderService.getOrderStats();
  }

  @Get('orders/recent/list')
  async getRecentOrders(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.orderService.getRecentOrders(limit);
  }

  @Put('orders/:id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, dto);
  }

  // ============ Guide Management ============

  @Get('guides')
  async getGuides(
    @Query('search') search?: string,
    @Query('isPublished') isPublished?: string,
    @Query('isFree') isFree?: string,
    @Query('categoryId') categoryId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.guideService.findAll({
      search,
      isPublished: isPublished === 'true' ? true : isPublished === 'false' ? false : undefined,
      isFree: isFree === 'true' ? true : isFree === 'false' ? false : undefined,
      categoryId,
      page,
      limit,
    });
  }

  @Get('guides/:id')
  async getGuide(@Param('id') id: string) {
    return this.guideService.findOne(id);
  }

  @Get('guides/stats/overview')
  async getGuideStats() {
    return this.guideService.getGuideStats();
  }

  @Post('guides')
  async createGuide(@Body() dto: CreateGuideAdminDto) {
    return this.guideService.create(dto);
  }

  @Put('guides/:id')
  async updateGuide(@Param('id') id: string, @Body() dto: UpdateGuideAdminDto) {
    return this.guideService.update(id, dto);
  }

  @Delete('guides/:id')
  async deleteGuide(@Param('id') id: string) {
    return this.guideService.remove(id);
  }

  @Post('guides/bulk-publish')
  async bulkPublishGuides(@Body() dto: BulkPublishGuidesDto) {
    return this.guideService.bulkPublish(dto);
  }

  @Post('guides/:id/update-rating')
  async updateGuideRating(@Param('id') id: string) {
    return this.guideService.updateRating(id);
  }

  // ============ Content Management - FAQ ============

  @Get('content/faqs')
  async getAllFAQs() {
    return this.contentService.getAllFAQs();
  }

  @Post('content/faqs')
  async createFAQ(@Body() dto: CreateFAQDto) {
    return this.contentService.createFAQ(dto);
  }

  @Put('content/faqs/:id')
  async updateFAQ(@Param('id') id: string, @Body() dto: UpdateFAQDto) {
    return this.contentService.updateFAQ(id, dto);
  }

  @Delete('content/faqs/:id')
  async deleteFAQ(@Param('id') id: string) {
    return this.contentService.deleteFAQ(id);
  }

  @Post('content/faqs/reorder')
  async reorderFAQs(@Body('orderedIds') orderedIds: string[]) {
    return this.contentService.reorderFAQs(orderedIds);
  }

  // ============ Content Management - Testimonials ============

  @Get('content/testimonials')
  async getAllTestimonials() {
    return this.contentService.getAllTestimonials();
  }

  @Post('content/testimonials')
  async createTestimonial(@Body() dto: CreateTestimonialDto) {
    return this.contentService.createTestimonial(dto);
  }

  @Put('content/testimonials/:id')
  async updateTestimonial(
    @Param('id') id: string,
    @Body() dto: UpdateTestimonialDto,
  ) {
    return this.contentService.updateTestimonial(id, dto);
  }

  @Delete('content/testimonials/:id')
  async deleteTestimonial(@Param('id') id: string) {
    return this.contentService.deleteTestimonial(id);
  }

  @Post('content/testimonials/reorder')
  async reorderTestimonials(@Body('orderedIds') orderedIds: string[]) {
    return this.contentService.reorderTestimonials(orderedIds);
  }

  // ============ Content Management - Site Settings ============

  @Get('content/settings')
  async getAllSettings() {
    return this.contentService.getAllSettings();
  }

  @Get('content/settings/:key')
  async getSetting(@Param('key') key: string) {
    return this.contentService.getSetting(key);
  }

  @Put('content/settings')
  async updateSetting(@Body() dto: UpdateSiteSettingDto) {
    return this.contentService.updateSetting(dto);
  }

  @Delete('content/settings/:key')
  async deleteSetting(@Param('key') key: string) {
    return this.contentService.deleteSetting(key);
  }

  @Post('content/settings/bulk')
  async bulkUpdateSettings(
    @Body('settings') settings: Array<{ key: string; value: string }>,
  ) {
    return this.contentService.bulkUpdateSettings(settings);
  }
}
