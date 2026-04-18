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
      growthTrajectory: string;
      perks: string[];
      whatToStudy?: string;
      commonTools?: string[];
      softSkills?: string[];
      careerLadder: { role: string; years: string; salary: string }[];
      companiesInIndia: { name: string; type: string; salaryRange: string }[];
      globalMarket?: { country: string; demand: string; visaContext: string }[];
    };
  };
  targetCourse: string;
  durationYears: number;
  onBack: () => void;
}

export default function CareerResultDetail({ career, targetCourse, durationYears, onBack }: CareerResultDetailProps) {
  return (
    <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '3rem' }}>
      <button 
        onClick={onBack}
        style={{ 
          background: 'none', border: 'none', color: 'var(--text-secondary)', 
          display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
          padding: 0, fontSize: '0.9rem', width: 'fit-content'
        }}
        className="hover-opacity"
      >
        <ChevronLeft size={18} /> Back to Recommendations
      </button>

      {/* Header Section */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <h1 className="gradient-text" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0, lineHeight: 1.1 }}>{career.title}</h1>
            <span style={{ 
              padding: '0.4rem 1rem', borderRadius: '24px', background: 'var(--success)', 
              color: 'white', fontSize: '0.85rem', fontWeight: '800', boxShadow: '0 4px 12px var(--success-glow)'
            }}>
              {career.confidence}% Match
            </span>
          </div>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, maxWidth: '800px' }}>{career.details.summary}</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '1.5rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', padding: '1rem', borderRadius: '16px' }}>
            <DollarSign size={28} />
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg. Package (India)</p>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>{career.details.averageSalary}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '1.5rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.12)', color: 'var(--accent)', padding: '1rem', borderRadius: '16px' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Market Growth</p>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>{career.details.growthPotential}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '1.5rem' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6', padding: '1rem', borderRadius: '16px' }}>
            <Briefcase size={28} />
          </div>
          <div>
            <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Annual Vacancies</p>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>{career.details.jobVacanciesPerYear}</h3>
          </div>
        </div>
      </div>

      <div className="responsive-grid-wide" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Growth Narrative & Reasoning */}
          <div className="glass-card" style={{ border: '1px solid var(--accent)', background: 'var(--accent-glow)', padding: '2rem' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.4rem' }}>
              <TrendingUp size={24} /> 5-Year Growth Outlook
            </h3>
            <p style={{ margin: 0, lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                {career.details.growthTrajectory || 'Steady growth expected in the evolving Indian tech market.'}
            </p>
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Info size={18} /> Why this matches you?
                </h4>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{career.reasoning}</p>
            </div>
          </div>

          {/* Career Ladder Section */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.4rem' }}>
              <Star size={24} color="var(--warning)" /> The Career Progression Ladder
            </h3>
            <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px dashed var(--border)', marginLeft: '1rem' }}>
              {(career.details.careerLadder || []).map((step, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: '2rem' }}>
                   <div style={{ 
                        position: 'absolute', left: '-2.7rem', top: '0', width: '20px', height: '20px', 
                        borderRadius: '50%', background: i === 0 ? 'var(--accent)' : 'var(--bg-secondary)', 
                        border: '4px solid var(--bg-primary)', boxShadow: i === 0 ? '0 0 10px var(--accent-glow)' : 'none'
                   }} />
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>{step.role}</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent)', fontWeight: '700' }}>Exp: {step.years} Years</p>
                        </div>
                        <div style={{ textAlign: 'right', background: 'var(--bg-secondary)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '700' }}>
                            {step.salary}
                        </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack & Soft Skills */}
          <div className="responsive-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.2rem' }}>
                <Briefcase size={22} color="var(--accent)" /> Tech Stack & Tools
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {(career.details.commonTools || []).map((tool, i) => (
                  <span key={i} style={{ padding: '0.5rem 0.8rem', background: 'var(--bg-secondary)', borderRadius: '10px', fontSize: '0.85rem', border: '1px solid var(--border)', fontWeight: '600' }}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.2rem' }}>
                <Star size={22} color="var(--warning)" /> Social & Soft Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {(career.details.softSkills || []).map((skill, i) => (
                  <span key={i} style={{ padding: '0.5rem 0.8rem', background: 'rgba(245, 158, 11, 0.05)', color: '#f59e0b', borderRadius: '10px', fontSize: '0.85rem', border: '1px solid rgba(245, 158, 11, 0.2)', fontWeight: '600' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Top Companies Section */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.2rem' }}>
              <Briefcase size={22} color="var(--accent)" /> Top Employers in India
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(career.details.companiesInIndia || []).map((company, i) => (
                <div key={i} style={{ padding: '1rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '800', fontSize: '1rem' }}>{company.name}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.6, padding: '0.2rem 0.5rem', border: '1px solid var(--border)', borderRadius: '4px' }}>{company.type}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: '700' }}>{company.salaryRange} p.a.</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'center' }}>* Estimates based on 2024-25 market data</p>
          </div>

          {/* Action Section */}
          <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--accent)' }}>
            <h4 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Lock In Your Future?</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>Set this as your target career to generate a specialized academic roadmap.</p>
            <button 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '1rem', borderRadius: '16px', fontSize: '1rem' }} 
              onClick={() => window.location.href=`/dashboard/roadmap?target=${encodeURIComponent(career.title)}&course=${encodeURIComponent(targetCourse)}&duration=${durationYears}`}
            >
              Generate Specialized Roadmap
            </button>
          </div>

          {/* Global Markets Section */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.2rem' }}>
              <TrendingUp size={22} color="var(--accent)" /> Global Horizons
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(career.details.globalMarket || []).map((market, i) => (
                <div key={i} style={{ padding: '1rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: '800', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                       <MapPin size={16} color="var(--danger)" /> {market.country}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: market.demand === 'High' ? 'var(--success)' : 'var(--accent)', fontWeight: '800' }}>{market.demand} Demand</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{market.visaContext}</div>
                </div>
              ))}
            </div>
            {!career.details.globalMarket?.length && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    International migration data pending for this path.
                </div>
            )}
          </div>
        </aside>
      </div>

      {/* Study Strategy - Full Width */}
      <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Info size={28} color="var(--accent)" /> Professional Study Strategy
          </h2>
          <div style={{ lineHeight: 1.8, fontSize: '1.1rem', color: 'var(--text-primary)', opacity: 0.9 }}>
              {career.details.whatToStudy || 'A specialized study plan is being architected based on your interests and core subjects.'}
          </div>
      </div>

      <style jsx>{`
        .responsive-grid-wide {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 900px) {
          .responsive-grid-wide {
            grid-template-columns: 1fr;
          }
        }
        .hover-opacity:hover { opacity: 0.8; }
      `}</style>
    </div>
  );
}
