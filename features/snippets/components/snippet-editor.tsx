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
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');

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
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card w-full max-w-3xl" style={{ padding: '28px' }}>
        {/* Close */}
        <button onClick={onClose} className="btn-icon absolute top-4 right-4" style={{ zIndex: 20 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        {/* Title */}
        <h2 className="text-lg font-bold mb-5 pr-10" style={{ color: 'var(--text-primary)' }}>
          {snippet ? 'Edit Snippet' : 'New Snippet'}
        </h2>

        {/* Tab switcher */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit" style={{ background: 'var(--border-subtle)' }}>
          <button
            onClick={() => setTab('edit')}
            className="text-xs font-semibold px-4 py-1.5 rounded-lg transition-all"
            style={tab === 'edit' ? { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-card)' } : { background: 'transparent', color: 'var(--text-muted)' }}
          >
            Edit
          </button>
          <button
            onClick={() => setTab('preview')}
            className="text-xs font-semibold px-4 py-1.5 rounded-lg transition-all"
            style={tab === 'preview' ? { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-card)' } : { background: 'transparent', color: 'var(--text-muted)' }}
          >
            Preview
          </button>
        </div>

        {tab === 'edit' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="section-label">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setError(''); }}
                placeholder="Snippet title..."
                className="input"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="section-label">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description (optional)..."
                rows={2}
                className="input resize-none"
              />
            </div>

            {/* Language + Tags + Syntax */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <label className="section-label">Tags</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="react, hooks..."
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
                onChange={(e) => { setCode(e.target.value); setError(''); }}
                placeholder="Paste your code here..."
                rows={14}
                className="input resize-y"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.6' }}
              />
            </div>

            {error && (
              <p className="text-sm font-medium" style={{ color: 'var(--danger)' }}>{error}</p>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3">
              <button type="button" onClick={onClose} className="btn-ghost w-full sm:w-auto">Cancel</button>
              <button type="submit" className="btn-primary w-full sm:w-auto">
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
