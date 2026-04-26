'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FileText, Link as LinkIcon, Book, Sparkles,
  Video, Plus, AlertTriangle, Loader2,
  Trash2, Edit3, Save, X, ChevronRight, GraduationCap,
  Upload, FileScan, CheckCircle2, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SyllabusAnalyzer() {
  const [inputTab, setInputTab] = useState<'text' | 'pdf'>('text');
  const [syllabusText, setSyllabusText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [persistentTopics, setPersistentTopics] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [showInput, setShowInput] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfExtracted, setPdfExtracted] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [clearingAll, setClearingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await fetch('/api/syllabus');
      const data = await res.json();
      if (data.syllabusTopics) setPersistentTopics(data.syllabusTopics);
      if (data.syllabusTopics?.length > 0) setShowInput(false);
    } catch (e) {
      toast.error("Failed to load your syllabus cards.");
    }
  };

  const clearAllTopics = async () => {
    setClearingAll(false);
    const promise = Promise.all(persistentTopics.map(t => fetch(`/api/syllabus/${t.id}`, { method: 'DELETE' })));

    toast.promise(promise, {
      loading: 'Clearing your knowledge graph...',
      success: () => {
        setPersistentTopics([]);
        setShowInput(true);
        return 'All cards cleared.';
      },
      error: 'Failed to clear some cards.'
    });
  };

  const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];

  const handleFileSelect = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Unsupported file type.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10 MB.');
      return;
    }
    setPdfFile(file);
    setPdfExtracted(false);
    setParsing(true);
    const promise = (async () => {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/syllabus/parse-pdf', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSyllabusText(data.text);
      setPdfExtracted(true);
      return data;
    })();

    toast.promise(promise, {
      loading: `Extracting Syllabus from ${file.name}...`,
      success: (data) => `Neural extraction complete.`,
      error: (err) => err.message || 'Extraction failed.'
    });

    try { await promise; } catch (e) { }
    setParsing(false);
  }, []);

  const analyzeSyllabus = async () => {
    setLoading(true);
    const promise = (async () => {
      const res = await fetch('/api/syllabus/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: syllabusText })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      await Promise.all(data.topics.map((topic: any) =>
        fetch('/api/syllabus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subjectName: data.subjectName || "Unassigned",
            topicName: topic.name,
            difficulty: topic.difficulty,
            subtopics: topic.subtopics,
            resources: topic.resources,
            youtubeSearchUrl: topic.youtubeSearchUrl,
            documentation: topic.documentation,
            practiceQuestions: topic.practiceQuestions
          })
        })
      ));

      await fetchTopics();
      setSyllabusText('');
      setPdfFile(null);
      setPdfExtracted(false);
      setShowInput(false);
      return data;
    })();

    toast.promise(promise, {
      loading: 'AI is decomposing your syllabus...',
      success: 'Knowledge graph generated!',
      error: 'Analysis failed.'
    });

    try { await promise; } catch (e) { }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setDeleteId(null);
    const promise = fetch(`/api/syllabus/${id}`, { method: 'DELETE' });

    toast.promise(promise, {
      loading: 'Removing card...',
      success: () => {
        setPersistentTopics(prev => prev.filter(t => t.id !== id));
        return 'Card removed.';
      },
      error: 'Delete failed.'
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 5vh, 2.5rem)', padding: '0 clamp(0.5rem, 3vw, 1rem) 2rem' }}>
      <header className="page-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', margin: 0, lineHeight: 1.1 }}>Syllabus Hub</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', marginTop: '0.5rem' }}>Neural decomposition of your academic workload.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {persistentTopics.length > 0 && (
            <button className="btn-secondary" onClick={() => setClearingAll(true)} style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)', fontSize: '0.8rem', padding: '0.6rem 1rem' }}>
              <Trash2 size={16} /> CLEAR
            </button>
          )}
          {!showInput && (
            <button className="btn-primary" onClick={() => setShowInput(true)} style={{ fontSize: '0.8rem', padding: '0.6rem 1rem' }}>
              <Plus size={16} /> ADD NEW
            </button>
          )}
        </div>
      </header>

      {showInput && (
        <div className="glass-card fade-in" style={{ padding: 'clamp(1rem, 4vw, 2rem)', borderRadius: '24px' }}>
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '12px', width: 'fit-content', marginBottom: '1.5rem' }}>
            {([{ id: 'text', label: 'PASTE TEXT' }, { id: 'pdf', label: 'UPLOAD FILE' }] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setInputTab(tab.id)}
                style={{
                  padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
                  fontSize: '0.7rem', fontWeight: '900', cursor: 'pointer',
                  background: inputTab === tab.id ? 'var(--accent)' : 'transparent',
                  color: inputTab === tab.id ? 'white' : 'var(--text-muted)',
                  transition: '0.2s', letterSpacing: '1px'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {inputTab === 'text' ? (
            <textarea
              className="input-field"
              style={{ minHeight: '150px', borderRadius: '16px', padding: '1.25rem', fontSize: '0.95rem', marginBottom: 0 }}
              placeholder="Paste syllabus text here for AI decomposition..."
              value={syllabusText}
              onChange={e => setSyllabusText(e.target.value)}
            />
          ) : (
            <div
              onClick={() => !parsing && fileInputRef.current?.click()}
              style={{
                border: `2px dashed var(--border)`,
                borderRadius: '16px',
                padding: 'clamp(1.5rem, 5vw, 3rem)',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--bg-secondary)',
                minHeight: '150px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                transition: '0.3s'
              }}
            >
              <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={e => handleFileSelect(e.target.files?.[0] as File)} />
              {parsing ? <Loader2 size={28} className="spin" color="var(--accent)" /> : <Upload size={28} color="var(--accent)" />}
              <div style={{ minWidth: 0, maxWidth: '100%' }}>
                <p style={{ margin: 0, fontWeight: '800', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {pdfFile ? pdfFile.name : 'Tap to upload syllabus'}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>PDF, PNG, JPG supported</p>
              </div>
            </div>
          )}

          <button
            className="btn-primary"
            onClick={analyzeSyllabus}
            disabled={loading || !syllabusText}
            style={{ width: '100%', padding: '0.9rem', marginTop: '1.25rem', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '1px' }}
          >
            {loading ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />}
            {loading ? 'ANALYZING...' : 'GENERATE GRAPH'}
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2rem, 8vh, 4rem)' }}>
        {Object.entries(
          persistentTopics.reduce((acc: any, topic) => {
            const subject = topic.subjectName || "Unassigned";
            if (!acc[subject]) acc[subject] = [];
            acc[subject].push(topic);
            return acc;
          }, {})
        ).map(([subject, topics]: [string, any]) => (
          <div key={subject}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Book size={22} color="var(--accent)" /> {subject}
              </h2>
              <Link href={`/dashboard/mock-exam?subject=${encodeURIComponent(subject)}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: '800' }}>
                <Sparkles size={14} /> PRACTICE TEST
              </Link>
            </div>

            <div className="syllabus-square-grid">
              {topics.map((topic: any) => (
                <Link key={topic.id} href={`/dashboard/syllabus/${topic.id}`} style={{ textDecoration: 'none' }}>
                  <div className="glass-card square-card fade-in">
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteId(topic.id);
                      }}
                    >
                      <Trash2 size={12} />
                    </button>

                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          background: topic.difficulty === 'Hard' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '0.75rem'
                        }}>
                          {topic.difficulty === 'Hard' ? <AlertTriangle size={18} color="var(--danger)" /> : <CheckCircle2 size={18} color="var(--success)" />}
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {topic.topicName}
                        </h3>
                        <p style={{ margin: '6px 0 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                          {topic.subtopics.length} CONCEPTS
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: '900', color: topic.difficulty === 'Hard' ? 'var(--danger)' : 'var(--success)', letterSpacing: '1px' }}>
                          {topic.difficulty.toUpperCase()}
                        </span>
                        <ArrowRight size={16} color="var(--text-muted)" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Delete Modal */}
      {(deleteId || clearingAll) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card fade-in-up" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2rem', borderRadius: '24px', border: '1px solid var(--danger-glow)' }}>
            <div style={{ background: 'var(--danger-glow)', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--danger)' }}>
              <AlertTriangle size={24} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 900 }}>Dangerous Action</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              {clearingAll ? 'Are you sure you want to PERMANENTLY clear your entire knowledge graph?' : 'Are you sure you want to remove this subject card?'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-secondary" style={{ flex: 1, fontSize: '0.85rem', padding: '0.75rem' }} onClick={() => { setDeleteId(null); setClearingAll(false); }}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, fontSize: '0.85rem', padding: '0.75rem', background: 'var(--danger)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }} onClick={() => clearingAll ? clearAllTopics() : handleDelete(deleteId!)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .syllabus-square-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr));
          gap: 1rem;
        }

        .square-card {
          min-height: 220px;
          position: relative;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 1.25rem !important;
          border: 1px solid var(--border);
          overflow: hidden;
          border-radius: 20px;
        }

        .square-card:hover {
          transform: translateY(-4px);
          border-color: rgba(129, 140, 248, 0.3) !important;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4) !important;
        }

        .square-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: translateX(-100%);
          transition: 0.6s;
        }

        .square-card:hover::before {
          transform: translateX(100%);
        }

        .delete-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(239, 68, 68, 0.1);
          border: none;
          color: var(--danger);
          width: 26px;
          height: 26px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: 0.2s;
          z-index: 10;
        }

        @media (max-width: 768px) {
          .delete-btn { opacity: 1; background: var(--bg-secondary); border: 1px solid var(--border); }
        }

        .square-card:hover .delete-btn {
          opacity: 1;
        }

        .delete-btn:hover {
          background: var(--danger);
          color: white;
        }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

    </div>
  );
}
