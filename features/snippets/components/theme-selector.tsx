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
