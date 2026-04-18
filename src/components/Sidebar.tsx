'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Map, BookOpen, MessageSquare,
  AlertTriangle, Calendar, BarChart, Settings, LogOut, GraduationCap, X, Sparkles, Activity, ShieldCheck
} from 'lucide-react';
import { useClerk } from '@clerk/nextjs';

const links = [
  { name: 'Overview',          path: '/dashboard',           icon: LayoutDashboard },
  { name: 'Roadmap',           path: '/dashboard/roadmap',   icon: Map },
  { name: 'Career Assessment', path: '/dashboard/career',    icon: Activity },
  { name: 'Syllabus',          path: '/dashboard/syllabus',  icon: BookOpen },
  { name: 'Assistant',         path: '/dashboard/assistant', icon: MessageSquare },
  { name: 'Exam Mode',         path: '/dashboard/exam',      icon: AlertTriangle },
  { name: 'Schedule',          path: '/dashboard/timetable', icon: Calendar },
  { name: 'Analytics',         path: '/dashboard/analytics', icon: BarChart },
  { name: 'Settings',          path: '/dashboard/settings',  icon: Settings }, // Added Settings back
];

export default function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const sidebarContent = (
    <aside style={{
      width: '280px',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(50px)',
      WebkitBackdropFilter: 'blur(50px)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      borderRight: '1px solid var(--border)',
      position: 'relative',
    }}>
      {/* --- BRAND ARCHITECTURE --- */}
      <div style={{ padding: '2.5rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="float-anim" style={{ 
            width: '44px', height: '44px', borderRadius: '14px', 
            background: 'var(--accent)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 25px var(--accent-glow)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <GraduationCap size={24} color="white" />
          </div>
          <div>
            <p className="gradient-text" style={{ margin: 0, fontWeight: '900', fontSize: '1.3rem', letterSpacing: '-0.04em' }}>CampusIQ</p>
          </div>
        </div>

        <button onClick={onClose} className="mobile-only-btn" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      {/* --- DYNAMIC NAVIGATION --- */}
      <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: '900', color: 'var(--text-secondary)', padding: '1.5rem 0.8rem 0.6rem', letterSpacing: '2px', opacity: 0.5 }}>OS MODULES</p>
        
        {links.map(({ name, path, icon: Icon }) => {
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
                padding: '0.9rem 1.2rem',
                borderRadius: '16px',
                fontSize: '0.92rem',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#fff' : 'var(--text-primary)',
                background: isActive ? 'var(--accent)' : 'transparent',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                border: '1px solid transparent',
                position: 'relative'
              }}
            >
              <Icon size={19} style={{ 
                opacity: isActive ? 1 : 0.7,
                transition: '0.3s ease'
              }} />
              <span style={{ flex: 1 }}>{name}</span>
              {isActive && <Sparkles size={14} className="fade-in-up" style={{ opacity: 0.8 }} />}
            </Link>
          );
        })}
      </nav>

      {/* --- TELEMETRY FOOTER --- */}
      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.02)' }}>
        <button 
          onClick={() => signOut({ redirectUrl: '/' })} 
          className="signout-hover"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '1.2rem 0.5rem 0.5rem', background: 'transparent', border: 'none',
            cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700',
            color: 'var(--danger)', marginTop: '0.5rem', transition: '0.3s'
          }}
        >
          <LogOut size={18} />
          Deactivate Session
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
        {sidebarContent}
      </div>

      <style jsx global>{`
        .sidebar-desktop { display: flex; height: 100vh; position: sticky; top: 0; }
        .sidebar-mobile { display: none; }
        .mobile-only-btn { display: none; }

        .nav-item-idle:hover {
          background: var(--accent-glow) !important;
          transform: translateX(8px);
          color: var(--accent) !important;
          border-left: 3px solid var(--accent) !important;
        }

        .nav-item-active {
          box-shadow: 0 12px 24px var(--accent-glow);
          border: 1px solid rgba(255,255,255,0.2) !important;
        }

        .signout-hover:hover {
            opacity: 0.7;
            transform: scale(0.98);
        }

        .sidebar-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          backdrop-filter: blur(12px); opacity: 0; pointer-events: none;
          transition: 0.4s ease; z-index: 1999;
        }
        .sidebar-overlay.active { opacity: 1; pointer-events: auto; }

        @media (max-width: 768px) {
          .sidebar-desktop { display: none; }
          .sidebar-mobile { display: block; }
          .mobile-only-btn { display: flex; }
        }
      `}</style>
    </>
  );
}