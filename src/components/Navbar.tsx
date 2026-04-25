'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { Moon, Sun, GraduationCap, LayoutDashboard, ArrowRight, Menu, X, Activity, Globe, Zap } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

export default function Navbar() {
  const { theme, toggleTheme } = useStore();
  const { userId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 2000,
      padding: scrolled ? '1rem' : '1.5rem',
      transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <nav style={{
        width: '100%',
        maxWidth: scrolled ? '900px' : '1300px',
        height: '70px',
        background: scrolled ? 'var(--glass-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(30px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(30px)' : 'none',
        borderRadius: '24px',
        border: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: scrolled ? 'var(--card-shadow)' : 'none',
      }}>
        {/* Left: Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="neon-border" style={{ 
              background: 'var(--bg-secondary)', 
              width: '40px',
              height: '40px',
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border)'
            }}>
              <GraduationCap size={20} color="var(--accent-neon)" />
            </div>
            <span className="shimmer-text" style={{ 
              fontWeight: '900', 
              fontSize: '1.3rem', 
              letterSpacing: '-0.04em' 
            }}>
              CampusIQ
            </span>
          </Link>
        </div>

        {/* Center: System Links (Desktop) */}
        <div className="nav-desktop" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2.5rem',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: scrolled ? 1 : 0.8
        }}>
          {['Features', 'How it works', 'Pricing'].map(item => (
            <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} style={{
              fontSize: '0.8rem',
              fontWeight: '700',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              transition: '0.3s'
            }} className="nav-link-hover">
              {item}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            {theme === 'dark' ? <Zap size={18} color="var(--warning)" /> : <Activity size={18} color="var(--accent)" />}
          </button>

          {!userId ? (
            <Link href="/signup" className="btn-primary" style={{ 
              borderRadius: '14px',
              padding: '0.7rem 1.5rem',
              fontSize: '0.85rem',
              background: 'var(--accent-gradient)',
              border: 'none',
              boxShadow: '0 0 20px var(--accent-glow)'
            }}>
              GET STARTED <ArrowRight size={14} />
            </Link>
          ) : (
            <Link href="/dashboard" className="btn-primary" style={{ borderRadius: '14px', padding: '0.7rem 1.5rem' }}>
              DASHBOARD
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="nav-mobile-toggle" style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)' }}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="mobile-drawer fade-in" style={{ position: 'absolute', top: '90px', left: '1rem', right: '1rem', zIndex: 1001 }}>
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid var(--accent)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {['Features', 'How it works', 'Pricing'].map(item => (
                    <Link key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setIsOpen(false)} style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {item}
                    </Link>
                  ))}
                  <div style={{ height: '1px', background: 'var(--border)' }} />
                  {!userId ? (
                    <Link href="/signup" onClick={() => setIsOpen(false)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      GET STARTED
                    </Link>
                  ) : (
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      DASHBOARD
                    </Link>
                  )}
                </div>
            </div>
        </div>
      )}

      <style jsx>{`
        .nav-link-hover:hover {
          color: var(--accent-neon) !important;
          text-shadow: 0 0 10px var(--accent-neon);
        }
        @media (max-width: 1000px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
        }
        @media (min-width: 1001px) {
          .nav-mobile-toggle { display: none !important; }
        }
      `}</style>
    </div>
  );
}