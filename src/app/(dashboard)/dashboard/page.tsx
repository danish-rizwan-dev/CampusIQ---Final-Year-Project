'use client';

import { useUser } from '@clerk/nextjs';
import { 
  CheckCircle, Clock, TrendingUp, Calendar, 
  Loader2, ChevronRight, Target, Activity,
  GraduationCap, BookOpen, Sparkles
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
    insight: "Gathering your latest academic updates..."
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [userRes, taskRes] = await Promise.all([
          fetch('/api/user/me'),
          fetch('/api/tasks')
        ]);
        
        const userData = await userRes.json();
        const tasksData = await taskRes.json();

        const activeRoadmap = userData.user?.roadmaps.find((r: any) => r.status === 'ACTIVE');
        const pendingTasks = tasksData.tasks?.filter((t: any) => t.status === 'PENDING') || [];
        
        setTasks(pendingTasks.slice(0, 3));
        setStats({
          activeSemester: activeRoadmap?.semesterNumber || 0,
          tasksDue: pendingTasks.length,
          attendanceAvg: 92,
          careerProgress: userData.user?.careerProfile?.careerReadinessScore || 0,
          insight: activeRoadmap 
            ? `You're currently in Semester ${activeRoadmap.semesterNumber}. You have ${pendingTasks.length} tasks that need your attention.`
            : "Welcome! Let's start by setting up your academic roadmap for the semester."
        });
      } catch (error) {
        toast.error("Neural sync failed. Using cached data.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '80vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <Loader2 size={40} style={{ animation: 'spin 2s linear infinite', color: 'var(--accent)' }} />
        <p style={{ letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 'bold', opacity: 0.6 }}>LOADING EXPERIENCE</p>
      </div>
    );
  }

  return (
    <div className="fade-in-up" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* --- HERO SECTION (Using your Bento styles) --- */}
      <header className="bento-card" style={{ 
        background: 'linear-gradient(135deg, var(--accent-glow) 0%, transparent 100%)',
        position: 'relative'
      }}>
        <div className="page-header" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '1.5px', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>OVERVIEW</p>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
              {greeting}, <br /><span className="gradient-text">{user?.firstName || 'Scholar'}</span>
            </h1>
          </div>
          <div className="stack-on-mobile" style={{ marginTop: '1rem' }}>
            <Link href="/dashboard/roadmap" className="btn-secondary" style={{ textDecoration: 'none' }}>
              My Roadmap
            </Link>
            <Link href="/dashboard/exam" className="btn-primary" style={{ textDecoration: 'none' }}>
              Exam Mode <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </header>

      {/* --- STATS GRID (Using your responsive-grid utility) --- */}
      <div className="responsive-grid">
        {[
          { label: 'SEMESTER', val: stats.activeSemester || '—', icon: <GraduationCap />, color: 'var(--accent)' },
          { label: 'TASKS DUE', val: stats.tasksDue, icon: <Clock />, color: 'var(--warning)' },
          { label: 'ATTENDANCE', val: `${stats.attendanceAvg}%`, icon: <TrendingUp />, color: 'var(--success)' },
          { label: 'READINESS', val: `${Math.round(stats.careerProgress)}%`, icon: <Target />, color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ color: s.color, background: 'var(--bg-primary)', padding: '10px', borderRadius: '12px' }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '1px' }}>{s.label}</p>
              <h3 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '800' }}>{s.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* --- MAIN LAYOUT (Using your asymmetric grid) --- */}
      <div className="responsive-grid-wide">
        
        {/* Left: Progress & Insights */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="bento-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Sparkles size={22} className="gradient-text" style={{ WebkitTextFillColor: 'unset', color: 'var(--accent)' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Academic Insight</h2>
            </div>
            
            <div style={{ background: 'var(--accent-glow)', padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid var(--accent)', marginBottom: '2rem' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-primary)', margin: 0 }}>
                "{stats.insight}"
              </p>
            </div>

            <div className="responsive-grid-2">
              <Link href="/dashboard/assistant" className="btn-primary" style={{ textDecoration: 'none', justifyContent: 'center' }}>Open Assistant</Link>
              <Link href="/dashboard/syllabus" className="btn-secondary" style={{ textDecoration: 'none', justifyContent: 'center' }}>Scan Syllabus</Link>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ margin: 0 }}>Career Readiness</h4>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>Skill-gap analysis score</p>
            </div>
            <div style={{ flex: 1, minWidth: '150px', height: '10px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${stats.careerProgress}%`, height: '100%', background: 'var(--accent)', transition: 'width 1s ease' }} />
            </div>
            <span style={{ fontWeight: '800', color: 'var(--accent)' }}>{Math.round(stats.careerProgress)}%</span>
          </div>
        </section>

        {/* Right: Task Sidebar */}
        <aside className="bento-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>
              <Activity size={18} color="var(--accent)" /> Priority List
            </h3>
            <span style={{ fontSize: '0.65rem', fontWeight: '800', padding: '4px 12px', background: 'var(--accent-glow)', borderRadius: '20px', color: 'var(--accent)' }}>
              {tasks.length} ACTIVE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tasks.length > 0 ? tasks.map((t, i) => (
              <div key={i} className="task-row">
                <div style={{ width: '4px', height: '24px', borderRadius: '4px', background: t.priority === 'HIGH' ? 'var(--danger)' : 'var(--accent)' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>{t.title}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t.type}</p>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.3 }} />
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={32} style={{ color: 'var(--success)', opacity: 0.3, marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.85rem' }}>Schedule is clear.</p>
              </div>
            )}
          </div>

          <Link href="/dashboard/timetable" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.8rem' }}>
              Full Schedule
            </button>
          </Link>
        </aside>

      </div>

      <style jsx>{`
        .task-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: var(--bg-primary);
          border-radius: 12px;
          border: 1px solid var(--border);
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .task-row:hover {
          border-color: var(--accent);
          transform: translateX(4px);
          background: var(--bg-secondary);
        }

        /* Ensuring link underlines are gone everywhere */
        :global(a) {
          text-decoration: none !important;
        }
      `}</style>
    </div>
  );
}