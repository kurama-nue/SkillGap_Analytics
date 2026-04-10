/**
 * Hook: useRAGQuery
 * Manages chat message state and API calls to /api/v1/engine/query
 */
import { useCallback, useState } from 'react';
import { queryRAG } from '../api/client';
import type { ChatMessage, SourceDocument } from '../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface UseRAGQueryReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  sendQuery: (query: string) => Promise<void>;
  clearMessages: () => void;
}

export function useRAGQuery(): UseRAGQueryReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendQuery = useCallback(async (query: string) => {
    if (!query.trim() || isLoading) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: query,
      timestamp: new Date(),
    };

    // Add assistant loading placeholder
    const loadingId = generateId();
    const loadingMessage: ChatMessage = {
      id: loadingId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      const response = await queryRAG({ query, top_k: 5 });

      const assistantMessage: ChatMessage = {
        id: loadingId,
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date(),
        isLoading: false,
      };

      // Replace loading placeholder with real response
      setMessages((prev) =>
        prev.map((m) => (m.id === loadingId ? assistantMessage : m))
      );
    } catch (err) {
      const errMsg =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';

      const errorMessage: ChatMessage = {
        id: loadingId,
        role: 'error',
        content: errMsg,
        timestamp: new Date(),
        isLoading: false,
      };

      setMessages((prev) =>
        prev.map((m) => (m.id === loadingId ? errorMessage : m))
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, isLoading, sendQuery, clearMessages };
}
