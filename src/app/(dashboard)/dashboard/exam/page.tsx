'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle, Clock, Star, BookOpen,
  History, Loader2, Sparkles,
  ChevronRight, Plus, X, ArrowRight,
  Target, Calendar, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ExamPrep() {
  const router = useRouter();
  const [form, setForm] = useState({ examName: '', topics: '', targetDate: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [showInput, setShowInput] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/exam/history');
      const data = await res.json();
      if (data.preps) {
        setHistory(data.preps);
        if (data.preps.length > 0) setShowInput(false);
      }
    } catch (e) {
      toast.error('Failed to load history');
    }
    setFetching(false);
  };

  const activateExamMode = async () => {
    setLoading(true);
    const promise = (async () => {
      const res = await fetch('/api/exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data;
    })();

    toast.promise(promise, {
      loading: 'AI is creating your study plan...',
      success: (data) => {
        router.push(`/dashboard/exam/${data.id}`);
        return "Study plan created!";
      },
      error: "Failed to create plan."
    });

    try { await promise; } catch (e) { }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setDeleteId(null);
    const promise = fetch(`/api/exam/${id}`, { method: 'DELETE' });

    toast.promise(promise, {
      loading: 'Deleting plan...',
      success: () => {
        setHistory(prev => prev.filter(h => h.id !== id));
        return 'Deleted.';
      },
      error: 'Delete failed.'
    });
  };

  if (fetching) {
    return (
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} className="spin" color="var(--accent)" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 5vh, 2.5rem)', padding: '0 clamp(0.5rem, 3vw, 1rem) 2rem' }}>
      <header className="page-header" style={{ alignItems: 'center' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(1.6rem, 5vw, 2.8rem)', margin: 0, lineHeight: 1.1 }}>Exam Prep</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)', marginTop: '0.5rem' }}>
            AI-powered study plans to help you ace your exams.
          </p>
        </div>
        {!showInput && (
          <button className="btn-primary" onClick={() => setShowInput(true)} style={{ whiteSpace: 'nowrap' }}>
            <Plus size={18} /> NEW PLAN
          </button>
        )}
      </header>

      {showInput && (
        <div className="glass-card fade-in" style={{ padding: 'clamp(1.25rem, 5vw, 2.5rem)', borderRadius: '24px', position: 'relative' }}>
          {history.length > 0 && (
            <button onClick={() => setShowInput(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 3vw, 1.5rem)', marginBottom: 'clamp(1.5rem, 5vh, 2.5rem)' }}>
            <div style={{ background: 'var(--accent-glow)', padding: 'clamp(0.75rem, 2vw, 1rem)', borderRadius: '14px', color: 'var(--accent)', flexShrink: 0 }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', fontWeight: 900 }}>Start Exam Prep</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>The AI will create a targeted study plan for you.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="responsive-grid-2" style={{ gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '8px', display: 'block', letterSpacing: '1px' }}>SUBJECT</label>
                <input type="text" className="input-field" placeholder="e.g. Distributed Systems" value={form.examName} onChange={e => setForm({ ...form, examName: e.target.value })} style={{ marginBottom: 0 }} />
              </div>
              <div>
                <label style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '8px', display: 'block', letterSpacing: '1px' }}>EXAM DATE</label>
                <input type="date" className="input-field" value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })} style={{ marginBottom: 0 }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '8px', display: 'block', letterSpacing: '1px' }}>TOPICS / SYLLABUS</label>
              <textarea className="input-field" style={{ minHeight: '120px', borderRadius: '16px', padding: '1rem', fontSize: '0.95rem', marginBottom: 0 }}
                placeholder="Paste key topics or syllabus content here..."
                value={form.topics}
                onChange={e => setForm({ ...form, topics: e.target.value })}
              />
            </div>
            <button
              className="btn-primary"
              style={{ padding: '1rem', fontSize: '0.95rem', borderRadius: '14px', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}
              onClick={activateExamMode}
              disabled={loading || !form.examName || !form.topics}
            >
              {loading ? <Loader2 size={20} className="spin" /> : <Sparkles size={20} />}
              {loading ? 'ARCHITECTING...' : 'CREATE STUDY PLAN'}
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 900 }}>
            <History size={20} color="var(--accent)" /> PREVIOUS PLANS
          </h3>
          <div className="exam-square-grid">
            {history.map((h, i) => (
              <Link key={h.id} href={`/dashboard/exam/${h.id}`} style={{ textDecoration: 'none' }}>
                <div className="glass-card square-card fade-in">
                  <button className="delete-btn" onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeleteId(h.id);
                  }}>
                    <Trash2 size={14} />
                  </button>

                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: 'linear-gradient(135deg, var(--accent-glow) 0%, transparent 100%)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid rgba(129, 140, 248, 0.1)'
                        }}>
                          <Target size={20} color="var(--accent)" />
                        </div>
                        <div style={{ padding: '4px 8px', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                           <span style={{ fontSize: '0.55rem', fontWeight: '900', color: 'var(--accent)', letterSpacing: '1px' }}>READY</span>
                        </div>
                      </div>

                      <h3 style={{ margin: '1rem 0 0.5rem', fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {h.examName}
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={12} color="var(--text-muted)" />
                          <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {new Date(h.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={12} color="var(--text-muted)" />
                          <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            AI Analyzed
                          </p>
                        </div>
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      marginTop: '1.25rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '1px' }}>
                        OPEN PLAN
                      </span>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                        <ArrowRight size={14} color="var(--text-primary)" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Custom Delete Modal */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card fade-in-up" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2rem', borderRadius: '24px', border: '1px solid var(--danger-glow)' }}>
            <div style={{ background: 'var(--danger-glow)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--danger)' }}>
              <AlertTriangle size={24} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 900 }}>Delete Plan?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Are you sure you want to erase this study plan? This action is permanent.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem' }} onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, padding: '0.75rem', fontSize: '0.85rem', background: 'var(--danger)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }} onClick={() => handleDelete(deleteId)}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .exam-square-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
          gap: 1rem;
        }

        .square-card {
          min-height: 280px;
          position: relative;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 1.5rem !important;
          border: 1px solid var(--border);
          overflow: hidden;
          border-radius: 20px;
        }

        .square-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: translateX(-100%);
          transition: 0.6s;
        }

        .square-card:hover::before {
          transform: translateX(100%);
        }

        .square-card:hover {
          transform: translateY(-4px);
          border-color: rgba(129, 140, 248, 0.3) !important;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4) !important;
        }

        .delete-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(239, 68, 68, 0.1);
          border: none;
          color: var(--danger);
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: 0.3s;
          z-index: 10;
        }

        @media (max-width: 768px) {
          .delete-btn { opacity: 1; background: var(--bg-secondary); border: 1px solid var(--border); }
        }

        .square-card:hover .delete-btn {
          opacity: 1;
        }

        .delete-btn:hover {
          background: var(--danger);
          color: white;
          transform: scale(1.1);
        }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
