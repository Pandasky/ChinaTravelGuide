import axios from 'axios';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Default model - can be easily changed
const DEFAULT_MODEL = 'anthropic/claude-3.5-sonnet';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

interface ChatCompletionResponse {
  id: string;
  choices: Array<{
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// System prompt for China travel assistant
const SYSTEM_PROMPT = `You are ChinaWise AI, a helpful travel assistant specialized in China travel. You provide accurate, up-to-date information about:

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

export const aiService = {
  /**
   * Send a chat completion request to OpenRouter
   */
  async sendMessage(
    messages: ChatMessage[],
    model: string = DEFAULT_MODEL
  ): Promise<string> {
    try {
      const response = await axios.post<ChatCompletionResponse>(
        `${OPENROUTER_BASE_URL}/chat/completions`,
        {
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 1000,
        } as ChatCompletionRequest,
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'ChinaWise AI Assistant',
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new Error('Failed to get AI response. Please try again.');
    }
  },

  /**
   * Stream chat completion (for real-time typing effect)
   */
  async *streamMessage(
    messages: ChatMessage[],
    model: string = DEFAULT_MODEL
  ): AsyncGenerator<string, void, unknown> {
    try {
      const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'ChinaWise AI Assistant',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 1000,
          stream: true,
        } as ChatCompletionRequest),
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error);
      throw new Error('Failed to stream AI response');
    }
  },

  /**
   * Get available models from OpenRouter
   */
  async getAvailableModels(): Promise<Array<{ id: string; name: string }>> {
    // Common models that work well for travel assistance
    return [
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Recommended)' },
      { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
      { id: 'openai/gpt-4o', name: 'GPT-4o' },
      { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' },
      { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B' },
      { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5' },
    ];
  },
};

export default aiService;
