'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useStore } from '@/store/useStore';
import { 
  Moon, Sun, User, Shield, Bell, LogOut, 
  ChevronRight, ExternalLink, Smartphone, Mail, Globe 
} from 'lucide-react';

export default function Settings() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { theme, toggleTheme } = useStore();

  const ActionTile = ({ icon: Icon, title, desc, action }: any) => (
    <div style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      padding: '1.2rem', background: 'var(--bg-secondary)', 
      borderRadius: '16px', marginBottom: '0.75rem', border: '1px solid var(--border)' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ color: 'var(--accent)', background: 'var(--accent-glow)', padding: '8px', borderRadius: '10px' }}>
          <Icon size={20} />
        </div>
        <div>
          <strong style={{ display: 'block', fontSize: '0.95rem' }}>{title}</strong>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{desc}</p>
        </div>
      </div>
      {action}
    </div>
  );

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* --- HEADER --- */}
      <header>
        <h1 className="gradient-text" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '0.5rem' }}>Manage your account preferences and theme.</p>
      </header>

      {/* --- PROFILE SECTION --- */}
      <section className="bento-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '85px', height: '85px', borderRadius: '24px', background: 'var(--accent)', overflow: 'hidden', border: '3px solid var(--accent-glow)' }}>
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <User size={40} />
                </div>
              )}
            </div>
            <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: 'var(--success)', width: '20px', height: '20px', borderRadius: '50%', border: '4px solid var(--bg-primary)' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{user?.fullName || 'Academic Participant'}</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0' }}>{user?.primaryEmailAddress?.emailAddress}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '4px 10px', background: 'var(--accent-glow)', color: 'var(--accent)', borderRadius: '99px' }}>PRO USER</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '4px 10px', background: 'var(--border)', color: 'var(--text-secondary)', borderRadius: '99px' }}>STUDENT ID: {user?.id.slice(-6).toUpperCase()}</span>
            </div>
          </div>
        </div>

        <button className="btn-secondary" style={{ width: '100%', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} onClick={() => window.open('https://accounts.clerk.com/user', '_blank')}>
          Edit Profile Identity <ExternalLink size={16} />
        </button>
      </section>

      {/* --- PREFERENCES GRID --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Appearance */}
        <section>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="var(--accent)" /> Interface
          </h3>
          <ActionTile 
            icon={theme === 'dark' ? Moon : Sun}
            title="Dark Mode"
            desc="Toggle high-contrast neural theme"
            action={
              <button onClick={toggleTheme} className="ios-switch" style={{ background: theme === 'dark' ? 'var(--accent)' : '#d1d5db' }}>
                <div style={{ left: theme === 'dark' ? '26px' : '4px' }} />
              </button>
            }
          />
        </section>

        {/* Communications */}
        <section>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="var(--accent)" /> Protocols
          </h3>
          <ActionTile 
            icon={Smartphone}
            title="Push Alerts"
            desc="Critical deadline notifications"
            action={<input type="checkbox" defaultChecked className="ios-checkbox" />}
          />
          <ActionTile 
            icon={Mail}
            title="Weekly Reports"
            desc="AI performance breakdown"
            action={<input type="checkbox" defaultChecked className="ios-checkbox" />}
          />
        </section>
      </div>

      {/* --- SECURITY & SESSION --- */}
      <section className="bento-card" style={{ padding: '2rem', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={22} color="var(--accent)" /> Security & Session
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Your authentication is handled via Clerk's encrypted tunneling. Active sessions are monitored to ensure data integrity across the CampusIQ network.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-secondary" style={{ borderRadius: '12px' }} onClick={() => window.open('https://accounts.clerk.com/user', '_blank')}>
                Security Dashboard
            </button>
            <button 
                className="btn-primary" 
                style={{ background: 'var(--danger)', color: '#fff', borderRadius: '12px', border: 'none' }}
                onClick={() => signOut({ redirectUrl: '/' })}
            >
                Logout Session
            </button>
        </div>
      </section>

      <style jsx global>{`
        .ios-switch {
          width: 50px; height: 26px; border-radius: 20px; border: none; 
          cursor: pointer; position: relative; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ios-switch div {
          width: 20px; height: 20px; border-radius: 50%; background: white;
          position: absolute; top: 3px; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .ios-checkbox {
          width: 20px; height: 20px; accent-color: var(--accent); cursor: pointer;
        }
        @media (max-width: 600px) {
            .gradient-text { fontSize: 1.8rem !important; }
        }
      `}</style>
    </div>
  );
}