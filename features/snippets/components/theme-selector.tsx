'use client';

import { useTheme } from '@/lib/hooks/use-theme';
import { SYNTAX_THEMES } from '@/lib/types';

export default function ThemeSelector() {
  const { colorTheme, globalSyntaxTheme, toggleColorTheme, changeGlobalSyntaxTheme } = useTheme();

  return (
    <div className="space-y-4">
      <span className="section-label">Theme</span>

      {/* Color Mode Toggle */}
      <div>
        <label className="text-[11px] block mb-2" style={{ color: 'var(--text-faint)' }}>Color Mode</label>
        <button
          onClick={toggleColorTheme}
          className="btn-ghost w-full text-left text-sm flex items-center justify-between"
        >
          <span>{colorTheme === 'dark' ? '🌙 Dark' : '☀️ Light'}</span>
          <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>tap to switch</span>
        </button>
      </div>

      {/* Default Syntax Theme */}
      <div>
        <label className="text-[11px] block mb-2" style={{ color: 'var(--text-faint)' }}>Default Syntax</label>
        <select
          value={globalSyntaxTheme}
          onChange={(e) => changeGlobalSyntaxTheme(e.target.value as any)}
          className="input text-sm"
          style={{ cursor: 'pointer', padding: '8px 12px' }}
        >
          {SYNTAX_THEMES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
