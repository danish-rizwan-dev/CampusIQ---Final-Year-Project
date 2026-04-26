import { ChevronRight, Calendar, BookOpen, Target, CheckCircle2, Info, ExternalLink, Wrench, Book as BookIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface SemesterCardProps {
  id: string;
  semesterNumber: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING';
  subjects: string[];
  skills: string[];
  environmentSetup?: {
    tools: string[];
    reasons: string[];
    resources: { name: string; url: string; type: string }[];
    books: { title: string; author: string; description: string }[];
  };
  onEvaluate?: () => void;
}

export default function SemesterCard({ id, semesterNumber, status, subjects, skills, environmentSetup, onEvaluate }: SemesterCardProps) {
  const [showSetup, setShowSetup] = useState(false);
  const isCompleted = status === 'COMPLETED';
  const isActive = status === 'ACTIVE';

  return (
    <div className={`glass-card ${isActive ? 'active-border' : ''}`} style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 'clamp(1rem, 3vw, 1.25rem)',
      position: 'relative',
      opacity: status === 'PENDING' ? 0.7 : 1,
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      padding: 'clamp(1.25rem, 4vw, 1.5rem)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h3 style={{ margin: 0, fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: '800' }}>Semester {semesterNumber}</h3>
          {isActive && (
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Current Focus <Target size={12} />
            </span>
          )}
        </div>
        <div style={{ 
          padding: '0.3rem 0.75rem', 
          borderRadius: '12px', 
          fontSize: '0.65rem', 
          fontWeight: '900',
          background: isActive ? 'var(--accent)' : isCompleted ? 'var(--success)' : 'var(--bg-secondary)',
          color: isActive || isCompleted ? 'white' : 'var(--text-muted)',
          letterSpacing: '1px',
          flexShrink: 0
        }}>
          {status}
        </div>
      </div>

      <div className="responsive-grid-2" style={{ gap: '1rem' }}>
        <div>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '800', letterSpacing: '0.5px' }}>
            <BookOpen size={14} /> SUBJECTS
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {subjects.slice(0, 3).map((sub, i) => (
              <li key={i} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>• {sub}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '800', letterSpacing: '0.5px' }}>
            <CheckCircle2 size={14} /> CORE SKILLS
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {skills.slice(0, 3).map((skill, i) => (
              <li key={i} style={{ color: 'var(--text-primary)' }}>• {skill}</li>
            ))}
          </ul>
        </div>
      </div>

      {environmentSetup && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.25rem' }}>
          <button 
            onClick={() => setShowSetup(!showSetup)}
            style={{ 
              background: 'var(--accent-glow)', 
              border: '1px solid var(--accent-glow)', 
              color: 'var(--accent)', 
              width: '100%', 
              padding: '0.7rem', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: '800',
              cursor: 'pointer',
              transition: '0.3s'
            }}
          >
            <Wrench size={16} /> {showSetup ? 'HIDE SETUP GUIDE' : 'VIEW SETUP GUIDE'}
          </button>

          {showSetup && (
            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h5 style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900', letterSpacing: '1px' }}>
                  <Info size={14} /> TOOLS & SOFTWARE
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {environmentSetup.tools.map((tool, i) => (
                    <span key={i} title={environmentSetup.reasons[i]} style={{ background: 'var(--bg-secondary)', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.7rem', border: '1px solid var(--border)', cursor: 'help', fontWeight: '600' }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900', letterSpacing: '1px' }}>
                  <ExternalLink size={14} /> RESOURCES
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {environmentSetup.resources.map((res, i) => (
                    <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                      • {res.name} <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>({res.type})</span>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h5 style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900', letterSpacing: '1px' }}>
                  <BookIcon size={14} /> BOOKS
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {environmentSetup.books.map((book, i) => (
                    <div key={i} style={{ fontSize: '0.8rem' }}>
                      <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{book.title}</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>by {book.author}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="stack-on-mobile" style={{ gap: '0.75rem', marginTop: '0.5rem' }}>
        <Link 
          href={`/dashboard/roadmap/${id}`}
          className="btn-secondary" 
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', padding: '0.8rem 0.5rem', borderRadius: '12px' }}
        >
          VIEW FULL PLAN <ChevronRight size={16} />
        </Link>
        
        {isActive && onEvaluate && (
          <button 
            onClick={onEvaluate}
            className="btn-primary" 
            style={{ flex: 1, fontSize: '0.8rem', padding: '0.8rem 0.5rem', borderRadius: '12px' }}
          >
            COMPLETE SEMESTER
          </button>
        )}
      </div>

      <style jsx>{`
        .active-border {
          border-color: var(--accent);
          box-shadow: 0 0 25px var(--accent-glow);
        }
      `}</style>
    </div>
  );
}
