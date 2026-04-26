'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, Map, BookOpen, MessageSquare, 
  AlertTriangle, Calendar, BarChart, ArrowRight, 
  Brain, Infinity, Cpu, CheckCircle2, Shield, Sparkles,
  Zap, Activity, Terminal, Command, Target
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
        padding: 'clamp(100px, 15vh, 160px) clamp(1rem, 5vw, 2rem) 80px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }} className="hero-container">
          
          <div className="fade-in-up" style={{ animationDelay: '0.2s', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--accent-neon)', borderRadius: '3px' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: '900', letterSpacing: '3px', color: 'var(--accent-neon)' }}>v2.0 INITIALIZED</span>
            </div>

            <h1 style={{ 
              fontSize: 'clamp(3rem, 12vw, 6.5rem)', 
              fontWeight: 950, 
              lineHeight: 0.85, 
              letterSpacing: '-0.06em',
              marginBottom: '2rem'
            }}>
              SMART <br />
              <span className="shimmer-text">STUDENT OS</span>
            </h1>

            <p style={{ 
              maxWidth: '500px', 
              fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              marginBottom: '2.5rem',
              borderLeft: '2px solid var(--accent)',
              paddingLeft: '24px'
            }}>
              Architect your academic trajectory with AI. Manage syllabus, exams, and career roadmaps in one unified neural interface.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/signup" className="btn-primary" style={{ 
                padding: '1.25rem 2.5rem', 
                borderRadius: '12px', 
                fontSize: '0.9rem', 
                fontWeight: '900',
                letterSpacing: '1px'
              }}>
                GET STARTED
              </Link>
              <Link href="#features" className="btn-secondary" style={{ 
                padding: '1.25rem 2.5rem', 
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '900',
                border: '1px solid var(--border)'
              }}>
                SYSTEM SPECS
              </Link>
            </div>
          </div>

          {/* Neural Core Visual */}
          <div className="neural-core-container float-anim">
            <div style={{ 
              width: 'clamp(280px, 40vw, 550px)', 
              height: 'clamp(280px, 40vw, 550px)', 
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
                width: '70%', 
                height: '70%', 
                border: '1px dashed var(--accent)', 
                borderRadius: '50%',
                animation: 'spin 30s linear infinite',
                position: 'absolute'
              }} />
              <Brain size={80} color="var(--accent-neon)" style={{ opacity: 0.8 }} />
              
              {[0, 90, 180, 270].map((deg, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  width: '6px',
                  height: '6px',
                  background: 'var(--accent-neon)',
                  borderRadius: '50%',
                  transform: `rotate(${deg}deg) translate(min(180px, 35vw))`,
                  boxShadow: '0 0 15px var(--accent-neon)'
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" style={{ padding: 'clamp(80px, 15vh, 150px) 0', position: 'relative' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(1rem, 5vw, 2rem)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 10vh, 6rem)' }}>
            <h2 style={{ fontSize: 'clamp(2.2rem, 8vw, 5rem)', fontWeight: 950, letterSpacing: '-0.04em', lineHeight: 1, margin: 0 }}>
              NEURAL <span className="shimmer-text">MODULES.</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem', fontWeight: 700, letterSpacing: '2px' }}>
              ADVANCED ACADEMIC ARCHITECTURE
            </p>
          </div>

          <div className="bento-grid">
            <div className="bento-card bento-main" style={{ padding: 'clamp(1.5rem, 5vw, 4rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Zap size={40} color="var(--accent-neon)" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1 }}>AUTOPILOT ROADMAPS</h3>
              <p style={{ fontSize: 'clamp(1rem, 1.2vw, 1.1rem)', color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: 1.6 }}>
                Every semester, every subject, every deadline. Our AI generates a personalized trajectory for your entire degree.
              </p>
              <div style={{ marginTop: '2.5rem', display: 'flex', gap: '2rem' }}>
                <div><p style={{ fontWeight: '900', color: 'var(--accent-neon)', fontSize: '1.25rem', margin: 0 }}>100%</p><p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', margin: 0, fontWeight: 800 }}>PRECISION</p></div>
                <div style={{ width: '1px', background: 'var(--border)' }} />
                <div><p style={{ fontWeight: '900', color: 'var(--accent-neon)', fontSize: '1.25rem', margin: 0 }}>24/7</p><p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', margin: 0, fontWeight: 800 }}>SYNCING</p></div>
              </div>
            </div>

            <div className="bento-card bento-small" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
              <MessageSquare size={28} color="var(--accent)" />
              <h4 style={{ marginTop: '1.5rem', fontSize: '1.4rem', fontWeight: '900' }}>AI ASSISTANT</h4>
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>Context-aware tutor that understands your specific course syllabus.</p>
            </div>

            <div className="bento-card bento-small" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
              <Activity size={28} color="var(--warning)" />
              <h4 style={{ marginTop: '1.5rem', fontSize: '1.4rem', fontWeight: '900' }}>EXAM PREP</h4>
              <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>Decompose complex topics into high-yield study blocks for maximum efficiency.</p>
            </div>

            <div className="bento-card bento-wide" style={{ border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'center', padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: 'clamp(1.5rem, 5vw, 3rem)' }}>
                <Target size={32} color="var(--accent-neon)" />
                <h4 style={{ marginTop: '1.5rem', fontSize: '1.8rem', fontWeight: '900' }}>CAREER SYNC</h4>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Align your daily studies with high-growth industry roles and future skills.</p>
              </div>
              <div style={{ height: '100%', minHeight: '180px', background: 'linear-gradient(45deg, var(--bg-secondary), var(--accent-glow))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Cpu size={100} color="var(--accent)" style={{ opacity: 0.1 }} />
                <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle, transparent, var(--bg-primary))' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section style={{ padding: 'clamp(80px, 15vh, 150px) 1.5rem', background: 'var(--bg-secondary)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 950, marginBottom: '1.5rem', lineHeight: 0.9 }}>READY TO <span className="shimmer-text">UPGRADE?</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>Initialize your core OS and transcend the traditional academic experience.</p>
          <Link href="/signup" className="btn-primary" style={{ padding: '1.5rem 4rem', fontSize: '1rem', fontWeight: 900, borderRadius: '14px' }}>
            GET STARTED NOW
          </Link>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" style={{ padding: 'clamp(60px, 10vh, 120px) 1.5rem', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: 'clamp(2rem, 5vw, 4rem)', borderRadius: '32px', display: 'flex', flexDirection: 'column', gap: '3rem', border: '1px solid var(--border)' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 950, marginBottom: '1rem', lineHeight: 1 }}>GET IN <span className="shimmer-text">TOUCH.</span></h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>Whether you have a question, feedback, or a partnership inquiry, our neural links are always open.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <div style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <Terminal size={32} color="var(--accent)" style={{ marginBottom: '1rem' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '0.5rem' }}>DEVELOPER PROTOCOL</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Architected and maintained by Danish Rizwan.</p>
                <a href="https://danishrizwan.in" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'inline-flex', padding: '12px 24px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 900 }}>
                  VIEW PORTFOLIO
                </a>
              </div>

              <div style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <MessageSquare size={32} color="var(--accent-neon)" style={{ marginBottom: '1rem' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '0.5rem' }}>DIRECT UPLINK</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Inquiries regarding enterprise licensing or support.</p>
                <a href="mailto:contact@danishrizwan.in" className="btn-primary" style={{ display: 'inline-flex', padding: '12px 24px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 900 }}>
                  EMAIL CONTACT
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: '4rem 1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '3px', fontWeight: 900, marginBottom: '0.5rem' }}>
          © 2026 CAMPUS IQ — NEURAL ACADEMIC OPERATING SYSTEM
        </p>
        <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)' }}>
          MADE BY <span style={{ color: 'var(--accent)' }}>DANISH RIZWAN PVT LTD</span>
        </p>
      </footer>

      <style jsx global>{`
        .hero-container {
          display: flex;
          align-items: center;
          gap: 4rem;
        }
        .neural-core-container {
          flex: 1;
          display: flex;
          justify-content: center;
          position: relative;
        }
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-auto-rows: minmax(260px, auto);
          gap: clamp(1rem, 2vw, 2rem);
        }
        .bento-main { grid-column: span 8; grid-row: span 2; }
        .bento-small { grid-column: span 4; }
        .bento-wide { grid-column: span 8; }
        
        @media (max-width: 1024px) {
          .hero-container { flex-direction: column; text-align: center; gap: 3rem; }
          .hero-container h1 { justify-content: center; }
          .hero-container p { margin-left: auto; margin-right: auto; border-left: none; border-top: 2px solid var(--accent); padding-left: 0; padding-top: 20px; }
          .hero-container div { justify-content: center; }
          .bento-grid { grid-template-columns: repeat(2, 1fr); }
          .bento-main { grid-column: span 2; }
          .bento-small { grid-column: span 1; }
          .bento-wide { grid-column: span 2; }
        }

        @media (max-width: 650px) {
          .bento-grid { grid-template-columns: 1fr; }
          .bento-main, .bento-small, .bento-wide { grid-column: span 1; grid-row: span 1; }
          .neural-core-container { order: -1; margin-bottom: 2rem; }
        }
      `}</style>
    </div>
  );
}