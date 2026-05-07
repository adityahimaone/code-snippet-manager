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
    <div className="space-y-6">
      {/* Language Filter */}
      <div>
        <span className="section-label">Language</span>
        <div className="flex flex-wrap gap-2">
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
          <div className="flex flex-wrap gap-2">
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
                    background: 'rgba(216, 114, 60, 0.12)',
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
        <button onClick={resetFilters} className="btn-ghost text-xs">
          Reset Filters
        </button>
      )}
    </div>
  );
}
