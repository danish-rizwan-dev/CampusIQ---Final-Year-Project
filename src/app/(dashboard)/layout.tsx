'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useStore } from '@/store/useStore';
import { Moon, Sun, Menu, Loader2, LayoutDashboard, Map, BookOpen, MessageSquare, Activity, Command, AlertTriangle, Calendar, Target, Settings, FileText } from 'lucide-react';
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { theme, toggleTheme } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && user) {
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName || user.username
        })
      }).catch(err => console.error('Sync error:', err));
    }
  }, [isLoaded, user]);

  const handleScroll = (e: any) => setScrolled(e.target.scrollTop > 10);

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <Loader2 size={30} className="spin" color="#6366f1" />
      </div>
    );
  }

  const navLinks = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Roadmap', path: '/dashboard/roadmap', icon: Map },
    { name: 'Exam Prep', path: '/dashboard/exam', icon: AlertTriangle },
    { name: 'Mock Exam', path: '/dashboard/mock-exam', icon: FileText },
    { name: 'Class Schedule', path: '/dashboard/timetable', icon: Calendar },
    { name: 'Performance', path: '/dashboard/analytics', icon: Activity },
    { name: 'Career', path: '/dashboard/career', icon: Target },
    { name: 'Syllabus', path: '/dashboard/syllabus', icon: BookOpen },
    { name: 'Assistant', path: '/dashboard/assistant', icon: MessageSquare },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const currentPage = navLinks.find(link => pathname === link.path || (link.path !== '/dashboard' && pathname?.startsWith(link.path)))?.name || 'Dashboard';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative' }}>
        
        {/* --- TOP NAV --- */}
        <header style={{
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(1rem, 5vw, 2.5rem)',
          background: scrolled ? 'var(--glass-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'all 0.3s ease',
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button onClick={() => setSidebarOpen(true)} className="hamburger-btn">
              <Menu size={22} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Command size={18} color="var(--accent)" />
                <h2 className="current-page-title">{currentPage.toUpperCase()}</h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button onClick={toggleTheme} className="theme-toggle-pill" style={{ border: 'none', background: 'var(--bg-secondary)', padding: '8px 16px' }}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <UserButton />
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main onScroll={handleScroll} className="main-stage">
          <div className="page-breadcrumb">
            <span style={{ opacity: 0.3 }}>ROOT</span>
            <span style={{ margin: '0 8px', opacity: 0.1 }}>/</span>
            <span style={{ color: 'var(--accent-neon)', fontWeight: '900' }}>{currentPage.toUpperCase()}</span>
          </div>
          {children}
        </main>

        {/* --- MOBILE NAV --- */}
        <nav className="mobile-bottom-nav">
            {navLinks.map((link) => {
                const isActive = pathname === link.path;
                const Icon = link.icon;
                return (
                    <Link key={link.path} href={link.path} className={`bottom-nav-item ${isActive ? 'active' : ''}`}>
                        <Icon size={20} />
                        {isActive && <div className="active-dot" />}
                    </Link>
                );
            })}
        </nav>
      </div>

      <style jsx global>{`
        .main-stage {
            flex: 1;
            overflow-y: auto;
            padding: 1rem clamp(1rem, 3vw, 1.5rem) 4rem;
        }

        .current-page-title {
            font-size: 0.9rem;
            font-weight: 900;
            letter-spacing: 2px;
            margin: 0;
            color: var(--text-primary);
        }

        .page-breadcrumb {
            display: flex;
            align-items: center;
            font-size: 0.7rem;
            font-weight: 900;
            margin-bottom: 2rem;
            letter-spacing: 3px;
        }

        .mobile-bottom-nav {
            display: none;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            height: 70px;
            background: var(--glass-bg);
            backdrop-filter: blur(30px);
            border-top: 1px solid var(--border);
            justify-content: space-around;
            align-items: center;
            z-index: 1000;
        }

        .bottom-nav-item {
            color: var(--text-secondary);
            padding: 12px;
            position: relative;
        }

        .bottom-nav-item.active {
            color: var(--accent-neon);
        }

        .active-dot {
            position: absolute;
            bottom: 4px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 4px;
            background: var(--accent-neon);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--accent-neon);
        }

        .hamburger-btn {
            display: none;
            background: transparent;
            border: 1px solid var(--border);
            padding: 8px;
            border-radius: 8px;
            color: var(--text-primary);
        }

        @media (max-width: 768px) {
            .hamburger-btn { display: flex; }
            .mobile-bottom-nav { display: flex; }
            .main-stage { padding: 1.5rem 1rem 100px; }
            .page-breadcrumb { display: none; }
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}