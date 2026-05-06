'use client';

import { Snippet } from '@/lib/types';

export function exportToJSON(snippets: Snippet[]) {
  const dataStr = JSON.stringify(snippets, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `snippets-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToCSV(snippets: Snippet[]) {
  const headers = ['Title', 'Description', 'Language', 'Tags', 'Code', 'Created', 'Updated'];
  const rows = snippets.map((s) => [
    `"${s.title.replace(/"/g, '""')}"`,
    `"${s.description.replace(/"/g, '""')}"`,
    s.language,
    `"${s.tags.join(', ')}"`,
    `"${s.code.replace(/"/g, '""').replace(/\n/g, '\\n')}"`,
    s.createdAt,
    s.updatedAt,
  ]);

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
  const dataBlob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `snippets-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function importFromJSON(file: File): Promise<Snippet[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data)) {
          resolve(data);
        } else {
          reject(new Error('Invalid JSON format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export async function importFromCSV(file: File): Promise<Snippet[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter((line) => line.trim());
        const headers = lines[0].split(',').map((h) => h.trim());

        const snippets: Snippet[] = lines.slice(1).map((line) => {
          const values = parseCSVLine(line);
          return {
            id: Math.random().toString(36).substring(2, 15),
            title: values[0] || 'Untitled',
            description: values[1] || '',
            language: values[2] || 'text',
            tags: values[3]
              ? values[3].split(',').map((t) => t.trim().toLowerCase())
              : [],
            code: values[4] || '',
            createdAt: values[5] || new Date().toISOString(),
            updatedAt: values[6] || new Date().toISOString(),
          };
        });

        resolve(snippets);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}
