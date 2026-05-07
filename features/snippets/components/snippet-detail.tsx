'use client';

import { useSnippetStore } from '@/lib/store/snippet-store';
import { SYNTAX_THEMES } from '@/lib/types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import ShareModal from './share-modal';
import { Snippet } from '@/lib/types';

const syntaxStyles: Record<string, any> = {
  'github-dark': nightOwl,
  'monokai': nightOwl,
  'dracula': nightOwl,
  'one-light': nightOwl,
  'nord': nightOwl,
};

interface SnippetDetailProps {
  onEdit: (snippet: Snippet) => void;
}

export default function SnippetDetail({ onEdit }: SnippetDetailProps) {
  const { selectedSnippet, setSelectedSnippet, deleteSnippet, updateSnippet } = useSnippetStore();
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  if (!selectedSnippet) return null;

  const currentSyntaxTheme = selectedSnippet.syntaxTheme || 'github-dark';

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(selectedSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      deleteSnippet(selectedSnippet.id);
      setSelectedSnippet(null);
    }
  };

  const handleSyntaxChange = (theme: string) => {
    updateSnippet(selectedSnippet.id, { syntaxTheme: theme });
    setSelectedSnippet({ ...selectedSnippet, syntaxTheme: theme });
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <>
      <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedSnippet(null); }}>
        <div className="modal-card w-full max-w-4xl" style={{ padding: '28px' }}>
          {/* Close button */}
          <button
            onClick={() => setSelectedSnippet(null)}
            className="btn-icon absolute top-4 right-4"
            style={{ zIndex: 20 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          {/* Header */}
          <div className="mb-5 pr-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {selectedSnippet.title}
              </h2>
              <span
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider w-fit"
                style={{ background: 'var(--accent-secondary-soft)', color: 'var(--accent-secondary)' }}
              >
                {selectedSnippet.language}
              </span>
            </div>
            {selectedSnippet.description && (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{selectedSnippet.description}</p>
            )}
          </div>

          {/* Toolbar row: syntax theme + copy */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            {/* Syntax theme pills */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-faint)' }}>Theme</span>
              <div className="flex gap-1">
                {SYNTAX_THEMES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => handleSyntaxChange(t.value)}
                    className={`pill-filter text-[10px] py-1 px-2.5 ${currentSyntaxTheme === t.value ? 'active' : ''}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Copy button — PROMINENT */}
            <button
              onClick={copyToClipboard}
              className={`copy-btn ${copied ? 'copied' : ''}`}
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy Code
                </>
              )}
            </button>
          </div>

          {/* Code block */}
          <div className="code-block mb-5" data-syntax={currentSyntaxTheme}>
            <SyntaxHighlighter
              style={syntaxStyles[currentSyntaxTheme] || nightOwl}
              language={selectedSnippet.language}
              showLineNumbers
              customStyle={{
                background: 'transparent',
                padding: '0',
                margin: 0,
                fontSize: '13px',
                lineHeight: '1.65',
              }}
            >
              {selectedSnippet.code}
            </SyntaxHighlighter>
          </div>

          {/* Tags */}
          {selectedSnippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {selectedSnippet.tags.map((tag) => (
                <span key={tag} className="tag-chip">#{tag}</span>
              ))}
            </div>
          )}

          {/* Footer: meta + actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div className="text-[11px] space-y-0.5" style={{ color: 'var(--text-faint)' }}>
              <p>Created: {formatDate(selectedSnippet.createdAt)}</p>
              <p>Updated: {formatDate(selectedSnippet.updatedAt)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onEdit(selectedSnippet)}
                className="btn-secondary"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
              <button onClick={() => setShowShareModal(true)} className="btn-accent">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
              <button onClick={handleDelete} className="btn-danger">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareModal snippet={selectedSnippet} onClose={() => setShowShareModal(false)} />
      )}
    </>
  );
}
