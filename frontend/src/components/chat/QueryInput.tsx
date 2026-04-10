/**
 * Chat query input with submit on Enter, suggested prompts, and disabled state.
 */
import { useState, useRef, type KeyboardEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';

const SUGGESTED_QUERIES = [
  'Which engineers have skill gaps in Kubernetes?',
  'What are the top skills in the Data Science team?',
  'Who should I prioritize for leadership training?',
  'List employees with average proficiency below 3.',
];

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

export function QueryInput({ onSubmit, isLoading }: QueryInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Suggested queries */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {SUGGESTED_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => { setValue(q); textareaRef.current?.focus(); }}
            disabled={isLoading}
            style={{
              padding: '4px 10px',
              fontSize: 11,
              borderRadius: 99,
              background: 'rgba(99,120,255,0.08)',
              border: '1px solid rgba(99,120,255,0.2)',
              color: 'var(--color-accent-light)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-sans)',
              whiteSpace: 'nowrap',
            }}
          >
            <Sparkles size={10} style={{ display: 'inline', marginRight: 4 }} />
            {q}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'flex-end',
          background: 'rgba(8,12,20,0.6)',
          border: '1px solid rgba(99,120,255,0.2)',
          borderRadius: 12,
          padding: '10px 14px',
          transition: 'border-color 0.2s',
        }}
        onFocus={() => {}}
      >
        <textarea
          ref={textareaRef}
          id="rag-query-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask anything about your workforce… (Shift+Enter for new line)"
          disabled={isLoading}
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            color: 'var(--color-text-primary)',
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: 'var(--font-sans)',
            minHeight: 24,
            maxHeight: 120,
            overflow: 'auto',
          }}
        />
        <button
          id="rag-send-btn"
          onClick={handleSubmit}
          disabled={!value.trim() || isLoading}
          className="btn-primary"
          style={{ padding: '8px 14px', flexShrink: 0 }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
