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

export default function ExamArena() {
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
      loading: 'AI is synthesizing survival strategy...',
      success: (data) => {
        router.push(`/dashboard/exam/${data.id}`);
        return "Strategy generated!";
      },
      error: "Generation failed."
    });

    try { await promise; } catch (e) { }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setDeleteId(null);
    const promise = fetch(`/api/exam/${id}`, { method: 'DELETE' });

    toast.promise(promise, {
      loading: 'Deleting protocol...',
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
          <h1 className="gradient-text" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>Exam Arena</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>
            High-intensity AI revision protocols for ultimate survival.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {!showInput && (
            <button className="btn-primary" onClick={() => setShowInput(true)}>
              <Plus size={18} /> New Strategy
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
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>Initialize Panic Mode</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>The AI will map your syllabus to high-priority exam patterns.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="responsive-grid-2" style={{ gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', letterSpacing: '1px' }}>SUBJECT_NAME</label>
                <input type="text" className="input-field" placeholder="e.g. Distributed Systems" value={form.examName} onChange={e => setForm({ ...form, examName: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', letterSpacing: '1px' }}>TARGET_DATE</label>
                <input type="date" className="input-field" value={form.targetDate} onChange={e => setForm({ ...form, targetDate: e.target.value })} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', letterSpacing: '1px' }}>SYLLABUS_VECTORS</label>
              <textarea className="input-field" style={{ minHeight: '150px', borderRadius: '20px', padding: '1.25rem', fontSize: '1rem' }}
                placeholder="Paste key topics here for priority analysis..."
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
              {loading ? 'Synthesizing...' : 'GENERATE_SURVIVAL_STRATEGY'}
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 900 }}>
            <History size={24} color="var(--accent)" /> Previous Protocols
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

                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        background: 'var(--accent-glow)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.25rem'
                      }}>
                        <Target size={22} color="var(--accent)" />
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {h.examName}
                      </h3>
                      <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                        {new Date(h.targetDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '1.5px' }}>
                        VIEW_PROTOCOL
                      </span>
                      <ArrowRight size={18} color="var(--text-secondary)" />
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
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 900 }}>Delete Protocol?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Are you sure you want to permanently erase this survival strategy? This action cannot be undone.
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
          transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 1.75rem !important;
          border: 1px solid var(--border);
        }

        .square-card:hover {
          transform: translateY(-8px);
          border-color: var(--accent) !important;
          box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important;
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
