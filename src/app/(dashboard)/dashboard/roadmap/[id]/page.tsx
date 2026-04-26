'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Calendar, BookOpen, Target, CheckCircle2, 
  Circle, ChevronRight, ChevronDown, Clock, Award, Video, Loader2
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

export default function SemesterDetail() {
  const { id } = useParams();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedMonth, setExpandedMonth] = useState<number>(1);

  useEffect(() => {
    if (isLoaded && user) {
      fetchRoadmap();
    }
  }, [isLoaded, user, id]);

  const fetchRoadmap = async () => {
    try {
      const res = await fetch('/api/user/me');
      const data = await res.json();
      const found = data.user?.roadmaps.find((r: any) => r.id === id);
      if (found) {
        setRoadmap(found);
      } else {
        toast.error("Roadmap not found in your profile.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load detailed curriculum.");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} style={{ animation: 'spin 1.5s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Roadmap not found</h2>
        <button className="btn-secondary" onClick={() => router.back()} style={{ marginTop: '1rem' }}>Go Back</button>
      </div>
    );
  }

  // Group weeks by month
  const months = Array.from({ length: 6 }, (_, i) => {
    const monthNum = i + 1;
    const weeks = roadmap.weeklyBreakdown?.filter((w: any) => w.month === monthNum) || [];
    return { month: monthNum, weeks };
  });

  return (
    <div className="detail-page-container">
      {/* Header */}
      <div className="page-header" style={{ alignItems: 'flex-start', justifyContent: 'flex-start', textAlign: 'left', gap: '1rem' }}>
        <button onClick={() => router.back()} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', minWidth: '40px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        
        <div style={{ flex: 1 }}>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', margin: 0 }}>Sem {roadmap.semesterNumber}</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>Detailed Professional Roadmap</p>
        </div>

        <div style={{ 
            background: roadmap.status === 'ACTIVE' ? 'var(--accent)' : 'var(--accent-glow)', 
            color: roadmap.status === 'ACTIVE' ? 'white' : 'var(--accent)',
            border: '1px solid var(--accent)', 
            padding: '0.5rem 1rem', 
            borderRadius: '24px', 
            fontSize: '0.75rem', 
            fontWeight: '800',
            boxShadow: roadmap.status === 'ACTIVE' ? '0 4px 12px var(--accent-glow)' : 'none'
        }}>
          {roadmap.status}
        </div>
      </div>

      <div className="stack-on-mobile" style={{ gap: '2rem', width: '100%' }}>
        {/* Main Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1.8 }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', margin: '0 0 0.5rem' }}>
            <Calendar size={20} color="var(--accent)" /> Detailed Timeline
          </h2>
          
          {months.map(({ month, weeks }) => (
            <div key={month} className="glass-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <button 
                onClick={() => setExpandedMonth(expandedMonth === month ? 0 : month)}
                className="month-header"
                style={{ 
                  width: '100%', padding: 'clamp(1rem, 3vw, 1.25rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  background: expandedMonth === month ? 'var(--accent-glow)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.75rem, 2vw, 1.25rem)' }}>
                  <div style={{ 
                    width: 'clamp(36px, 10vw, 44px)', height: 'clamp(36px, 10vw, 44px)', 
                    borderRadius: '12px', background: 'var(--accent)', color: 'white', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1rem' 
                  }}>
                    {month}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 'clamp(1rem, 2vw, 1.1rem)', fontWeight: '800' }}>MONTH {month}</h3>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                      {weeks[0]?.focus?.split(':')[0] || 'PHASE INITIALIZATION'}
                    </p>
                  </div>
                </div>
                {expandedMonth === month ? <ChevronDown size={18} /> : <ChevronRight size={18} opacity={0.5} />}
              </button>

              {expandedMonth === month && (
                <div style={{ padding: 'clamp(1.25rem, 4vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: '2rem', borderTop: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
                  {weeks.map((week: any) => (
                    <div key={week.week} className="week-item">
                      <div style={{ position: 'absolute', left: '-1px', top: '0', background: 'var(--bg-primary)', padding: '2px', transform: 'translateX(-50%)' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg-primary)', boxShadow: '0 0 10px var(--accent)' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div className="week-header">
                          <h4 className="week-title" style={{ fontSize: '1rem', fontWeight: '800', lineHeight: 1.3 }}>
                            WEEK {week.week}: <span style={{ color: 'var(--text-secondary)' }}>{week.focus}</span>
                          </h4>
                          {week.youtubeSearchUrl && (
                            <a 
                              href={week.youtubeSearchUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn-secondary watch-btn"
                              style={{ padding: '6px 12px', fontSize: '0.7rem', fontWeight: '800', borderRadius: '8px' }}
                            >
                              <Video size={14} /> WATCH
                            </a>
                          )}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.6', opacity: 0.8 }}>
                          {week.details}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                          {week.tasks.map((task: string, idx: number) => (
                            <span key={idx} style={{ background: 'var(--bg-secondary)', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', border: '1px solid var(--border)', fontWeight: '700', color: 'var(--accent)' }}>
                              {task.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  {weeks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Data structure mismatch. Please update roadmap.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
          <div className="glass-card" style={{ borderRadius: '24px', padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '1px' }}>
              <BookOpen size={18} color="var(--accent)" /> CORE CURRICULUM
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {roadmap.subjects?.map((sub: string, idx: number) => (
                <div key={idx} style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
                  background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)'
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>{sub}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ borderRadius: '24px', padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '1px' }}>
              <Award size={18} color="var(--warning)" /> MILESTONE PROJECTS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {roadmap.projects?.map((proj: any, idx: number) => (
                <div key={idx} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.85rem', fontWeight: '800' }}>{proj.name}</strong>
                    <span style={{ fontSize: '0.6rem', fontWeight: '900', color: 'var(--accent)', background: 'var(--accent-glow)', padding: '2px 6px', borderRadius: '4px' }}>M{proj.month}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.75rem', lineHeight: 1.4 }}>{proj.description}</p>
                  {proj.youtubeSearchUrl && (
                    <a href={proj.youtubeSearchUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--danger)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Video size={12} /> REFERENCE PROTOCOL
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .detail-page-container {
          maxWidth: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 0 clamp(0.5rem, 3vw, 1rem);
          width: 100%;
        }

        .page-header {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          width: 100%;
        }

        .week-item {
          position: relative;
          padding-left: 1.75rem;
          border-left: 1px solid var(--border);
          transition: 0.3s;
        }

        .week-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .watch-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--danger) !important;
          border: 1px solid var(--border);
          flex-shrink: 0;
        }
        
        @media (max-width: 768px) {
          .page-header {
            flex-direction: row;
            align-items: center;
          }
          .week-header {
            flex-direction: column;
            gap: 0.75rem;
          }
          .watch-btn {
            width: fit-content;
          }
        }
      `}</style>
    </div>
  );
}
