'use client';

import { useState } from 'react';
import { useSnippetStore } from '@/lib/store/snippet-store';
import { exportToJSON, exportToCSV, importFromJSON, importFromCSV } from '@/lib/utils/export-import';

export default function ExportImportButtons() {
  const { snippets, addSnippet } = useSnippetStore();
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleExportJSON = () => {
    exportToJSON(snippets);
    setMessage('Exported to JSON');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleExportCSV = () => {
    exportToCSV(snippets);
    setMessage('Exported to CSV');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const imported = await importFromJSON(file);
      imported.forEach((snippet) => {
        addSnippet({
          title: snippet.title,
          description: snippet.description,
          code: snippet.code,
          language: snippet.language,
          tags: snippet.tags,
        });
      });
      setMessage(`Imported ${imported.length} snippets`);
    } catch {
      setMessage('Import failed: Invalid JSON format');
    } finally {
      setImporting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const imported = await importFromCSV(file);
      imported.forEach((snippet) => {
        addSnippet({
          title: snippet.title,
          description: snippet.description,
          code: snippet.code,
          language: snippet.language,
          tags: snippet.tags,
        });
      });
      setMessage(`Imported ${imported.length} snippets`);
    } catch {
      setMessage('Import failed: Invalid CSV format');
    } finally {
      setImporting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <span className="section-label">Export / Import</span>

      <div className="flex flex-col gap-2">
        <button onClick={handleExportJSON} disabled={snippets.length === 0} className="btn-ghost text-left text-sm">
          Export JSON
        </button>
        <button onClick={handleExportCSV} disabled={snippets.length === 0} className="btn-ghost text-left text-sm">
          Export CSV
        </button>
        <label className="btn-ghost text-left text-sm cursor-pointer">
          {importing ? 'Importing...' : 'Import JSON'}
          <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" disabled={importing} />
        </label>
        <label className="btn-ghost text-left text-sm cursor-pointer">
          {importing ? 'Importing...' : 'Import CSV'}
          <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" disabled={importing} />
        </label>
      </div>

      {message && (
        <p className="text-xs" style={{ color: 'var(--accent-secondary)' }}>{message}</p>
      )}
    </div>
  );
}
