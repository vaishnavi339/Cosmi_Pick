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
      className={`relative inline-flex items-center justify-center p-2.5 rounded-full transition-all duration-200 border border-[#DCDACD] dark:border-white/10 bg-white/65 dark:bg-white/[0.05] hover:bg-[#E2EADD]/55 dark:hover:bg-white/10 text-[#213A30] dark:text-[#F7F6F0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B86A4B] ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-[#D09A50] transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#68766C] transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
