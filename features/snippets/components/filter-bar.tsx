'use client';

import { useSnippetStore } from '@/lib/store/snippet-store';
import { SUPPORTED_LANGUAGES } from '@/lib/types';

export default function FilterBar() {
  const {
    selectedLanguage,
    setSelectedLanguage,
    selectedTags,
    setSelectedTags,
    getAllTags,
    resetFilters,
  } = useSnippetStore();

  const tags = getAllTags();
  const hasFilters = selectedLanguage || selectedTags.length > 0;

  return (
    <div className="space-y-5">
      {/* Language Filter */}
      <div>
        <span className="section-label">Language</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedLanguage(null)}
            className={`pill-filter ${!selectedLanguage ? 'active' : ''}`}
          >
            All
          </button>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              onClick={() => setSelectedLanguage(lang.value)}
              className={`pill-filter ${selectedLanguage === lang.value ? 'active' : ''}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      {tags.length > 0 && (
        <div>
          <span className="section-label">Tags</span>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => {
                    if (isActive) {
                      setSelectedTags(selectedTags.filter((t) => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                  className={`pill-filter ${isActive ? 'active' : ''}`}
                  style={isActive ? {
                    background: 'var(--accent-secondary-soft)',
                    borderColor: 'var(--accent-secondary)',
                    color: 'var(--accent-secondary)',
                  } : undefined}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Reset */}
      {hasFilters && (
        <button onClick={resetFilters} className="btn-ghost text-xs w-full">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          Reset Filters
        </button>
      )}
    </div>
  );
}
