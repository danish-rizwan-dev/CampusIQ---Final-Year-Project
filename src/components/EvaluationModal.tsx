'use client';

import { useState } from 'react';
import { Loader2, TrendingUp, TrendingDown, Minus, X, Target, Book, Layout, Clock, BrainCircuit, Sparkles, Activity, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const METRICS = [
  { key: 'gpa', label: 'GPA', weight: '30%', icon: <Target size={16} /> },
  { key: 'assignmentRate', label: 'Work', weight: '15%', icon: <Layout size={16} /> },
  { key: 'conceptScore', label: 'Mastery', weight: '25%', icon: <Book size={16} /> },
  { key: 'timeConsistency', label: 'Focus', weight: '20%', icon: <Clock size={16} /> },
  { key: 'mockTestScore', label: 'Tests', weight: '10%', icon: <BrainCircuit size={16} /> },
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
    ADVANCED: { icon: <TrendingUp size={40} color="var(--success)" />, label: 'ADVANCED' },
    BALANCED: { icon: <Minus size={40} color="var(--warning)" />, label: 'BALANCED' },
    FOUNDATION: { icon: <TrendingDown size={40} color="var(--danger)" />, label: 'FIX_MODE' },
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div className="glass-card fade-in-up neon-border" style={{ width: '100%', maxWidth: '900px', borderRadius: '32px', padding: '0', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <div className="scan-line" />
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, backdropFilter: 'blur(5px)', transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--danger)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
          <X size={18} />
        </button>

        {/* Left Column (Stats Preview) */}
        <div style={{ flex: '1 1 350px', background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--accent-glow) 100%)', padding: 'clamp(2rem, 5vw, 3rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
            <div style={{ display: 'inline-flex', padding: '1.25rem', background: 'var(--accent-glow)', borderRadius: '24px', marginBottom: '1.5rem', boxShadow: '0 0 20px var(--accent-glow)' }}>
              <Activity size={36} color="var(--accent)" />
            </div>
            <h2 className="gradient-text" style={{ fontSize: '2rem', margin: '0 0 0.75rem', lineHeight: 1.1 }}>Semester<br/>Evaluation</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '3rem', maxWidth: '280px' }}>Adjust your performance metrics to predict your next semester's trajectory.</p>
            
            <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'var(--bg-primary)', border: `4px solid ${weightedScore >= 80 ? 'var(--success)' : (weightedScore >= 60 ? 'var(--accent)' : 'var(--warning)')}`, boxShadow: `0 0 40px ${weightedScore >= 80 ? 'var(--success)' : (weightedScore >= 60 ? 'var(--accent)' : 'var(--warning)')}40`, transition: 'all 0.3s ease' }}>
               <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '4.5rem', fontWeight: 950, color: weightedScore >= 80 ? 'var(--success)' : (weightedScore >= 60 ? 'var(--accent)' : 'var(--warning)'), lineHeight: 1, transition: 'color 0.3s ease' }}>{weightedScore}</div>
                 <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '4px', color: 'var(--text-muted)', marginTop: '8px' }}>PREDICTED</div>
               </div>
            </div>
        </div>

        {/* Right Column (Form / Loading / Result) */}
        {result && !loading ? (
          <div className="fade-in" style={{ flex: '1 1 400px', padding: 'clamp(2rem, 5vw, 3rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '2px solid var(--accent)', boxShadow: '0 0 30px var(--accent-glow)' }}>
              {trendConfig[result.trend as keyof typeof trendConfig]?.icon}
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2.2rem', fontWeight: 950, color: 'var(--text-primary)' }}>Evaluation Complete</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1rem' }}>Your academic performance has been analyzed. Trajectory: <strong style={{ color: 'var(--accent)' }}>{trendConfig[result.trend as keyof typeof trendConfig]?.label}</strong></p>
            
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', background: 'var(--bg-secondary)', padding: '2rem 3rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3.5rem', fontWeight: 950, lineHeight: 1, color: 'var(--text-primary)' }}>{result.performanceScore?.toFixed(0)}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent)', marginTop: '10px', letterSpacing: '2px' }}>FINAL SCORE</div>
                </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={onSuccess}>
              ACCESS NEXT SEMESTER <ChevronRight size={20} />
            </button>
          </div>
        ) : loading ? (
          <div className="fade-in" style={{ flex: '1 1 400px', padding: 'clamp(2rem, 5vw, 3rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
             <div className="neon-border" style={{ padding: '25px', borderRadius: '50%', marginBottom: '2rem' }}>
               <Loader2 size={60} className="spin" color="var(--accent-neon)" />
             </div>
             <h3 style={{ fontSize: '1.8rem', fontWeight: 950, margin: '0 0 0.75rem', letterSpacing: '1px' }}>Synthesizing Future</h3>
             <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Analyzing metrics to formulate next semester...</p>
          </div>
        ) : (
          <div className="fade-in" style={{ flex: '1 1 400px', padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
             <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {METRICS.map((m, i) => (
                    <div key={m.key} className="glass-card" style={{ padding: '1rem 1.25rem', borderRadius: '20px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', transition: 'border-color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                           <span style={{ color: 'var(--accent)' }}>{m.icon}</span> {m.label}
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                           <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '8px' }}>WEIGHT: {m.weight}</span>
                           <span style={{ fontSize: '1.2rem', fontWeight: 950, color: 'var(--accent)' }}>{formData[m.key]}%</span>
                         </div>
                      </div>
                      <input
                        type="range"
                        min={0} max={100}
                        value={formData[m.key]}
                        onChange={e => setFormData(prev => ({ ...prev, [m.key]: Number(e.target.value) }))}
                        style={{ width: '100%', accentColor: 'var(--accent)', height: '6px', borderRadius: '3px', cursor: 'pointer', outline: 'none', background: 'var(--bg-secondary)' }}
                      />
                    </div>
                  ))}
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1rem', marginTop: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: '0 0 20px var(--accent-glow)' }}>
                  <Sparkles size={20} /> INITIALIZE NEXT PHASE
                </button>
             </form>
          </div>
        )}
      </div>
    </div>
  );
}
