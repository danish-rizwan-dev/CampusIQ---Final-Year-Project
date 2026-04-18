'use client';

import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { Moon, Sun, GraduationCap, LayoutDashboard, ArrowRight } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

export default function Navbar() {
  const { theme, toggleTheme } = useStore();
  const { userId } = useAuth();

  return (
    <div style={{
      position: 'sticky',
      top: '1.5rem',
      zIndex: 1000,
      padding: '0 2rem',
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
        borderRadius: '100px', // Fully rounded "Pill" shape
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
          <span className="gradient-text" style={{ 
            fontWeight: '900', 
            fontSize: '1.2rem', 
            letterSpacing: '-0.03em' 
          }}>
            CampusIQ
          </span>
        </Link>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          
          {/* Theme Toggle (Icon Only for a cleaner look) */}
          <button 
            onClick={toggleTheme} 
            className="btn-secondary" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              padding: 0,
              borderRadius: '50%',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
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
              <Link href="/signup" className="btn-primary" style={{ 
                textDecoration: 'none', 
                padding: '0.6rem 1.4rem',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Get Started <ArrowRight size={16} />
              </Link>
            </>
          ) : (
            <Link href="/dashboard" className="btn-primary" style={{ 
              textDecoration: 'none', 
              padding: '0.6rem 1.4rem',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          )}
        </div>
      </nav>
      <style jsx global>{`
        @media (max-width: 640px) {
          nav { padding: 0 1rem !important; }
        }
      `}</style>
    </div>
  );
}