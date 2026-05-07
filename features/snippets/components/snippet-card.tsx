'use client';

import { Snippet } from '@/lib/types';
import { useSnippetStore } from '@/lib/store/snippet-store';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';

const syntaxStyles: Record<string, any> = {
  'github-dark': nightOwl,
  'monokai': nightOwl,
  'dracula': nightOwl,
  'one-light': nightOwl,
  'nord': nightOwl,
};

interface SnippetCardProps {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
}

export default function SnippetCard({ snippet, onEdit }: SnippetCardProps) {
  const { setSelectedSnippet, setSelectedTags, deleteSnippet } = useSnippetStore();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateCode = (code: string, maxLines: number = 10) => {
    const lines = code.split('\n');
    if (lines.length <= maxLines) return code;
    return lines.slice(0, maxLines).join('\n') + '\n...';
  };

  const currentSyntaxTheme = snippet.syntaxTheme || 'github-dark';

  return (
    <div
      className="card card-clickable group relative p-5"
      onClick={() => setSelectedSnippet(snippet)}
    >
      {/* Top row: title + language badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1 mr-3">
          <h3 className="text-[15px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {snippet.title}
          </h3>
          {snippet.description && (
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
              {snippet.description}
            </p>
          )}
        </div>
        <span
          className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider"
          style={{ background: 'var(--accent-secondary-soft)', color: 'var(--accent-secondary)' }}
        >
          {snippet.language}
        </span>
      </div>

      {/* Code preview */}
      <div className="code-block overflow-hidden" data-syntax={currentSyntaxTheme}>
        <SyntaxHighlighter
          style={syntaxStyles[currentSyntaxTheme] || nightOwl}
          language={snippet.language}
          customStyle={{
            background: 'transparent',
            padding: '0',
            margin: 0,
            fontSize: '12px',
            lineHeight: '1.5',
          }}
        >
          {truncateCode(snippet.code)}
        </SyntaxHighlighter>
      </div>

      {/* Tags */}
      {snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {snippet.tags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTags([tag]);
              }}
              className="tag-chip"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Footer: date + actions */}
      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <span className="text-[11px]" style={{ color: 'var(--text-faint)' }}>
          {new Date(snippet.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <div className="flex items-center gap-1.5">
          {/* Copy button — always visible */}
          <button
            onClick={copyToClipboard}
            className={`copy-btn text-[11px] py-1 px-2.5 ${copied ? 'copied' : ''}`}
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Copied
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy
              </>
            )}
          </button>

          {/* Edit — visible on hover */}
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(snippet); }}
            className="btn-icon opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ width: '28px', height: '28px', borderRadius: '7px', fontSize: '12px' }}
            title="Edit"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>

          {/* Delete — visible on hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Delete this snippet?')) deleteSnippet(snippet.id);
            }}
            className="btn-icon opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ width: '28px', height: '28px', borderRadius: '7px', fontSize: '12px', color: 'var(--danger)' }}
            title="Delete"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
