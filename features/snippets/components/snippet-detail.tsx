'use client';

import { useSnippetStore } from '@/lib/store/snippet-store';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';

export default function SnippetDetail() {
  const { selectedSnippet, setSelectedSnippet, deleteSnippet } = useSnippetStore();
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [sharing, setSharing] = useState(false);

  if (!selectedSnippet) return null;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(selectedSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedSnippet),
      });
      const data = await res.json();
      const url = `${window.location.origin}${data.url}`;
      await navigator.clipboard.writeText(url);
      setShareUrl(url);
      setTimeout(() => setShareUrl(''), 5000);
    } catch (error) {
      alert('Failed to share snippet');
    } finally {
      setSharing(false);
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      deleteSnippet(selectedSnippet.id);
      setSelectedSnippet(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto card-virtual relative">
        {/* Close button */}
        <button
          onClick={() => setSelectedSnippet(null)}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
            <h2 className="text-xl md:text-2xl font-display tracking-tight text-white">
              {selectedSnippet.title}
            </h2>
            <span className="px-3 py-1 text-xs border border-gray-600 rounded text-gray-400 shrink-0 w-fit">
              {selectedSnippet.language}
            </span>
          </div>
          {selectedSnippet.description && (
            <p className="text-gray-400 text-sm">{selectedSnippet.description}</p>
          )}
        </div>

        {/* Code */}
        <div className="relative mb-6">
          <button
            onClick={copyToClipboard}
            className="absolute top-3 right-3 px-3 py-1 text-xs border border-gray-600 rounded text-gray-400 hover:border-white hover:text-white transition-all z-10"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
            <SyntaxHighlighter
              style={nightOwl}
              language={selectedSnippet.language}
              showLineNumbers
              customStyle={{
              background: '#0a0a0a',
              padding: '20px',
              borderRadius: '10px',
              fontSize: '13px',
              lineHeight: '1.6',
              border: '1px solid #333',
              margin: 0,
            }}
          >
            {selectedSnippet.code}
          </SyntaxHighlighter>
        </div>

        {/* Tags */}
        {selectedSnippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedSnippet.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs border border-orange-500/50 rounded text-orange-400 bg-orange-500/10"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-gray-800">
          <div className="text-gray-600 text-xs space-y-1">
            <p>
              Created: {new Date(selectedSnippet.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p>
              Updated: {new Date(selectedSnippet.updatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              disabled={sharing}
              className="px-4 py-2 text-xs border border-gray-600 rounded text-gray-400 hover:border-orange-500 hover:text-orange-400 transition-all disabled:opacity-50"
            >
              {sharing ? 'Sharing...' : 'Share'}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-xs border border-gray-600 rounded text-gray-400 hover:border-red-500 hover:text-red-400 transition-all"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Share URL notification */}
        {shareUrl && (
          <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/50 rounded-lg">
            <p className="text-orange-400 text-xs">
              Share URL copied to clipboard! Valid for 30 days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
