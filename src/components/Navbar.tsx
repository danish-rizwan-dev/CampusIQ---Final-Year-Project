'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { Moon, Sun, GraduationCap, LayoutDashboard, ArrowRight, Menu, X } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

export default function Navbar() {
  const { theme, toggleTheme } = useStore();
  const { userId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      position: 'sticky',
      top: '1.5rem',
      zIndex: 1000,
      padding: '0 clamp(1rem, 5vw, 2rem)',
    }}>
      <nav className="fade-in-up" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        border: '1px solid var(--border)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '100px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ 
            background: 'var(--accent)', 
            padding: '6px', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            <GraduationCap size={22} color="#fff" />
          </div>
          <span className="gradient-text brand-text" style={{ 
            fontWeight: '900', 
            fontSize: '1.2rem', 
            letterSpacing: '-0.03em' 
          }}>
            CampusIQ
          </span>
        </Link>

        {/* Action Controls (Desktop) */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 4px' }} />

          {!userId ? (
            <>
              <Link href="/login" style={{ 
                textDecoration: 'none', 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: 'var(--text-primary)',
                padding: '0 0.5rem'
              }}>
                Log In
              </Link>
              <Link href="/signup" className="btn-primary" style={{ textDecoration: 'none', padding: '0.6rem 1.4rem', fontSize: '0.9rem', gap: '8px' }}>
                Get Started <ArrowRight size={16} />
              </Link>
            </>
          ) : (
            <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none', padding: '0.6rem 1.4rem', fontSize: '0.9rem', gap: '8px' }}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="nav-mobile-toggle">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="mobile-drawer fade-in">
            <div className="mobile-drawer-content glass-card">
                <button onClick={toggleTheme} className="mobile-drawer-item" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }} />
                {!userId ? (
                    <>
                        <Link href="/login" onClick={() => setIsOpen(false)} className="mobile-drawer-item">Log In</Link>
                        <Link href="/signup" onClick={() => setIsOpen(false)} className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                            Get Started <ArrowRight size={18} />
                        </Link>
                    </>
                ) : (
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="btn-primary" style={{ width: '100%' }}>
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                )}
            </div>
        </div>
      )}

      <style jsx global>{`
        .nav-mobile-toggle {
            display: none;
            background: transparent;
            border: none;
            color: var(--text-primary);
            cursor: pointer;
            padding: 8px;
        }

        .theme-toggle-btn {
            display: flex; 
            align-items: center; 
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid var(--border);
            background: transparent;
            color: var(--text-primary);
            cursor: pointer;
            transition: 0.3s;
        }

        .theme-toggle-btn:hover {
            border-color: var(--accent);
            background: var(--accent-glow);
        }

        .mobile-drawer {
            position: absolute;
            top: 5.5rem;
            left: 1rem;
            right: 1rem;
            z-index: 1001;
        }

        .mobile-drawer-content {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            border-radius: 24px;
        }

        .mobile-drawer-item {
            display: flex;
            align-items: center;
            padding: 1rem;
            border-radius: 12px;
            color: var(--text-primary);
            text-decoration: none;
            font-weight: 600;
            background: transparent;
            border: none;
            cursor: pointer;
            transition: 0.2s;
        }
        
        .mobile-drawer-item:hover {
            background: var(--bg-primary);
            color: var(--accent);
        }

        @media (max-width: 768px) {
            .nav-desktop { display: none; }
            .nav-mobile-toggle { display: flex; }
            .brand-text { font-size: 1.1rem !important; }
        }

        @media (max-width: 480px) {
            .brand-text { display: none; }
        }
      `}</style>
    </div>
  );
}