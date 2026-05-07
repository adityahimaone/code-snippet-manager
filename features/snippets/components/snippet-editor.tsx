'use client';

import { useState } from 'react';
import { useSnippetStore } from '@/lib/store/snippet-store';
import { Snippet, SUPPORTED_LANGUAGES, SYNTAX_THEMES } from '@/lib/types';
import CodePreview from './code-preview';

interface SnippetEditorProps {
  snippet?: Snippet;
  onClose: () => void;
}

export default function SnippetEditor({ snippet, onClose }: SnippetEditorProps) {
  const { addSnippet, updateSnippet } = useSnippetStore();
  const [title, setTitle] = useState(snippet?.title || '');
  const [description, setDescription] = useState(snippet?.description || '');
  const [language, setLanguage] = useState(snippet?.language || 'javascript');
  const [code, setCode] = useState(snippet?.code || '');
  const [tagsInput, setTagsInput] = useState(snippet?.tags.join(', ') || '');
  const [syntaxTheme, setSyntaxTheme] = useState(snippet?.syntaxTheme || 'github-dark');
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    if (!code.trim()) { setError('Code is required'); return; }

    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    if (snippet) {
      updateSnippet(snippet.id, { title, description, language, code, tags, syntaxTheme });
    } else {
      addSnippet({ title, description, language, code, tags, syntaxTheme });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'var(--bg-overlay)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="card w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
        style={{ background: 'var(--bg-card)', padding: '28px' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          {snippet ? 'Edit Snippet' : 'New Snippet'}
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setShowPreview(false)}
            className={`pill-filter ${!showPreview ? 'active' : ''}`}
          >
            Edit
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`pill-filter ${showPreview ? 'active' : ''}`}
          >
            Preview
          </button>
        </div>

        {!showPreview ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="section-label">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Snippet title..."
                className="input"
              />
            </div>

            {/* Description */}
            <div>
              <label className="section-label">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                rows={2}
                className="input resize-none"
              />
            </div>

            {/* Language, Tags, Syntax Theme */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="section-label">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input"
                  style={{ cursor: 'pointer' }}
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="section-label">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="react, hooks, utility..."
                  className="input"
                />
              </div>
              <div>
                <label className="section-label">Syntax Theme</label>
                <select
                  value={syntaxTheme}
                  onChange={(e) => setSyntaxTheme(e.target.value)}
                  className="input"
                  style={{ cursor: 'pointer' }}
                >
                  {SYNTAX_THEMES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Code */}
            <div>
              <label className="section-label">Code</label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                rows={12}
                className="input resize-y"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="btn-ghost w-full md:w-auto">Cancel</button>
              <button type="submit" className="btn-primary w-full md:w-auto">
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
