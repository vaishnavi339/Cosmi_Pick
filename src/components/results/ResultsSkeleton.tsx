'use client';

import React from 'react';

export function ResultsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Top Summary Strip Skeleton */}
      <div className="rounded-3xl glass-card border border-slate-200/80 dark:border-white/10 p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-200/60 dark:border-white/10">
          <div className="h-6 w-48 rounded-full bg-slate-200 dark:bg-white/10" />
          <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-white/10" />
        </div>
        <div className="flex flex-wrap gap-2.5 pt-2">
          <div className="h-7 w-28 rounded-xl bg-slate-200 dark:bg-white/10" />
          <div className="h-7 w-32 rounded-xl bg-slate-200 dark:bg-white/10" />
          <div className="h-7 w-24 rounded-xl bg-slate-200 dark:bg-white/10" />
          <div className="h-7 w-36 rounded-xl bg-slate-200 dark:bg-white/10" />
          <div className="h-7 w-32 rounded-xl bg-slate-200 dark:bg-white/10" />
        </div>
      </div>

      {/* Hero Pick Card Skeleton */}
      <div className="rounded-[1.75rem] glass-card border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 space-y-6">
        <div className="h-6 w-52 rounded-full bg-slate-200 dark:bg-white/10" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Visual Left Tile Skeleton */}
          <div className="md:col-span-5 flex justify-center">
            <div className="w-56 h-72 rounded-3xl bg-slate-200 dark:bg-white/10" />
          </div>

          {/* Details Right Column Skeleton */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-slate-200 dark:bg-white/10" />
              <div className="h-8 w-4/5 rounded-xl bg-slate-200 dark:bg-white/10" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-white/10" />
                <div className="space-y-1.5">
                  <div className="h-3 w-16 rounded bg-slate-200 dark:bg-white/10" />
                  <div className="h-4 w-28 rounded bg-slate-200 dark:bg-white/10" />
                </div>
              </div>
              <div className="h-8 w-20 rounded-xl bg-slate-200 dark:bg-white/10" />
            </div>

            {/* Bullets Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-200 dark:bg-white/10" />
              <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-white/10" />
              <div className="h-4 w-4/6 rounded bg-slate-200 dark:bg-white/10" />
            </div>

            {/* Actives & Action Skeleton */}
            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded-lg bg-slate-200 dark:bg-white/10" />
                <div className="h-6 w-20 rounded-lg bg-slate-200 dark:bg-white/10" />
              </div>
              <div className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Cards Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-3xl glass-card border border-slate-200/80 dark:border-white/10 overflow-hidden space-y-4"
          >
            <div className="w-full aspect-[4/3] bg-slate-200 dark:bg-white/10" />
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-20 rounded bg-slate-200 dark:bg-white/10" />
                  <div className="h-6 w-4/5 rounded-lg bg-slate-200 dark:bg-white/10" />
                  <div className="h-3 w-32 rounded bg-slate-200 dark:bg-white/10" />
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/10 flex-shrink-0" />
              </div>

              <div className="h-16 rounded-2xl bg-slate-100 dark:bg-white/5" />

              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-lg bg-slate-200 dark:bg-white/10" />
                <div className="h-5 w-16 rounded-lg bg-slate-200 dark:bg-white/10" />
                <div className="h-5 w-16 rounded-lg bg-slate-200 dark:bg-white/10" />
              </div>

              <div className="h-10 w-full rounded-2xl bg-slate-200 dark:bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
