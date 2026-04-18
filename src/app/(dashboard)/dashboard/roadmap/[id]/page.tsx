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
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
      {/* Header */}
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => router.back()} className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%', minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="gradient-text" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', margin: 0 }}>Sem {roadmap.semesterNumber}</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem' }}>Detailed 6-month OS timeline</p>
          </div>
        </div>
        <div style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
          {roadmap.status}
        </div>
      </div>

      <div className="responsive-grid-wide">
        {/* Main Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem' }}>
            <Calendar size={24} color="var(--accent)" /> Detailed Timeline
          </h2>
          
          {months.map(({ month, weeks }) => (
            <div key={month} className="glass-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '20px' }}>
              <button 
                onClick={() => setExpandedMonth(expandedMonth === month ? 0 : month)}
                style={{ 
                  width: '100%', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  background: expandedMonth === month ? 'var(--bg-secondary)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem' }}>
                    {month}
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>Month {month}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Focus: {weeks[0]?.focus?.split(':')[0] || 'Curriculum Focus'}
                    </p>
                  </div>
                </div>
                {expandedMonth === month ? <ChevronDown size={22} /> : <ChevronRight size={22} />}
              </button>

              {expandedMonth === month && (
                <div style={{ padding: '1.5rem 1.5rem 2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', borderTop: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
                  {weeks.map((week: any) => (
                    <div key={week.week} style={{ position: 'relative', paddingLeft: '2.5rem', borderLeft: '2px solid var(--border)' }}>
                      <div style={{ position: 'absolute', left: '-10px', top: '0', background: 'var(--bg-primary)', padding: '2px' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--accent)', border: '4px solid var(--bg-primary)' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Week {week.week}: {week.focus}</h4>
                          {week.youtubeSearchUrl && (
                            <a 
                              href={week.youtubeSearchUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn-secondary" 
                              style={{ 
                                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', 
                                fontSize: '0.75rem', borderRadius: '10px', textDecoration: 'none', color: 'var(--danger)',
                                border: '1px solid var(--border)'
                              }}
                            >
                              <Video size={16} /> Watch
                            </a>
                          )}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                          {week.details}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.5rem' }}>
                          {week.tasks.map((task: string, idx: number) => (
                            <span key={idx} style={{ background: 'var(--bg-secondary)', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid var(--border)', fontWeight: '500' }}>
                              • {task}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  {weeks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Detailed timeline for this semester was generated in the old format.</p>
                      <button className="btn-primary" onClick={() => toast.info("Regeneration logic coming in next update!")}>
                        Regenerate for 24-Week View
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Subjects */}
          <div className="glass-card" style={{ borderRadius: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <BookOpen size={22} color="var(--accent)" /> Core Subjects
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {roadmap.subjects?.map((sub: string, idx: number) => (
                <div key={idx} style={{ 
                  display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                  background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)'
                }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)' }} />
                  <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Skill Targets */}
          <div className="glass-card" style={{ borderRadius: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Target size={22} color="var(--accent)" /> Skill Checklist
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {roadmap.skills?.map((skill: string, idx: number) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} color="var(--success)" /> {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="glass-card" style={{ borderRadius: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <Award size={22} color="var(--accent)" /> Projects
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {roadmap.projects?.map((proj: any, idx: number) => (
                <div key={idx} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '1rem' }}>{proj.name}</strong>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent)' }}>Month {proj.month}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem' }}>{proj.description}</p>
                  {proj.youtubeSearchUrl && (
                    <a href={proj.youtubeSearchUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--danger)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Video size={14} /> View Reference
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
