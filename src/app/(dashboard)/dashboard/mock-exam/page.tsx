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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      <header className="page-header" style={{ alignItems: 'center' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', margin: 0 }}>Mock Exams</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>
            Generate and take detailed exams to test your knowledge.
          </p>
        </div>
        {!showCreator && exams.length > 0 && (
          <button className="btn-primary" onClick={() => setShowCreator(true)}>
            <Plus size={18} /> Generate New Exam
          </button>
        )}
      </header>

      {showCreator && (
        <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '32px', position: 'relative' }}>
          {exams.length > 0 && (
            <button onClick={() => setShowCreator(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ background: 'var(--accent-glow)', padding: '1rem', borderRadius: '16px', color: 'var(--accent)' }}>
              <FileText size={32} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>Create Mock Exam</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>AI will generate MCQs and Detailed questions based on your syllabus.</p>
            </div>
          </div>

          {filteredSubjects.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '2px', margin: 0 }}>QUICK GENERATE BY SUBJECT</p>
                {filteredSubjects.length > 4 && (
                  <button 
                    onClick={() => setShowAllSubjects(!showAllSubjects)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {showAllSubjects ? 'SHOW LESS' : `VIEW ALL (${filteredSubjects.length})`}
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
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
                      padding: '1.25rem',
                      borderRadius: '20px',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)',
                      fontSize: '0.9rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      transition: '0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-glow)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                  >
                    <Sparkles size={16} color="var(--accent)" />
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label className="input-label">SELECT SUBJECT</label>
              <select 
                className="input-field"
                value={form.subject}
                onChange={e => handleSubjectSelect(e.target.value)}
                style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2rem' }}
              >
                <option value="">-- Choose a subject --</option>
                {filteredSubjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
                <option value="custom">Other / Custom Subject</option>
              </select>
            </div>

            {form.subject === 'custom' && (
              <div>
                <label className="input-label">CUSTOM SUBJECT NAME</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Operating Systems" 
                  value={form.subject === 'custom' ? '' : form.subject}
                  onChange={e => setForm({...form, subject: e.target.value})}
                />
              </div>
            )}

            <div>
              <label className="input-label">SYLLABUS / TOPICS</label>
              <textarea 
                className="input-field" 
                style={{ minHeight: '150px' }}
                placeholder="The syllabus will be auto-filled if you select a subject above, or you can paste it here..."
                value={form.syllabus}
                onChange={e => setForm({...form, syllabus: e.target.value})}
              />
            </div>
            <button 
              className="btn-primary" 
              style={{ padding: '1.25rem', width: '100%', fontSize: '1.1rem' }}
              disabled={loading || !form.subject}
              onClick={() => generateExam()}
            >
              {loading ? <Loader2 size={20} className="spin" /> : <Sparkles size={20} />}
              {loading ? 'ANALYZING SYLLABUS...' : 'GENERATE MOCK EXAM'}
            </button>
          </div>
        </div>
      )}

      {exams.length === 0 && !showCreator && !fetching && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <History size={48} color="var(--text-secondary)" style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No exams found. Click "Generate New Exam" to get started.</p>
          <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setShowCreator(true)}>
            <Plus size={18} /> Generate Your First Exam
          </button>
        </div>
      )}

      {exams.length > 0 && (
        <div className="responsive-grid">
          {exams.map((exam) => (
            <div key={exam.id} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.5rem', background: 'var(--accent-glow)', borderRadius: '12px', color: 'var(--accent)' }}>
                  <Target size={24} />
                </div>
                <div style={{ 
                  padding: '4px 10px', 
                  background: exam.status === 'COMPLETED' ? 'var(--success-glow)' : 'var(--warning-glow)', 
                  color: exam.status === 'COMPLETED' ? 'var(--success)' : 'var(--warning)',
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  fontWeight: '900'
                }}>
                  {exam.status}
                </div>
                <button 
                  onClick={(e) => { e.preventDefault(); deleteExam(exam.id); }}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.6, transition: '0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.5rem 0' }}>{exam.subject}</h3>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {exam.durationMinutes}m
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileText size={14} /> {exam.totalMarks} Marks
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <Link href={`/dashboard/mock-exam/${exam.id}`} className="btn-primary" style={{ width: '100%' }}>
                  {exam.status === 'COMPLETED' ? 'REVIEW RESULTS' : 'START EXAM'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .input-label {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-secondary);
          margin-bottom: 8px;
          display: block;
          letter-spacing: 1px;
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
