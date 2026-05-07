import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Snippet } from '@/lib/types';

interface SnippetStore {
  snippets: Snippet[];
  searchQuery: string;
  selectedLanguage: string | null;
  selectedTags: string[];
  selectedSnippet: Snippet | null;
  isEditorOpen: boolean;

  addSnippet: (snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSnippet: (id: string, updates: Partial<Snippet>) => void;
  deleteSnippet: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedLanguage: (language: string | null) => void;
  setSelectedTags: (tags: string[]) => void;
  setSelectedSnippet: (snippet: Snippet | null) => void;
  setEditorOpen: (open: boolean) => void;
  resetFilters: () => void;

  getAllTags: () => string[];
  getFilteredSnippets: () => Snippet[];
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useSnippetStore = create<SnippetStore>()(
  persist(
    (set, get) => ({
      snippets: [],
      searchQuery: '',
      selectedLanguage: null,
      selectedTags: [],
      selectedSnippet: null,
      isEditorOpen: false,

      addSnippet: (snippet) => {
        const newSnippet: Snippet = {
          ...snippet,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          snippets: [newSnippet, ...state.snippets],
        }));
      },

      updateSnippet: (id, updates) => {
        set((state) => ({
          snippets: state.snippets.map((s) =>
            s.id === id
              ? { ...s, ...updates, updatedAt: new Date().toISOString() }
              : s
          ),
        }));
      },

      deleteSnippet: (id) => {
        set((state) => ({
          snippets: state.snippets.filter((s) => s.id !== id),
        }));
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedLanguage: (language) => set({ selectedLanguage: language }),
      setSelectedTags: (tags) => set({ selectedTags: tags }),
      setSelectedSnippet: (snippet) => set({ selectedSnippet: snippet }),
      setEditorOpen: (open) => set({ isEditorOpen: open }),
      resetFilters: () => set({ searchQuery: '', selectedLanguage: null, selectedTags: [] }),

      getAllTags: () => {
        const tags = new Set<string>();
        get().snippets.forEach((s) => s.tags.forEach((t) => tags.add(t)));
        return Array.from(tags);
      },

      getFilteredSnippets: () => {
        const { snippets, searchQuery, selectedLanguage, selectedTags } = get();

        return snippets.filter((snippet) => {
          const matchesSearch =
            !searchQuery ||
            snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            snippet.code.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesLanguage =
            !selectedLanguage || snippet.language === selectedLanguage;

          const matchesTags =
            selectedTags.length === 0 ||
            selectedTags.every((tag) => snippet.tags.includes(tag));

          return matchesSearch && matchesLanguage && matchesTags;
        });
      },
    }),
    {
      name: 'snippet-storage',
    }
  )
);
