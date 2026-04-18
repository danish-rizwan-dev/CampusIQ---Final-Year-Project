'use client';

import Link from 'next/link';
import { 
  GraduationCap, Map, BookOpen, MessageSquare, 
  AlertTriangle, Calendar, BarChart, ArrowRight, 
  Brain, Infinity, Cpu, CheckCircle2, Shield, Sparkles
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="mesh-gradient" />

      {/* --- HERO SECTION --- */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 20px' }}>
        <div className="fade-in-up" style={{ 
          background: 'var(--accent-glow)', 
          padding: '8px 20px', 
          borderRadius: '100px', 
          border: '1px solid var(--accent)',
          fontSize: '0.75rem',
          letterSpacing: '2px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: 'var(--accent)',
          fontWeight: '700'
        }}>
          <Cpu size={14} /> A DR ORIGINALS PRODUCTION
        </div>

        <h1 className="fade-in-up" style={{ 
          fontSize: 'clamp(3.5rem, 12vw, 8.5rem)', 
          fontWeight: 900, 
          lineHeight: 0.85, 
          letterSpacing: '-0.06em', 
          color: 'var(--text-primary)' 
        }}>
          Master Your <br />
          <span className="gradient-text">Academic Fate.</span>
        </h1>
        
        <p className="fade-in-up" style={{ 
          maxWidth: '650px', 
          fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', 
          color: 'var(--text-secondary)', 
          marginTop: '32px', 
          lineHeight: 1.6 
        }}>
          The world’s first autonomous student operating system. We don't just track your grades; we architect your career from Semester 1 to CEO.
        </p>

        <div className="fade-in-up" style={{ marginTop: '48px', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/signup" className="btn-primary" style={{ padding: '20px 45px', borderRadius: '100px', fontSize: '1.1rem', textDecoration: 'none' }}>
            Initialize Path
          </Link>
          <Link href="#features" className="btn-secondary" style={{ padding: '20px 45px', borderRadius: '100px', fontSize: '1.1rem', textDecoration: 'none' }}>
            System Specs
          </Link>
        </div>
      </section>

      {/* --- BENTO MODULES --- */}
      <section id="features" style={{ maxWidth: '1300px', margin: '0 auto', padding: '100px 20px' }}>
        <div style={{ marginBottom: '80px', textAlign: 'left' }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>Engine Modules</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Precision-engineered tools for high-velocity learning.</p>
        </div>
        
        <div className="bento-grid">
          
          <div className="bento-card bento-main" style={{ padding: '60px' }}>
            <div style={{ color: 'var(--accent)', marginBottom: '30px' }}><Map size={48} /></div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--text-primary)', lineHeight: 1.1 }}>The 8-Semester <br />Autopilot</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '480px', marginTop: '24px' }}>
              A living roadmap that re-calibrates every 24 hours based on your focus, energy levels, and upcoming deadlines.
            </p>
            <div style={{ marginTop: '50px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {['Curriculum Mapping', 'Skill-Gap Analysis', 'Credit Tracking'].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                        <CheckCircle2 size={18} color="var(--success)" /> {item}
                    </div>
                ))}
            </div>
          </div>

          <div className="bento-card bento-small" style={{ padding: '40px', background: 'var(--bg-secondary)' }}>
            <MessageSquare size={32} color="#a855f7" />
            <h3 style={{ marginTop: '24px', fontSize: '1.8rem', color: 'var(--text-primary)' }}>Cognitive Tutor</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '16px', lineHeight: 1.6 }}>Your AI tutor learns your weak spots and crafts custom drills to fix them.</p>
          </div>

          <div className="bento-card bento-small" style={{ padding: '40px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <AlertTriangle size={32} color="var(--danger)" />
            <h3 style={{ marginTop: '24px', fontSize: '1.8rem', color: 'var(--text-primary)' }}>Panic Protocol</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '16px', lineHeight: 1.6 }}>Emergency triage for exams. Focus only on the high-yield topics that matter.</p>
          </div>

          <div className="bento-card bento-wide" style={{ padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ maxWidth: '450px' }}>
                <Brain size={40} color="var(--accent)" />
                <h3 style={{ fontSize: '2.2rem', marginTop: '24px', color: 'var(--text-primary)' }}>Career Synthesis</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '12px' }}>Bridge the gap between passing exams and landing high-tier offers.</p>
            </div>
            <div className="float-anim" style={{ opacity: 0.2 }}>
                <Infinity size={120} color="var(--accent)" />
            </div>
          </div>
        </div>
      </section>

      {/* --- LONG SCROLL FEATURE SECTION --- */}
      <section style={{ padding: '120px 20px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>One OS. Total Control.</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginTop: '24px' }}>
                CampusIQ replaces fragmented tools with a single neural interface designed for the high-achieving student.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '60px', marginTop: '100px' }}>
                {[
                    { icon: <Calendar />, title: "Time Sync", desc: "Adaptive timetable that breathes with you." },
                    { icon: <BookOpen />, title: "Syllabus AI", desc: "Instant extraction of key topics from PDFs." },
                    { icon: <Shield />, title: "Attendance Guard", desc: "Predictive alerts before you hit the danger zone." }
                ].map((s, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ color: 'var(--accent)', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                        <h4 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: '700' }}>{s.title}</h4>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '12px', lineHeight: 1.6 }}>{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- FOOTER & SIGNATURE --- */}
      <footer style={{ padding: '100px 20px 60px', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid var(--border)', paddingTop: '60px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
                <GraduationCap size={28} color="var(--accent)" />
                <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)' }}>CampusIQ</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                Redefining academic potential through autonomous AI. Built for the thinkers and the builders.
            </p>
            <div style={{ marginTop: '40px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                © 2026 CampusIQ • All Systems Operational
            </div>
        </div>

        {/* HIDDEN SIGNATURE IN THE CORNER */}
        <div 
          className="signature-tag"
          style={{ 
            position: 'absolute', 
            bottom: '20px', 
            right: '30px', 
            opacity: 0.3,
            transition: '0.3s ease',
            cursor: 'default',
            textAlign: 'right'
          }}
        >
            <p style={{ fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--text-secondary)', margin: 0 }}>CODE ARCHITECT</p>
            <p style={{ 
              fontSize: '1.1rem', 
              fontWeight: '700', 
              color: 'var(--text-primary)', 
              margin: 0,
              fontFamily: 'serif' 
            }}>
              Danish Rizwan
            </p>
        </div>
      </footer>

      {/* --- FLOATING HUD --- */}
      <div style={{ 
        position: 'fixed', 
        bottom: '30px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        background: 'var(--glass-bg)', 
        backdropFilter: 'blur(20px)', 
        padding: '12px 30px', 
        borderRadius: '100px', 
        border: '1px solid var(--border)',
        display: 'flex',
        gap: '30px',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '700' }}>SYSTEM STABLE</span>
        </div>
        <Link href="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '900', fontSize: '0.85rem', letterSpacing: '1px' }}>INITIALIZE OS —&gt;</Link>
      </div>

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .signature-tag:hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
}