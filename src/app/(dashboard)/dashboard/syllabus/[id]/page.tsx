'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FileText, Link as LinkIcon, Book, Sparkles, 
  Video, ArrowLeft, Loader2, GraduationCap, 
  ExternalLink, Library, ChevronRight, Activity, Clock
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function TopicDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [topic, setTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'docs' | 'links' | 'practice'>('docs');

  useEffect(() => {
    fetchTopic();
  }, [params.id]);

  const fetchTopic = async () => {
    try {
      const res = await fetch(`/api/syllabus/${params.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTopic(data.topic);
    } catch (e) {
      toast.error("Failed to load topic details.");
      router.push('/dashboard/syllabus');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 className="spin" size={40} color="var(--accent)" />
      </div>
    );
  }

  if (!topic) return null;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Back Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={() => router.back()} 
          className="btn-secondary" 
          style={{ padding: '0.6rem', borderRadius: '12px' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{topic.subjectName || 'Syllabus'}</p>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{topic.topicName}</h1>
        </div>
      </div>

      <div className="responsive-grid-wide" style={{ alignItems: 'flex-start' }}>
        {/* Main Content Area */}
        <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', padding: '6px', borderRadius: '14px', width: 'fit-content', marginBottom: '2rem' }}>
            {[
              { id: 'docs', label: 'Documentation', icon: <Library size={16} /> },
              { id: 'links', label: 'Resources', icon: <LinkIcon size={16} /> },
              { id: 'practice', label: 'Practice', icon: <GraduationCap size={16} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                  transition: '0.2s'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="fade-in">
            {activeTab === 'docs' && (
              <div>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={20} color="var(--accent)" /> Topic Details
                </h2>
                <div 
                  className="docs-content"
                  style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-primary)', opacity: 0.9 }}
                  dangerouslySetInnerHTML={{ __html: topic.documentation || '<p>No detailed documentation available.</p>' }} 
                />
              </div>
            )}

            {activeTab === 'links' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Video size={20} color="var(--danger)" /> Curated Resources
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  <a href={topic.youtubeSearchUrl} target="_blank" rel="noopener noreferrer" className="bento-card" style={{ padding: '1.5rem', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                      <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: 'fit-content', padding: '10px', borderRadius: '12px' }}>
                        <Video size={24} color="var(--danger)" />
                      </div>
                      <div>
                          <p style={{ margin: 0, fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>Video Lectures</p>
                          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Master this topic with visual guides on YouTube.</p>
                      </div>
                  </a>
                  {topic.resources?.map((res: string, i: number) => (
                      <div key={i} className="bento-card" style={{ padding: '1.5rem', display: 'flex', gap: '12px' }}>
                          <ExternalLink size={20} color="var(--accent)" />
                          <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{res}</p>
                      </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'practice' && (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <GraduationCap size={20} color="var(--accent)" /> Practice Area
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {topic.practiceQuestions?.length > 0 ? topic.practiceQuestions.map((pq: any, i: number) => (
                        <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                            <div style={{ background: 'var(--accent-glow)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: '800', flexShrink: 0 }}>{i+1}</div>
                            <div>
                                <p style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: '600', lineHeight: 1.5 }}>{pq.question}</p>
                                <span style={{ fontSize: '0.7rem', padding: '4px 12px', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border)', textTransform: 'uppercase', fontWeight: 800, color: 'var(--accent)' }}>{pq.type}</span>
                            </div>
                        </div>
                    )) : (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>No practice questions available.</p>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '1px' }}>TOPIC INFO</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--accent-glow)', padding: '8px', borderRadius: '10px' }}><Activity size={18} color="var(--accent)" /></div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>DIFFICULTY</p>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: topic.difficulty === 'Hard' ? 'var(--danger)' : 'var(--success)' }}>{topic.difficulty}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(34,197,94,0.1)', padding: '8px', borderRadius: '10px' }}><Clock size={18} color="var(--success)" /></div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>EST. TIME</p>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>4 - 6 Hours</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '1px' }}>KEY TOPICS</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {topic.subtopics?.map((sub: string, i: number) => (
                <span key={i} style={{ background: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid var(--border)', fontWeight: 600 }}>
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .docs-content p { margin-bottom: 1.25rem; }
        .docs-content h1, .docs-content h2, .docs-content h3 { margin-top: 2rem; margin-bottom: 1rem; color: var(--text-primary); }
        .docs-content ul { padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .docs-content li { margin-bottom: 0.5rem; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
