'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, Map, BookOpen, MessageSquare, 
  AlertTriangle, Calendar, BarChart, ArrowRight, 
  Brain, Infinity, Cpu, CheckCircle2, Shield, Sparkles,
  Zap, Activity, Terminal, Command
} from 'lucide-react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', overflow: 'hidden' }}>
      <div className="noise-overlay" style={{ pointerEvents: 'none' }} />
      <div className="mesh-gradient" style={{ pointerEvents: 'none' }} />
      
      {/* --- KINETIC HERO --- */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '100px clamp(2rem, 10vw, 8rem) 80px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1400px', width: '100%', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'center' }} className="stack-on-mobile">
          
          <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>

            <h1 style={{ 
              fontSize: 'clamp(3rem, 8vw, 7rem)', 
              fontWeight: 950, 
              lineHeight: 0.9, 
              letterSpacing: '-0.06em',
              marginBottom: '40px'
            }}>
              SMART <br />
              <span className="shimmer-text">STUDENT OS</span>
            </h1>

            <p style={{ 
              maxWidth: '550px', 
              fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', 
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              marginBottom: '48px',
              borderLeft: '1px solid var(--border)',
              paddingLeft: '24px'
            }}>
              Organize your studies and build your future. The simple all-in-one tool that helps you manage classes, grades, and career goals.
            </p>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Link href="/signup" className="btn-primary" style={{ 
                padding: '24px 48px', 
                borderRadius: '8px', 
                fontSize: '1rem', 
                letterSpacing: '1px'
              }}>
                GET STARTED
              </Link>
              <Link href="#how-it-works" className="btn-secondary" style={{ 
                padding: '24px 48px', 
                borderRadius: '8px'
              }}>
                HOW IT WORKS
              </Link>
            </div>
          </div>

          {/* Neural Core Visual */}
          <div className="float-anim" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
              width: 'clamp(300px, 40vw, 500px)', 
              height: 'clamp(300px, 40vw, 500px)', 
              background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border)',
              position: 'relative'
            }}>
              <div className="scan-line" />
              <div style={{ 
                width: '60%', 
                height: '60%', 
                border: '2px dashed var(--accent)', 
                borderRadius: '50%',
                animation: 'spin 20s linear infinite',
                position: 'absolute'
              }} />
              <div style={{ 
                width: '40%', 
                height: '40%', 
                border: '1px solid var(--accent-neon)', 
                borderRadius: '50%',
                animation: 'spin 10s linear infinite reverse',
                position: 'absolute',
                opacity: 0.5
              }} />
              <Brain size={100} color="var(--accent-neon)" style={{ opacity: 0.8 }} />
              
              {/* Data nodes */}
              {[0, 72, 144, 216, 288].map((deg, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  width: '8px',
                  height: '8px',
                  background: 'var(--accent-neon)',
                  borderRadius: '50%',
                  transform: `rotate(${deg}deg) translate(200px) rotate(-${deg}deg)`,
                  opacity: 0.4
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" style={{ padding: '150px 0', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '1px', height: '100px', background: 'linear-gradient(to bottom, var(--accent), transparent)' }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', marginBottom: '80px' }} className="stack-on-mobile">
            <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, letterSpacing: '-0.04em' }}>
              SMART <br />FEATURES.
            </h2>
            <div style={{ height: '4px', flex: 1, background: 'var(--border)', marginBottom: '1.5rem' }} />
            <p style={{ maxWidth: '300px', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Tools built to help you stay ahead in your studies and career.
            </p>
          </div>

          <div className="bento-grid">
            {/* Main Module */}
            <div className="bento-card bento-main" style={{ padding: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Activity size={48} color="var(--accent-neon)" style={{ marginBottom: '32px' }} />
              <h3 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '24px' }}>STUDY PLANNER</h3>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '500px' }}>
                Your entire degree path, mapped and updated as you go. We help you find the best way to reach your goals.
              </p>
              <div style={{ marginTop: '48px', display: 'flex', gap: '32px' }}>
                <div><p style={{ fontWeight: '900', color: 'var(--accent-neon)', fontSize: '1.5rem' }}>99%</p><p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SUCCESS RATE</p></div>
                <div style={{ width: '1px', background: 'var(--border)' }} />
                <div><p style={{ fontWeight: '900', color: 'var(--accent-neon)', fontSize: '1.5rem' }}>EASY</p><p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SETUP</p></div>
              </div>
            </div>

            {/* Side Module 1 */}
            <div className="bento-card bento-small" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <MessageSquare size={32} color="var(--accent)" />
              <h4 style={{ marginTop: '32px', fontSize: '1.8rem', fontWeight: '800' }}>AI STUDY BUDDY</h4>
              <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Get instant help with your subjects and clear your doubts in seconds.</p>
            </div>

            {/* Side Module 2 */}
            <div className="bento-card bento-small" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <AlertTriangle size={32} color="var(--danger)" />
              <h4 style={{ marginTop: '32px', fontSize: '1.8rem', fontWeight: '800' }}>EXAM PREP</h4>
              <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Focus on the most important topics when you're short on time.</p>
            </div>

            {/* Wide Module */}
            <div id="how-it-works" className="bento-card bento-wide" style={{ border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
              <div style={{ padding: '40px' }}>
                <Command size={40} color="var(--accent-neon)" />
                <h4 style={{ marginTop: '24px', fontSize: '2.5rem', fontWeight: '900' }}>ALL-IN-ONE</h4>
                <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Everything you need—syllabus, schedule, and attendance—in one simple place.</p>
              </div>
              <div style={{ height: '100%', background: 'linear-gradient(45deg, var(--bg-secondary), var(--accent-glow))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <Infinity size={150} color="var(--accent)" style={{ opacity: 0.1 }} />
                <div style={{ position: 'absolute', width: '200%', height: '1px', background: 'var(--border)', transform: 'rotate(-45deg)' }} />
                <div style={{ position: 'absolute', width: '200%', height: '1px', background: 'var(--border)', transform: 'rotate(45deg)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section style={{ padding: '100px 20px', background: 'var(--bg-secondary)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '32px' }}>READY TO <span className="shimmer-text">INITIALIZE?</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '48px' }}>Join the next generation of students using AI to architect their future.</p>
          <Link href="/signup" className="btn-primary" style={{ padding: '24px 64px', fontSize: '1.1rem' }}>
            GET CAMPUS IQ
          </Link>
        </div>
      </section>


      {/* --- FOOTER --- */}
      <footer style={{ padding: '60px 20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '2px' }}>© 2026 CAMPUS IQ — A DR ORIGINALS PRODUCTION</p>
      </footer>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-auto-rows: minmax(300px, auto);
          gap: 30px;
        }
        .bento-main { grid-column: span 8; grid-row: span 2; }
        .bento-small { grid-column: span 4; }
        .bento-wide { grid-column: span 8; }
        @media (max-width: 1000px) {
          .bento-grid { grid-template-columns: 1fr; }
          .bento-main, .bento-small, .bento-wide { grid-column: span 1; grid-row: span 1; }
        }
      `}</style>
    </div>
  );
}