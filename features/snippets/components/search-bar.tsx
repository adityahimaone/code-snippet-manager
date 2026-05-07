'use client';

import { useSnippetStore } from '@/lib/store/snippet-store';
import { useState, forwardRef } from 'react';

const SearchBar = forwardRef<HTMLInputElement>((props, ref) => {
  const { searchQuery, setSearchQuery } = useSnippetStore();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
      </span>
      <input
        ref={ref}
        type="text"
        placeholder="Search snippets..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="input"
        style={{
          paddingLeft: '40px',
          paddingRight: searchQuery ? '40px' : '16px',
          borderColor: isFocused ? 'var(--text-primary)' : undefined,
        }}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          ✕
        </button>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
export default SearchBar;
