'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-200 border border-white/10 hover:border-indigo-400/40 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
