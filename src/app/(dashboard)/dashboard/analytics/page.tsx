'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Target, Brain, Award, Loader2,
  BarChart3, Info, Activity, AlertTriangle, Calendar, HelpCircle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

interface BarProps { value: number; color: string; label: string; tooltip: string; }
function MetricBar({ value, color, label, tooltip }: BarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }} title={tooltip}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{label}</span>
        <span style={{ fontSize: '0.8rem', fontWeight: '800', color }}>{Math.round(value)}%</span>
      </div>
      <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      </div>
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics/summary');
      const json = await res.json();
      setData(json);
    } catch (err) {
      toast.error("Failed to load analytics data.");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={40} className="spin" color="var(--accent)" />
        <p style={{ color: 'var(--text-secondary)' }}>Aggregating Campus Intelligence...</p>
      </div>
    );
  }

  if (!data?.hasData) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem' }}>
        <div className="glass-card" style={{ padding: '4rem', borderRadius: '32px' }}>
          <Activity size={64} color="var(--accent)" style={{ opacity: 0.5, marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No Academic Data Yet</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Complete your first semester evaluation and generate a roadmap to see advanced performance tracking and AI-driven growth metrics.
          </p>
          <button className="btn-primary" onClick={() => window.location.href = '/dashboard/roadmap'}>Start Your Roadmap</button>
        </div>
      </div>
    );
  }

  const { latest, trend, weakness, chartData, careerReadiness } = data;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.85rem' }}>Semester {label}</p>
          <p style={{ margin: 0, color: 'var(--accent)', fontSize: '1.1rem', fontWeight: '800' }}>Score: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem', paddingBottom: '4rem' }}>
      <header className="page-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', margin: 0 }}>Performance</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>Track your grades and see how you're growing.</p>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
          <Calendar size={16} color="var(--accent)" /> <span>2026-27</span>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="responsive-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', padding: '0.6rem', borderRadius: '10px' }}>
              <Activity size={20} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: trend.improving ? 'var(--success)' : 'var(--danger)', fontSize: '0.8rem', fontWeight: 'bold', padding: '0.15rem 0.5rem', background: trend.improving ? 'var(--success-glow)' : 'var(--danger-glow)', borderRadius: '8px' }}>
              {trend.improving ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend.change}%
            </div>
          </div>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Your Score</h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '2rem', fontWeight: '900' }}>{Math.round(latest.score)}<span style={{ fontSize: '1rem', opacity: 0.4 }}>/100</span></p>
        </div>

        <div className="glass-card">
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '0.6rem', borderRadius: '10px', marginBottom: '1rem', width: 'fit-content' }}>
            <Target size={20} />
          </div>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Career Readiness</h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '2rem', fontWeight: '900' }}>{Math.round(careerReadiness)}<span style={{ fontSize: '1rem', opacity: 0.4 }}>%</span></p>
          <div style={{ width: '100%', height: '5px', background: 'var(--border)', borderRadius: '3px', marginTop: '1rem' }}>
            <div style={{ width: `${careerReadiness}%`, height: '100%', background: '#8b5cf6', borderRadius: '3px' }} />
          </div>
        </div>

        <div className="glass-card" style={{ border: '1px solid var(--danger-glow)' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.6rem', borderRadius: '10px', marginBottom: '1rem', width: 'fit-content' }}>
            <AlertTriangle size={20} />
          </div>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Critical Weakness</h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '1.4rem', fontWeight: '900', color: 'var(--danger)' }}>{weakness.name}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Current focus: {Math.round(weakness.value)}%</p>
        </div>
      </div>

      <div className="responsive-grid-wide" style={{ gap: '1.5rem' }}>
        {/* Trend Chart */}
        <div className="glass-card" style={{ padding: 'clamp(1rem, 5vw, 2.5rem)', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
              <BarChart3 size={18} color="var(--accent)" /> Grade History
            </h3>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="sem" name="Semester" stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val: number | string) => `S${val}`} />
                <YAxis stroke="var(--text-secondary)" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metric Breakdown */}
        <div className="glass-card" style={{ padding: 'clamp(1rem, 5vw, 2.5rem)', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="var(--success)" /> Subject Breakdown
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <MetricBar value={latest.gpa} color="var(--accent)" label="GPA Stability" tooltip="Consistency" />
            <MetricBar value={latest.assignments} color="var(--success)" label="Assignment Vigor" tooltip="Quality rate" />
            <MetricBar value={latest.consistency} color="var(--warning)" label="Time Consistency" tooltip="Study hours" />
            <MetricBar value={latest.concepts} color="#8b5cf6" label="Concept Mastery" tooltip="Theory exams" />
            <MetricBar value={latest.mock} color="var(--danger)" label="Mock Readiness" tooltip="Simulation test" />
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--accent-glow)', borderRadius: '16px', border: '1px solid var(--accent)' }}>
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--accent)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Brain size={16} /> Performance Tip
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              Strengthening <strong>{weakness.name}</strong> could boost your score by <strong>{Math.round((100 - weakness.value) * 0.15)}%</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Mock Exam History Section */}
      {data.mockExams?.length > 0 && (
        <div className="glass-card" style={{ padding: 'clamp(1rem, 5vw, 2.5rem)', borderRadius: '24px' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem' }}>
            <Award size={20} color="var(--accent)" /> Recent Mock History
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {data.mockExams.map((exam: any) => (
              <div key={exam.id} style={{ padding: '1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800' }}>{exam.subject}</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {new Date(exam.date).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '950', color: exam.score >= 40 ? 'var(--success)' : 'var(--danger)' }}>
                    {Math.round(exam.score)}%
                  </div>
                  <span style={{ fontSize: '0.65rem', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                    {exam.score >= 40 ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Strategy Insights */}
      <div className="glass-card" style={{ border: '1px solid var(--accent)', background: 'var(--accent-glow)', borderRadius: '24px', padding: 'clamp(1rem, 5vw, 2.5rem)' }}>
        <h2 style={{ color: 'var(--accent)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem' }}>
          <Brain size={28} /> AI Tips for You
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <InsightCard
            title="PERFORMANCE"
            text={trend.improving
              ? `You've demonstrated a strong performance boost of ${trend.change}% compared to your previous assessment.`
              : `Your recent performance dip of ${Math.abs(Number(trend.change))}% suggests a focus shift. Revisit Month 2.`}
            color="var(--accent)"
          />
          <InsightCard
            title="ADVISORY"
            text={`Your current academic bottleneck is ${weakness.name}. Use the Syllabus tool to break down complex topics.`}
            color="var(--warning)"
          />
          <InsightCard
            title="CAREER PATH"
            text={`At ${Math.round(careerReadiness)}% readiness, you are well-positioned for junior roles. Maintain high GPA targets.`}
            color="var(--success)"
          />
        </div>
      </div>

      <style jsx>{`
        .spin { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.8s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

function InsightCard({ title, text, color }: { title: string, text: string, color: string }) {
  return (
    <div style={{ background: 'var(--bg-primary)', padding: '1.8rem', borderRadius: '24px', border: '1px solid var(--border)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-12px', left: '20px', background: color, color: 'white', padding: '0.3rem 1rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: `0 4px 10px ${color}44` }}>{title}</div>
      <p style={{ lineHeight: '1.8', margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{text}</p>
    </div>
  );
}

function SparklesIcon({ size }: { size: number }) {
  return <Brain size={size} style={{ color: 'var(--accent)' }} />;
}
