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
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '1rem' }}>
      <header className="page-header" style={{ alignItems: 'center' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', margin: 0 }}>Exam Prep</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            AI-powered study plans to help you ace your exams.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {!showInput && (
            <button className="btn-primary" onClick={() => setShowInput(true)}>
              <Plus size={18} /> New Plan
            </button>
          )}
        </div>
      </header>

      {showInput && (
        <div className="glass-card fade-in" style={{ padding: '2.5rem', borderRadius: '32px', position: 'relative' }}>
          {history.length > 0 && (
            <button onClick={() => setShowInput(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ background: 'var(--accent-glow)', padding: '1rem', borderRadius: '16px', color: 'var(--accent)' }}>
              <AlertTriangle size={32} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>Start Exam Prep</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>The AI will create a study plan based on your syllabus.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="responsive-grid-2" style={{ gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', letterSpacing: '1px' }}>SUBJECT</label>
                <input type="text" className="input-field" placeholder="e.g. Distributed Systems" value={form.examName} onChange={e => setForm({ ...form, examName: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', letterSpacing: '1px' }}>EXAM DATE</label>
                <input type="date" className="input-field" value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', letterSpacing: '1px' }}>TOPICS</label>
              <textarea className="input-field" style={{ minHeight: '150px', borderRadius: '20px', padding: '1.25rem', fontSize: '1rem' }}
                placeholder="Paste key topics here for analysis..."
                value={form.topics}
                onChange={e => setForm({ ...form, topics: e.target.value })}
              />
            </div>
            <button
              className="btn-primary"
              style={{ padding: '1.25rem', fontSize: '1.1rem', borderRadius: '18px', gap: '0.75rem' }}
              onClick={activateExamMode}
              disabled={loading || !form.examName || !form.topics}
            >
              {loading ? <Loader2 size={20} className="spin" /> : <Sparkles size={20} />}
              {loading ? 'Creating...' : 'CREATE STUDY PLAN'}
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 900 }}>
            <History size={24} color="var(--accent)" /> Previous Plans
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
                          width: '48px',
                          height: '48px',
                          background: 'linear-gradient(135deg, var(--accent-glow) 0%, transparent 100%)',
                          borderRadius: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid rgba(129, 140, 248, 0.1)'
                        }}>
                          <Target size={24} color="var(--accent)" />
                        </div>
                        <div style={{ padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                           <span style={{ fontSize: '0.6rem', fontWeight: '900', color: 'var(--accent)', letterSpacing: '1px' }}>READY</span>
                        </div>
                      </div>

                      <h3 style={{ margin: '1rem 0 0.5rem', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                        {h.examName}
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={12} color="var(--text-muted)" />
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            {new Date(h.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={12} color="var(--text-muted)" />
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            24h Intensity
                          </p>
                        </div>
                      </div>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      marginTop: '1.5rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '1px' }}>
                        VIEW STUDY PLAN
                      </span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                        <ArrowRight size={16} color="var(--text-primary)" />
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card fade-in-up" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2rem', borderRadius: '24px', border: '1px solid var(--danger-glow)' }}>
            <div style={{ background: 'var(--danger-glow)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--danger)' }}>
              <AlertTriangle size={30} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 900 }}>Delete Plan?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Are you sure you want to permanently delete this study plan? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, background: 'var(--danger)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }} onClick={() => handleDelete(deleteId)}>Confirm Erase</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .exam-square-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .square-card {
          aspect-ratio: 1 / 1;
          position: relative;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 2rem !important;
          border: 1px solid var(--border);
          overflow: hidden;
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
          transform: translateY(-6px);
          border-color: rgba(129, 140, 248, 0.3) !important;
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.4) !important;
        }

        .delete-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(239, 68, 68, 0.1);
          border: none;
          color: var(--danger);
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: 0.3s;
          z-index: 10;
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
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
