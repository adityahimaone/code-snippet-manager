'use client';

import { useState } from 'react';
import { useSnippetStore } from '@/lib/store/snippet-store';
import { exportToJSON, exportToCSV, importFromJSON, importFromCSV } from '@/lib/utils/export-import';

export default function ExportImportButtons() {
  const { snippets, addSnippet, resetFilters } = useSnippetStore();
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
    } catch (error) {
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
    } catch (error) {
      setMessage('Import failed: Invalid CSV format');
    } finally {
      setImporting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <span className="text-orange-500 text-xs font-medium uppercase tracking-wider block">
        Export / Import
      </span>

      <div className="flex flex-col gap-2">
        {/* Export buttons */}
        <button
          onClick={handleExportJSON}
          disabled={snippets.length === 0}
          className="ghost-button text-left"
        >
          Export JSON
        </button>
        <button
          onClick={handleExportCSV}
          disabled={snippets.length === 0}
          className="ghost-button text-left"
        >
          Export CSV
        </button>

        {/* Import buttons */}
        <label className="ghost-button text-left cursor-pointer">
          {importing ? 'Importing...' : 'Import JSON'}
          <input
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
            disabled={importing}
          />
        </label>
        <label className="ghost-button text-left cursor-pointer">
          {importing ? 'Importing...' : 'Import CSV'}
          <input
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
            disabled={importing}
          />
        </label>
      </div>

      {/* Status message */}
      {message && (
        <p className="text-orange-400 text-xs">{message}</p>
      )}
    </div>
  );
}
