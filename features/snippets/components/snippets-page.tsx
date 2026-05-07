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
  const { getFilteredSnippets, setEditorOpen, isEditorOpen, selectedSnippet, setSelectedSnippet } = useSnippetStore();
  const [isCreating, setIsCreating] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const snippets = getFilteredSnippets();

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'n',
      ctrl: true,
      description: 'Create new snippet',
      action: () => {
        setSelectedSnippet(null);
        setIsCreating(true);
      },
    },
    {
      key: 'k',
      ctrl: true,
      description: 'Focus search',
      action: () => {
        searchInputRef.current?.focus();
      },
    },
    {
      key: '/',
      ctrl: true,
      description: 'Show shortcuts',
      action: () => {
        setShowShortcuts(true);
      },
    },
    {
      key: 'Escape',
      description: 'Close modal',
      action: () => {
        if (showShortcuts) {
          setShowShortcuts(false);
        } else if (isCreating) {
          setIsCreating(false);
        } else if (selectedSnippet) {
          setSelectedSnippet(null);
        }
      },
    },
  ]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 py-6 md:py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-display tracking-tight mb-2">CODE SNIPPETS</h1>
              <p className="text-orange-500 text-xs md:text-sm">Personal code snippet manager</p>
            </div>
            <button
              onClick={() => {
                setSelectedSnippet(null);
                setIsCreating(true);
              }}
              className="outlined-button w-full md:w-auto"
            >
              + New Snippet
            </button>
          </div>
          <SearchBar ref={searchInputRef} />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-8 space-y-6 md:space-y-8">
              <FilterBar />
              <ExportImportButtons />
              <ThemeSelector />
            </div>
          </aside>

          {/* Main - Snippets Grid */}
          <main className="lg:col-span-3">
            {snippets.length === 0 ? (
              <div className="text-center py-12 md:py-16">
                <p className="text-gray-500 text-base md:text-lg mb-4">No snippets found</p>
                <button
                  onClick={() => {
                    setSelectedSnippet(null);
                    setIsCreating(true);
                  }}
                  className="outlined-button"
                >
                  Create your first snippet
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:gap-6">
                {snippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      {isCreating && (
        <SnippetEditor
          onClose={() => setIsCreating(false)}
        />
      )}
      {selectedSnippet && (
        <SnippetDetail />
      )}
      {showShortcuts && (
        <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  );
}
