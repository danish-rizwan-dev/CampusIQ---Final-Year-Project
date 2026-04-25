'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Map, BookOpen, MessageSquare,
  AlertTriangle, Calendar, BarChart, Settings, LogOut, GraduationCap, X, Sparkles, Activity, ShieldCheck, FileText
} from 'lucide-react';
import { useClerk } from '@clerk/nextjs';

const links = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Study Plan', path: '/dashboard/roadmap', icon: Map, hot: true },
  { name: 'Career Path', path: '/dashboard/career', icon: Activity },
  { name: 'Syllabus Hub', path: '/dashboard/syllabus', icon: BookOpen },
  { name: 'AI Assistant', path: '/dashboard/assistant', icon: MessageSquare },
  { name: 'Exam Prep', path: '/dashboard/exam', icon: AlertTriangle },
  { name: 'Mock Exam', path: '/dashboard/mock-exam', icon: FileText },
  { name: 'Class Schedule', path: '/dashboard/timetable', icon: Calendar },
  { name: 'Performance', path: '/dashboard/analytics', icon: BarChart },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const sidebarContent = (
    <aside style={{
      width: '280px',
      background: 'var(--glass-bg)',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 2rem)',
      margin: '1rem',
      borderRadius: '24px',
      border: '1px solid var(--border)',
      position: 'relative',
      boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* --- GLOW ORB DECOR --- */}
      <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px', background: 'var(--accent)', filter: 'blur(80px)', opacity: 0.15, pointerEvents: 'none' }} />

      {/* --- BRAND ARCHITECTURE --- */}
      <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="float-anim" style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--glow-shadow)',
            border: '1px solid var(--border-bright)'
          }}>
            <GraduationCap size={22} color="white" />
          </div>
          <div>
            <p className="gradient-text" style={{ margin: 0, fontWeight: '900', fontSize: '1.25rem', letterSpacing: '-0.04em' }}>CampusIQ</p>
            <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '1px', opacity: 0.6 }}>STUDENT OS v2.0</p>
          </div>
        </Link>

        <button onClick={onClose} className="mobile-only-btn" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      {/* --- DYNAMIC NAVIGATION --- */}
      <nav style={{ flex: 1, padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }} className="custom-scrollbar">
        <p style={{ fontSize: '0.65rem', fontWeight: '900', color: 'var(--text-secondary)', padding: '1rem 0.8rem 0.6rem', letterSpacing: '2px', opacity: 0.4 }}>CORE SYSTEMS</p>

        {links.map(({ name, path, icon: Icon, hot }) => {
          const isActive = pathname === path || (path !== '/dashboard' && pathname.startsWith(path));
          return (
            <Link
              key={path}
              href={path}
              onClick={onClose}
              className={isActive ? 'nav-item-active' : 'nav-item-idle'}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.85rem 1rem',
                borderRadius: '14px',
                fontSize: '0.9rem',
                fontWeight: isActive ? '700' : '600',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-glow)' : 'transparent',
                transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                position: 'relative'
              }}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Icon size={18} style={{
                  opacity: isActive ? 1 : 0.6,
                  color: isActive ? 'var(--accent-neon)' : 'inherit'
                }} />
                {hot && !isActive && <div style={{ position: 'absolute', top: -4, right: -4, width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 8px var(--accent)' }} />}
              </div>
              <span style={{ flex: 1 }}>{name}</span>
              {isActive && <div className="active-indicator" />}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
        <button
          onClick={() => signOut({ redirectUrl: '/' })}
          className="signout-hover"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '0.75rem', background: 'transparent', border: 'none',
            cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700',
            color: 'var(--danger)', transition: '0.3s',
          }}
        >
          <LogOut size={16} color='var(--danger)' />
          Logout Session
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="sidebar-desktop">{sidebarContent}</div>

      <div className={`sidebar-overlay ${mobileOpen ? 'active' : ''}`} onClick={onClose} />

      <div className="sidebar-mobile" style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 2000,
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{ margin: 0, height: '100vh', width: '280px' }}>
          {sidebarContent}
        </div>
      </div>

      <style jsx global>{`
        .sidebar-desktop { display: flex; height: 100vh; position: sticky; top: 0; }
        .sidebar-mobile { display: none; }
        .mobile-only-btn { display: none; }

        .nav-item-idle:hover {
          background: var(--accent-glow) !important;
          color: var(--accent) !important;
          padding-left: 1.25rem !important;
        }

        .nav-item-active {
          box-shadow: 0 10px 20px var(--accent-glow);
          border: 1px solid rgba(255,255,255,0.1) !important;
        }

        .active-indicator {
            position: absolute;
            right: 12px;
            width: 4px;
            height: 14px;
            background: var(--accent-neon);
            border-radius: 2px;
            box-shadow: 0 0 10px var(--accent-neon);
        }

        .signout-hover:hover {
            color: var(--danger) !important;
            transform: translateX(5px);
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

        @keyframes shimmer {
            0% { opacity: 0.5; transform: translateX(-100%); }
            100% { opacity: 1; transform: translateX(200%); }
        }

        @media (max-width: 768px) {
          .sidebar-desktop { display: none; }
          .sidebar-mobile { display: block; }
          .mobile-only-btn { display: flex; }
        }
      `}</style>
    </>
  );
}