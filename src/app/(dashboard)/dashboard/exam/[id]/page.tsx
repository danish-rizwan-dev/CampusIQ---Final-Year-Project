'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  AlertTriangle, Clock, Star, BookOpen, 
  ChevronDown, ChevronUp, Loader2, Sparkles, 
  CheckCircle2, ArrowLeft, Video, Target, Calendar
} from 'lucide-react';
import { toast } from 'sonner';

export default function ExamDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [prep, setPrep] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedMock, setExpandedMock] = useState<number | null>(null);

  useEffect(() => {
    fetchPrep();
  }, [params.id]);

  const fetchPrep = async () => {
    try {
      const res = await fetch(`/api/exam/${params.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPrep(data.prep);
    } catch (e) {
      toast.error("Failed to load exam strategy.");
      router.push('/dashboard/exam');
    } finally {
      setLoading(false);
    }
  };

  const weightColors: Record<string, string> = {
    'Very High': 'var(--danger)',
    'High': 'var(--warning)',
    'Medium': 'var(--success)'
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 className="spin" size={40} color="var(--accent)" />
      </div>
    );
  }

  if (!prep) return null;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button onClick={() => router.back()} className="btn-secondary" style={{ padding: '0.75rem', borderRadius: '14px' }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <span style={{ 
              fontSize: '0.7rem', 
              fontWeight: 900, 
              background: 'var(--danger)', 
              color: 'white', 
              padding: '2px 10px', 
              borderRadius: '20px',
              letterSpacing: '1px'
            }}>PANIC_MODE_ACTIVE</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Created {new Date(prep.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 950 }}>{prep.examName} Strategy</h1>
        </div>
      </div>

      <div className="responsive-grid-wide" style={{ alignItems: 'flex-start', gap: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Study Areas */}
          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Star size={24} color="var(--warning)" /> Priority Study Areas
            </h2>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {prep.importantTopics?.map((t: any, i: number) => (
                <div key={i} className="glass-card" style={{ 
                  borderRadius: '24px', 
                  padding: '1.5rem',
                  borderLeft: `8px solid ${weightColors[t.weight] || 'var(--accent)'}`,
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{t.name}</h3>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 900, 
                      padding: '4px 12px', 
                      borderRadius: '10px', 
                      background: weightColors[t.weight], 
                      color: 'white',
                      letterSpacing: '1px'
                    }}>{t.weight.toUpperCase()}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{t.reason}</p>
                  {t.youtubeSearchUrl && (
                    <a href={t.youtubeSearchUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none', gap: '8px', fontSize: '0.85rem', padding: '0.6rem 1.25rem', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}>
                      <Video size={18} /> Watch Masterclass
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* AI Mock Test */}
          <section>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Target size={24} color="var(--success)" /> Predictive Practice Test
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {prep.mockTests?.map((q: any, i: number) => (
                <div key={i} className="glass-card" style={{ borderRadius: '20px', overflow: 'hidden', padding: 0 }}>
                  <button
                    onClick={() => setExpandedMock(expandedMock === i ? null : i)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', gap: '1.5rem' }}
                  >
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <span style={{ fontWeight: 900, color: 'var(--accent)', opacity: 0.5 }}>0{i+1}</span>
                      <span style={{ fontWeight: 700, lineHeight: 1.5 }}>{q.question}</span>
                    </div>
                    {expandedMock === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {expandedMock === i && (
                    <div style={{ padding: '0 1.5rem 1.5rem 3.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', background: 'var(--bg-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', marginBottom: '1rem' }}>
                        <CheckCircle2 size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '1px' }}>AI MODEL ANSWER</span>
                      </div>
                      <p style={{ margin: 0, lineHeight: '1.8', fontSize: '1rem', color: 'var(--text-primary)', opacity: 0.8 }}>{q.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '2rem' }}>
          <div className="glass-card" style={{ padding: '2rem', borderRadius: '32px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock size={24} color="var(--accent)" /> Revision Daily
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {prep.revisionPlan?.map((day: any, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border)' }}>
                  <div style={{ background: 'var(--accent)', color: 'white', minWidth: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem' }}>
                    D{day.day}
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '6px' }}>{day.focus}</strong>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>{day.hours}h Intensity</span>
                      {day.youtubeSearchUrl && (
                        <a href={day.youtubeSearchUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Video size={14} /> REVISE
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', borderRadius: '32px', textAlign: 'center' }}>
            <Calendar size={40} color="var(--accent)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Final Countdown</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Your exam for <strong style={{ color: 'var(--text-primary)' }}>{prep.examName}</strong> is targeted for {new Date(prep.targetDate).toLocaleDateString()}.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
