'use client';

import { useState } from 'react';
import { executeCode, ExecutionResult } from '@/lib/utils/code-executor';

interface CodePreviewProps {
  code: string;
  language: string;
}

export default function CodePreview({ code, language }: CodePreviewProps) {
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    const execResult = await executeCode(code, language);
    setResult(execResult);
    setRunning(false);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleRun}
        disabled={running}
        className="btn-primary"
      >
        {running ? 'Running...' : '▶ Run Code'}
      </button>

      {result && (
        <div className="card p-4 space-y-2" style={{ background: 'var(--bg-code)' }}>
          {result.logs.length > 0 && (
            <div>
              <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Console:</div>
              <div className="text-sm font-mono space-y-1">
                {result.logs.map((log, i) => (
                  <div key={i} style={{ color: 'var(--text-secondary)' }}>{log}</div>
                ))}
              </div>
            </div>
          )}

          {result.output && (
            <div>
              <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Output:</div>
              <div className="text-sm font-mono" style={{ color: '#22c55e' }}>{result.output}</div>
            </div>
          )}

          {result.error && (
            <div>
              <div className="text-xs mb-1" style={{ color: '#ef4444' }}>Error:</div>
              <div className="text-sm font-mono" style={{ color: '#ef4444' }}>{result.error}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
