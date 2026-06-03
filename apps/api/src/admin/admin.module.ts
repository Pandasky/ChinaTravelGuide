import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminDashboardService } from './services/admin-dashboard.service';
import { AdminUserService } from './services/admin-user.service';
import { AdminOrderService } from './services/admin-order.service';
import { AdminGuideService } from './services/admin-guide.service';
import { AdminContentService } from './services/admin-content.service';

@Module({
  controllers: [AdminController],
  providers: [
    AdminDashboardService,
    AdminUserService,
    AdminOrderService,
    AdminGuideService,
    AdminContentService,
  ],
  exports: [
    AdminDashboardService,
    AdminUserService,
    AdminOrderService,
    AdminGuideService,
    AdminContentService,
  ],
})
export class AdminModule {}
