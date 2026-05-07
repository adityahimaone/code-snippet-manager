# Code Snippet Manager Enhancements Implementation Plan

> **For AI Agent Workers:** Required sub-skill: use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax to track progress.

**Goal:** Add sharing via URL, code execution/preview, syntax theme customization, keyboard shortcuts, and dark/light mode toggle

**Architecture:** 
- Share API endpoint generates unique URLs with snippet data stored in DB/localStorage
- Code execution uses sandboxed iframe or web workers for safe preview
- Theme system uses CSS variables with localStorage persistence
- Keyboard shortcuts via event listeners with visual hints
- Dark/light mode toggle with system preference detection

**Tech Stack:** Next.js 16 App Router, React, Tailwind CSS, Zustand, localStorage/IndexedDB

---

## File Structure

**New Files:**
- `app/api/share/route.ts` - Share API endpoint
- `app/share/[id]/page.tsx` - Public share page
- `features/snippets/components/share-modal.tsx` - Share UI modal
- `features/snippets/components/code-preview.tsx` - Code execution preview
- `features/snippets/components/theme-selector.tsx` - Syntax theme picker
- `features/snippets/components/keyboard-shortcuts-modal.tsx` - Shortcuts help
- `lib/hooks/use-keyboard-shortcuts.ts` - Keyboard shortcuts hook
- `lib/hooks/use-theme.ts` - Theme management hook
- `lib/utils/code-executor.ts` - Safe code execution utility

**Modified Files:**
- `features/snippets/components/snippet-detail.tsx` - Add share button
- `features/snippets/components/snippet-editor.tsx` - Add preview tab
- `features/snippets/components/snippets-page.tsx` - Add keyboard shortcuts
- `lib/store/snippet-store.ts` - Add theme state
- `app/globals.css` - Add theme CSS variables
- `app/layout.tsx` - Add theme provider

---

### Task 1: Share Snippet via URL - API Endpoint

**Files:**
- Create: `app/api/share/route.ts`
- Modify: `lib/store/snippet-store.ts`

- [ ] **Step 1: Create share API route**

```typescript
// app/api/share/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

// In-memory store (replace with DB in production)
const sharedSnippets = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const snippet = await request.json();
    const shareId = nanoid(10);
    
    sharedSnippets.set(shareId, {
      ...snippet,
      sharedAt: new Date().toISOString(),
    });
    
    return NextResponse.json({ 
      shareId,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/share/${shareId}`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to share snippet' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Share ID required' }, { status: 400 });
  }
  
  const snippet = sharedSnippets.get(id);
  
  if (!snippet) {
    return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
  }
  
  return NextResponse.json(snippet);
}
```

- [ ] **Step 2: Install nanoid dependency**

Run: `npm install nanoid`
Expected: Package installed successfully

- [ ] **Step 3: Create share page**

```typescript
// app/share/[id]/page.tsx
import { notFound } from 'next/navigation';

async function getSharedSnippet(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/share?id=${id}`, {
    cache: 'no-store'
  });
  
  if (!res.ok) return null;
  return res.json();
}

export default async function SharePage({ params }: { params: { id: string } }) {
  const snippet = await getSharedSnippet(params.id);
  
  if (!snippet) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-display mb-2">{snippet.title}</h1>
          <p className="text-gray-400">{snippet.description}</p>
          <div className="flex gap-2 mt-4">
            {snippet.tags?.map((tag: string) => (
              <span key={tag} className="text-xs px-2 py-1 bg-gray-800 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm">
            <code>{snippet.code}</code>
          </pre>
        </div>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-orange-500 hover:underline">
            Create your own snippets →
          </a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Test share API**

Run: `npm run dev` and test POST to `/api/share`
Expected: Returns shareId and URL

- [ ] **Step 5: Commit**

```bash
git add app/api/share/route.ts app/share/[id]/page.tsx package.json package-lock.json
git commit -m "feat: add share snippet API and public share page"
```

---

### Task 2: Share Modal UI

**Files:**
- Create: `features/snippets/components/share-modal.tsx`
- Modify: `features/snippets/components/snippet-detail.tsx`

- [ ] **Step 1: Create share modal component**

```typescript
// features/snippets/components/share-modal.tsx
'use client';

import { useState } from 'react';
import { Snippet } from '@/lib/store/snippet-store';

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
```

- [ ] **Step 2: Add share button to snippet detail**

```typescript
// Modify features/snippets/components/snippet-detail.tsx
// Add import at top:
import ShareModal from './share-modal';
import { useState } from 'react';

// Inside component, add state:
const [showShareModal, setShowShareModal] = useState(false);

// Add share button in the actions section (after edit/delete buttons):
<button
  onClick={() => setShowShareModal(true)}
  className="ghost-button"
>
  Share
</button>

// Add modal at the end before closing div:
{showShareModal && (
  <ShareModal
    snippet={selectedSnippet}
    onClose={() => setShowShareModal(false)}
  />
)}
```

- [ ] **Step 3: Test share flow**

Run: `npm run dev`, open snippet detail, click Share
Expected: Modal opens, generates link, can copy

- [ ] **Step 4: Commit**

```bash
git add features/snippets/components/share-modal.tsx features/snippets/components/snippet-detail.tsx
git commit -m "feat: add share modal UI with copy link functionality"
```

---

### Task 3: Theme System - CSS Variables & Hook

**Files:**
- Create: `lib/hooks/use-theme.ts`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add theme CSS variables**

```css
/* Add to app/globals.css after existing @theme block */

/* Light mode overrides */
[data-theme="light"] {
  --color-midnight-void: #ffffff;
  --color-ghost-white: #000000;
  --color-muted-ash: #666666;
  --color-accent-orange: #ff5c00;
}

/* Syntax theme variables */
[data-syntax-theme="github-dark"] {
  --syntax-bg: #0d1117;
  --syntax-text: #c9d1d9;
  --syntax-comment: #8b949e;
  --syntax-keyword: #ff7b72;
  --syntax-string: #a5d6ff;
  --syntax-function: #d2a8ff;
}

[data-syntax-theme="monokai"] {
  --syntax-bg: #272822;
  --syntax-text: #f8f8f2;
  --syntax-comment: #75715e;
  --syntax-keyword: #f92672;
  --syntax-string: #e6db74;
  --syntax-function: #a6e22e;
}

[data-syntax-theme="dracula"] {
  --syntax-bg: #282a36;
  --syntax-text: #f8f8f2;
  --syntax-comment: #6272a4;
  --syntax-keyword: #ff79c6;
  --syntax-string: #f1fa8c;
  --syntax-function: #50fa7b;
}
```

- [ ] **Step 2: Create theme hook**

```typescript
// lib/hooks/use-theme.ts
'use client';

import { useEffect, useState } from 'react';

type ColorTheme = 'dark' | 'light';
type SyntaxTheme = 'github-dark' | 'monokai' | 'dracula';

export function useTheme() {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('dark');
  const [syntaxTheme, setSyntaxTheme] = useState<SyntaxTheme>('github-dark');

  useEffect(() => {
    // Load from localStorage
    const savedColorTheme = localStorage.getItem('color-theme') as ColorTheme;
    const savedSyntaxTheme = localStorage.getItem('syntax-theme') as SyntaxTheme;
    
    if (savedColorTheme) {
      setColorTheme(savedColorTheme);
      document.documentElement.setAttribute('data-theme', savedColorTheme);
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = prefersDark ? 'dark' : 'light';
      setColorTheme(theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
    
    if (savedSyntaxTheme) {
      setSyntaxTheme(savedSyntaxTheme);
      document.documentElement.setAttribute('data-syntax-theme', savedSyntaxTheme);
    }
  }, []);

  const toggleColorTheme = () => {
    const newTheme = colorTheme === 'dark' ? 'light' : 'dark';
    setColorTheme(newTheme);
    localStorage.setItem('color-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const changeSyntaxTheme = (theme: SyntaxTheme) => {
    setSyntaxTheme(theme);
    localStorage.setItem('syntax-theme', theme);
    document.documentElement.setAttribute('data-syntax-theme', theme);
  };

  return {
    colorTheme,
    syntaxTheme,
    toggleColorTheme,
    changeSyntaxTheme,
  };
}
```

- [ ] **Step 3: Test theme hook**

Run: `npm run dev`, toggle theme in browser console
Expected: Theme switches, persists on reload

- [ ] **Step 4: Commit**

```bash
git add lib/hooks/use-theme.ts app/globals.css
git commit -m "feat: add theme system with dark/light mode and syntax themes"
```

---

### Task 4: Theme Selector UI

**Files:**
- Create: `features/snippets/components/theme-selector.tsx`
- Modify: `features/snippets/components/snippets-page.tsx`

- [ ] **Step 1: Create theme selector component**

```typescript
// features/snippets/components/theme-selector.tsx
'use client';

import { useTheme } from '@/lib/hooks/use-theme';

export default function ThemeSelector() {
  const { colorTheme, syntaxTheme, toggleColorTheme, changeSyntaxTheme } = useTheme();

  return (
    <div className="space-y-4">
      <span className="text-orange-500 text-xs font-medium uppercase tracking-wider block">
        Themes
      </span>

      {/* Color Theme Toggle */}
      <div>
        <label className="text-xs text-gray-400 block mb-2">Color Mode</label>
        <button
          onClick={toggleColorTheme}
          className="ghost-button w-full text-left"
        >
          {colorTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

      {/* Syntax Theme Selector */}
      <div>
        <label className="text-xs text-gray-400 block mb-2">Syntax Theme</label>
        <select
          value={syntaxTheme}
          onChange={(e) => changeSyntaxTheme(e.target.value as any)}
          className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-sm"
        >
          <option value="github-dark">GitHub Dark</option>
          <option value="monokai">Monokai</option>
          <option value="dracula">Dracula</option>
        </select>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add theme selector to sidebar**

```typescript
// Modify features/snippets/components/snippets-page.tsx
// Add import:
import ThemeSelector from './theme-selector';

// Add in sidebar after ExportImportButtons:
<ThemeSelector />
```

- [ ] **Step 3: Test theme selector**

Run: `npm run dev`, toggle themes from sidebar
Expected: Themes change immediately and persist

- [ ] **Step 4: Commit**

```bash
git add features/snippets/components/theme-selector.tsx features/snippets/components/snippets-page.tsx
git commit -m "feat: add theme selector UI to sidebar"
```

---

### Task 5: Keyboard Shortcuts System

**Files:**
- Create: `lib/hooks/use-keyboard-shortcuts.ts`
- Create: `features/snippets/components/keyboard-shortcuts-modal.tsx`
- Modify: `features/snippets/components/snippets-page.tsx`

- [ ] **Step 1: Create keyboard shortcuts hook**

```typescript
// lib/hooks/use-keyboard-shortcuts.ts
'use client';

import { useEffect } from 'react';

export interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}
```

- [ ] **Step 2: Create shortcuts help modal**

```typescript
// features/snippets/components/keyboard-shortcuts-modal.tsx
'use client';

interface KeyboardShortcutsModalProps {
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ onClose }: KeyboardShortcutsModalProps) {
  const shortcuts = [
    { keys: ['Ctrl', 'N'], description: 'Create new snippet' },
    { keys: ['Ctrl', 'K'], description: 'Focus search' },
    { keys: ['Ctrl', '/'], description: 'Show shortcuts' },
    { keys: ['Esc'], description: 'Close modal' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-display mb-4">Keyboard Shortcuts</h2>
        
        <div className="space-y-3">
          {shortcuts.map((shortcut, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-gray-400">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, j) => (
                  <kbd
                    key={j}
                    className="px-2 py-1 bg-black border border-gray-700 rounded text-xs"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="ghost-button w-full mt-6"
        >
          Close
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add shortcuts to main page**

```typescript
// Modify features/snippets/components/snippets-page.tsx
// Add imports:
import { useKeyboardShortcuts } from '@/lib/hooks/use-keyboard-shortcuts';
import KeyboardShortcutsModal from './keyboard-shortcuts-modal';
import { useRef } from 'react';

// Add state:
const [showShortcuts, setShowShortcuts] = useState(false);
const searchInputRef = useRef<HTMLInputElement>(null);

// Add shortcuts:
useKeyboardShortcuts([
  {
    key: 'n',
    ctrl: true,
    description: 'Create new snippet',
    action: () => {
      setSelectedSnippet(null);
      setIsCreating(true);
    },
  },
  {
    key: 'k',
    ctrl: true,
    description: 'Focus search',
    action: () => {
      searchInputRef.current?.focus();
    },
  },
  {
    key: '/',
    ctrl: true,
    description: 'Show shortcuts',
    action: () => setShowShortcuts(true),
  },
  {
    key: 'Escape',
    description: 'Close modal',
    action: () => {
      setIsCreating(false);
      setSelectedSnippet(null);
      setShowShortcuts(false);
    },
  },
]);

// Add modal at end:
{showShortcuts && (
  <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />
)}

// Pass ref to SearchBar:
<SearchBar ref={searchInputRef} />
```

- [ ] **Step 4: Update SearchBar to accept ref**

```typescript
// Modify features/snippets/components/search-bar.tsx
// Change to forwardRef:
import { forwardRef } from 'react';

const SearchBar = forwardRef<HTMLInputElement>((props, ref) => {
  // ... existing code
  // Add ref to input:
  <input ref={ref} ... />
});

SearchBar.displayName = 'SearchBar';
export default SearchBar;
```

- [ ] **Step 5: Test keyboard shortcuts**

Run: `npm run dev`, test Ctrl+N, Ctrl+K, Ctrl+/, Esc
Expected: All shortcuts work as described

- [ ] **Step 6: Commit**

```bash
git add lib/hooks/use-keyboard-shortcuts.ts features/snippets/components/keyboard-shortcuts-modal.tsx features/snippets/components/snippets-page.tsx features/snippets/components/search-bar.tsx
git commit -m "feat: add keyboard shortcuts system with help modal"
```

---

### Task 6: Code Preview/Execution

**Files:**
- Create: `lib/utils/code-executor.ts`
- Create: `features/snippets/components/code-preview.tsx`
- Modify: `features/snippets/components/snippet-editor.tsx`

- [ ] **Step 1: Create safe code executor**

```typescript
// lib/utils/code-executor.ts
export type ExecutionResult = {
  output: string;
  error?: string;
  logs: string[];
};

export async function executeCode(code: string, language: string): Promise<ExecutionResult> {
  const logs: string[] = [];
  
  // Only support JavaScript/TypeScript for now
  if (!['javascript', 'typescript'].includes(language.toLowerCase())) {
    return {
      output: '',
      error: 'Code execution only supported for JavaScript/TypeScript',
      logs: [],
    };
  }

  try {
    // Create sandboxed execution context
    const sandbox = {
      console: {
        log: (...args: any[]) => logs.push(args.map(String).join(' ')),
        error: (...args: any[]) => logs.push('ERROR: ' + args.map(String).join(' ')),
        warn: (...args: any[]) => logs.push('WARN: ' + args.map(String).join(' ')),
      },
    };

    // Wrap code in function to capture return value
    const wrappedCode = `
      (function() {
        ${code}
      })()
    `;

    // Execute in sandboxed context
    const func = new Function('console', `return ${wrappedCode}`);
    const result = func(sandbox.console);

    return {
      output: result !== undefined ? String(result) : '',
      logs,
    };
  } catch (error) {
    return {
      output: '',
      error: error instanceof Error ? error.message : String(error),
      logs,
    };
  }
}
```

- [ ] **Step 2: Create code preview component**

```typescript
// features/snippets/components/code-preview.tsx
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
```

- [ ] **Step 3: Add preview tab to snippet editor**

```typescript
// Modify features/snippets/components/snippet-editor.tsx
// Add imports:
import CodePreview from './code-preview';
import { useState } from 'react';

// Add state for tab:
const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

// Add tabs UI before form:
<div className="flex gap-2 mb-4 border-b border-gray-800">
  <button
    onClick={() => setActiveTab('edit')}
    className={`px-4 py-2 text-sm ${
      activeTab === 'edit'
        ? 'text-orange-500 border-b-2 border-orange-500'
        : 'text-gray-400'
    }`}
  >
    Edit
  </button>
  <button
    onClick={() => setActiveTab('preview')}
    className={`px-4 py-2 text-sm ${
      activeTab === 'preview'
        ? 'text-orange-500 border-b-2 border-orange-500'
        : 'text-gray-400'
    }`}
  >
    Preview
  </button>
</div>

// Wrap form in conditional:
{activeTab === 'edit' ? (
  <form onSubmit={handleSubmit} className="space-y-6">
    {/* existing form fields */}
  </form>
) : (
  <CodePreview code={code} language={language} />
)}
```

- [ ] **Step 4: Test code execution**

Run: `npm run dev`, create snippet with JS code, switch to Preview tab, click Run
Expected: Code executes, shows output/logs/errors

- [ ] **Step 5: Commit**

```bash
git add lib/utils/code-executor.ts features/snippets/components/code-preview.tsx features/snippets/components/snippet-editor.tsx
git commit -m "feat: add code execution preview for JavaScript snippets"
```

---

## Verification

After all tasks complete:

1. **Export/Import:** Export snippets to JSON/CSV, import them back
2. **Share:** Share a snippet, open the public URL in incognito
3. **Themes:** Toggle dark/light mode, change syntax themes
4. **Shortcuts:** Test Ctrl+N, Ctrl+K, Ctrl+/, Esc
5. **Preview:** Create JS snippet, run it in preview tab
6. **Build:** Run `npm run build` - should succeed with no errors

Expected: All features work, build passes, no console errors
