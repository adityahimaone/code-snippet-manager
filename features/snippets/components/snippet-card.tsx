'use client';

import { Snippet } from '@/lib/types';
import { useSnippetStore } from '@/lib/store/snippet-store';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';

export default function SnippetCard({ snippet }: { snippet: Snippet }) {
  const { setSelectedSnippet, setSelectedTags, deleteSnippet } = useSnippetStore();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateCode = (code: string, maxLines: number = 12) => {
    const lines = code.split('\n');
    if (lines.length <= maxLines) return code;
    return lines.slice(0, maxLines).join('\n') + '\n...';
  };

  return (
    <div
      className="card-virtual cursor-pointer group relative"
      onClick={() => setSelectedSnippet(snippet)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white text-lg font-medium mb-1">{snippet.title}</h3>
          {snippet.description && (
            <p className="text-gray-500 text-sm">{snippet.description}</p>
          )}
        </div>
        <span className="px-2 py-1 text-xs border border-gray-600 rounded text-gray-400 shrink-0">
          {snippet.language}
        </span>
      </div>

      {/* Code Preview */}
      <div className="relative">
          <SyntaxHighlighter
            style={nightOwl}
            language={snippet.language}
            customStyle={{
            background: '#0a0a0a',
            padding: '16px',
            borderRadius: '10px',
            fontSize: '13px',
            lineHeight: '1.6',
            border: '1px solid #333',
            margin: 0,
            }}
          >
            {snippet.code.slice(0, 200)}
          </SyntaxHighlighter>
      </div>

      {/* Tags */}
      {snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {snippet.tags.map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTags([tag]);
              }}
              className="text-orange-500/70 hover:text-orange-400 text-xs transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
        <span className="text-gray-600 text-xs">
          {new Date(snippet.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 text-xs border border-gray-600 rounded text-gray-400 hover:border-white hover:text-white transition-all"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteSnippet(snippet.id);
            }}
            className="px-3 py-1 text-xs border border-gray-600 rounded text-gray-400 hover:border-red-500 hover:text-red-400 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
