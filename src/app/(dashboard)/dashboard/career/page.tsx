'use client';

import { useState, useEffect } from 'react';
import { 
  Brain, Sparkles, Loader2, Target, Briefcase, 
  MapPin, DollarSign, TrendingUp, Globe, Award,
  ChevronRight, ArrowLeft, CheckCircle2, Info, RefreshCw
} from 'lucide-react';
import CareerResultDetail from '@/components/CareerResultDetail';

export default function CareerAssessmentPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [results, setResults] = useState<any[] | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    skills: '',
    interests: '',
    subjects: '',
    salaryExpectation: 'High Income',
    locationPreference: 'India',
    workEnvironment: 'Hybrid',
    interestsDetailed: '',
    projectPreference: 'Technical/Analytical'
  });

  useEffect(() => {
    fetchSavedResult();
  }, []);

  const fetchSavedResult = async () => {
    setInitialLoading(true);
    try {
      const res = await fetch('/api/user/me');
      const data = await res.json();
      if (data.user?.careerProfile?.fullAssessmentResult) {
        setResults(data.user.careerProfile.fullAssessmentResult.recommendations);
        setStep(4);
      }
    } catch (e) {
      console.error(e);
    }
    setInitialLoading(false);
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/career/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.recommendations) {
        setResults(data.recommendations);
        setStep(4); // Results step
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (initialLoading) {
    return (
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={40} className="spin" color="var(--accent)" />
        <p style={{ color: 'var(--text-secondary)' }}>Synchronizing Career Profile...</p>
      </div>
    );
  }

  if (selectedCareer) {
    return (
      <CareerResultDetail 
        career={selectedCareer} 
        onBack={() => setSelectedCareer(null)} 
      />
    );
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Foundations</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Let's start with your current strengths and academic background.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="input-label">Core Skills</label>
                <textarea 
                  className="input-field" 
                  style={{ minHeight: '100px', paddingTop: '12px' }}
                  placeholder="e.g. JavaScript, Public Speaking, Graphic Design, Mathematics..."
                  value={formData.skills}
                  onChange={e => setFormData({...formData, skills: e.target.value})}
                />
              </div>
              <div>
                <label className="input-label">Favorite Subjects</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Physics, Economics, Computer Science..."
                  value={formData.subjects}
                  onChange={e => setFormData({...formData, subjects: e.target.value})}
                />
              </div>
              <button onClick={handleNext} className="btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}>
                Continue to Interests <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Deep Interests</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Tell us what truly excites you and how you like to work.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="input-label">What do you enjoy doing in your free time?</label>
                <textarea 
                  className="input-field" 
                  style={{ minHeight: '100px', paddingTop: '12px' }}
                  placeholder="e.g. Solving puzzles, building apps, volunteering, writing stories..."
                  value={formData.interestsDetailed}
                  onChange={e => setFormData({...formData, interestsDetailed: e.target.value})}
                />
              </div>
              <div>
                <label className="input-label">Project Preference</label>
                <select className="input-field" value={formData.projectPreference} onChange={e => setFormData({...formData, projectPreference: e.target.value})}>
                  <option>Technical/Analytical (Data, Code, Logic)</option>
                  <option>Creative/Design (Art, UI/UX, Storytelling)</option>
                  <option>Social/Leadership (Management, Teaching, HR)</option>
                  <option>Hands-on/Physical (Engineering, Lab work)</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={handlePrev} className="btn-secondary" style={{ flex: 1, padding: '1rem' }}>Back</button>
                <button onClick={handleNext} className="btn-primary" style={{ flex: 2, padding: '1rem' }}>
                  Lifestyle Preferences <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Lifestyle & Goals</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Finalizing your career environment and financial expectations.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="input-label">Salary Goal</label>
                  <select className="input-field" value={formData.salaryExpectation} onChange={e => setFormData({...formData, salaryExpectation: e.target.value})}>
                    <option>Standard</option>
                    <option>Above Average</option>
                    <option>High Income</option>
                    <option>Ultra High / Executive</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Location</label>
                  <select className="input-field" value={formData.locationPreference} onChange={e => setFormData({...formData, locationPreference: e.target.value})}>
                    <option>India</option>
                    <option>Abroad</option>
                    <option>Global (Hybrid)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="input-label">Preferred Work Setting</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {['Remote', 'Office', 'Hybrid'].map(m => (
                    <button 
                      key={m} 
                      onClick={() => setFormData({...formData, workEnvironment: m})}
                      className={formData.workEnvironment === m ? 'btn-primary' : 'btn-secondary'}
                      style={{ padding: '0.8rem', fontSize: '0.85rem' }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={handlePrev} className="btn-secondary" style={{ flex: 1, padding: '1rem' }}>Back</button>
                <button onClick={handleAnalyze} disabled={loading} className="btn-primary" style={{ flex: 2, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                  {loading ? (
                    <><Loader2 size={18} className="spin" /> Generating Assessment...</>
                  ) : (
                    <><Sparkles size={18} /> Reveal My Future</>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="fade-in">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Recommended Paths</h1>
              <p style={{ color: 'var(--text-secondary)' }}>We've analyzed your profile. Click a career card for a deep dive into salary, growth, and setup guides.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {results?.map((career, idx) => (
                <div key={idx} className="glass-card fade-in" style={{ padding: '1.5rem', cursor: 'pointer', animationDelay: `${idx * 0.1}s` }} onClick={() => setSelectedCareer(career)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div style={{ width: '50px', height: '50px', background: 'var(--accent-glow)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Briefcase size={24} color="var(--accent)" />
                    </div>
                    <div style={{ background: 'var(--success)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      {career.confidence}% Match
                    </div>
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>{career.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {career.reasoning}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    <span>Deep Dive Analysis</span>
                    <ChevronRight size={18} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '4rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Want to try a different profile or update your skills?</p>
              <button 
                onClick={() => {
                  setStep(1);
                  setResults(null);
                }} 
                className="btn-secondary" 
                style={{ padding: '0.8rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <RefreshCw size={18} /> Re-Take Full Assessment
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '5rem' }}>
      {step < 4 && (
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'var(--accent-glow)', borderRadius: '24px', marginBottom: '1.5rem' }}>
            <Brain size={48} color="var(--accent)" />
          </div>
          <h1 className="gradient-text" style={{ fontSize: ' clamp(2rem, 5vw, 3rem)', margin: '0 0 1rem' }}>AI Career Assessment</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>Navigate your future with precision. Our AI maps your skills and interests to high-growth career paths.</p>
          
          {/* Progress Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2rem' }}>
            {[1, 2, 3].map(s => (
              <div 
                key={s} 
                style={{ 
                  width: '60px', height: '6px', borderRadius: '3px', 
                  background: s <= step ? 'var(--accent)' : 'var(--border)',
                  transition: '0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }} 
              />
            ))}
          </div>
        </div>
      )}

      {step < 4 && (
        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '2.5rem', borderRadius: '32px' }}>
          {renderStep()}
        </div>
      )}

      {step === 4 && renderStep()}

      <style jsx>{`
        .input-label { display: block; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem; font-weight: 600; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
