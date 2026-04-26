'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, Plus, History, Loader2, Sparkles, 
  ChevronRight, ArrowLeft, Target, Clock, AlertTriangle, 
  Trash2, X 
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function MockExamsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get('subject');
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showCreator, setShowCreator] = useState(false);
  const [form, setForm] = useState({ subject: '', syllabus: '' });
  const [syllabusTopics, setSyllabusTopics] = useState<any[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [roadmapSubjects, setRoadmapSubjects] = useState<string[]>([]);
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  useEffect(() => {
    fetchExams();
    fetchSyllabus();
    fetchUserSubjects();
  }, []);

  const fetchUserSubjects = async () => {
    try {
      const res = await fetch('/api/user/me');
      const data = await res.json();
      if (data.user?.roadmaps?.length > 0) {
        const latestRoadmap = data.user.roadmaps[data.user.roadmaps.length - 1];
        if (Array.isArray(latestRoadmap.subjects)) {
          setRoadmapSubjects(latestRoadmap.subjects);
        }
      }
    } catch (e) {
      console.error('Failed to load roadmap subjects');
    }
  };

  useEffect(() => {
    // Extract specific topic names if the subject is generic (e.g. B.Tech Semester)
    const specificSyllabusSubjects: string[] = [];
    syllabusTopics.forEach((t: any) => {
      const isGeneric = t.subjectName.toLowerCase().includes('semester') || t.subjectName.toLowerCase().includes('b.tech');
      if (isGeneric) {
        specificSyllabusSubjects.push(t.topicName);
      } else {
        specificSyllabusSubjects.push(t.subjectName);
      }
    });

    const combined = Array.from(new Set([...roadmapSubjects, ...specificSyllabusSubjects]))
      .filter(s => !s.toLowerCase().includes('semester') && !s.toLowerCase().includes('b.tech')) as string[];
    
    setFilteredSubjects(combined);
  }, [roadmapSubjects, syllabusTopics]);

  const [filteredSubjects, setFilteredSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (subjectParam && filteredSubjects.length > 0) {
      handleSubjectSelect(subjectParam);
    }
  }, [subjectParam, filteredSubjects]);

  const fetchSyllabus = async () => {
    try {
      const res = await fetch('/api/syllabus');
      const data = await res.json();
      if (data.syllabusTopics) {
        setSyllabusTopics(data.syllabusTopics);
        const subjects = Array.from(new Set(data.syllabusTopics.map((t: any) => t.subjectName)));
        setAvailableSubjects(subjects as string[]);
      }
    } catch (e) {
      console.error('Failed to load syllabus');
    }
  };

  const handleSubjectSelect = (sub: string) => {
    const relevantTopics = syllabusTopics
      .filter(t => t.subjectName === sub || t.topicName === sub)
      .map(t => `${t.topicName}: ${t.subtopics.join(', ')}`)
      .join('\n');
    setForm({ subject: sub, syllabus: relevantTopics });
    setShowCreator(true);
  };

  const fetchExams = async () => {
    try {
      const res = await fetch('/api/exam/mock');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (data.exams) {
        setExams(data.exams);
        if (data.exams.length === 0) setShowCreator(true);
      } else {
        setShowCreator(true);
      }
    } catch (e) {
      toast.error('Failed to load exams');
      setShowCreator(true);
    }
    setFetching(false);
  };

  const generateExam = async (customForm?: { subject: string, syllabus: string }) => {
    const targetForm = customForm || form;
    setLoading(true);
    try {
      const res = await fetch('/api/exam/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetForm)
      });
      const data = await res.json();
      if (data.id) {
        toast.success(`Exam for ${targetForm.subject} Generated!`);
        await fetchExams();
        setShowCreator(false);
        setForm({ subject: '', syllabus: '' });
      } else {
        throw new Error(data.error || 'Failed to generate');
      }
    } catch (e: any) {
      toast.error(e.message);
    }
    setLoading(false);
  };

  const deleteExam = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    try {
      const res = await fetch(`/api/exam/mock/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Exam Deleted');
        setExams(exams.filter(e => e.id !== id));
      }
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  if (fetching) {
    return (
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} className="spin" color="var(--accent)" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(0.5rem, 3vw, 1rem)', display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 5vh, 2.5rem)' }}>
      
      <header className="page-header" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', margin: 0, fontWeight: 950, lineHeight: 1 }}>Mock Exams</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 600 }}>
            Test your knowledge with AI-driven simulations.
          </p>
        </div>
        {!showCreator && exams.length > 0 && (
          <button className="btn-primary" onClick={() => setShowCreator(true)} style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '0.8rem', fontWeight: 900 }}>
            <Plus size={18} /> GENERATE NEW
          </button>
        )}
      </header>

      {showCreator && (
        <div className="glass-card" style={{ padding: 'clamp(1.25rem, 5vw, 2.5rem)', borderRadius: '28px', position: 'relative', border: '1px solid var(--border)' }}>
          {exams.length > 0 && (
            <button onClick={() => setShowCreator(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'var(--accent-glow)', padding: '0.75rem', borderRadius: '12px', color: 'var(--accent)' }}>
              <FileText size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>Create Exam</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>NEURAL GENERATION ACTIVE</p>
            </div>
          </div>

          {filteredSubjects.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '2px', margin: 0 }}>QUICK SUBJECTS</p>
                {filteredSubjects.length > 4 && (
                  <button 
                    onClick={() => setShowAllSubjects(!showAllSubjects)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer' }}
                  >
                    {showAllSubjects ? 'SHOW LESS' : `VIEW ALL (${filteredSubjects.length})`}
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.6rem' }}>
                {(showAllSubjects ? filteredSubjects : filteredSubjects.slice(0, 4)).map(sub => (
                  <button 
                    key={sub}
                    disabled={loading}
                    onClick={() => {
                      const relevantTopics = syllabusTopics
                        .filter(t => t.subjectName === sub || t.topicName === sub)
                        .map(t => `${t.topicName}: ${t.subtopics.join(', ')}`)
                        .join('\n');
                      generateExam({ subject: sub, syllabus: relevantTopics });
                    }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '12px',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="input-label">TARGET SUBJECT</label>
              <select 
                className="input-field"
                value={form.subject}
                onChange={e => handleSubjectSelect(e.target.value)}
                style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem', borderRadius: '12px' }}
              >
                <option value="">-- Select Subject --</option>
                {filteredSubjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
                <option value="custom">Other / Custom Subject</option>
              </select>
            </div>

            {form.subject === 'custom' && (
              <div>
                <label className="input-label">SUBJECT NAME</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Operating Systems" 
                  value={form.subject === 'custom' ? '' : form.subject}
                  onChange={e => setForm({...form, subject: e.target.value})}
                  style={{ borderRadius: '12px' }}
                />
              </div>
            )}

            <div>
              <label className="input-label">SYLLABUS CONTEXT</label>
              <textarea 
                className="input-field" 
                style={{ minHeight: '120px', borderRadius: '12px' }}
                placeholder="Details help AI generate better questions..."
                value={form.syllabus}
                onChange={e => setForm({...form, syllabus: e.target.value})}
              />
            </div>
            <button 
              className="btn-primary" 
              style={{ padding: '1rem', width: '100%', fontSize: '1rem', borderRadius: '14px', fontWeight: 900 }}
              disabled={loading || !form.subject}
              onClick={() => generateExam()}
            >
              {loading ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />}
              <span style={{ marginLeft: '8px' }}>{loading ? 'ANALYZING...' : 'INITIALIZE SIMULATION'}</span>
            </button>
          </div>
        </div>
      )}

      {exams.length === 0 && !showCreator && !fetching && (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-secondary)', borderRadius: '32px', border: '1px dashed var(--border)' }}>
          <History size={40} color="var(--text-secondary)" style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>NO ACTIVE EXAMS FOUND</p>
          <button className="btn-primary" style={{ marginTop: '1.5rem', borderRadius: '12px' }} onClick={() => setShowCreator(true)}>
            <Plus size={18} /> GENERATE FIRST EXAM
          </button>
        </div>
      )}

      {exams.length > 0 && (
        <div className="responsive-grid" style={{ gap: '1rem' }}>
          {exams.map((exam) => (
            <div key={exam.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.5rem', background: 'var(--accent-glow)', borderRadius: '10px', color: 'var(--accent)' }}>
                  <Target size={20} />
                </div>
                <div style={{ 
                  padding: '4px 10px', 
                  background: exam.status === 'COMPLETED' ? 'var(--success-glow)' : 'var(--warning-glow)', 
                  color: exam.status === 'COMPLETED' ? 'var(--success)' : 'var(--warning)',
                  borderRadius: '8px',
                  fontSize: '0.65rem',
                  fontWeight: '900'
                }}>
                  {exam.status}
                </div>
                <button 
                  onClick={(e) => { e.preventDefault(); deleteExam(exam.id); }}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.4 }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>{exam.subject}</h3>
                <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {exam.durationMinutes}M
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileText size={12} /> {exam.totalMarks} MARKS
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <Link href={`/dashboard/mock-exam/${exam.id}`} className="btn-primary" style={{ width: '100%', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 900, padding: '12px' }}>
                  {exam.status === 'COMPLETED' ? 'REVIEW RESULTS' : 'START SIMULATION'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .input-label {
          font-size: 0.65rem;
          font-weight: 900;
          color: var(--text-muted);
          margin-bottom: 6px;
          display: block;
          letter-spacing: 1.5px;
        }
      `}</style>
    </div>
  );
}

export default function MockExamsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} className="spin" color="var(--accent)" />
      </div>
    }>
      <MockExamsContent />
    </Suspense>
  );
}
