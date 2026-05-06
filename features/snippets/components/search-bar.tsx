'use client';

import { useSnippetStore } from '@/lib/store/snippet-store';
import { useState } from 'react';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useSnippetStore();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search snippets..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full px-6 py-3 bg-black border-2 rounded-lg font-body text-sm transition-all ${
          isFocused
            ? 'border-white text-white'
            : 'border-gray-600 text-gray-400'
        }`}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}
