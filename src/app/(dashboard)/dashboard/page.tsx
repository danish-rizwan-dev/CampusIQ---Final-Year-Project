'use client';

import { useUser } from '@clerk/nextjs';
import { 
  CheckCircle, Clock, TrendingUp, Calendar, 
  Loader2, ChevronRight, Target, Activity,
  GraduationCap, BookOpen, Sparkles, Zap, Shield, Brain, MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeSemester: 0,
    tasksDue: 0,
    attendanceAvg: 0,
    careerProgress: 0,
    mockReadiness: 0,
    latestMock: null as any,
    insight: "Synthesizing your academic trajectory..."
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [userRes, taskRes, analyticsRes] = await Promise.all([
          fetch('/api/user/me'),
          fetch('/api/tasks'),
          fetch('/api/analytics/summary')
        ]);
        
        const userData = await userRes.json();
        const tasksData = await taskRes.json();
        const analyticsData = await analyticsRes.json();

        const activeRoadmap = userData.user?.roadmaps.find((r: any) => r.status === 'ACTIVE');
        const pendingTasks = tasksData.tasks?.filter((t: any) => t.status === 'PENDING') || [];
        
        setTasks(pendingTasks.slice(0, 4));
        setStats({
          activeSemester: activeRoadmap?.semesterNumber || 0,
          tasksDue: pendingTasks.length,
          attendanceAvg: 92,
          careerProgress: userData.user?.careerProfile?.careerReadinessScore || 0,
          mockReadiness: analyticsData.latest?.mock || 0,
          latestMock: analyticsData.mockExams?.[0] || null,
          insight: activeRoadmap 
            ? `Everything looks good. You are in Semester ${activeRoadmap.semesterNumber}. You have ${pendingTasks.length} tasks to complete.`
            : "Welcome! Create your first study plan to get started."
        });
      } catch (error) {
        toast.error("Telemetry link failed. Using offline cache.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '80vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <div className="neon-border" style={{ padding: '20px', borderRadius: '50%' }}>
          <Loader2 size={40} className="spin" color="var(--accent-neon)" />
        </div>
        <p style={{ letterSpacing: '4px', fontSize: '0.7rem', fontWeight: '900', color: 'var(--accent-neon)' }}>LOADING...</p>
      </div>
    );
  }

  return (
    <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 4vh, 2rem)', position: 'relative' }}>
      
      {/* --- COMMAND HEADER --- */}
      <header className="bento-card neon-border" style={{ 
        padding: 'clamp(1.25rem, 5vw, 2.5rem)',
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--accent-glow) 100%)',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: '24px'
      }}>
        <div className="scan-line" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <div style={{ width: '6px', height: '6px', background: 'var(--accent-neon)', borderRadius: '1px' }} />
            <span style={{ fontSize: '0.55rem', fontWeight: '900', letterSpacing: '2px', color: 'var(--accent-neon)' }}>SYSTEM ONLINE</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', fontWeight: 950, lineHeight: 1, letterSpacing: '-0.04em', margin: 0 }}>
            {greeting}, <br className="mobile-only" /><span className="shimmer-text">{user?.firstName?.toUpperCase() || 'STUDENT'}</span>
          </h1>
          
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/dashboard/roadmap" className="btn-primary" style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '0.7rem', fontWeight: 900, flex: '1 1 140px', textAlign: 'center' }}>
              REVEAL STRATEGY
            </Link>
            <Link href="/dashboard/exam" className="btn-secondary" style={{ borderRadius: '12px', border: '1px solid var(--accent-neon)', color: 'var(--accent-neon)', padding: '12px 20px', fontSize: '0.7rem', fontWeight: 900, flex: '1 1 140px', textAlign: 'center' }}>
              EXAM PROTOCOL
            </Link>
          </div>
        </div>
        
        <Shield size={200} color="var(--accent)" style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.05, pointerEvents: 'none' }} />
      </header>

      {/* --- TELEMETRY GRID --- */}
      <div className="telemetry-grid">
        {[
          { label: 'SEMESTER', val: stats.activeSemester || '—', icon: <GraduationCap size={16} />, color: 'var(--accent-neon)' },
          { label: 'PENDING', val: stats.tasksDue, icon: <Activity size={16} />, color: 'var(--warning)' },
          { label: 'ATTENDANCE', val: `${stats.attendanceAvg}%`, icon: <Zap size={16} />, color: 'var(--success)' },
          { label: 'READINESS', val: `${Math.round(stats.mockReadiness)}%`, icon: <Brain size={16} />, color: 'var(--accent-neon)' },
        ].map((s, i) => (
          <div key={i} className="glass-card telemetry-item" style={{ borderLeft: `3px solid ${s.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
               <span style={{ color: s.color }}>{s.icon}</span>
               <span style={{ fontSize: '0.55rem', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '1px' }}>{s.label}</span>
            </div>
            <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: '950', margin: 0, lineHeight: 1 }}>{s.val}</h3>
          </div>
        ))}
      </div>

      {/* --- MAIN INTERFACE --- */}
      <div className="stack-on-mobile" style={{ gap: '1.5rem' }}>
        
        {/* Left Col: Insights & Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 2 }}>
          <section className="glass-card" style={{ padding: 'clamp(1.25rem, 5vw, 2rem)', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Brain size={20} color="var(--accent-neon)" />
              <h2 style={{ fontSize: '0.85rem', fontWeight: '900', margin: 0, letterSpacing: '1px', color: 'var(--text-muted)' }}>NEURAL INSIGHTS</h2>
            </div>
            
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)', position: 'relative' }}>
              <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', lineHeight: 1.5, color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
                "{stats.insight}"
              </p>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: '900', letterSpacing: '1px', color: 'var(--text-muted)' }}>CAREER TRAJECTORY</span>
                <span style={{ color: 'var(--accent-neon)', fontWeight: '900', fontSize: '0.7rem' }}>{Math.round(stats.careerProgress)}%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ 
                  width: `${stats.careerProgress}%`, 
                  height: '100%', 
                  background: 'var(--accent-gradient)', 
                  boxShadow: '0 0 10px var(--accent-glow)'
                }} />
              </div>
            </div>

            {stats.latestMock && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.55rem', fontWeight: 900, color: 'var(--accent-neon)', letterSpacing: '1px' }}>LATEST SIMULATION</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.85rem', fontWeight: 800 }}>{stats.latestMock.subject}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: 950, color: stats.latestMock.score >= 40 ? 'var(--success)' : 'var(--danger)' }}>{Math.round(stats.latestMock.score)}%</p>
                </div>
              </div>
            )}
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
             <Link href="/dashboard/assistant" className="glass-card glass-card-hoverable" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '16px' }}>
                <MessageSquare size={18} color="var(--accent-neon)" />
                <span style={{ fontWeight: '800', fontSize: '0.75rem', letterSpacing: '0.5px' }}>AI CHAT</span>
             </Link>
             <Link href="/dashboard/syllabus" className="glass-card glass-card-hoverable" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '16px' }}>
                <BookOpen size={18} color="var(--accent-secondary)" />
                <span style={{ fontWeight: '800', fontSize: '0.75rem', letterSpacing: '0.5px' }}>SYLLABUS</span>
             </Link>
          </div>
        </div>

        {/* Right Col: Task Queue */}
        <aside className="glass-card" style={{ padding: '1.25rem', flex: 1, borderRadius: '24px', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
             <h3 style={{ fontSize: '0.85rem', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                <Activity size={18} color="var(--warning)" /> TASK QUEUE
             </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {tasks.length > 0 ? tasks.map((t, i) => (
              <div key={i} className="task-node">
                <div style={{ 
                  width: '5px', 
                  height: '5px', 
                  borderRadius: '50%', 
                  background: t.priority === 'HIGH' ? 'var(--danger)' : 'var(--accent-neon)',
                  flexShrink: 0
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                   <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{t.title}</p>
                   <p style={{ fontSize: '0.55rem', color: 'var(--text-muted)', letterSpacing: '0.5px', margin: 0 }}>{t.type} · {t.priority}</p>
                </div>
                <ChevronRight size={10} opacity={0.3} />
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle size={24} color="var(--success)" opacity={0.3} />
                <p style={{ fontSize: '0.6rem', fontWeight: '900', marginTop: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>QUEUE EMPTY</p>
              </div>
            )}
          </div>

          <Link href="/dashboard/timetable" style={{ marginTop: '1.25rem', display: 'block' }}>
            <button className="btn-secondary" style={{ width: '100%', fontSize: '0.6rem', fontWeight: '900', letterSpacing: '1.5px', border: '1px dashed var(--border)', padding: '10px', borderRadius: '10px' }}>
              FULL SCHEDULE
            </button>
          </Link>
        </aside>

      </div>

      <style jsx>{`
        .telemetry-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }
        .telemetry-item {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-radius: 16px;
        }
        .task-node {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          transition: 0.3s;
          cursor: pointer;
          border-radius: 12px;
        }
        .task-node:hover {
          background: rgba(255, 255, 255, 0.04);
          transform: translateX(3px);
        }
        .mobile-only { display: none; }
        @media (max-width: 1024px) {
          .telemetry-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .mobile-only { display: block; }
          .telemetry-grid { gap: 0.6rem; }
          .telemetry-item { padding: 0.75rem; }
        }
        @media (max-width: 480px) {
          .telemetry-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

    </div>
  );
}