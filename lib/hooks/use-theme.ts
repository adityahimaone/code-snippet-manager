'use client';

import { useEffect, useState } from 'react';

type ColorTheme = 'dark' | 'light';
type SyntaxTheme = 'github-dark' | 'monokai' | 'dracula' | 'one-light' | 'nord';

export function useTheme() {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('light');
  const [globalSyntaxTheme, setGlobalSyntaxTheme] = useState<SyntaxTheme>('github-dark');

  useEffect(() => {
    const savedColor = localStorage.getItem('color-theme') as ColorTheme;
    const savedSyntax = localStorage.getItem('syntax-theme') as SyntaxTheme;

    if (savedColor) {
      setColorTheme(savedColor);
      document.documentElement.setAttribute('data-theme', savedColor);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = prefersDark ? 'dark' : 'light';
      setColorTheme(theme);
      document.documentElement.setAttribute('data-theme', theme);
    }

    if (savedSyntax) {
      setGlobalSyntaxTheme(savedSyntax);
    }
  }, []);

  const toggleColorTheme = () => {
    const next = colorTheme === 'dark' ? 'light' : 'dark';
    setColorTheme(next);
    localStorage.setItem('color-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const changeGlobalSyntaxTheme = (theme: SyntaxTheme) => {
    setGlobalSyntaxTheme(theme);
    localStorage.setItem('syntax-theme', theme);
  };

  return {
    colorTheme,
    globalSyntaxTheme,
    toggleColorTheme,
    changeGlobalSyntaxTheme,
  };
}
