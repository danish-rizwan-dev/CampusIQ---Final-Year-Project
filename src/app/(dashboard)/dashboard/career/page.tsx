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
    targetCourse: '',
    durationYears: 3,
    skills: '',
    interests: '',
    subjects: '',
    salaryExpectation: 'Above Average',
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
        setStep(5); // Show results
      }
      if (data.user?.targetCourse) {
        setFormData(prev => ({ 
            ...prev, 
            targetCourse: data.user.targetCourse,
            durationYears: data.user.durationYears || 3
        }));
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
        setStep(5); // Results step
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
        targetCourse={formData.targetCourse}
        durationYears={formData.durationYears}
        onBack={() => setSelectedCareer(null)} 
      />
    );
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={24} color="var(--accent)" /> Academic Origin
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Tell us about your current educational journey to better align your career paths.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <label className="input-label">Academic Course / Degree</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required
                  placeholder="e.g. BCA, B.Tech Computer Science, B.Sc IT"
                  value={formData.targetCourse}
                  onChange={e => setFormData({...formData, targetCourse: e.target.value})}
                />
              </div>
              <div>
                <label className="input-label">Degree Duration</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(y => (
                    <button 
                      key={y}
                      type="button"
                      onClick={() => setFormData({...formData, durationYears: y})}
                      className={formData.durationYears === y ? 'btn-primary' : 'btn-secondary'}
                      style={{ padding: '0.8rem 0', fontSize: '0.9rem' }}
                    >
                      {y}Y
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.75rem', textAlign: 'center' }}>
                    This will determine the length of your academic roadmap.
                </p>
              </div>
              <button 
                onClick={handleNext} 
                disabled={!formData.targetCourse}
                className="btn-primary" 
                style={{ padding: '1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                Let's Assess Skills <ChevronRight size={18} />
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={24} color="var(--accent)" /> Skills & Subjects
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>We'll use your current strengths to find high-compatibility fields.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="input-label">Core Technical/Soft Skills</label>
                <textarea 
                  className="input-field" 
                  style={{ minHeight: '100px', paddingTop: '12px' }}
                  placeholder="e.g. JavaScript, Python, UI Design, Project Management..."
                  value={formData.skills}
                  onChange={e => setFormData({...formData, skills: e.target.value})}
                />
              </div>
              <div>
                <label className="input-label">Favorite Academic Subjects</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Data Structures, Web Development, Economics..."
                  value={formData.subjects}
                  onChange={e => setFormData({...formData, subjects: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={handlePrev} className="btn-secondary" style={{ flex: 1, padding: '1rem' }}>Back</button>
                <button onClick={handleNext} className="btn-primary" style={{ flex: 2, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    Deeper Interests <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={24} color="var(--accent)" /> Passions & Logic
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Your passions drive your longevity in a career path.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <label className="input-label">What excites you about tech/work?</label>
                <textarea 
                  className="input-field" 
                  style={{ minHeight: '120px', paddingTop: '12px' }}
                  placeholder="e.g. I love building things that people use daily, solving complex logic puzzles..."
                  value={formData.interestsDetailed}
                  onChange={e => setFormData({...formData, interestsDetailed: e.target.value})}
                />
              </div>
              <div>
                <label className="input-label">Natural Inclination</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                  {[
                    { val: 'Technical/Analytical', icon: <TrendingUp size={16}/>, desc: 'Data, Code, Logic' },
                    { val: 'Creative/Design', icon: <Globe size={16}/>, desc: 'Art, UI/UX, Story' },
                    { val: 'Social/Leadership', icon: <Briefcase size={16}/>, desc: 'Management, HR, Sales' }
                  ].map(item => (
                    <button 
                      key={item.val} 
                      onClick={() => setFormData({...formData, projectPreference: item.val})}
                      className={formData.projectPreference.includes(item.val) ? 'btn-primary' : 'btn-secondary'}
                      style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}
                    >
                      {item.icon}
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{item.val}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={handlePrev} className="btn-secondary" style={{ flex: 1, padding: '1rem' }}>Back</button>
                <button onClick={handleNext} className="btn-primary" style={{ flex: 2, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Lifestyle Goals <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={24} color="var(--accent)" /> Future Lifestyle
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Finalizing your career environment and financial expectations.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="responsive-grid-2" style={{ gap: '1.5rem' }}>
                <div>
                  <label className="input-label">Salary Goal</label>
                  <select className="input-field text-center" value={formData.salaryExpectation} onChange={e => setFormData({...formData, salaryExpectation: e.target.value})}>
                    <option>Standard</option>
                    <option>Above Average</option>
                    <option>High Income</option>
                    <option>Ultra High / Executive</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Geography</label>
                  <select className="input-field text-center" value={formData.locationPreference} onChange={e => setFormData({...formData, locationPreference: e.target.value})}>
                    <option>India</option>
                    <option>Abroad / US / EU</option>
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
                      type="button"
                      onClick={() => setFormData({...formData, workEnvironment: m})}
                      className={formData.workEnvironment === m ? 'btn-primary' : 'btn-secondary'}
                      style={{ padding: '0.8rem', fontSize: '0.85rem' }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button onClick={handlePrev} className="btn-secondary" style={{ flex: 1, padding: '1rem' }}>Back</button>
                <button onClick={handleAnalyze} disabled={loading} className="btn-primary" style={{ flex: 2, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: '0 0 20px var(--accent-glow)' }}>
                  {loading ? (
                    <><Loader2 size={20} className="spin" /> Synchronizing AI...</>
                  ) : (
                    <><Sparkles size={20} /> Reveal My Future Path</>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="fade-in">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h1 className="gradient-text" style={{ fontSize: 'clamp(2rem, 6vw, 2.75rem)', marginBottom: '0.75rem' }}>Your Recommended Paths</h1>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '1rem' }}>
                We've analyzed your {formData.targetCourse} background and interests. Select a career to generate your specialized roadmap.
              </p>
            </div>

            <div className="responsive-grid" style={{ gap: '1.5rem' }}>
              {results?.map((career, idx) => (
                <div key={idx} className="glass-card fade-in" style={{ padding: '2rem', cursor: 'pointer', animationDelay: `${idx * 0.15}s`, borderRadius: '28px', border: '1px solid var(--border)', transition: 'transform 0.3s ease' }} onClick={() => setSelectedCareer(career)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ width: '56px', height: '56px', background: 'var(--accent-glow)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Briefcase size={28} color="var(--accent)" />
                    </div>
                    <div style={{ background: 'var(--success)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800' }}>
                      {career.confidence}% Match
                    </div>
                  </div>
                  <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.5rem' }}>{career.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {career.reasoning}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: '800', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                    <span>Deep Dive Analysis</span>
                    <ChevronRight size={20} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '5rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Want to try a different profile or academic background?</p>
              <button 
                onClick={() => {
                  setStep(1);
                  setResults(null);
                }} 
                className="btn-secondary" 
                style={{ padding: '1rem 2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', borderRadius: '14px' }}
              >
                <RefreshCw size={20} /> Re-Take Full Assessment
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(0.5rem, 3vw, 1rem) clamp(2rem, 10vh, 5rem)' }}>
      {step < 5 && (
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 8vh, 4rem)' }}>
          <div style={{ display: 'inline-flex', padding: 'clamp(1rem, 3vw, 1.5rem)', background: 'var(--accent-glow)', borderRadius: '24px', marginBottom: '1.5rem' }}>
            <Brain size={40} color="var(--accent)" />
          </div>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', margin: '0 0 0.5rem', lineHeight: 1.1 }}>Career Architect</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: 'clamp(0.85rem, 1.2vw, 1rem)' }}>Navigate your future with precision. Our AI maps your trajectory.</p>
          
          {/* Progress Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2rem' }}>
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                style={{ 
                  flex: '0 1 60px', height: '6px', borderRadius: '3px', 
                  background: s <= step ? 'var(--accent)' : 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  transition: '0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }} 
              />
            ))}
          </div>
        </div>
      )}

      {step < 5 && (
        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: 'clamp(1.5rem, 5vw, 2.5rem)', borderRadius: '24px' }}>
          {renderStep()}
        </div>
      )}

      {step === 5 && (
        <div className="fade-in">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vh, 3.5rem)' }}>
            <h1 className="gradient-text" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.75rem)', marginBottom: '0.75rem', lineHeight: 1.1 }}>Your Predicted Paths</h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: 'clamp(0.85rem, 1.2vw, 1rem)' }}>
              Analyzed for your <strong>{formData.targetCourse}</strong> background.
            </p>
          </div>

          <div className="responsive-grid" style={{ gap: '1rem' }}>
            {results?.map((career, idx) => (
              <div key={idx} className="glass-card fade-in" style={{ padding: 'clamp(1.25rem, 4vw, 2rem)', cursor: 'pointer', animationDelay: `${idx * 0.1}s`, borderRadius: '24px', border: '1px solid var(--border)', transition: '0.3s ease' }} onClick={() => setSelectedCareer(career)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--accent-glow)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Briefcase size={24} color="var(--accent)" />
                  </div>
                  <div style={{ background: 'var(--success)', color: 'white', padding: '0.3rem 0.75rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '0.5px' }}>
                    {career.confidence}% MATCH
                  </div>
                </div>
                <h3 style={{ margin: '0 0 0.75rem 0', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: '900' }}>{career.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {career.reasoning}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: '900', borderTop: '1px solid var(--border)', paddingTop: '1.25rem', letterSpacing: '1px' }}>
                  <span>DEEP DIVE ANALYSIS</span>
                  <ChevronRight size={18} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'clamp(3rem, 10vh, 5rem)', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: '600' }}>Want to try a different academic background?</p>
            <button 
              onClick={() => {
                setStep(1);
                setResults(null);
              }} 
              className="btn-secondary" 
              style={{ padding: '0.8rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '800' }}
            >
              <RefreshCw size={18} /> RE-START ASSESSMENT
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .input-label { display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.6rem; font-weight: 800; letter-spacing: 0.5px; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
