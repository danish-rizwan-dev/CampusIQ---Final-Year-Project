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
      gap: '1.25rem',
      position: 'relative',
      opacity: status === 'PENDING' ? 0.7 : 1,
      transition: 'all 0.3s ease',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Semester {semesterNumber}</h3>
          {isActive && (
            <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Current Focus <Target size={14} />
            </span>
          )}
        </div>
        <div style={{ 
          padding: '0.25rem 0.75rem', 
          borderRadius: '20px', 
          fontSize: '0.7rem', 
          fontWeight: 'bold',
          background: isActive ? 'var(--accent)' : isCompleted ? 'var(--success)' : 'var(--border)',
          color: isActive || isCompleted ? 'white' : 'var(--text-secondary)'
        }}>
          {status}
        </div>
      </div>

      <div className="responsive-grid-2" style={{ gap: '1rem' }}>
        <div>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <BookOpen size={14} /> Subjects
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {subjects.slice(0, 3).map((sub, i) => (
              <li key={i} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>• {sub}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <CheckCircle2 size={14} /> Core Skills
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {skills.slice(0, 3).map((skill, i) => (
              <li key={i}>• {skill}</li>
            ))}
          </ul>
        </div>
      </div>

      {environmentSetup && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
          <button 
            onClick={() => setShowSetup(!showSetup)}
            style={{ 
              background: 'var(--accent-glow)', 
              border: 'none', 
              color: 'var(--accent)', 
              width: '100%', 
              padding: '0.6rem', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <Wrench size={16} /> {showSetup ? 'Hide Setup Guide' : 'View Environment Setup'}
          </button>

          {showSetup && (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h5 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={14} /> Tools & Software
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {environmentSetup.tools.map((tool, i) => (
                    <span key={i} title={environmentSetup.reasons[i]} style={{ background: 'var(--bg-secondary)', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', border: '1px solid var(--border)', cursor: 'help' }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ExternalLink size={14} /> Setup Resources
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {environmentSetup.resources.map((res, i) => (
                    <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      • {res.name} <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>({res.type})</span>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h5 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <BookIcon size={14} /> Recommended Books
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {environmentSetup.books.map((book, i) => (
                    <div key={i} style={{ fontSize: '0.8rem' }}>
                      <strong style={{ display: 'block' }}>{book.title}</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>by {book.author}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
        <Link 
          href={`/dashboard/roadmap/${id}`}
          className="btn-secondary" 
          style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
        >
          View Full Plan <ChevronRight size={16} />
        </Link>
        
        {isActive && onEvaluate && (
          <button 
            onClick={onEvaluate}
            className="btn-primary " 
            style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem' , justifyContent: 'center', alignItems: 'center' }}
          >
            Complete Semester
          </button>
        )}
      </div>

      <style jsx>{`
        .active-border {
          border-color: var(--accent);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
        }
      `}</style>
    </div>
  );
}
