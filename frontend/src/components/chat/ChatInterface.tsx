/**
 * ChatInterface — Full RAG chat panel connecting to /api/v1/engine/query
 */
import { useEffect, useRef } from 'react';
import { Brain, Trash2 } from 'lucide-react';
import { useRAGQuery } from '../../hooks/useRAGQuery';
import { MessageBubble } from './MessageBubble';
import { QueryInput } from './QueryInput';

export function ChatInterface() {
  const { messages, isLoading, sendQuery, clearMessages } = useRAGQuery();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6378ff, #818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Brain size={20} color="white" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>HR Intelligence Chat</h2>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>
              Semantic search powered by pgvector + GPT-4o-mini
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            className="btn-ghost"
            onClick={clearMessages}
            style={{ fontSize: 12 }}
            title="Clear conversation"
          >
            <Trash2 size={14} /> Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              color: 'var(--color-text-muted)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(99,120,255,0.08)',
                border: '1px solid rgba(99,120,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Brain size={32} color="#6378ff" />
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Ask anything about your workforce
              </p>
              <p style={{ margin: 0, fontSize: 13 }}>
                Skill gaps · Proficiency levels · Department analytics · Career paths
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <QueryInput onSubmit={sendQuery} isLoading={isLoading} />
      </div>
    </div>
  );
}
