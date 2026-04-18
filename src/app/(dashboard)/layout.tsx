'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useStore } from '@/store/useStore';
import { Moon, Sun, Menu, Loader2, LayoutDashboard, Map, BookOpen, MessageSquare, Activity } from 'lucide-react';
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { theme, toggleTheme } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Sync logic remains the same
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
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Roadmap', path: '/dashboard/roadmap', icon: Map },
    { name: 'Career', path: '/dashboard/career', icon: Activity },
    { name: 'Syllabus', path: '/dashboard/syllabus', icon: BookOpen },
    { name: 'Ask AI', path: '/dashboard/assistant', icon: MessageSquare },
  ];

  const currentPage = navLinks.find(link => pathname === link.path || (link.path !== '/dashboard' && pathname?.startsWith(link.path)))?.name || 'Dashboard';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative' }}>
        
        {/* --- ULTRA-MINIMAL TOP BAR --- */}
        <header style={{
          height: '64px',
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
          {/* Left Side: Mobile Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setSidebarOpen(true)} className="hamburger-btn">
              <Menu size={22} />
            </button>
            
            <div className="status-indicator">
                <div className="status-dot pulse" />
                <span className="hide-tablet">SYSTEM ONLINE</span>
                <span className="show-tablet-only">ONLINE</span>
            </div>

            <div className="vertical-divider show-tablet" />
            
            <h2 className="current-page-title show-tablet">{currentPage}</h2>
          </div>

          {/* Right Side: Essential Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={toggleTheme} className="theme-toggle-pill">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span className="theme-text">{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
            </button>
            
            <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} className="hide-mobile" />
            
            <div style={{ transform: 'scale(1.1)' }}>
                <UserButton />
            </div>
          </div>
        </header>

        {/* --- MAIN STAGE --- */}
        <main 
          onScroll={handleScroll}
          className="main-stage"
        >
          <div className="page-breadcrumb hide-tablet">
            <span style={{ opacity: 0.5 }}>Dashboard</span>
            <span style={{ margin: '0 8px', opacity: 0.3 }}>/</span>
            <span style={{ color: 'var(--accent)', fontWeight: '700' }}>{currentPage}</span>
          </div>
          {children}
        </main>

        {/* --- MOBILE BOTTOM NAVIGATION --- */}
        <nav className="mobile-bottom-nav">
            {navLinks.map((link) => {
                const isActive = pathname === link.path;
                const Icon = link.icon;
                return (
                    <Link key={link.path} href={link.path} className={`bottom-nav-item ${isActive ? 'active' : ''}`}>
                        <Icon size={20} />
                        <span>{link.name}</span>
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
            padding: 1rem 2.5rem 3rem;
            transition: all 0.3s ease;
        }

        .status-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--bg-secondary);
            padding: 6px 14px;
            border-radius: 100px;
            border: 1px solid var(--border);
            font-size: 0.65rem;
            font-weight: 800;
            color: var(--text-secondary);
            letter-spacing: 1px;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
        }

        .vertical-divider {
            width: 1px;
            height: 24px;
            background: var(--border);
            margin: 0 0.5rem;
        }

        .current-page-title {
            font-size: 1.1rem;
            font-weight: 800;
            margin: 0;
            letter-spacing: -0.02em;
        }

        .page-breadcrumb {
            display: flex;
            align-items: center;
            font-size: 0.75rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .pulse { animation: pulse-green 2s infinite; }
        @keyframes pulse-green {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .mobile-bottom-nav {
            display: none;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 70px;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border-top: 1px solid var(--border);
            justify-content: space-around;
            align-items: center;
            padding: 0 1rem;
            z-index: 1000;
        }

        .bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.65rem;
            font-weight: 700;
            transition: 0.3s;
            position: relative;
            padding: 8px 12px;
            border-radius: 12px;
        }

        .bottom-nav-item.active {
            color: var(--accent);
            background: var(--accent-glow);
        }

        .active-dot {
            position: absolute;
            top: 4px;
            right: 4px;
            width: 4px;
            height: 4px;
            background: var(--accent);
            border-radius: 50%;
        }

        .hamburger-btn {
            display: none;
            background: transparent;
            border: 1px solid var(--border);
            padding: 8px;
            border-radius: 10px;
            color: var(--text-primary);
            cursor: pointer;
        }

        .theme-toggle-pill {
            display: flex;
            align-items: center;
            gap: 8px;
            background: transparent;
            border: 1px solid var(--border);
            padding: 8px 14px;
            border-radius: 100px;
            cursor: pointer;
            color: var(--text-primary);
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.5px;
            transition: 0.2s;
        }

        .show-tablet, .show-tablet-only { display: none; }

        @media (min-width: 769px) {
            .show-tablet { display: flex; }
            .hide-tablet { display: none; }
        }

        @media (max-width: 1024px) {
            .hide-tablet { display: none; }
            .show-tablet-only { display: block; }
        }

        @media (max-width: 768px) {
            .main-stage { padding: 1rem 1rem 100px; }
            .hamburger-btn { display: flex; }
            .mobile-bottom-nav { display: flex; }
            .status-indicator, .theme-text, .hide-mobile, .show-tablet { display: none; }
            .theme-toggle-pill { padding: 8px; }
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}