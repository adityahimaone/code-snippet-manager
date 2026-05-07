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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'var(--bg-overlay)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="card w-full max-w-md"
        style={{ background: 'var(--bg-card)', padding: '24px' }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Keyboard Shortcuts</h2>

        <div className="space-y-3">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.description}</span>
              <div className="flex gap-1">
                {s.keys.map((key, j) => (
                  <kbd
                    key={j}
                    className="px-2 py-0.5 text-xs rounded-md font-mono"
                    style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--border-default)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="btn-ghost w-full mt-6">Close</button>
      </div>
    </div>
  );
}
