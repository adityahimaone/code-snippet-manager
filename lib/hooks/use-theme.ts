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
