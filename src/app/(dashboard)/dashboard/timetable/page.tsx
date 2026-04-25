'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface ClassEntry {
  id: string;
  subjectName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  location: string;
  attendanceStats: number;
}

interface TaskEntry {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  priority: string;
  status: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

import { toast } from 'sonner';

export default function Timetable() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'tasks'>('schedule');
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [loading, setLoading] = useState(true);

  const [classes, setClasses] = useState<ClassEntry[]>([]);
  const [tasks, setTasks] = useState<TaskEntry[]>([]);

  const [newClass, setNewClass] = useState({ subjectName: '', dayOfWeek: 1, startTime: '09:00', endTime: '10:00', location: '' });
  const [newTask, setNewTask] = useState({ title: '', type: 'Assignment', dueDate: '', priority: 'MEDIUM' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schedRes, taskRes] = await Promise.all([
        fetch('/api/schedule').catch(() => ({ ok: false, json: () => ({ error: 'Network error' }) })),
        fetch('/api/tasks').catch(() => ({ ok: false, json: () => ({ error: 'Network error' }) }))
      ]);

      if (schedRes.ok) {
        const schedData = await (schedRes as Response).json();
        setClasses(schedData.schedule || []);
      } else {
        toast.error('Failed to load schedule');
      }

      if (taskRes.ok) {
        const taskData = await (taskRes as Response).json();
        setTasks(taskData.tasks || []);
      } else {
        toast.error('Failed to load tasks');
      }

    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('An unexpected error occurred while syncing data.');
    }
    setLoading(false);
  };

  const addClass = async () => {
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClass),
      });
      if (res.ok) {
        fetchData();
        setShowAddClass(false);
        setNewClass({ subjectName: '', dayOfWeek: 1, startTime: '09:00', endTime: '10:00', location: '' });
      }
    } catch (error) {
      console.error('Add class error:', error);
    }
  };

  const addTask = async () => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        fetchData();
        setShowAddTask(false);
        setNewTask({ title: '', type: 'Assignment', dueDate: '', priority: 'MEDIUM' });
      }
    } catch (error) {
      console.error('Add task error:', error);
    }
  };

  const toggleTaskStatus = async (id: string, currentStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED' }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const removeTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error('Remove error:', error);
    }
  };

  const priorityColor = (p: string) => p === 'HIGH' ? 'var(--danger)' : p === 'MEDIUM' ? 'var(--warning)' : 'var(--success)';

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="page-header">
        <div>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', margin: 0 }}>Class Schedule</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0', fontSize: '0.9rem' }}>Manage your classes and upcoming tasks.</p>
        </div>
        <div className="stack-on-mobile">
          <button
            className={activeTab === 'schedule' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('schedule')}
          >Classes</button>
          <button
            className={activeTab === 'tasks' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveTab('tasks')}
          >Assignments</button>
        </div>
      </div>

      {activeTab === 'schedule' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <button className="btn-primary" style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowAddClass(true)}>
            <Plus size={18} /> Add Class
          </button>

          {/* Weekly Grid */}
          <div className="glass-card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)', width: '100px' }}>Time</th>
                  {DAYS.map(d => (
                    <th key={d} style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'center' }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HOURS.map(hour => (
                  <tr key={hour}>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', borderTop: '1px solid var(--border)' }}>{hour}</td>
                    {DAYS.map((day, dayIndex) => {
                      const entry = classes.find(c => c.dayOfWeek === (dayIndex + 1) && c.startTime === hour);
                      return (
                        <td key={day} style={{ padding: '0.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                          {entry && (
                            <div style={{
                              background: 'var(--accent-glow)',
                              border: `1px solid var(--accent)`,
                              borderRadius: '8px', padding: '0.5rem', fontSize: '0.8rem'
                            }}>
                              <strong style={{ display: 'block' }}>{entry.subjectName}</strong>
                              <span style={{ color: 'var(--text-secondary)' }}>{entry.location}</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showAddClass && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div className="glass-card" style={{ width: '100%', maxWidth: '450px' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Add New Class</h3>
                <label>Subject Name</label>
                <input className="input-field" value={newClass.subjectName} onChange={e => setNewClass({ ...newClass, subjectName: e.target.value })} />
                <label>Day</label>
                <select className="input-field" value={newClass.dayOfWeek} onChange={e => setNewClass({ ...newClass, dayOfWeek: Number(e.target.value) })}>
                  {DAYS.map((d, i) => <option key={d} value={i+1}>{d}</option>)}
                </select>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><label>Start</label><input type="time" className="input-field" value={newClass.startTime} onChange={e => setNewClass({ ...newClass, startTime: e.target.value })} /></div>
                  <div><label>End</label><input type="time" className="input-field" value={newClass.endTime} onChange={e => setNewClass({ ...newClass, endTime: e.target.value })} /></div>
                </div>
                <label>Location</label>
                <input className="input-field" placeholder="Room / Lab" value={newClass.location} onChange={e => setNewClass({ ...newClass, location: e.target.value })} />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddClass(false)}>Cancel</button>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={addClass}>Add Class</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <button className="btn-primary" style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowAddTask(true)}>
            <Plus size={18} /> Add Task
          </button>

          <div className="glass-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.map(task => (
                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '10px', borderLeft: `4px solid ${priorityColor(task.priority)}`, opacity: task.status === 'COMPLETED' ? 0.6 : 1 }}>
                  <input type="checkbox" checked={task.status === 'COMPLETED'} onChange={() => toggleTaskStatus(task.id, task.status)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none' }}>{task.title}</strong>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{task.type}</span>
                      <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-secondary)' }}>
                        <Clock size={13} /> {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: priorityColor(task.priority) }}>{task.priority}</span>
                  <button onClick={() => removeTask(task.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {tasks.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No tasks found in database. Add one above!</p>}
            </div>
          </div>

          {showAddTask && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div className="glass-card" style={{ width: '100%', maxWidth: '450px' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Add New Task</h3>
                <label>Task Title</label>
                <input className="input-field" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
                <label>Type</label>
                <select className="input-field" value={newTask.type} onChange={e => setNewTask({ ...newTask, type: e.target.value })}>
                  <option>Assignment</option><option>Project</option><option>Lab</option><option>Study</option><option>Exam Prep</option>
                </select>
                <label>Due Date</label>
                <input type="date" className="input-field" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
                <label>Priority</label>
                <select className="input-field" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                  <option>LOW</option><option>MEDIUM</option><option>HIGH</option>
                </select>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddTask(false)}>Cancel</button>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={addTask}>Add Task</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
