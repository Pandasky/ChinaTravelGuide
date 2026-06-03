import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export class ChatMessageDto {
  @IsEnum(MessageRole)
  role: MessageRole;

  @IsString()
  content: string;
}

export class SendMessageDto {
  @IsString()
  @IsOptional()
  sessionId?: string;

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  model?: string;
}

export class CreateSessionDto {
  @IsString()
  @IsOptional()
  title?: string;
}

export class StreamMessageDto {
  @IsString()
  @IsOptional()
  sessionId?: string;

  @IsString()
  message: string;

  @IsString()
  @IsOptional()
  model?: string;
}
