import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateFAQDto {
  @IsString()
  question: string;

  @IsString()
  answer: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}

export class UpdateFAQDto extends CreateFAQDto {}

export class CreateTestimonialDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  country: string;

  @IsString()
  content: string;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}

export class UpdateTestimonialDto extends CreateTestimonialDto {}

export class UpdateSiteSettingDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}
