'use client';

import { useSnippetStore } from '@/lib/store/snippet-store';
import { SYNTAX_THEMES } from '@/lib/types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import ShareModal from './share-modal';

const syntaxStyles: Record<string, any> = {
  'github-dark': nightOwl,
  'monokai': nightOwl,
  'dracula': nightOwl,
  'one-light': nightOwl,
  'nord': nightOwl,
};

export default function SnippetDetail() {
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'var(--bg-overlay)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) setSelectedSnippet(null); }}
    >
      <div
        className="card w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
        style={{ background: 'var(--bg-card)', padding: '28px' }}
      >
        {/* Close */}
        <button
          onClick={() => setSelectedSnippet(null)}
          className="absolute top-4 right-4 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-2">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {selectedSnippet.title}
            </h2>
            <span className="pill-filter shrink-0 w-fit text-[11px] cursor-default" style={{ borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}>
              {selectedSnippet.language}
            </span>
          </div>
          {selectedSnippet.description && (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{selectedSnippet.description}</p>
          )}
        </div>

        {/* Syntax Theme Selector */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Syntax:</span>
          <div className="flex gap-1.5">
            {SYNTAX_THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => handleSyntaxChange(t.value)}
                className={`pill-filter text-[10px] py-0.5 px-2.5 ${currentSyntaxTheme === t.value ? 'active' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Code */}
        <div className="relative mb-5">
          <button
            onClick={copyToClipboard}
            className="absolute top-3 right-3 z-10 btn-ghost text-xs py-1 px-3"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <div className="code-block" data-syntax={currentSyntaxTheme}>
            <SyntaxHighlighter
              style={syntaxStyles[currentSyntaxTheme] || nightOwl}
              language={selectedSnippet.language}
              showLineNumbers
              customStyle={{
                background: 'transparent',
                padding: '0',
                margin: 0,
                fontSize: '13px',
                lineHeight: '1.6',
              }}
            >
              {selectedSnippet.code}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* Tags */}
        {selectedSnippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {selectedSnippet.tags.map((tag) => (
              <span key={tag} className="tag-chip">#{tag}</span>
            ))}
          </div>
        )}

        {/* Meta + Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="text-xs space-y-0.5" style={{ color: 'var(--text-muted)' }}>
            <p>Created: {formatDate(selectedSnippet.createdAt)}</p>
            <p>Updated: {formatDate(selectedSnippet.updatedAt)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowShareModal(true)} className="btn-accent text-xs">Share</button>
            <button onClick={handleDelete} className="text-xs py-1.5 px-4 rounded-full transition-all cursor-pointer" style={{ border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', background: 'transparent' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>Delete</button>
            <button onClick={() => setSelectedSnippet(null)} className="btn-ghost text-xs">Close</button>
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareModal snippet={selectedSnippet} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
}
