'use client';

import { useState } from 'react';
import { Snippet } from '@/lib/types';

interface ShareModalProps {
  snippet: Snippet;
  onClose: () => void;
}

export default function ShareModal({ snippet, onClose }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snippet),
      });
      const data = await res.json();
      setShareUrl(data.url);
    } catch {
      alert('Failed to generate share link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'var(--bg-overlay)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="card w-full max-w-md"
        style={{ background: 'var(--bg-card)', padding: '24px' }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Share Snippet</h2>

        {!shareUrl ? (
          <div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              Generate a public link to share this snippet with anyone.
            </p>
            <button onClick={handleShare} disabled={loading} className="btn-primary w-full">
              {loading ? 'Generating...' : 'Generate Share Link'}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Share this link:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="input flex-1 text-sm"
              />
              <button onClick={handleCopy} className="btn-primary shrink-0">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        <button onClick={onClose} className="btn-ghost w-full mt-4">Close</button>
      </div>
    </div>
  );
}
