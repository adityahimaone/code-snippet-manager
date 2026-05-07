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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-display mb-4">Keyboard Shortcuts</h2>
        
        <div className="space-y-3">
          {shortcuts.map((shortcut, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-gray-400">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, j) => (
                  <kbd
                    key={j}
                    className="px-2 py-1 bg-black border border-gray-700 rounded text-xs"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="ghost-button w-full mt-6"
        >
          Close
        </button>
      </div>
    </div>
  );
}
