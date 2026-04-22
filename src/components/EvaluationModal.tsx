'use client';

import { useState } from 'react';
import { Loader2, TrendingUp, TrendingDown, Minus, X, Target, Book, Layout, Clock, BrainCircuit, Sparkles, Activity } from 'lucide-react';
import { toast } from 'sonner';

const METRICS = [
  { key: 'gpa', label: 'GPA', weight: '30%', icon: <Target size={14} /> },
  { key: 'assignmentRate', label: 'Work', weight: '15%', icon: <Layout size={14} /> },
  { key: 'conceptScore', label: 'Mastery', weight: '25%', icon: <Book size={14} /> },
  { key: 'timeConsistency', label: 'Focus', weight: '20%', icon: <Clock size={14} /> },
  { key: 'mockTestScore', label: 'Tests', weight: '10%', icon: <BrainCircuit size={14} /> },
];

interface Props {
  roadmapId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EvaluationModal({ roadmapId, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, number>>({
    gpa: 75, assignmentRate: 80, conceptScore: 70, timeConsistency: 75, mockTestScore: 70,
  });

  const weightedScore = Math.round(
    formData.gpa * 0.30 +
    formData.timeConsistency * 0.20 +
    formData.conceptScore * 0.25 +
    formData.assignmentRate * 0.15 +
    formData.mockTestScore * 0.10
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const promise = (async () => {
      const res = await fetch('/api/roadmap/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roadmapId, ...formData }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      return data;
    })();

    toast.promise(promise, {
      loading: 'AI is synthesizing your next semester...',
      success: 'Evaluation complete!',
      error: 'Evaluation failed.'
    });

    try { await promise; } catch(e) {}
    setLoading(false);
  };

  const trendConfig = {
    ADVANCED: { icon: <TrendingUp size={24} color="var(--success)" />, label: 'ADVANCED' },
    BALANCED: { icon: <Minus size={24} color="var(--warning)" />, label: 'BALANCED' },
    FOUNDATION: { icon: <TrendingDown size={24} color="var(--danger)" />, label: 'FIX_MODE' },
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div className="glass-card fade-in-up" style={{ width: '100%', maxWidth: '440px', borderRadius: '24px', padding: '1.5rem', position: 'relative', border: '1px solid var(--accent)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={18} />
        </button>

        {result && !loading ? (
          <div style={{ textAlign: 'center' }} className="fade-in">
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', fontWeight: 900 }}>Evaluation Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 950, lineHeight: 1 }}>{result.performanceScore?.toFixed(0)}</div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-secondary)', marginTop: '4px' }}>OPS_SCORE</div>
                </div>
                <div style={{ width: '1px', background: 'var(--border)' }} />
                <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '3rem' }}>
                        {trendConfig[result.trend as keyof typeof trendConfig]?.icon}
                    </div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-secondary)', marginTop: '4px' }}>{trendConfig[result.trend as keyof typeof trendConfig]?.label}</div>
                </div>
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '0.8rem' }} onClick={onSuccess}>
              Continue to Next Semester
            </button>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <Loader2 size={32} className="spin" color="var(--accent)" style={{ marginBottom: '1rem' }} />
            <p style={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px', opacity: 0.7 }}>SYNCING_TRAJECTORY</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="fade-in">
            <header style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity size={18} color="var(--accent)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Semester Evaluation</h3>
            </header>

            <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, opacity: 0.6 }}>PREDICTED</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '950', color: weightedScore >= 80 ? 'var(--success)' : 'var(--accent)' }}>{weightedScore}%</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {METRICS.map(m => (
                <div key={m.key} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 40px', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 800, opacity: 0.8 }}>
                    {m.icon} {m.label}
                  </div>
                  <input
                    type="range"
                    min={0} max={100}
                    value={formData[m.key]}
                    onChange={e => setFormData(prev => ({ ...prev, [m.key]: Number(e.target.value) }))}
                    style={{ width: '100%', accentColor: 'var(--accent)', height: '4px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.8rem', fontWeight: 900, textAlign: 'right', color: 'var(--accent)' }}>{formData[m.key]}%</span>
                </div>
              ))}
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '0.9rem' }}>
              <Sparkles size={16} /> GENERATE SEMESTER
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
