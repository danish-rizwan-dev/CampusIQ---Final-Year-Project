'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CareerTest() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const [data, setData] = useState({
    interests: '',
    skills: '',
    personality: 'introvert, analytical',
    salaryExpectation: '',
    workLifeBalance: 'medium'
  });

  const submitProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/career/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const aiResponse = await res.json();
      setResults(aiResponse);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (results) {
    return (
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <h2 className="gradient-text" style={{ textAlign: 'center', marginBottom: '2rem' }}>AI Career Analysis Complete</h2>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {results.recommendations.map((rec: any, idx: number) => (
            <div key={idx} className="glass-card" style={{ borderLeft: '4px solid var(--accent)' }}>
              <h3>{rec.title} <span style={{ fontSize: '0.9rem', color: 'var(--success)' }}>({rec.confidence}% Match)</span></h3>
              <p style={{ marginTop: '0.5rem' }}><strong>Why:</strong> {rec.reasoning}</p>
              <p style={{ marginTop: '0.5rem', color: 'var(--warning)' }}><strong>Skill Gap:</strong> {rec.skillGap}</p>
              <button 
                className="btn-primary" 
                style={{ marginTop: '1rem' }}
                onClick={() => router.push('/dashboard')}
              >
                Select this Path
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ width: '100%', maxWidth: '600px', alignSelf: 'flex-start' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2 className="gradient-text">Career Discovery Test</h2>
        <span style={{ color: 'var(--text-secondary)' }}>Step {step} of 3</span>
      </div>

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label>What are your core interests? (Comma separated)</label>
          <input type="text" className="input-field" placeholder="e.g. Graphic design, writing, problem solving" value={data.interests} onChange={e => setData({...data, interests: e.target.value})} />
          <button className="btn-primary" onClick={() => setStep(2)}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label>What are your current hard skills? (Comma separated)</label>
          <input type="text" className="input-field" placeholder="e.g. Python, Video Editing, Sales" value={data.skills} onChange={e => setData({...data, skills: e.target.value})} />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => setStep(3)}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label>Lifestyle Expectations</label>
          <select className="input-field" value={data.workLifeBalance} onChange={e => setData({...data, workLifeBalance: e.target.value})}>
            <option value="high">High Balance (9-5, Low Stress)</option>
            <option value="medium">Medium Balance (Standard)</option>
            <option value="low">Hustle Mode (High hours, High reward)</option>
          </select>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}>Back</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={submitProfile} disabled={loading}>
              {loading ? 'AI Analyzing...' : 'Finish & Calculate'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
