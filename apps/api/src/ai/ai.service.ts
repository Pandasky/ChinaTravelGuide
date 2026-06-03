import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

@Injectable()
export class AiService {
  private readonly openRouterBaseUrl = 'https://openrouter.ai/api/v1';
  private readonly defaultModel = 'anthropic/claude-3.5-sonnet';

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  private getOpenRouterApiKey(): string {
    return this.configService.get<string>('OPENROUTER_API_KEY') || '';
  }

  private getSystemPrompt(): string {
    return `You are ChinaWise AI, a helpful travel assistant specialized in China travel. You provide accurate, up-to-date information about:

- Tourist attractions (hours, prices, best times to visit)
- Restaurants and local cuisine recommendations
- Transportation (subway, bus, taxi, high-speed rail, flights)
- Hotels and accommodations
- Chinese language translation and pronunciation help
- Cultural etiquette and customs
- Emergency information (hospitals, police, embassies)
- Shopping and local markets
- Day trips and itineraries

Guidelines:
- Keep responses concise but informative (2-4 paragraphs max)
- Use bullet points for lists
- Include relevant Chinese characters and pinyin when helpful
- Be friendly and encouraging
- If unsure about something, say so honestly
- Always prioritize traveler safety

Example good response:
"The Great Wall at Mutianyu is fantastic! 🏯

**Getting there:**
• Take Bus 916 Express from Dongzhimen (¥12, ~1 hour)
• Or hire a private car for ¥400-500 round trip

**Tickets:**
• ¥40 entrance + ¥120 cable car (optional)
• Open 8:00 AM - 5:00 PM

**Tips:**
• Arrive early (before 9 AM) to avoid crowds
• The toboggan ride down is fun!
• Bring water and comfortable shoes

Want to know about other sections like Jinshanling or Simatai?"`;
  }

  private async checkSubscription(userId: string): Promise<boolean> {
    const subscription = await this.usersService.getCurrentSubscription(userId);
    return !!subscription;
  }

  async getChatSessions(userId: string) {
    return this.prisma.chatSession.findMany({
      where: { userId },
      include: {
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getChatSession(userId: string, sessionId: string) {
    const session = await this.prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Chat session not found');
    }

    return session;
  }

  async createChatSession(userId: string, title?: string) {
    return this.prisma.chatSession.create({
      data: {
        userId,
        title: title || 'New Chat',
      },
    });
  }

  async deleteChatSession(userId: string, sessionId: string) {
    const session = await this.prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Chat session not found');
    }

    await this.prisma.chatSession.delete({
      where: { id: sessionId },
    });

    return { message: 'Chat session deleted' };
  }

  async sendMessage(userId: string, message: string, sessionId?: string, model?: string) {
    // Check subscription
    const hasSubscription = await this.checkSubscription(userId);
    if (!hasSubscription) {
      throw new ForbiddenException('Active subscription required to use AI chat');
    }

    // Get or create session
    let session;
    if (sessionId) {
      session = await this.prisma.chatSession.findFirst({
        where: { id: sessionId, userId },
      });
      if (!session) {
        throw new NotFoundException('Chat session not found');
      }
    } else {
      // Auto-generate title from first message
      const title = message.slice(0, 50) + (message.length > 50 ? '...' : '');
      session = await this.createChatSession(userId, title);
    }

    // Get chat history
    const history = await this.prisma.message.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'asc' },
      take: 20, // Keep last 20 messages for context
    });

    // Build messages array
    const messages: ChatMessage[] = [
      { role: 'system', content: this.getSystemPrompt() },
      ...history.map((m) => ({ role: m.role.toLowerCase() as ChatMessage['role'], content: m.content })),
      { role: 'user', content: message },
    ];

    // Call OpenRouter API
    const response = await this.callOpenRouter(messages, model);

    // Save messages to database
    await this.prisma.$transaction([
      this.prisma.message.create({
        data: {
          sessionId: session.id,
          role: 'USER',
          content: message,
        },
      }),
      this.prisma.message.create({
        data: {
          sessionId: session.id,
          role: 'ASSISTANT',
          content: response,
        },
      }),
      this.prisma.chatSession.update({
        where: { id: session.id },
        data: { updatedAt: new Date() },
      }),
    ]);

    return {
      sessionId: session.id,
      message: response,
    };
  }

  async *streamMessage(userId: string, message: string, sessionId?: string, model?: string) {
    // Check subscription
    const hasSubscription = await this.checkSubscription(userId);
    if (!hasSubscription) {
      throw new ForbiddenException('Active subscription required to use AI chat');
    }

    // Get or create session
    let session;
    if (sessionId) {
      session = await this.prisma.chatSession.findFirst({
        where: { id: sessionId, userId },
      });
      if (!session) {
        throw new NotFoundException('Chat session not found');
      }
    } else {
      const title = message.slice(0, 50) + (message.length > 50 ? '...' : '');
      session = await this.createChatSession(userId, title);
    }

    // Get chat history
    const history = await this.prisma.message.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    // Build messages array
    const messages: ChatMessage[] = [
      { role: 'system', content: this.getSystemPrompt() },
      ...history.map((m) => ({ role: m.role.toLowerCase() as ChatMessage['role'], content: m.content })),
      { role: 'user', content: message },
    ];

    // Save user message
    await this.prisma.message.create({
      data: {
        sessionId: session.id,
        role: 'USER',
        content: message,
      },
    });

    // Stream from OpenRouter
    const selectedModel = model || this.defaultModel;
    const apiKey = this.getOpenRouterApiKey();

    const response = await fetch(`${this.openRouterBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://chinawise.com',
        'X-Title': 'ChinaWise AI Assistant',
      },
      body: JSON.stringify({
        model: selectedModel,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Stream request failed');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullContent += content;
                yield content;
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Save assistant message
    await this.prisma.$transaction([
      this.prisma.message.create({
        data: {
          sessionId: session.id,
          role: 'ASSISTANT',
          content: fullContent,
        },
      }),
      this.prisma.chatSession.update({
        where: { id: session.id },
        data: { updatedAt: new Date() },
      }),
    ]);
  }

  private async callOpenRouter(messages: ChatMessage[], model?: string): Promise<string> {
    const apiKey = this.getOpenRouterApiKey();
    const selectedModel = model || this.defaultModel;

    try {
      const response = await axios.post<OpenRouterResponse>(
        `${this.openRouterBaseUrl}/chat/completions`,
        {
          model: selectedModel,
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://chinawise.com',
            'X-Title': 'ChinaWise AI Assistant',
          },
        },
      );

      return response.data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  async getAvailableModels() {
    return [
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Recommended for best quality' },
      { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', description: 'Most powerful' },
      { id: 'openai/gpt-4o', name: 'GPT-4o', description: 'Fast and capable' },
      { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Reliable performance' },
      { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', description: 'Open source' },
      { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', description: 'Google AI' },
    ];
  }
}
