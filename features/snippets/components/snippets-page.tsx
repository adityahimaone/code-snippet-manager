'use client';

import { useSnippetStore } from '@/lib/store/snippet-store';
import SearchBar from './search-bar';
import FilterBar from './filter-bar';
import SnippetCard from './snippet-card';
import SnippetEditor from './snippet-editor';
import SnippetDetail from './snippet-detail';
import { useState } from 'react';

export default function SnippetsPage() {
  const { getFilteredSnippets, setEditorOpen, isEditorOpen, selectedSnippet, setSelectedSnippet } = useSnippetStore();
  const [isCreating, setIsCreating] = useState(false);
  const snippets = getFilteredSnippets();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-display tracking-tight mb-2">CODE SNIPPETS</h1>
              <p className="text-orange-500 text-sm">Personal code snippet manager</p>
            </div>
            <button
              onClick={() => {
                setSelectedSnippet(null);
                setIsCreating(true);
              }}
              className="outlined-button"
            >
              + New Snippet
            </button>
          </div>
          <SearchBar />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <FilterBar />
            </div>
          </aside>

          {/* Main - Snippets Grid */}
          <main className="lg:col-span-3">
            {snippets.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg mb-4">No snippets found</p>
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
              <div className="grid gap-6">
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
    </div>
  );
}
