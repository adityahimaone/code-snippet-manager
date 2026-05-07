'use client';

import { useState } from 'react';
import { useSnippetStore } from '@/lib/store/snippet-store';
import { SUPPORTED_LANGUAGES, Snippet } from '@/lib/types';
import CodePreview from './code-preview';

interface SnippetEditorProps {
  snippet?: Snippet | null;
  onClose: () => void;
}

export default function SnippetEditor({ snippet, onClose }: SnippetEditorProps) {
  const { addSnippet, updateSnippet } = useSnippetStore();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [title, setTitle] = useState(snippet?.title || '');
  const [description, setDescription] = useState(snippet?.description || '');
  const [code, setCode] = useState(snippet?.code || '');
  const [language, setLanguage] = useState(snippet?.language || 'javascript');
  const [tagsInput, setTagsInput] = useState(snippet?.tags.join(', ') || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !code.trim()) {
      setError('Title and code are required');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    if (snippet) {
      updateSnippet(snippet.id, {
        title: title.trim(),
        description: description.trim(),
        code,
        language,
        tags,
      });
    } else {
      addSnippet({
        title: title.trim(),
        description: description.trim(),
        code,
        language,
        tags,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto card-virtual relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
        >
          ✕
        </button>

        <h2 className="text-xl md:text-2xl font-display tracking-tight mb-6">
          {snippet ? 'Edit Snippet' : 'New Snippet'}
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'edit'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'preview'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Preview
          </button>
        </div>

        {activeTab === 'edit' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-orange-500 text-xs font-medium uppercase tracking-wider mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Snippet title..."
              className="w-full px-4 py-3 bg-black border-2 border-gray-600 rounded-lg text-white text-sm focus:border-white outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-orange-500 text-xs font-medium uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description..."
              rows={2}
              className="w-full px-4 py-3 bg-black border-2 border-gray-600 rounded-lg text-white text-sm focus:border-white outline-none transition-colors resize-none"
            />
          </div>

          {/* Language & Tags Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-orange-500 text-xs font-medium uppercase tracking-wider mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-black border-2 border-gray-600 rounded-lg text-white text-sm focus:border-white outline-none transition-colors"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-orange-500 text-xs font-medium uppercase tracking-wider mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="react, hooks, utility..."
                className="w-full px-4 py-3 bg-black border-2 border-gray-600 rounded-lg text-white text-sm focus:border-white outline-none transition-colors"
              />
            </div>
          </div>

          {/* Code */}
          <div>
            <label className="block text-orange-500 text-xs font-medium uppercase tracking-wider mb-2">
              Code
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              rows={12}
              className="w-full px-4 py-3 bg-black border-2 border-gray-600 rounded-lg text-white text-sm focus:border-white outline-none transition-colors font-mono resize-y"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="ghost-button w-full md:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="outlined-button w-full md:w-auto"
            >
              {snippet ? 'Update Snippet' : 'Save Snippet'}
            </button>
          </div>
        </form>
        ) : (
          <CodePreview code={code} language={language} />
        )}
      </div>
    </div>
  );
}
