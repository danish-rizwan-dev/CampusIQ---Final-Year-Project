'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, Link as LinkIcon, Book, Sparkles, 
  Video, Plus, CheckCircle2, AlertTriangle, Loader2,
  Trash2, Edit3, Save, X, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function SyllabusAnalyzer() {
  const [syllabusText, setSyllabusText] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [persistentTopics, setPersistentTopics] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [showInput, setShowInput] = useState(true);

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

  const analyzeSyllabus = async () => {
    setLoading(true);
    toast.info("AI is reading your syllabus... This takes a few seconds.");
    try {
      const res = await fetch('/api/syllabus/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: syllabusText })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      // Automatically save each extracted topic to the database
      toast.info(`Saving ${data.topics.length} subjects to your profile...`);
      for (const topic of data.topics) {
        await fetch('/api/syllabus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subjectName: data.subjectName || "Unassigned",
            topicName: topic.name,
            difficulty: topic.difficulty,
            subtopics: topic.subtopics,
            resources: topic.resources,
            youtubeSearchUrl: topic.youtubeSearchUrl
          })
        });
      }
      
      await fetchTopics();
      setSyllabusText('');
      setShowInput(false);
      toast.success("Analysis complete! All subjects added as persistent cards.");
    } catch (e) {
      toast.error("Failed to analyze syllabus. Check text content.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subject card?")) return;
    try {
      await fetch(`/api/syllabus/${id}`, { method: 'DELETE' });
      setPersistentTopics(prev => prev.filter(t => t.id !== id));
      toast.success("Card removed.");
    } catch (e) {
      toast.error("Delete failed.");
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`/api/syllabus/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        toast.success("Updated successfully.");
        setEditingId(null);
        fetchTopics();
      }
    } catch (e) {
      toast.error("Update failed.");
    }
  };

  const syncToTasks = async (topic: any) => {
    setSyncing(true);
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Study: ${topic.topicName}`,
          type: 'STUDY',
          priority: topic.difficulty === 'Hard' ? 'HIGH' : 'MEDIUM',
          description: `Focus: ${topic.subtopics.join(', ')}. Tutorial: ${topic.youtubeSearchUrl}`
        })
      });
      toast.success(`"${topic.topicName}" added to tasks!`);
    } catch (e) {
      toast.error("Sync failed.");
    }
    setSyncing(false);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
      <header className="page-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', margin: 0 }}>Syllabus Intelligence</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Persistent curriculum management with AI-powered topic extraction.
          </p>
        </div>
        {!showInput && (
          <button className="btn-primary" onClick={() => setShowInput(true)} style={{ gap: '0.5rem', width: 'auto' }}>
            <Plus size={18} /> Add More
          </button>
        )}
      </header>

      {showInput && (
        <div className="glass-card fade-in" style={{ padding: 'clamp(1.25rem, 5vw, 2.5rem)', borderRadius: '24px', position: 'relative' }}>
          {persistentTopics.length > 0 && (
            <button onClick={() => setShowInput(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--accent-glow)', borderRadius: '12px', color: 'var(--accent)' }}>
              <FileText size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Extract New Subjects</h3>
            </div>
          </div>
          
          <textarea 
            className="input-field" 
            style={{ minHeight: '200px', fontFamily: 'monospace', resize: 'vertical', borderRadius: '16px', padding: '1rem', fontSize: '0.9rem' }}
            placeholder="e.g. Unit 1: OS Architecture..."
            value={syllabusText}
            onChange={e => setSyllabusText(e.target.value)}
          />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button className="btn-primary" 
              onClick={analyzeSyllabus} 
              disabled={loading || !syllabusText}
              style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', fontSize: '0.95rem', gap: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {loading ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />}
              {loading ? 'AI Parsing...' : 'Extract & Save Cards'}
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {persistentTopics.map((topic) => (
          <div key={topic.id} className="glass-card fade-in" style={{ 
            borderRadius: '24px',
            borderLeft: `8px solid ${topic.difficulty === 'Hard' ? 'var(--danger)' : topic.difficulty === 'Medium' ? 'var(--warning)' : 'var(--success)'}`,
            padding: '1.5rem',
            position: 'relative'
          }}>
            {editingId === topic.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="responsive-grid-2" style={{ gap: '1rem' }}>
                  <div>
                    <label>Main Topic Name</label>
                    <input className="input-field" style={{ marginBottom: 0 }} value={editData.topicName} onChange={e => setEditData({...editData, topicName: e.target.value})} />
                  </div>
                  <div>
                    <label>Difficulty</label>
                    <select className="input-field" style={{ marginBottom: 0 }} value={editData.difficulty} onChange={e => setEditData({...editData, difficulty: e.target.value})}>
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button className="btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                  <button className="btn-primary" onClick={handleUpdate}><Save size={16} /> Save</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.35rem' }}>
                  <button className="icon-btn" title="Sync to Tasks" onClick={() => syncToTasks(topic)} disabled={syncing}><Plus size={16} /></button>
                  <button className="icon-btn" title="Edit Card" onClick={() => {setEditingId(topic.id); setEditData(topic);}}><Edit3 size={16} /></button>
                  <button className="icon-btn" title="Delete" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(topic.id)}><Trash2 size={16} /></button>
                </div>

                <div style={{ marginBottom: '1.25rem', paddingRight: '4rem' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{topic.subjectName}</span>
                  <h3 style={{ margin: '0.15rem 0 0.4rem', fontSize: '1.3rem' }}>{topic.topicName}</h3>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                      <AlertTriangle size={13} color={topic.difficulty === 'Hard' ? 'var(--danger)' : 'var(--success)'} /> {topic.difficulty} Priority
                    </span>
                  </div>
                </div>
                
                <div className="syllabus-grid">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0, fontSize: '0.9rem' }}><Book size={16} color="var(--accent)" /> Concept Mastery</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {topic.subtopics.map((sub: string, i: number) => (
                        <span key={i} style={{ background: 'var(--bg-secondary)', padding: '0.25rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid var(--border)' }}>
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0, fontSize: '0.9rem' }}><LinkIcon size={16} color="var(--accent)" /> Learning Path</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {topic.resources?.map((res: string, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                           <CheckCircle2 size={12} color="var(--success)" /> {res}
                        </div>
                      ))}
                      {topic.youtubeSearchUrl && (
                        <a href={topic.youtubeSearchUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ marginTop: '0.25rem', borderRadius: '10px', color: 'var(--danger)', fontSize: '0.75rem', padding: '0.4rem', justifyContent: 'center' }}>
                          <Video size={14} /> View Lectures
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .icon-btn { background: var(--bg-primary); border: 1px solid var(--border); border-radius: 8px; padding: 5px; cursor: pointer; color: var(--text-secondary); transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .icon-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }
        
        .syllabus-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .syllabus-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
