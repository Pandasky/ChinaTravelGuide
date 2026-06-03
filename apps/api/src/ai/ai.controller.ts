import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SendMessageDto, CreateSessionDto, StreamMessageDto } from './dto/chat-message.dto';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('sessions')
  async getChatSessions(@CurrentUser('id') userId: string) {
    return this.aiService.getChatSessions(userId);
  }

  @Get('sessions/:id')
  async getChatSession(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
  ) {
    return this.aiService.getChatSession(userId, sessionId);
  }

  @Post('sessions')
  async createChatSession(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateSessionDto,
  ) {
    return this.aiService.createChatSession(userId, dto.title);
  }

  @Delete('sessions/:id')
  async deleteChatSession(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
  ) {
    return this.aiService.deleteChatSession(userId, sessionId);
  }

  @Post('chat')
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.aiService.sendMessage(userId, dto.message, dto.sessionId, dto.model);
  }

  @Sse('chat/stream')
  streamMessage(
    @CurrentUser('id') userId: string,
    @Query() dto: StreamMessageDto,
  ): Observable<MessageEvent> {
    const generator = this.aiService.streamMessage(
      userId,
      dto.message,
      dto.sessionId,
      dto.model,
    );

    return from(this.generatorToObservable(generator)).pipe(
      map((content) => ({
        data: { content, done: false },
      })),
    );
  }

  @Get('models')
  async getAvailableModels() {
    return this.aiService.getAvailableModels();
  }

  private async *generatorToObservable<T>(generator: AsyncGenerator<T>): AsyncGenerator<T> {
    try {
      for await (const value of generator) {
        yield value;
      }
    } catch (error) {
      console.error('Stream error:', error);
      throw error;
    }
  }
}
