'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import SemesterCard from '@/components/SemesterCard';
import EvaluationModal from '@/components/EvaluationModal';
import { Map as MapIcon, Plus, Loader2, BrainCircuit, RefreshCw, Sparkles, Target, ChevronRight, Lock } from 'lucide-react';
import Link from 'next/link';

export default function RoadmapPage() {
  const { user } = useUser();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [evaluatingSemesterId, setEvaluatingSemesterId] = useState<string | null>(null);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const isGeneratingRef = useRef(false);

  // Setup form for users with no roadmap yet
  const [setupData, setSetupData] = useState({
    targetCourse: '',
    durationYears: 3,
    targetCareer: '',
    skillLevel: 'Beginner',
    availableHours: 40,
  });

  useEffect(() => {
    fetchUserData();
    // Check for target career, course, and duration in URL for AUTO-GENERATION
    const params = new URLSearchParams(window.location.search);
    const target = params.get('target');
    const course = params.get('course');
    const duration = params.get('duration');
    
    if (target && course && duration) {
      // Auto-trigger generation
      const autoData = {
        targetCareer: target,
        targetCourse: course,
        durationYears: Number(duration),
        skillLevel: 'Beginner',
        availableHours: 40
      };
      setSetupData(autoData);
    }
  }, []);

  // Effect to auto-trigger generation once data is ready and params exist
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = params.get('target');
    
    if (target && userData && !userData.roadmaps?.length && !generating && !isGeneratingRef.current) {
      isGeneratingRef.current = true;
      // Clean up URL IMMEDIATELY to prevent double-triggering
      window.history.replaceState({}, '', '/dashboard/roadmap');
      handleGenerateRoadmap(undefined, true);
    }
  }, [userData]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/me');
      const data = await res.json();
      if (data.user) setUserData(data.user);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleGenerateRoadmap = async (e?: React.FormEvent, overwrite = false) => {
    if (e) e.preventDefault();
    setGenerating(true);
    if (overwrite) setSelectedPath('Custom Path');
    try {
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...setupData, overwrite })
      });
      const data = await res.json();
      if (data.roadmap) {
        setShowRegenerateModal(false);
        fetchUserData();
      }
    } catch (err) {
      console.error(err);
    }
    setGenerating(false);
    setSelectedPath(null);
  };

  const handleQuickSelect = async (careerTitle: string) => {
    setSelectedPath(careerTitle);
    setSetupData(prev => ({ ...prev, targetCareer: careerTitle }));
    const body = { 
        ...setupData, 
        targetCareer: careerTitle, 
        overwrite: true 
    };
    
    setGenerating(true);
    try {
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.roadmap) {
        setShowRegenerateModal(false);
        fetchUserData();
      }
    } catch (err) {
      console.error(err);
    }
    setGenerating(false);
    setSelectedPath(null);
  };

  if (loading && !userData) {
    return (
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={40} className="spin" color="var(--accent)" />
        <p style={{ color: 'var(--text-secondary)' }}>Syncing your academic space...</p>
      </div>
    );
  }

  if (generating && !userData?.roadmaps?.length) {
    return (
        <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2rem', textAlign: 'center' }}>
            <div style={{ position: 'relative' }}>
                <div style={{ width: '100px', height: '100px', border: '4px solid var(--accent-glow)', borderRadius: '50%', borderTopColor: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
                <BrainCircuit size={40} color="var(--accent)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            </div>
            <div>
                <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>AI is Architecting Your Future</h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>Analyzing your {setupData.targetCourse} course to build a 24-week hyper-specialized roadmap for <strong>{setupData.targetCareer}</strong>.</p>
            </div>
        </div>
    );
  }

  if (!userData?.roadmaps || userData.roadmaps.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '1rem' }}>
        <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'var(--accent-glow)', borderRadius: '24px', marginBottom: '1.5rem' }}>
            <MapIcon size={48} color="var(--accent)" />
          </div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: '0 0 1rem' }}>Setup Your Roadmap</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Define your goals and we'll generate a semester-by-semester plan using the state-of-the-art Gemini 3 Flash Preview.</p>
          
          <form onSubmit={(e) => handleGenerateRoadmap(e)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
            <div className="responsive-grid-2" style={{ gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Target Course</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="e.g. B.Tech CSE, BCA"
                  value={setupData.targetCourse}
                  onChange={e => setSetupData({ ...setupData, targetCourse: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Course Duration</label>
                <select className="input-field text-center" value={setupData.durationYears} onChange={e => setSetupData({ ...setupData, durationYears: Number(e.target.value) })}>
                  {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>{y} Year{y > 1 ? 's' : ''}</option>)}
                </select>
              </div>
            </div>

            <div className="responsive-grid-2" style={{ gap: '1rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Desired Tech Career Goal</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="e.g. Fullstack Developer, Data Scientist"
                  value={setupData.targetCareer}
                  onChange={e => setSetupData({ ...setupData, targetCareer: e.target.value })}
                />
              </div>
            </div>

            <div className="responsive-grid-2" style={{ gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Skill Level</label>
                <select className="input-field" value={setupData.skillLevel} onChange={e => setSetupData({ ...setupData, skillLevel: e.target.value })}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Study Hours / Week</label>
                <input
                  type="number"
                  className="input-field"
                  min={1} max={168}
                  value={setupData.availableHours}
                  onChange={e => setSetupData({ ...setupData, availableHours: Number(e.target.value) })}
                />
              </div>
            </div>

            <button type="submit" disabled={generating} className="btn-primary" style={{ padding: '1rem', fontSize: '1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {generating ? (
                <><Loader2 size={20} className="spin" /> AI Is Constructing Your Roadmap...</>
              ) : (
                <><Plus size={20} /> Generate Personalized Roadmap</>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Deduplicate roadmaps for rendering
  const uniqueRoadmaps = userData?.roadmaps ? 
    Array.from(new Map(userData.roadmaps.map((r: any) => [r.semesterNumber, r])).values()) : [];

  const totalSems = userData?.totalSemesters || 8;
  const completedSems = uniqueRoadmaps.filter((r: any) => r.status === 'COMPLETED').length;
  const careerTarget = userData?.careerProfile?.selectedCareer || 'Your Path';
  const targetCourse = userData?.targetCourse || 'Degree';
  const recommendations = userData?.careerProfile?.fullAssessmentResult?.recommendations || [];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', margin: '0 0 0.25rem' }}>
            {user?.firstName}'s Study Plan
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1rem' }}>
             <strong style={{ color: 'var(--text-primary)' }}>{targetCourse}</strong>
            &nbsp;•&nbsp;
            Goal: <strong style={{ color: 'var(--text-primary)' }}>{careerTarget}</strong>
            &nbsp;•&nbsp;
            <span style={{ color: 'var(--accent)', fontWeight: '700' }}>
              {completedSems} / {totalSems} Semesters Done
            </span>
          </p>
        </div>
        <button 
          onClick={() => {
            setSetupData({
                targetCourse: targetCourse,
                durationYears: userData.durationYears || 3,
                targetCareer: careerTarget,
                skillLevel: 'Beginner',
                availableHours: 40,
            });
            setShowRegenerateModal(true);
          }}
          className="btn-secondary"
          style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px', fontSize: '0.85rem' }}
        >
          <RefreshCw size={18} /> Regenerate Roadmap
        </button>
      </header>

      {/* Progress bar */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700' }}>
          <span>Semester 1</span>
          <span>Semester {totalSems}</span>
        </div>
        <div style={{ background: 'var(--border)', borderRadius: '10px', height: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div style={{
            width: `${(completedSems / totalSems) * 100}%`,
            height: '100%',
            background: 'var(--accent-gradient)',
            borderRadius: '10px',
            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 'var(--glow-shadow)'
          }} />
        </div>
      </div>

      {/* Timeline */}
      <div className="roadmap-timeline">
        {uniqueRoadmaps.sort((a: any, b: any) => a.semesterNumber - b.semesterNumber).map((semester: any) => (
          <div key={semester.id} style={{ position: 'relative', marginBottom: '3rem' }}>
            {/* Timeline dot */}
            <div style={{
              position: 'absolute',
              left: '-3.1rem',
              top: '1.75rem',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: semester.status === 'COMPLETED' ? 'var(--success)' : (semester.status === 'ACTIVE' ? 'var(--accent)' : 'var(--bg-primary)'),
              border: `4px solid var(--bg-primary)`,
              boxShadow: semester.status === 'ACTIVE' ? '0 0 10px var(--accent-glow)' : 'none',
              transition: 'all 0.3s',
            }} />

            <SemesterCard
              id={semester.id}
              semesterNumber={semester.semesterNumber}
              status={semester.status}
              subjects={semester.subjects}
              skills={semester.skills}
              environmentSetup={semester.environmentSetup}
              onEvaluate={() => setEvaluatingSemesterId(semester.id)}
            />
          </div>
        ))}

        {/* Future locked placeholders */}
        {Array.from({ length: Math.max(0, totalSems - uniqueRoadmaps.length) }, (_, i) => {
          const semNum = uniqueRoadmaps.length + i + 1;
          return (
            <div key={`locked-${i}`} style={{ position: 'relative', marginBottom: '3rem', opacity: 0.4 }}>
              <div style={{
                position: 'absolute', left: '-3.1rem', top: '1.75rem', width: '20px', height: '20px',
                borderRadius: '50%', background: 'var(--bg-secondary)', border: `4px solid var(--bg-primary)`,
              }} />
              <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                  <Lock size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Semester {semNum}</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Complete previous semester to unlock</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {evaluatingSemesterId && (
        <EvaluationModal
          roadmapId={evaluatingSemesterId}
          onClose={() => setEvaluatingSemesterId(null)}
          onSuccess={() => {
            setEvaluatingSemesterId(null);
            fetchUserData();
          }}
        />
      )}

      {showRegenerateModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="glass-card fade-in-up" style={{ width: '100%', maxWidth: '550px', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>Intelligent Regeneration</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                        Choose your next path. Overwriting will reset your progress.
                    </p>
                </div>
                <button onClick={() => setShowRegenerateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* AI Recommendations Section */}
                {recommendations.length > 0 && (
                    <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: '800', opacity: 0.6, marginBottom: '0.75rem', display: 'block', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Recommended Paths</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {recommendations.map((rec: any, i: number) => (
                                <button 
                                    key={i} 
                                    onClick={() => handleQuickSelect(rec.title)}
                                    disabled={generating}
                                    style={{ 
                                        width: '100%', padding: '1.25rem', textAlign: 'left', background: 'var(--bg-secondary)', 
                                        border: `1px solid ${selectedPath === rec.title ? 'var(--accent)' : 'var(--border)'}`, 
                                        borderRadius: '20px', cursor: 'pointer', transition: '0.3s',
                                        display: 'flex', alignItems: 'center', gap: '1.25rem' 
                                    }}
                                    className="hover-card"
                                >
                                    <div style={{ width: '45px', height: '45px', background: 'var(--accent-glow)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {selectedPath === rec.title ? <Loader2 size={24} className="spin" color="var(--accent)" /> : <Sparkles size={24} color="var(--accent)" />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '800', fontSize: '1.1rem', color: selectedPath === rec.title ? 'var(--accent)' : 'var(--text-primary)' }}>{rec.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{rec.confidence}% AI Compatibility Match</div>
                                    </div>
                                    <ChevronRight size={20} color="var(--text-secondary)" style={{ opacity: selectedPath === rec.title ? 0 : 1 }} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Manual Section */}
                <div>
                    <button 
                        onClick={() => setShowManualForm(!showManualForm)} 
                        style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0 }}
                    >
                        {showManualForm ? 'Hide Manual Setup' : 'Custom Career Goal?'} <Target size={16} />
                    </button>
                    
                    {showManualForm && (
                        <div className="fade-in" style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                             <form onSubmit={(e) => handleGenerateRoadmap(e, true)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: '800', opacity: 0.6 }}>Any Career You Desire</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        required
                                        placeholder="e.g. Blockchain Developer, AI Researcher"
                                        value={setupData.targetCareer}
                                        onChange={e => setSetupData({ ...setupData, targetCareer: e.target.value })}
                                    />
                                </div>
                                <div className="responsive-grid-2" style={{ gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: '800', opacity: 0.6 }}>Course</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            required
                                            value={setupData.targetCourse}
                                            onChange={e => setSetupData({ ...setupData, targetCourse: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: '800', opacity: 0.6 }}>Duration</label>
                                        <select className="input-field text-center" value={setupData.durationYears} onChange={e => setSetupData({ ...setupData, durationYears: Number(e.target.value) })}>
                                            {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>{y} Year{y > 1 ? 's' : ''}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" disabled={generating} className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}>
                                    {generating ? <Loader2 className="spin" /> : 'Generate Manual Path'}
                                </button>
                             </form>
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <Link href="/dashboard/career" className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '1rem', borderRadius: '16px', fontSize: '0.9rem', gap: '10px' }}>
                        <BrainCircuit size={18} /> Explore New Career Paths
                    </Link>
                </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in-up { animation: fadeInUp 0.5s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .hover-card:hover { border-color: var(--accent) !important; background: var(--accent-glow) !important; }
        .roadmap-timeline {
          position: relative;
          padding-left: 2.5rem;
          border-left: 2px solid var(--border);
          margin-left: 1rem;
          transition: all 0.3s ease;
        }
        @media (max-width: 600px) {
          .roadmap-timeline {
            padding-left: 1.5rem;
            margin-left: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
