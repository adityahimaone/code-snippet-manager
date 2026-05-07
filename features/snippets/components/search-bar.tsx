'use client';

import { useSnippetStore } from '@/lib/store/snippet-store';
import { useState, forwardRef } from 'react';

const SearchBar = forwardRef<HTMLInputElement>((props, ref) => {
  const { searchQuery, setSearchQuery } = useSnippetStore();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: isFocused ? 'var(--text-primary)' : 'var(--text-faint)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
      </span>
      <input
        ref={ref}
        type="text"
        placeholder="Search snippets by title, description, or code..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="input"
        style={{
          paddingLeft: '40px',
          paddingRight: searchQuery ? '40px' : '14px',
          height: '44px',
          borderRadius: '12px',
          fontSize: '14px',
        }}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 btn-icon"
          style={{ width: '26px', height: '26px', borderRadius: '6px', border: 'none', background: 'var(--border-subtle)', fontSize: '11px' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
export default SearchBar;
