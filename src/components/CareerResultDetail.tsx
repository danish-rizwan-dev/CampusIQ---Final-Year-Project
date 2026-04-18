'use client';

import { TrendingUp, DollarSign, MapPin, Briefcase, Star, Info, ChevronLeft } from 'lucide-react';

interface CareerResultDetailProps {
  career: {
    title: string;
    confidence: number;
    reasoning: string;
    skillGap: string;
    details: {
      summary: string;
      averageSalary: string;
      topCountries: string[];
      jobVacanciesPerYear: string;
      growthPotential: string;
      perks: string[];
    };
  };
  onBack: () => void;
}

export default function CareerResultDetail({ career, onBack }: CareerResultDetailProps) {
  return (
    <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <button 
        onClick={onBack}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--text-secondary)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          cursor: 'pointer',
          padding: 0,
          fontSize: '0.9rem'
        }}
      >
        <ChevronLeft size={18} /> Back to Recommendations
      </button>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: 0 }}>{career.title}</h1>
            <span style={{ 
              padding: '0.2rem 0.8rem', 
              borderRadius: '20px', 
              background: 'var(--success)', 
              color: 'white', 
              fontSize: '0.8rem', 
              fontWeight: 'bold' 
            }}>
              {career.confidence}% Match
            </span>
          </div>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', margin: 0 }}>{career.details.summary}</p>
        </div>
      </header>

      <div className="responsive-grid">
        <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '16px' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Avg. Salary</p>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{career.details.averageSalary}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', padding: '1rem', borderRadius: '16px' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Growth Potential</p>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{career.details.growthPotential}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '1rem', borderRadius: '16px' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Global Vacancies</p>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{career.details.jobVacanciesPerYear}</h3>
          </div>
        </div>
      </div>

      <div className="responsive-grid-wide">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={20} color="var(--warning)" /> Top Perks & Benefits
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {career.details.perks.map((perk, i) => (
                <span key={i} style={{ background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.9rem', border: '1px solid var(--border)' }}>
                  {perk}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={20} /> AI Reasoning
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--text-primary)' }}>{career.reasoning}</p>
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
              <strong>The Skill Gap:</strong>
              <p style={{ margin: '0.5rem 0 0', opacity: 0.8 }}>{career.skillGap}</p>
            </div>
          </div>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} color="var(--danger)" /> Top Countries
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {career.details.topCountries.map((country, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
                  {country}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card" style={{ textAlign: 'center' }}>
            <h4 style={{ marginBottom: '1rem' }}>Ready to start?</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Set this as your target career to generate a specialized roadmap.</p>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => window.location.href=`/dashboard/roadmap?target=${encodeURIComponent(career.title)}`}>
              Generate Roadmap
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
