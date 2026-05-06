'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Snippet } from '@/lib/types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function SharePage() {
  const params = useParams();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const res = await fetch(`/api/share?id=${params.id}`);
        if (!res.ok) throw new Error('Snippet not found');
        const data = await res.json();
        setSnippet(data);
      } catch (err) {
        setError('Snippet not found or expired');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSnippet();
    }
  }, [params.id]);

  const copyToClipboard = async () => {
    if (!snippet) return;
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-500">Loading snippet...</p>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error}</p>
          <a href="/" className="outlined-button">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <a href="/" className="text-orange-500 text-sm hover:text-orange-400 mb-4 inline-block">
            ← Back to Snippets
          </a>
          <h1 className="text-4xl font-display tracking-tight mb-2">SHARED SNIPPET</h1>
          <p className="text-gray-500 text-sm">View-only shared code snippet</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="card-virtual">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl font-display tracking-tight text-white">
                {snippet.title}
              </h2>
              <span className="px-3 py-1 text-xs border border-gray-600 rounded text-gray-400 shrink-0">
                {snippet.language}
              </span>
            </div>
            {snippet.description && (
              <p className="text-gray-400 text-sm">{snippet.description}</p>
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
              language={snippet.language}
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
              {snippet.code}
            </SyntaxHighlighter>
          </div>

          {/* Tags */}
          {snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {snippet.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs border border-orange-500/50 rounded text-orange-400 bg-orange-500/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
