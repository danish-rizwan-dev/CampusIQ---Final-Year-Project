'use client';

import Navbar from "@/components/Navbar";
import { useStore } from "@/store/useStore";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: isDark 
        ? 'radial-gradient(circle at 50% 50%, #0a0a0c 0%, #000 100%)' 
        : 'radial-gradient(circle at 50% 50%, #f8fafc 0%, #e2e8f0 100%)',
      color: isDark ? '#fff' : '#0f172a',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.5s ease'
    }}>
      {/* Background Orbs */}
      <div style={{ 
        position: 'absolute', top: '10%', left: '10%', width: '40vw', height: '40vw', 
        background: isDark ? 'var(--accent-glow)' : 'rgba(59, 130, 246, 0.1)', 
        borderRadius: '50%', filter: 'blur(120px)', opacity: isDark ? 0.1 : 0.5, pointerEvents: 'none' 
      }} />
      <div style={{ 
        position: 'absolute', bottom: '10%', right: '10%', width: '30vw', height: '30vw', 
        background: isDark ? 'var(--accent-secondary)' : 'rgba(139, 92, 246, 0.05)', 
        borderRadius: '50%', filter: 'blur(100px)', opacity: isDark ? 0.05 : 0.4, pointerEvents: 'none' 
      }} />
      
      <Navbar />
      
      <main style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem',
        paddingTop: '100px', 
        position: 'relative',
        zIndex: 1
      }}>
        <div className="fade-in" style={{ width: '100%', maxWidth: '1200px', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '4rem' }}>
          
          {/* Brand/Marketing Side */}
          <div className="hide-on-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: isDark ? '#fff' : '#1e293b' }}>
            <div style={{ background: isDark ? 'var(--accent-glow)' : 'rgba(59, 130, 246, 0.1)', width: 'fit-content', padding: '0.5rem 1.2rem', borderRadius: '100px', border: `1px solid ${isDark ? 'var(--accent)' : 'rgba(59, 130, 246, 0.3)'}`, color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '900', letterSpacing: '2px' }}>
              CAMPUS IQ v2.0
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: 950, lineHeight: 0.9, letterSpacing: '-0.05em', margin: 0, color: isDark ? '#fff' : '#0f172a' }}>
              Master Your <span className="gradient-text">Future</span>.
            </h1>
            <p style={{ fontSize: '1.2rem', color: isDark ? '#fff' : '#475569', lineHeight: 1.6, maxWidth: '450px', opacity: isDark ? 0.9 : 1 }}>
              The AI-powered academic cockpit for high-performing students. Sync your syllabus, generate roadmaps, and conquer mock exams.
            </p>
            
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
               <div>
                  <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a' }}>10x</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: isDark ? '#fff' : '#64748b', opacity: isDark ? 0.7 : 1 }}>Faster Revision</p>
               </div>
               <div style={{ width: '1px', background: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(15, 23, 42, 0.1)' }} />
               <div>
                  <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: isDark ? '#fff' : '#0f172a' }}>AI</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: isDark ? '#fff' : '#64748b', opacity: isDark ? 0.7 : 1 }}>Powered Insights</p>
               </div>
            </div>
          </div>

          {/* Form Side */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {children}
          </div>

        </div>
      </main>

      <style jsx global>{`
        @media (max-width: 900px) {
          .hide-on-mobile { display: none !important; }
          .fade-in { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
