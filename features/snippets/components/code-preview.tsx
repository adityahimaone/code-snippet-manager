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
        className="outlined-button"
      >
        {running ? 'Running...' : '▶ Run Code'}
      </button>

      {result && (
        <div className="bg-black border border-gray-800 rounded-lg p-4 space-y-2">
          {/* Console logs */}
          {result.logs.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Console:</div>
              <div className="text-sm font-mono space-y-1">
                {result.logs.map((log, i) => (
                  <div key={i} className="text-gray-300">{log}</div>
                ))}
              </div>
            </div>
          )}

          {/* Return value */}
          {result.output && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Output:</div>
              <div className="text-sm font-mono text-green-400">{result.output}</div>
            </div>
          )}

          {/* Error */}
          {result.error && (
            <div>
              <div className="text-xs text-red-500 mb-1">Error:</div>
              <div className="text-sm font-mono text-red-400">{result.error}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
