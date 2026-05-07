'use client';

interface KeyboardShortcutsModalProps {
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ onClose }: KeyboardShortcutsModalProps) {
  const shortcuts = [
    { keys: ['Ctrl', 'N'], description: 'Create new snippet' },
    { keys: ['Ctrl', 'K'], description: 'Focus search' },
    { keys: ['Ctrl', '/'], description: 'Show shortcuts' },
    { keys: ['Esc'], description: 'Close modal' },
  ];

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card w-full max-w-sm" style={{ padding: '24px' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Keyboard Shortcuts</h2>
          <button onClick={onClose} className="btn-icon" style={{ width: '28px', height: '28px', borderRadius: '7px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="space-y-2.5">
          {shortcuts.map((s, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-2 px-3 rounded-lg"
              style={{ background: i % 2 === 0 ? 'var(--border-subtle)' : 'transparent' }}
            >
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.description}</span>
              <div className="flex gap-1">
                {s.keys.map((key, j) => (
                  <kbd
                    key={j}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-sans)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    }}
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
