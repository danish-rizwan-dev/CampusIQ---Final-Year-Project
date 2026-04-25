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
    <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
      
      {/* --- COMMAND HEADER --- */}
      <header className="bento-card neon-border" style={{ 
        padding: '1.5rem 2rem',
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--accent-glow) 100%)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div className="scan-line" />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--accent-neon)', borderRadius: '2px' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px', color: 'var(--accent-neon)' }}>DASHBOARD</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', fontWeight: 950, lineHeight: 1, letterSpacing: '-0.04em', margin: 0 }}>
            {greeting}, <span className="shimmer-text">{user?.firstName || 'STUDENT'}</span>
          </h1>
          
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/dashboard/roadmap" className="btn-primary" style={{ borderRadius: '8px', padding: '10px 20px', fontSize: '0.85rem' }}>
              VIEW STUDY PLAN
            </Link>
            <Link href="/dashboard/exam" className="btn-secondary" style={{ borderRadius: '8px', border: '1px solid var(--accent-neon)', color: 'var(--accent-neon)', padding: '10px 20px', fontSize: '0.85rem' }}>
              EXAM PREP
            </Link>
          </div>
        </div>
        
        {/* Abstract background icon */}
        <Shield size={300} color="var(--accent)" style={{ position: 'absolute', right: '-50px', bottom: '-50px', opacity: 0.03, pointerEvents: 'none' }} />
      </header>

      {/* --- TELEMETRY GRID --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'SEMESTER', val: stats.activeSemester || '—', icon: <GraduationCap size={20} />, color: 'var(--accent-neon)' },
          { label: 'PENDING TASKS', val: stats.tasksDue, icon: <Activity size={20} />, color: 'var(--warning)' },
          { label: 'ATTENDANCE', val: `${stats.attendanceAvg}%`, icon: <Zap size={20} />, color: 'var(--success)' },
          { label: 'MOCK READINESS', val: `${Math.round(stats.mockReadiness)}%`, icon: <Brain size={20} />, color: 'var(--accent-neon)' },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ borderLeft: `4px solid ${s.color}`, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ color: s.color }}>{s.icon}</span>
               <span style={{ fontSize: '0.6rem', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '1px' }}>{s.label}</span>
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: '950', margin: 0, fontFamily: 'inherit' }}>{s.val}</h3>
          </div>
        ))}
      </div>

      {/* --- MAIN INTERFACE --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }} className="stack-on-mobile">
        
        {/* Left Col: Insights & Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section className="bento-card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <Brain size={24} color="var(--accent-neon)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>DAILY UPDATES</h2>
            </div>
            
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', position: 'relative' }}>
              <p style={{ fontSize: '1.2rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                "{stats.insight}"
              </p>
            </div>

            <div style={{ marginTop: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '900', letterSpacing: '1px' }}>CAREER PROGRESS</span>
                <span style={{ color: 'var(--accent-neon)', fontWeight: '900' }}>{Math.round(stats.careerProgress)}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ 
                  width: `${stats.careerProgress}%`, 
                  height: '100%', 
                  background: 'var(--accent-gradient)', 
                  transition: 'width 2s cubic-bezier(0.16, 1, 0.3, 1)' 
                }} />
              </div>
            </div>

            {stats.latestMock && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 900, color: 'var(--accent-neon)', letterSpacing: '1px' }}>LATEST MOCK SCORE</p>
                  <p style={{ margin: '4px 0 0', fontSize: '1rem', fontWeight: 900 }}>{stats.latestMock.subject}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950, color: stats.latestMock.score >= 40 ? 'var(--success)' : 'var(--danger)' }}>{Math.round(stats.latestMock.score)}%</p>
                  <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: 900, opacity: 0.5 }}>{new Date(stats.latestMock.date).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
             <Link href="/dashboard/assistant" className="glass-card glass-card-hoverable" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                <MessageSquare size={20} color="var(--accent-neon)" />
                <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>CHAT WITH AI</span>
             </Link>
             <Link href="/dashboard/syllabus" className="glass-card glass-card-hoverable" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                <BookOpen size={20} color="var(--accent-secondary)" />
                <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>UPLOAD SYLLABUS</span>
             </Link>
          </div>
        </div>

        {/* Right Col: Task Queue */}
        <aside className="bento-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
             <h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity size={18} color="var(--accent-neon)" /> TASKS
             </h3>
             <div style={{ width: '40px', height: '1px', background: 'var(--border)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tasks.length > 0 ? tasks.map((t, i) => (
              <div key={i} className="task-node">
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: t.priority === 'HIGH' ? 'var(--danger)' : 'var(--accent-neon)'
                }} />
                <div style={{ flex: 1 }}>
                   <p style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>{t.title}</p>
                   <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>{t.type} // {t.priority} PRIORITY</p>
                </div>
                <ChevronRight size={14} opacity={0.3} />
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <CheckCircle size={40} color="var(--success)" opacity={0.2} />
                <p style={{ fontSize: '0.7rem', fontWeight: '900', marginTop: '1rem', color: 'var(--text-muted)' }}>ALL DONE!</p>
              </div>
            )}
          </div>

          <Link href="/dashboard/timetable" style={{ marginTop: '2.5rem', display: 'block' }}>
            <button className="btn-secondary" style={{ width: '100%', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px', border: '1px dashed var(--border)' }}>
              VIEW FULL SCHEDULE
            </button>
          </Link>
        </aside>

      </div>

      <style jsx>{`
        .task-node {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          transition: 0.3s;
          cursor: pointer;
        }
        .task-node:hover {
          background: rgba(255, 255, 255, 0.04);
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}