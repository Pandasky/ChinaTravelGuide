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
import { GuidesService } from './guides.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CreateGuideDto } from './dto/create-guide.dto';
import { UpdateGuideDto } from './dto/update-guide.dto';
import { GuideFilterDto, SortField, SortOrder } from './dto/guide-filter.dto';

@Controller('guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @Public()
  @Get()
  async findAll(
    @Query() filters: GuideFilterDto,
    @CurrentUser('id') userId?: string,
  ) {
    return this.guidesService.findAll(filters, userId);
  }

  @Public()
  @Get('categories')
  async getCategories() {
    return this.guidesService.getCategories();
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId?: string,
  ) {
    return this.guidesService.findOne(id, userId);
  }

  @Public()
  @Get(':id/preview')
  async getPreview(@Param('id') id: string) {
    return this.guidesService.getPreview(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/download')
  async getDownloadUrl(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.guidesService.getDownloadUrl(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reviews')
  async createReview(
    @Param('id') guideId: string,
    @CurrentUser('id') userId: string,
    @Body('rating', new DefaultValuePipe(5), ParseIntPipe) rating: number,
    @Body('content') content?: string,
  ) {
    return this.guidesService.createReview(guideId, userId, rating, content);
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async create(@Body() dto: CreateGuideDto) {
    return this.guidesService.create(dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateGuideDto) {
    return this.guidesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.guidesService.remove(id);
  }
}
