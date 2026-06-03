import { IsString, IsOptional, IsBoolean, IsNumber, IsArray } from 'class-validator';

export class CreateGuideAdminDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  pdfUrl?: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsNumber()
  @IsOptional()
  pageCount?: number;

  @IsString()
  @IsOptional()
  version?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];
}

export class UpdateGuideAdminDto extends CreateGuideAdminDto {}

export class BulkPublishGuidesDto {
  @IsArray()
  @IsString({ each: true })
  guideIds: string[];

  @IsBoolean()
  isPublished: boolean;
}
