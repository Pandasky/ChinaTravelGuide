import { IsString, IsOptional, IsEmail } from 'class-validator';

export class OAuthLoginDto {
  @IsString()
  provider: 'google' | 'facebook' | 'apple';

  @IsString()
  accessToken: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  providerId?: string;
}
