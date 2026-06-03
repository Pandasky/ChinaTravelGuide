import { IsString, IsOptional, IsBoolean, IsEmail, IsEnum, IsArray } from 'class-validator';

export class UpdateUserAdminDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  country?: string;
}

export class CreateAdminUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}

export class UserFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @IsString()
  @IsOptional()
  page?: string;

  @IsString()
  @IsOptional()
  limit?: string;
}

export class BulkUserActionDto {
  @IsArray()
  @IsString({ each: true })
  userIds: string[];

  @IsEnum(['activate', 'deactivate', 'delete'])
  action: 'activate' | 'deactivate' | 'delete';
}
