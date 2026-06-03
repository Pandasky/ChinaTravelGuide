import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateFAQDto,
  UpdateFAQDto,
  CreateTestimonialDto,
  UpdateTestimonialDto,
  UpdateSiteSettingDto,
} from '../dto/admin-content.dto';

@Injectable()
export class AdminContentService {
  constructor(private prisma: PrismaService) {}

  // ============ FAQ Management ============

  async getAllFAQs() {
    return this.prisma.fAQ.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async getVisibleFAQs() {
    return this.prisma.fAQ.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
    });
  }

  async createFAQ(dto: CreateFAQDto) {
    return this.prisma.fAQ.create({
      data: dto,
    });
  }

  async updateFAQ(id: string, dto: UpdateFAQDto) {
    const faq = await this.prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    return this.prisma.fAQ.update({
      where: { id },
      data: dto,
    });
  }

  async deleteFAQ(id: string) {
    const faq = await this.prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    await this.prisma.fAQ.delete({
      where: { id },
    });

    return { message: 'FAQ deleted successfully' };
  }

  async reorderFAQs(orderedIds: string[]) {
    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.fAQ.update({
          where: { id },
          data: { order: index },
        }),
      ),
    );

    return { message: 'FAQs reordered successfully' };
  }

  // ============ Testimonial Management ============

  async getAllTestimonials() {
    return this.prisma.testimonial.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async getVisibleTestimonials() {
    return this.prisma.testimonial.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
    });
  }

  async createTestimonial(dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({
      data: dto,
    });
  }

  async updateTestimonial(id: string, dto: UpdateTestimonialDto) {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      throw new NotFoundException('Testimonial not found');
    }

    return this.prisma.testimonial.update({
      where: { id },
      data: dto,
    });
  }

  async deleteTestimonial(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      throw new NotFoundException('Testimonial not found');
    }

    await this.prisma.testimonial.delete({
      where: { id },
    });

    return { message: 'Testimonial deleted successfully' };
  }

  async reorderTestimonials(orderedIds: string[]) {
    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.testimonial.update({
          where: { id },
          data: { order: index },
        }),
      ),
    );

    return { message: 'Testimonials reordered successfully' };
  }

  // ============ Site Settings Management ============

  async getAllSettings() {
    return this.prisma.siteSetting.findMany();
  }

  async getSetting(key: string) {
    return this.prisma.siteSetting.findUnique({
      where: { key },
    });
  }

  async updateSetting(dto: UpdateSiteSettingDto) {
    return this.prisma.siteSetting.upsert({
      where: { key: dto.key },
      update: { value: dto.value },
      create: { key: dto.key, value: dto.value },
    });
  }

  async deleteSetting(key: string) {
    await this.prisma.siteSetting.delete({
      where: { key },
    });

    return { message: 'Setting deleted successfully' };
  }

  async bulkUpdateSettings(settings: Array<{ key: string; value: string }>) {
    await this.prisma.$transaction(
      settings.map((setting) =>
        this.prisma.siteSetting.upsert({
          where: { key: setting.key },
          update: { value: setting.value },
          create: { key: setting.key, value: setting.value },
        }),
      ),
    );

    return { message: 'Settings updated successfully' };
  }
}
