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
    } catch (error) {
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-display mb-4">Share Snippet</h2>
        
        {!shareUrl ? (
          <div>
            <p className="text-gray-400 mb-4">
              Generate a public link to share this snippet with anyone.
            </p>
            <button
              onClick={handleShare}
              disabled={loading}
              className="outlined-button w-full"
            >
              {loading ? 'Generating...' : 'Generate Share Link'}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-400 mb-2 text-sm">Share this link:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-black border border-gray-700 rounded px-3 py-2 text-sm"
              />
              <button
                onClick={handleCopy}
                className="outlined-button"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="ghost-button w-full mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
}
