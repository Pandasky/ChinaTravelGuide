import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGuideDto {
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
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageCount?: number;

  @IsString()
  @IsOptional()
  version?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];
}
