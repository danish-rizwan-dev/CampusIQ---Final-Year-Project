import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div style={{ 
      display: 'flex', 
      height: '60vh', 
      width: '100%', 
      alignItems: 'center', 
      justifyContent: 'center', 
      flexDirection: 'column', 
      gap: '1rem' 
    }}>
      <div style={{ position: 'relative' }}>
        <div style={{ 
          width: '60px', 
          height: '60px', 
          border: '3px solid var(--accent-glow)', 
          borderRadius: '50%', 
          borderTopColor: 'var(--accent)', 
          animation: 'spin 1s linear infinite' 
        }} />
        <Loader2 
          size={24} 
          color="var(--accent)" 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            animation: 'pulse 2s ease-in-out infinite'
          }} 
        />
      </div>
      <p style={{ 
        color: 'var(--text-secondary)', 
        fontSize: '0.9rem', 
        fontWeight: '600',
        letterSpacing: '0.05em' 
      }}>
        SYNCHRONIZING NEURAL OS...
      </p>
      
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 
          0%, 100% { transform: translate(-50%, -50%) scale(0.9); }
          50% { transform: translate(-50%, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
