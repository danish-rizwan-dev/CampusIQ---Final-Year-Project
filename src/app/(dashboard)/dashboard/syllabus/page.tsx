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
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '1rem' }}>
      <header className="page-header">
        <div>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: 0 }}>Syllabus Hub</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>Upload your syllabus to break it down into easy study topics.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {persistentTopics.length > 0 && (
            <button className="btn-secondary" onClick={() => setClearingAll(true)} style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <Trash2 size={18} /> Clear Data
            </button>
          )}
          {!showInput && (
            <button className="btn-primary" onClick={() => setShowInput(true)}>
              <Plus size={18} /> New Syllabus
            </button>
          )}
        </div>
      </header>

      {showInput && (
        <div className="glass-card fade-in" style={{ padding: '2rem', borderRadius: '32px' }}>
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '12px', width: 'fit-content', marginBottom: '2rem' }}>
            {([{ id: 'text', label: 'Paste Text' }, { id: 'pdf', label: 'Upload File' }] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setInputTab(tab.id)}
                style={{
                  padding: '0.5rem 1.25rem', borderRadius: '10px', border: 'none',
                  fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer',
                  background: inputTab === tab.id ? 'var(--accent)' : 'transparent',
                  color: inputTab === tab.id ? 'white' : 'var(--text-secondary)',
                  transition: '0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {inputTab === 'text' ? (
            <textarea
              className="input-field"
              style={{ minHeight: '180px', borderRadius: '20px', padding: '1.5rem', fontSize: '1rem' }}
              placeholder="Paste syllabus text here..."
              value={syllabusText}
              onChange={e => setSyllabusText(e.target.value)}
            />
          ) : (
            <div
              onClick={() => !parsing && fileInputRef.current?.click()}
              style={{
                border: `2px dashed var(--border)`,
                borderRadius: '20px',
                padding: '3rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--bg-secondary)',
                minHeight: '180px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
              }}
            >
              <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={e => handleFileSelect(e.target.files?.[0] as File)} />
              {parsing ? <Loader2 size={32} className="spin" color="var(--accent)" /> : <Upload size={32} color="var(--accent)" />}
              <p style={{ margin: 0, fontWeight: '700' }}>{pdfFile ? pdfFile.name : 'Click to upload syllabus'}</p>
            </div>
          )}

          <button
            className="btn-primary"
            onClick={analyzeSyllabus}
            disabled={loading || !syllabusText}
            style={{ width: '100%', padding: '1rem', marginTop: '1.5rem', borderRadius: '16px' }}
          >
            {loading ? <Loader2 size={20} className="spin" /> : <Sparkles size={20} />}
            {loading ? 'Analyzing...' : 'Generate Subject Graph'}
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {Object.entries(
          persistentTopics.reduce((acc: any, topic) => {
            const subject = topic.subjectName || "Unassigned";
            if (!acc[subject]) acc[subject] = [];
            acc[subject].push(topic);
            return acc;
          }, {})
        ).map(([subject, topics]: [string, any]) => (
          <div key={subject}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Book size={24} color="var(--accent)" /> {subject}
              </h2>
              <Link href={`/dashboard/mock-exam?subject=${encodeURIComponent(subject)}`} className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                <Sparkles size={16} /> Practice Mock Test
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
                      <Trash2 size={14} />
                    </button>

                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: topic.difficulty === 'Hard' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '1rem'
                        }}>
                          {topic.difficulty === 'Hard' ? <AlertTriangle size={20} color="var(--danger)" /> : <CheckCircle2 size={20} color="var(--success)" />}
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                          {topic.topicName}
                        </h3>
                        <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {topic.subtopics.length} Key Concepts
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: topic.difficulty === 'Hard' ? 'var(--danger)' : 'var(--success)', letterSpacing: '1px' }}>
                          {topic.difficulty.toUpperCase()}
                        </span>
                        <ArrowRight size={18} color="var(--text-secondary)" />
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card fade-in-up" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2rem', borderRadius: '24px', border: '1px solid var(--danger-glow)' }}>
            <div style={{ background: 'var(--danger-glow)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--danger)' }}>
              <AlertTriangle size={30} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 900 }}>Dangerous Action</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              {clearingAll ? 'Are you sure you want to PERMANENTLY clear your entire knowledge graph?' : 'Are you sure you want to remove this subject card?'}
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setDeleteId(null); setClearingAll(false); }}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1, background: 'var(--danger)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }} onClick={() => clearingAll ? clearAllTopics() : handleDelete(deleteId!)}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .syllabus-square-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .square-card {
          aspect-ratio: 1 / 1;
          position: relative;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 1.75rem !important;
          border: 1px solid var(--border);
          overflow: hidden;
        }

        .square-card:hover {
          transform: translateY(-6px);
          border-color: rgba(129, 140, 248, 0.3) !important;
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.4) !important;
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
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: 0.2s;
          z-index: 10;
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
        .fade-in { animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
