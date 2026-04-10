/**
 * Chat message bubble component.
 */
import { AlertTriangle, Bot, User, ExternalLink } from 'lucide-react';
import type { ChatMessage } from '../../types';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  if (message.isLoading) {
    return (
      <div className="message-enter" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div
          style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #6378ff, #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Bot size={16} color="white" />
        </div>
        <div
          className="glass-card"
          style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="message-enter"
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: isUser
            ? 'rgba(99, 120, 255, 0.2)'
            : isError
            ? 'rgba(239, 68, 68, 0.2)'
            : 'linear-gradient(135deg, #6378ff, #818cf8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${isUser ? 'rgba(99,120,255,0.3)' : isError ? 'rgba(239,68,68,0.3)' : 'transparent'}`,
        }}
      >
        {isUser ? (
          <User size={16} color="#818cf8" />
        ) : isError ? (
          <AlertTriangle size={16} color="#f87171" />
        ) : (
          <Bot size={16} color="white" />
        )}
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div
          style={{
            padding: '12px 16px',
            borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
            fontSize: 14,
            lineHeight: 1.65,
            whiteSpace: 'pre-wrap',
            background: isUser
              ? 'linear-gradient(135deg, #6378ff22, #818cf822)'
              : isError
              ? 'rgba(239, 68, 68, 0.1)'
              : 'rgba(17, 24, 39, 0.8)',
            border: `1px solid ${
              isUser
                ? 'rgba(99,120,255,0.25)'
                : isError
                ? 'rgba(239,68,68,0.25)'
                : 'rgba(99,120,255,0.12)'
            }`,
            color: isError ? '#fca5a5' : 'var(--color-text-primary)',
          }}
        >
          {message.content}
        </div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {message.sources.length} source{message.sources.length > 1 ? 's' : ''}
            </span>
            {message.sources.map((src, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  padding: '8px 12px',
                  background: 'rgba(99,120,255,0.05)',
                  border: '1px solid rgba(99,120,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              >
                <ExternalLink size={12} style={{ flexShrink: 0, marginTop: 2, color: 'var(--color-accent)' }} />
                <div>
                  <span style={{ color: 'var(--color-accent-light)', fontWeight: 500 }}>
                    {src.source}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)', marginLeft: 8 }}>
                    {(src.similarity_score * 100).toFixed(0)}% match
                  </span>
                  <p style={{ margin: '4px 0 0', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {src.content_preview}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span style={{ fontSize: 10, color: 'var(--color-text-muted)', alignSelf: isUser ? 'flex-end' : 'flex-start' }}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
