// src/lib/api/python-chat-service.ts
export interface ChatResponse {
  response: string;
  source: 'faq' | 'suggestions' | 'default' | 'error';
  allResponses?: string[];
  question?: string;
  suggestions?: string[];
  confidence: 'high' | 'medium' | 'low';
  contact?: string;
}

export interface PopularFAQ {
  _id: string;
  question: string;
  usageCount: number;
  lastUsed: string;
  tags: string[];
}

export class PythonChatService {
  private static instance: PythonChatService;

  private constructor() {}

  static getInstance(): PythonChatService {
    if (!PythonChatService.instance) {
      PythonChatService.instance = new PythonChatService();
    }
    return PythonChatService.instance;
  }

  async sendMessage(message: string, userId?: string): Promise<ChatResponse> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('PythonChatService error:', error);
      throw new Error('Impossible de contacter le service de chat');
    }
  }

  async getPopularFAQs(limit: number = 10): Promise<PopularFAQ[]> {
    try {
      const response = await fetch(`/api/popular-faqs?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.popularFAQs;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erreur récupération FAQs populaires:', error);
      return [];
    }
  }

  async healthCheck(): Promise<{ status: string; service: string }> {
    try {
      const response = await fetch('/api/chat');
      return await response.json();
    } catch (error) {
      return { status: 'error', service: 'Unavailable' };
    }
  }
}

export const pythonChatService = PythonChatService.getInstance();