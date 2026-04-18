'use client';

import { useState } from 'react';
import { Loader2, TrendingUp, TrendingDown, Minus, X } from 'lucide-react';
import { toast } from 'sonner';

const METRICS = [
  { key: 'gpa', label: 'GPA / Marks', weight: '30%', hint: 'Your overall grade percentage this semester' },
  { key: 'assignmentRate', label: 'Assignment Completion', weight: '15%', hint: 'Percentage of assignments submitted on time' },
  { key: 'conceptScore', label: 'Concept Mastery', weight: '25%', hint: 'How well you understood core concepts (self-rating)' },
  { key: 'timeConsistency', label: 'Study Consistency', weight: '20%', hint: 'How regularly you studied throughout the semester' },
  { key: 'mockTestScore', label: 'Mock Test Performance', weight: '10%', hint: 'Average score across practice tests' },
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
    toast.info("AI is evaluating your semester performance...");
    try {
      const res = await fetch('/api/roadmap/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roadmapId, ...formData }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      toast.success("Semester evaluation complete!");
    } catch (err) {
      toast.error("Failed to generate next semester. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  const trendConfig = {
    ADVANCED: { icon: <TrendingUp size={32} color="var(--success)" />, color: 'var(--success)', label: '🚀 Advanced Mode Unlocked', desc: 'Your next semester will include advanced topics and complex real-world projects.' },
    BALANCED: { icon: <Minus size={32} color="var(--warning)" />, color: 'var(--warning)', label: '⚖️ Balanced Mode', desc: 'Your next roadmap maintains pace while reinforcing weak areas identified this semester.' },
    FOUNDATION: { icon: <TrendingDown size={32} color="var(--danger)" />, color: 'var(--danger)', label: '🔁 Foundation Mode', desc: 'Next semester will slow down and reinforce fundamentals to build a stronger base.' },
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={22} />
        </button>

        {/* Result View */}
        {result && !loading && (
          <div style={{ textAlign: 'center' }}>
            <h2 className="gradient-text" style={{ marginBottom: '1rem' }}>Evaluation Complete!</h2>

            <div style={{ fontSize: '4rem', fontWeight: '900', color: result.performanceScore >= 80 ? 'var(--success)' : result.performanceScore >= 50 ? 'var(--warning)' : 'var(--danger)', marginBottom: '0.5rem' }}>
              {result.performanceScore?.toFixed(1)}
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Performance Score</p>

            {result.trend && (
              <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: `1px solid ${trendConfig[result.trend as keyof typeof trendConfig]?.color}44` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  {trendConfig[result.trend as keyof typeof trendConfig]?.icon}
                  <strong style={{ fontSize: '1.1rem', color: trendConfig[result.trend as keyof typeof trendConfig]?.color }}>
                    {trendConfig[result.trend as keyof typeof trendConfig]?.label}
                  </strong>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  {trendConfig[result.trend as keyof typeof trendConfig]?.desc}
                </p>
              </div>
            )}

            {result.finished && (
              <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>🎓 You've completed all 8 semesters!</p>
              </div>
            )}

            <button className="btn-primary" style={{ width: '100%' }} onClick={onSuccess}>
              View Updated Roadmap
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <Loader2 size={48} color="var(--accent)" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
            <h3>AI is analyzing your performance and building next semester...</h3>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Form */}
        {!result && !loading && (
          <form onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: '0.5rem' }} className="gradient-text">End of Semester Review</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              Your scores determine the adaptive difficulty of Semester {' '}
              <strong style={{ color: 'var(--accent)' }}>(next)</strong>.
              Be honest — this data helps the AI calibrate your roadmap.
            </p>

            {/* Live score preview */}
            <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Predicted Score</span>
              <span style={{
                fontSize: '2rem', fontWeight: '900',
                color: weightedScore >= 80 ? 'var(--success)' : weightedScore >= 50 ? 'var(--warning)' : 'var(--danger)'
              }}>
                {weightedScore}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {METRICS.map(m => (
                <div key={m.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ margin: 0 }}>{m.label} <span style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>({m.weight})</span></label>
                    <strong style={{ color: 'var(--accent)' }}>{formData[m.key]}%</strong>
                  </div>
                  <input
                    type="range"
                    min={0} max={100}
                    value={formData[m.key]}
                    onChange={e => setFormData(prev => ({ ...prev, [m.key]: Number(e.target.value) }))}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>{m.hint}</p>
                </div>
              ))}
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1rem' }}>
              Submit & Generate Next Semester
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
