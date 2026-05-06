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
    <div className="space-y-4">
      {/* Language Filter */}
      <div>
        <span className="text-orange-500 text-xs font-medium uppercase tracking-wider mb-3 block">
          Language
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedLanguage(null)}
            className={`px-4 py-2 text-xs rounded-lg border transition-all ${
              !selectedLanguage
                ? 'border-white bg-white text-black'
                : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200'
            }`}
          >
            All
          </button>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              onClick={() => setSelectedLanguage(lang.value)}
              className={`px-4 py-2 text-xs rounded-lg border transition-all ${
                selectedLanguage === lang.value
                  ? 'border-white bg-white text-black'
                  : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      {tags.length > 0 && (
        <div>
          <span className="text-orange-500 text-xs font-medium uppercase tracking-wider mb-3 block">
            Tags
          </span>
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
                  className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                    isActive
                      ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                      : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200'
                  }`}
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
        <button
          onClick={resetFilters}
          className="ghost-button text-xs"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
