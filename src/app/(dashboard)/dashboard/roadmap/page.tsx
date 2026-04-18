'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import SemesterCard from '@/components/SemesterCard';
import EvaluationModal from '@/components/EvaluationModal';
import { Map, Plus, Loader2, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default function RoadmapPage() {
  const { user } = useUser();
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [evaluatingSemesterId, setEvaluatingSemesterId] = useState<string | null>(null);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  // Setup form for users with no roadmap yet
  const [setupData, setSetupData] = useState({
    targetCareer: '',
    skillLevel: 'Beginner',
    availableHours: 10,
  });

  useEffect(() => {
    fetchUserData();
    // Check for target career in URL
    const params = new URLSearchParams(window.location.search);
    const target = params.get('target');
    if (target) {
      setSetupData(prev => ({ ...prev, targetCareer: target }));
    }
  }, []);

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

  const handleGenerateRoadmap = async (e: React.FormEvent, isOverwrite = false) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...setupData, overwrite: isOverwrite }),
      });
      const data = await res.json();
      if (data.roadmap) {
        if (isOverwrite) setShowRegenerateModal(false);
        await fetchUserData();
      }
    } catch (e) {
      console.error(e);
    }
    setGenerating(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
        <Loader2 size={40} color="var(--accent)" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading your roadmap...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // No roadmap yet — show setup form
  if (!userData?.roadmaps || userData.roadmaps.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'var(--accent-glow)', borderRadius: '20px', marginBottom: '1rem' }}>
            <Map size={48} color="var(--accent)" />
          </div>
          <h1 className="gradient-text" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem' }}>Set Up Your Roadmap</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Tell us your goal and we'll build a personal 8-semester AI roadmap tailored to you.</p>
        </div>

        <div className="glass-card">
          <form onSubmit={(e) => handleGenerateRoadmap(e, false)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label>Target Career</label>
              <input
                type="text"
                className="input-field"
                required
                placeholder="e.g. Software Engineer, Data Scientist, ML Researcher"
                value={setupData.targetCareer}
                onChange={e => setSetupData({ ...setupData, targetCareer: e.target.value })}
              />
            </div>
            <div>
              <label>Current Skill Level</label>
              <select className="input-field" value={setupData.skillLevel} onChange={e => setSetupData({ ...setupData, skillLevel: e.target.value })}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label>Available Study Hours / Week</label>
              <input
                type="range"
                min={5} max={60} step={5}
                value={setupData.availableHours}
                onChange={e => setSetupData({ ...setupData, availableHours: Number(e.target.value) })}
                style={{ width: '100%', marginTop: '0.5rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>5 hrs</span>
                <strong style={{ color: 'var(--accent)' }}>{setupData.availableHours} hrs / week</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>60 hrs</span>
              </div>
            </div>
            <button type="submit" disabled={generating} className="btn-primary" style={{ padding: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {generating ? (
                <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> AI is building your roadmap...</>
              ) : (
                <><Plus size={20} /> Generate My 8-Semester Roadmap</>
              )}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Want a perfectly tailored plan?
            </p>
            <Link href="/dashboard/career" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '12px', textDecoration: 'none' }}>
              <BrainCircuit size={18} /> Take Detailed AI Career Assessment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const careerTarget = userData.careerProfile?.selectedCareer || 'Your Career Goal';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: '0 0 0.25rem' }}>
            {user?.firstName}'s Roadmap
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.1rem' }}>
            Career Target: <strong style={{ color: 'var(--text-primary)' }}>{careerTarget}</strong>
            &nbsp;•&nbsp;
            <span style={{ color: 'var(--accent)' }}>
              {userData.roadmaps.filter((r: any) => r.status === 'COMPLETED').length} / {userData.roadmaps.length} Semesters Complete
            </span>
          </p>
        </div>
        <button 
          onClick={() => {
            setSetupData(prev => ({ ...prev, targetCareer: careerTarget }));
            setShowRegenerateModal(true);
          }}
          className="btn-secondary"
          style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px' }}
        >
          <Map size={18} /> Regenerate Roadmap
        </button>
      </header>

      {/* Progress bar */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span>Semester 1</span>
          <span>Semester 8</span>
        </div>
        <div style={{ background: 'var(--border)', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
          <div style={{
            width: `${(userData.roadmaps.filter((r: any) => r.status === 'COMPLETED').length / 8) * 100}%`,
            height: '100%',
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            borderRadius: '8px',
            transition: 'width 0.8s ease',
          }} />
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: '2.5rem', borderLeft: '2px solid var(--border)' }}>
        {userData.roadmaps.map((semester: any) => (
          <div key={semester.id} style={{ position: 'relative', marginBottom: '3rem' }}>
            {/* Timeline dot */}
            <div style={{
              position: 'absolute',
              left: '-3.1rem',
              top: '1.75rem',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: semester.status === 'COMPLETED'
                ? 'var(--success)'
                : semester.status === 'ACTIVE'
                  ? 'var(--accent)'
                  : 'var(--border)',
              boxShadow: semester.status === 'ACTIVE' ? '0 0 0 4px var(--accent-glow)' : 'none',
              border: '3px solid var(--bg-primary)',
              transition: 'all 0.3s',
            }} />

            <SemesterCard
              id={semester.id}
              semesterNumber={semester.semesterNumber}
              status={semester.status}
              subjects={semester.subjects}
              skills={semester.skills}
              onEvaluate={() => setEvaluatingSemesterId(semester.id)}
            />
          </div>
        ))}

        {/* Future locked placeholders */}
        {Array.from({ length: Math.max(0, 8 - userData.roadmaps.length) }, (_, i) => (
          <div key={`locked-${i}`} style={{ position: 'relative', marginBottom: '3rem', opacity: 0.4 }}>
            <div style={{ position: 'absolute', left: '-3.1rem', top: '1.75rem', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--border)', border: '3px solid var(--bg-primary)' }} />
            <div className="glass-card" style={{ cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🔒
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>Semester {userData.roadmaps.length + i + 1}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>Unlocks after completing Semester {userData.roadmaps.length + i}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ margin: '0 0 1.5rem 0' }}>Regenerate Roadmap</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Warning: This will overwrite your current roadmap and progress. Set your new goals below to generate a fresh 8-semester timeline.
            </p>
            <form onSubmit={(e) => handleGenerateRoadmap(e, true)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label>Target Career</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="e.g. Software Engineer..."
                  value={setupData.targetCareer}
                  onChange={e => setSetupData({ ...setupData, targetCareer: e.target.value })}
                />
              </div>
              <div>
                <label>Current Skill Level</label>
                <select className="input-field" value={setupData.skillLevel} onChange={e => setSetupData({ ...setupData, skillLevel: e.target.value })}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label>Available Study Hours / Week</label>
                <input
                  type="range"
                  min={5} max={60} step={5}
                  value={setupData.availableHours}
                  onChange={e => setSetupData({ ...setupData, availableHours: Number(e.target.value) })}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>5 hrs</span>
                  <strong style={{ color: 'var(--accent)' }}>{setupData.availableHours} hrs/week</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>60 hrs</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowRegenerateModal(false)} className="btn-secondary" style={{ flex: 1, padding: '0.75rem' }}>Cancel</button>
                <button type="submit" disabled={generating} className="btn-primary" style={{ flex: 1, padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                  {generating ? (
                    <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
                  ) : (
                    'Regenerate'
                  )}
                </button>
              </div>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Lost your way? Try a deep assessment.
              </p>
              <Link href="/dashboard/career" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '10px', textDecoration: 'none', fontSize: '0.85rem' }}>
                <BrainCircuit size={16} /> Full Career Assessment
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
