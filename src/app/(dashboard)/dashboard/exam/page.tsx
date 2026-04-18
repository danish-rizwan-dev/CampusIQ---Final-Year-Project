'use client';

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, Clock, Star, BookOpen, 
  ChevronDown, ChevronUp, History, Loader2, Sparkles, 
  CheckCircle2, ChevronRight, Plus, Video
} from 'lucide-react';
import { toast } from 'sonner';

export default function ExamMode() {
  const [form, setForm] = useState({ examName: '', topics: '', targetDate: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [examPlan, setExamPlan] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [expandedMock, setExpandedMock] = useState<number | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/exam/history');
      const data = await res.json();
      if (data.preps && data.preps.length > 0) {
        setHistory(data.preps);
        setExamPlan(data.preps[0]); // Default to latest
      }
    } catch (e) {
      console.error('Exam history load failed');
    }
    setFetching(false);
  };

  const activateExamMode = async () => {
    setLoading(true);
    toast.info("AI is analyzing syllabus... Please wait.");
    try {
      const res = await fetch('/api/exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setExamPlan(data);
      setHistory(prev => [data, ...prev]);
      toast.success("Exam strategy generated! Persistence enabled.");
    } catch (e) { 
      toast.error("Generation failed. Check your API key or connection.");
      console.error(e); 
    }
    setLoading(false);
  };

  const weightColors: Record<string, string> = {
    'Very High': 'var(--danger)',
    'High': 'var(--warning)',
    'Medium': 'var(--success)'
  };

  if (fetching) {
    return (
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <AlertTriangle size={80} color="var(--warning)" style={{ animation: 'pulse 1.5s infinite' }} />
          <Sparkles size={30} color="var(--accent)" style={{ position: 'absolute', top: -10, right: -10 }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 className="gradient-text" style={{ fontSize: '2rem' }}>AI Strategy Generation in Progress</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Mapping topics to high-priority exam patterns...</p>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } }`}</style>
      </div>
    );
  }

  if (!examPlan) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #ef4444, #f59e0b)', padding: '1.25rem', borderRadius: '16px', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.2)' }}>
            <AlertTriangle size={36} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.4rem' }} className="gradient-text">Exam Panic Mode</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.1rem' }}>Instant AI-powered revision strategies & practice tests</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="responsive-grid-2">
              <div>
                <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Exam Name / Subject</label>
                <input type="text" className="input-field" placeholder="e.g. Operating Systems Final" value={form.examName} onChange={e => setForm({ ...form, examName: e.target.value })} />
              </div>
              <div>
                <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Target Date</label>
                <input type="date" className="input-field" value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })} />
              </div>
            </div>
            <div>
              <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>Syllabus / Topics to Cover</label>
              <textarea className="input-field" style={{ resize: 'none', minHeight: '150px', borderRadius: '16px' }}
                placeholder="Paste your key topics here. For example: Process Scheduling, Synchronization, Deadlocks, Memory Management..."
                value={form.topics}
                onChange={e => setForm({ ...form, topics: e.target.value })}
              />
            </div>
            <button 
              className="btn-primary" 
              style={{ padding: '1.25rem', fontSize: '1.1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }} 
              onClick={activateExamMode} 
              disabled={!form.examName || !form.topics}
            >
              <Sparkles size={20} /> Generate Survival Strategy
            </button>
          </div>
        </div>

        {history.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
              <History size={18} /> Previous Exam Plans
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {history.map((h, i) => (
                <div key={i} className="glass-card" onClick={() => setExamPlan(h)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                  <div>
                    <strong style={{ display: 'block' }}>{h.examName}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(h.createdAt).toLocaleDateString()}</span>
                  </div>
                  <ChevronRight size={18} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.2rem', margin: 0 }}>{examPlan.examName}</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Your survival strategy is locked and saved to DB.</p>
        </div>
        <button className="btn-secondary" onClick={() => setExamPlan(null)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> New Exam
        </button>
      </div>

      <div className="responsive-grid-2" style={{ alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Important Topics */}
          <div className="glass-card" style={{ borderRadius: '24px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Star size={24} color="var(--warning)" /> Priority Study Areas
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {examPlan.importantTopics?.map((t: any, i: number) => (
                <div key={i} style={{ 
                  background: 'var(--bg-secondary)', 
                  borderRadius: '16px', 
                  padding: '1.25rem', 
                  borderLeft: `5px solid ${weightColors[t.weight] || 'var(--accent)'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <strong style={{ fontSize: '1.1rem' }}>{t.name}</strong>
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '10px', background: weightColors[t.weight], color: 'white' }}>{t.weight}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 1rem' }}>{t.reason}</p>
                    {t.youtubeSearchUrl && (
                      <a 
                        href={t.youtubeSearchUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-secondary" 
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '10px', textDecoration: 'none' }}
                      >
                        <Video size={16} color="#ff0000" /> Watch Material
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mock Tests */}
          <div className="glass-card" style={{ borderRadius: '24px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <BookOpen size={24} color="var(--success)" /> AI Practice Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {examPlan.mockTests?.map((q: any, i: number) => (
                <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <button
                    onClick={() => setExpandedMock(expandedMock === i ? null : i)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}
                  >
                    <span style={{ lineHeight: '1.5' }}><strong>Q{i + 1}.</strong> {q.question}</span>
                    {expandedMock === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {expandedMock === i && (
                    <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', background: 'var(--bg-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
                        <CheckCircle2 size={16} /> <strong style={{ fontSize: '0.85rem' }}>Model Answer</strong>
                      </div>
                      <p style={{ margin: 0, lineHeight: '1.7', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{q.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'sticky', top: '2rem' }}>
          {/* Revision Plan */}
          <div className="glass-card" style={{ borderRadius: '24px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Clock size={24} color="var(--accent)" /> Revision Daily
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {examPlan.revisionPlan?.map((day: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                  <div style={{ background: 'var(--accent)', color: 'white', minWidth: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    D{day.day}
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{day.focus}</strong>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{day.hours} Hours Focus</span>
                      {day.youtubeSearchUrl && (
                        <a href={day.youtubeSearchUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--danger)', fontSize: '0.75rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Video size={14} /> Link
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
