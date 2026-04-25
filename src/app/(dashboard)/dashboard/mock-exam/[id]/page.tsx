'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle2, ChevronRight, ChevronLeft, 
  Send, AlertTriangle, Loader2, Brain, Star, Target, RotateCcw
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function MockExamPlayer() {
  const { id } = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [retaking, setRetaking] = useState(false);

  useEffect(() => {
    fetchExam();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && exam && !isFinished) {
      handleAutoSubmit();
    }
  }, [timeLeft, isFinished]);

  const fetchExam = async () => {
    try {
      const res = await fetch(`/api/exam/mock/${id}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setExam(data);
      if (data.status === 'COMPLETED') {
        setIsFinished(true);
      } else {
        setTimeLeft(data.durationMinutes * 60);
      }
    } catch (e: any) {
      toast.error(e.message);
      router.push('/dashboard/mock-exam');
    }
    setLoading(false);
  };

  const handleRetake = async () => {
    if (!confirm('Are you sure you want to retake this test? Your previous score will be cleared.')) return;
    setRetaking(true);
    try {
      const res = await fetch(`/api/exam/mock/${id}`, { method: 'PATCH' });
      const data = await res.json();
      if (data.id) {
        setExam(data);
        setIsFinished(false);
        setAnswers({});
        setCurrentSection(0);
        setTimeLeft(data.durationMinutes * 60);
        toast.success('Test Reset! Good luck.');
      }
    } catch (e) {
      toast.error('Failed to reset test');
    }
    setRetaking(false);
  };

  const handleAutoSubmit = () => {
    toast.error('Time is up! Auto-submitting exam...');
    submitExam();
  };

  const submitExam = async () => {
    const totalQuestions = exam.examData.sections.reduce((acc: number, s: any) => acc + s.questions.length, 0);
    const answeredCount = Object.keys(answers).length;

    if (answeredCount < totalQuestions) {
      if (!confirm(`You have only answered ${answeredCount} out of ${totalQuestions} questions. Are you sure you want to submit?`)) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/exam/mock/${id}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Exam Evaluated by AI!');
        setExam(data.updatedExam);
        setIsFinished(true);
      }
    } catch (e) {
      toast.error('Submission failed');
    }
    setIsSubmitting(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={50} className="spin" color="var(--accent)" />
    </div>
  );

  if (isFinished) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderRadius: '32px' }}>
          <div style={{ background: 'var(--success-glow)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: 'var(--success)' }}>
            <Star size={40} />
          </div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Exam Results</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem' }}>
             <div>
               <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Final Score</p>
               <h2 style={{ fontSize: '3rem', fontWeight: 900, margin: 0 }}>{exam.score} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ {exam.totalMarks}</span></h2>
             </div>
             <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '3rem' }}>
               <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status</p>
               <h2 style={{ 
                 fontSize: '3rem', 
                 fontWeight: 900, 
                 margin: 0, 
                 color: (exam.score / exam.totalMarks) >= 0.4 ? 'var(--success)' : 'var(--danger)' 
               }}>
                 {(exam.score / exam.totalMarks) >= 0.4 ? 'PASSED' : 'FAILED'}
               </h2>
             </div>
          </div>

          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>AI Performance Feedback</h3>
             <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)' }}>
                <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  {exam.results?.feedback || "Your exam has been graded. Review your answers below to identify areas of improvement."}
                </p>
             </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3rem' }}>
            <button className="btn-primary" onClick={handleRetake} disabled={retaking} style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {retaking ? <Loader2 size={20} className="spin" /> : <RotateCcw size={20} />}
              RETAKE TEST
            </button>
            <button className="btn-secondary" onClick={() => router.push('/dashboard/mock-exam')} style={{ padding: '1rem 2rem' }}>
              BACK TO DASHBOARD
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!exam?.examData?.sections || exam.examData.sections.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <AlertTriangle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
        <h2>Exam Data Corrupted</h2>
        <p style={{ color: 'var(--text-secondary)' }}>This exam seems to have no questions. Please try generating a new one.</p>
        <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => router.push('/dashboard/mock-exam')}>
          BACK TO DASHBOARD
        </button>
      </div>
    );
  }

  const currentSectionData = exam.examData.sections[currentSection];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>{exam.subject}</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>
            {currentSectionData.sectionName}
            {currentSectionData.instructions && <span style={{ color: 'var(--accent)', marginLeft: '8px' }}>• {currentSectionData.instructions}</span>}
          </p>
        </div>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '12px', 
          background: timeLeft < 300 ? 'var(--danger-glow)' : 'var(--bg-secondary)', 
          padding: '0.75rem 1.5rem', borderRadius: '14px', 
          border: `1px solid ${timeLeft < 300 ? 'var(--danger)' : 'var(--border)'}`,
          color: timeLeft < 300 ? 'var(--danger)' : 'var(--text-primary)',
          fontWeight: 900
        }}>
          <Clock size={20} /> {formatTime(timeLeft)}
        </div>
      </div>

      {/* QUESTIONS */}
      <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px', minHeight: '500px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {currentSectionData.questions.map((q: any, idx: number) => (
            <div key={q.id || idx} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '3rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: 900, color: 'var(--accent)', fontSize: '1.1rem' }}>Q{idx + 1}.</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{q.question}</p>
              </div>

              {q.type === 'MCQ' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', paddingLeft: '2.5rem' }}>
                  {q.options.map((opt: string) => (
                    <button
                      key={opt}
                      onClick={() => setAnswers({ ...answers, [q.id || `q_${currentSection}_${idx}`]: opt })}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        background: answers[q.id || `q_${currentSection}_${idx}`] === opt ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                        borderColor: answers[q.id || `q_${currentSection}_${idx}`] === opt ? 'var(--accent)' : 'var(--border)',
                        color: 'var(--text-primary)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: '0.2s'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ paddingLeft: '2.5rem' }}>
                  <textarea
                    className="input-field"
                    style={{ minHeight: '200px', borderRadius: '20px' }}
                    placeholder="Type your detailed answer here..."
                    value={answers[q.id || `q_${currentSection}_${idx}`] || ''}
                    onChange={e => setAnswers({ ...answers, [q.id || `q_${currentSection}_${idx}`]: e.target.value })}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={12} /> Marks: {q.marks} | AI will evaluate depth and accuracy.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* NAVIGATION */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem' }}>
          <button 
            className="btn-secondary" 
            disabled={currentSection === 0}
            onClick={() => { setCurrentSection(prev => prev - 1); window.scrollTo(0, 0); }}
          >
            <ChevronLeft size={20} /> Previous Section
          </button>
          
          {currentSection < exam.examData.sections.length - 1 ? (
            <button className="btn-primary" onClick={() => { setCurrentSection(prev => prev + 1); window.scrollTo(0, 0); }}>
              Next Section <ChevronRight size={20} />
            </button>
          ) : (
            <button 
              className="btn-primary" 
              style={{ background: 'var(--success)', border: 'none' }}
              disabled={isSubmitting}
              onClick={submitExam}
            >
              {isSubmitting ? <Loader2 size={20} className="spin" /> : <Target size={20} />}
              {isSubmitting ? 'Evaluating...' : 'FINISH & SUBMIT EXAM'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
