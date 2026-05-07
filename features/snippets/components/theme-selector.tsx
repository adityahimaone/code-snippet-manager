'use client';

import { useTheme } from '@/lib/hooks/use-theme';
import { SYNTAX_THEMES } from '@/lib/types';

export default function ThemeSelector() {
  const { colorTheme, globalSyntaxTheme, toggleColorTheme, changeGlobalSyntaxTheme } = useTheme();

  return (
    <div className="space-y-4">
      <span className="section-label">Theme</span>

      {/* Color Mode */}
      <div>
        <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>Color Mode</label>
        <button
          onClick={toggleColorTheme}
          className="btn-ghost w-full text-left text-sm"
        >
          {colorTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

      {/* Default Syntax Theme */}
      <div>
        <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>Default Syntax</label>
        <select
          value={globalSyntaxTheme}
          onChange={(e) => changeGlobalSyntaxTheme(e.target.value as any)}
          className="input text-sm"
          style={{ cursor: 'pointer' }}
        >
          {SYNTAX_THEMES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
