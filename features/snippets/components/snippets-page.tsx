'use client';

import { useSnippetStore } from '@/lib/store/snippet-store';
import SearchBar from './search-bar';
import FilterBar from './filter-bar';
import SnippetCard from './snippet-card';
import SnippetEditor from './snippet-editor';
import SnippetDetail from './snippet-detail';
import ExportImportButtons from './export-import-buttons';
import ThemeSelector from './theme-selector';
import KeyboardShortcutsModal from './keyboard-shortcuts-modal';
import { useKeyboardShortcuts } from '@/lib/hooks/use-keyboard-shortcuts';
import { useState, useRef } from 'react';

export default function SnippetsPage() {
  const { getFilteredSnippets, selectedSnippet, setSelectedSnippet } = useSnippetStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<any>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const snippets = getFilteredSnippets();

  useKeyboardShortcuts([
    {
      key: 'n',
      ctrl: true,
      description: 'Create new snippet',
      action: () => { setSelectedSnippet(null); setIsCreating(true); },
    },
    {
      key: 'k',
      ctrl: true,
      description: 'Focus search',
      action: () => { searchInputRef.current?.focus(); },
    },
    {
      key: '/',
      ctrl: true,
      description: 'Show shortcuts',
      action: () => { setShowShortcuts(true); },
    },
    {
      key: 'Escape',
      description: 'Close modal',
      action: () => {
        if (showShortcuts) setShowShortcuts(false);
        else if (isCreating) setIsCreating(false);
        else if (editingSnippet) setEditingSnippet(null);
        else if (selectedSnippet) setSelectedSnippet(null);
      },
    },
  ]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      {/* Top Navigation Bar */}
      <nav
        className="sticky top-0 z-40 px-4 md:px-6"
        style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-glass)', backdropFilter: 'blur(16px) saturate(1.4)', WebkitBackdropFilter: 'blur(16px) saturate(1.4)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            {/* Logo icon */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--accent-primary)', color: '#000' }}
            >
              {'</>'}
            </div>
            <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Snippets
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-primary-soft)', color: '#000', fontWeight: 600 }}>
              {snippets.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShortcuts(true)}
              className="btn-icon text-xs"
              title="Keyboard shortcuts (Ctrl+/)"
            >
              ⌨
            </button>
            <button
              onClick={() => { setSelectedSnippet(null); setIsCreating(true); }}
              className="btn-primary"
            >
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:inline">New Snippet</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Search bar row */}
        <div className="mb-6">
          <SearchBar ref={searchInputRef} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="lg:block">
            <div className="lg:sticky lg:top-20 space-y-6">
              <FilterBar />
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
                <ExportImportButtons />
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
                <ThemeSelector />
              </div>
            </div>
          </aside>

          {/* Main grid */}
          <main>
            {snippets.length === 0 ? (
              <div
                className="card flex flex-col items-center justify-center text-center py-20 px-8"
                style={{ borderStyle: 'dashed' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: 'var(--accent-primary-soft)', color: 'var(--accent-primary)' }}
                >
                  {'</>'}
                </div>
                <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  No snippets yet
                </p>
                <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                  Save your first code snippet to get started
                </p>
                <button
                  onClick={() => { setSelectedSnippet(null); setIsCreating(true); }}
                  className="btn-primary"
                >
                  + Create snippet
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {snippets.map((snippet) => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={snippet}
                    onEdit={(s) => setEditingSnippet(s)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      {(isCreating || editingSnippet) && (
        <SnippetEditor
          snippet={editingSnippet || undefined}
          onClose={() => { setIsCreating(false); setEditingSnippet(null); }}
        />
      )}
      {selectedSnippet && !isCreating && !editingSnippet && (
        <SnippetDetail onEdit={(s) => { setSelectedSnippet(null); setEditingSnippet(s); }} />
      )}
      {showShortcuts && (
        <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  );
}
