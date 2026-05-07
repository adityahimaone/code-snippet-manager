'use client';

import { Snippet, SYNTAX_THEMES } from '@/lib/types';
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

export default function SnippetCard({ snippet }: { snippet: Snippet }) {
  const { setSelectedSnippet, setSelectedTags, deleteSnippet, updateSnippet } = useSnippetStore();
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
      className="card cursor-pointer group relative p-5"
      onClick={() => setSelectedSnippet(snippet)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold mb-0.5 truncate" style={{ color: 'var(--text-primary)' }}>
            {snippet.title}
          </h3>
          {snippet.description && (
            <p className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>
              {snippet.description}
            </p>
          )}
        </div>
        <span
          className="pill-filter shrink-0 ml-3 text-[11px] cursor-default"
          style={{ borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }}
        >
          {snippet.language}
        </span>
      </div>

      {/* Code Preview */}
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

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {new Date(snippet.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={copyToClipboard}
            className="btn-ghost text-xs py-1 px-3"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteSnippet(snippet.id);
            }}
            className="text-xs py-1 px-3 rounded-full transition-all cursor-pointer"
            style={{ border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = '#ef4444'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
