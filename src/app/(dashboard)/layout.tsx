'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useStore } from '@/store/useStore';
import { Moon, Sun, Menu, Loader2, Zap, ShieldCheck } from 'lucide-react';
import { useUser, UserButton } from '@clerk/nextjs';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { theme, toggleTheme } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* --- ULTRA-MINIMAL TOP BAR --- */}
        <header style={{
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2.5rem',
          background: scrolled ? 'var(--glass-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'all 0.3s ease',
          zIndex: 100,
        }}>
          {/* Left Side: Mobile Menu + Context */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setSidebarOpen(true)} className="hamburger-btn">
              <Menu size={20} />
            </button>
          </div>

          {/* Right Side: Essential Controls Only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button onClick={toggleTheme} className="theme-toggle-pill">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
            </button>
            
            <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
            
            <div style={{ transform: 'scale(1.1)' }}>
                <UserButton />
            </div>
          </div>
        </header>

        {/* --- MAIN STAGE --- */}
        <main 
          onScroll={handleScroll}
          style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2.5rem 3rem' }}
        >
          {children}
        </main>
      </div>

      <style jsx global>{`
        .hamburger-btn {
            display: none;
            background: transparent;
            border: 1px solid var(--border);
            padding: 8px;
            border-radius: 8px;
            color: var(--text-primary);
        }

        .status-badge {
            display: flex;
            alignItems: center;
            gap: 8px;
            background: var(--bg-secondary);
            padding: 4px 12px;
            border-radius: 100px;
            border: 1px solid var(--border);
            font-size: 0.65rem;
            font-weight: 800;
            color: var(--text-secondary);
            letter-spacing: 1px;
        }

        .theme-toggle-pill {
            display: flex;
            align-items: center;
            gap: 8px;
            background: transparent;
            border: 1px solid var(--border);
            padding: 6px 14px;
            border-radius: 100px;
            cursor: pointer;
            color: var(--text-primary);
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 1px;
            transition: 0.2s;
        }

        .theme-toggle-pill:hover {
            border-color: var(--accent);
            background: var(--accent-glow);
        }

        @media (max-width: 768px) {
            .hamburger-btn { display: flex; }
            .status-badge { display: none; }
            header { padding: 0 1.5rem !important; }
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}