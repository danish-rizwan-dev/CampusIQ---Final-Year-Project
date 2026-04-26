'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Copy, Sparkles, Target } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// --------------------------------------------------
// FORMAT RESPONSE — Renders AI text like Claude UI
// --------------------------------------------------
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} style={{ height: '0.4rem' }} />;

        // Section label: e.g. "Definition:", "Key Points:", "Example:", "Quick Summary:"
        const isSectionLabel = /^[A-Z][A-Za-z\s]+:$/.test(trimmed);
        if (isSectionLabel) {
          return (
            <div key={i} style={{
              fontWeight: 700,
              fontSize: '0.85rem',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginTop: i === 0 ? 0 : '0.6rem',
            }}>
              {trimmed}
            </div>
          );
        }

        // Numbered point: e.g. "1. Something here"
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
        if (numberedMatch) {
          return (
            <div key={i} style={{
              display: 'flex',
              gap: '0.6rem',
              alignItems: 'flex-start',
              paddingLeft: '0.25rem',
            }}>
              <span style={{
                minWidth: '1.5rem',
                height: '1.5rem',
                borderRadius: '50%',
                background: 'var(--accent)',
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '0.1rem',
              }}>
                {numberedMatch[1]}
              </span>
              <span style={{ lineHeight: '1.6', fontSize: '0.92rem' }}>
                {numberedMatch[2]}
              </span>
            </div>
          );
        }

        // Normal paragraph line
        return (
          <p key={i} style={{
            margin: 0,
            lineHeight: '1.65',
            fontSize: '0.93rem',
            color: 'inherit',
          }}>
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

export default function StudyAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your CampusIQ Study Assistant.\nAsk me anything — definitions, concepts, examples, or exam tips.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [topic, setTopic] = useState('Computer Science');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadHistory(); }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/assistant/history');
      const data = await res.json();
      if (data.history && data.history.length > 0) {
        setMessages(data.history);
      }
    } catch {
      console.error('History load failed');
    }
    setFetching(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Auto-detect mode by query length
    const isShortQuery = input.trim().split(/\s+/).length < 8;
    const mode = isShortQuery ? 'short' : 'detailed';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, topic, mode }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.reply }
      ]);

      toast.success('Response received');
    } catch {
      toast.error('AI connection failed. Please try again.');
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again.' }
      ]);
    }

    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info('Copied to clipboard');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (fetching) {
    return (
      <div style={{
        display: 'flex',
        height: '60vh',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        color: 'var(--text-secondary)'
      }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent)' }} />
        <span style={{ fontSize: '0.9rem' }}>Loading your session...</span>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(var(--vh, 1vh) * 100 - clamp(140px, 20vh, 180px))',
      gap: 'clamp(0.75rem, 2vh, 1.25rem)',
      padding: '0 clamp(0.5rem, 3vw, 1rem)'
    }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flex: '1 1 250px' }}>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.8rem)', margin: 0, lineHeight: 1.1 }}>AI Assistant</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem', fontWeight: '700', letterSpacing: '0.5px' }}>
            NEURAL ENGINE ACTIVE · CONTEXT AWARE
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <Sparkles size={14} color="var(--accent)" />
          <select
            value={topic}
            onChange={e => setTopic(e.target.value)}
            className="input-field"
            style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: 0, background: 'transparent', border: 'none', width: 'auto', fontWeight: '700' }}
          >
            <option>Computer Science</option>
            <option>Data Structures</option>
            <option>Artificial Intelligence</option>
            <option>Software Engineering</option>
            <option>Operating Systems</option>
            <option>Computer Networks</option>
            <option>Mathematics</option>
          </select>
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div className="glass-card" style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: 'clamp(1rem, 4vw, 1.5rem)',
        borderRadius: '24px',
        border: '1px solid var(--border)'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: 'flex',
            gap: '0.75rem',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
          }}>

            {/* AVATAR */}
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '10px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-secondary)',
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
              marginTop: '4px'
            }}>
              {msg.role === 'user'
                ? <User size={16} color="#fff" />
                : <Bot size={16} color="var(--accent)" />}
            </div>

            {/* BUBBLE */}
            <div style={{
              maxWidth: '85%',
              padding: msg.role === 'user' ? '0.75rem 1rem' : '1rem',
              borderRadius: msg.role === 'user' ? '18px 6px 18px 18px' : '6px 18px 18px 18px',
              background: msg.role === 'user' ? 'var(--accent-glow)' : 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              position: 'relative',
              border: '1px solid var(--border)',
              boxShadow: 'var(--card-shadow)',
            }}>

              {msg.role === 'user' ? (
                <p style={{ margin: 0, lineHeight: '1.5', fontSize: '0.9rem', fontWeight: '500' }}>
                  {msg.content}
                </p>
              ) : (
                <FormattedMessage content={msg.content} />
              )}

              {msg.role === 'assistant' && (
                <button
                  onClick={() => copyToClipboard(msg.content)}
                  title="Copy response"
                  style={{
                    position: 'absolute',
                    bottom: '-0.5rem',
                    right: '0',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    opacity: 0.8,
                    borderRadius: '6px',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    transform: 'translateY(100%)',
                    zIndex: 2
                  }}
                >
                  <Copy size={12} color="var(--text-muted)" />
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
            }}>
              <Bot size={16} color="var(--accent)" />
            </div>
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '6px 18px 18px 18px',
              background: 'var(--bg-secondary)',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: 'var(--accent)',
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT BAR */}
      <div style={{
        display: 'flex',
        gap: '0.6rem',
        padding: '0.6rem',
        background: 'var(--bg-secondary)',
        borderRadius: '18px',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            padding: '0.6rem 0.8rem',
            borderRadius: '12px',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            minHeight: '40px',
            maxHeight: '100px',
            overflowY: 'auto',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)'
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="btn-primary"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            padding: 0
          }}
        >
          {loading
            ? <Loader2 size={18} className="spin" />
            : <Send size={18} />}
        </button>
      </div>

      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}