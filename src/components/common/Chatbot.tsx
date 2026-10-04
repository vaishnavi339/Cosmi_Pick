'use client';

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };
const welcome = 'Hi, I’m Skin Guide. I can help you explore simple skincare routines, ingredients, and products in the CosmicPick catalog. What would you like help with?';
const prompts = ['Build me a simple routine', 'Products for dry skin?', 'What does niacinamide do?'];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: welcome }]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: 'user' as const, content }];
    setMessages(next);
    setDraft('');
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-12) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Please try sending that again.');
      setMessages((current) => [...current, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(draft);
    }
  }

  return (
    <div className="fixed bottom-5 right-4 z-[80] sm:bottom-6 sm:right-6">
      {open && (
        <section aria-label="Skin Guide chat" className="mb-3 flex h-[min(620px,calc(100dvh-7rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.6rem] border border-[#DADCCF] bg-[#FBFCF8] shadow-[0_24px_80px_rgba(23,32,27,0.22)] dark:border-white/10 dark:bg-[#1F2B23]">
          <header className="flex items-center gap-3 bg-[#213A30] px-4 py-4 text-[#F7F6F0]">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#D4E2D2] text-[#213A30]"><Sparkles size={19} /></div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-lg leading-tight">Skin Guide</h2>
              <p className="mt-0.5 text-xs text-white/70">CosmicPick skincare assistant</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-2 text-white/75 transition hover:bg-white/10 hover:text-white"><X size={19} /></button>
          </header>

          <div ref={listRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-br-md bg-[#213A30] text-white' : 'rounded-bl-md border border-[#E5E8DE] bg-white text-[#304238] dark:border-white/10 dark:bg-white/5 dark:text-[#F7F6F0]'}`}>{message.content}</p>
              </div>
            ))}
            {messages.length === 1 && !loading && <div className="flex flex-wrap gap-2 pt-1">{prompts.map((prompt) => <button key={prompt} type="button" onClick={() => void sendMessage(prompt)} className="rounded-full border border-[#DADCCF] px-3 py-2 text-left text-xs text-[#405449] transition hover:border-[#71896C] hover:bg-[#F1F4EE] dark:border-white/15 dark:text-[#E2EADD] dark:hover:bg-white/10">{prompt}</button>)}</div>}
            {loading && <div className="flex items-center gap-2 text-xs text-[#68766C] dark:text-[#A6B0A5]"><span className="flex gap-1"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#71896C]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#71896C] [animation-delay:120ms]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#71896C] [animation-delay:240ms]" /></span>Skin Guide is thinking</div>}
          </div>

          <div className="border-t border-[#E5E8DE] px-4 pb-3 pt-3 dark:border-white/10">
            {error && <p role="alert" className="mb-2 text-xs text-[#A44839]">{error}</p>}
            <form onSubmit={onSubmit} className="flex items-center gap-2 rounded-full border border-[#DADCCF] bg-white p-1.5 pl-4 focus-within:border-[#71896C] dark:border-white/15 dark:bg-white/5">
              <input ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={onKeyDown} maxLength={700} placeholder="Ask a skincare question…" aria-label="Your skincare question" className="min-w-0 flex-1 bg-transparent py-2 text-sm text-[#213A30] outline-none placeholder:text-[#89948B] dark:text-white" />
              <button type="submit" disabled={!draft.trim() || loading} aria-label="Send message" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#213A30] text-white transition hover:bg-[#365443] disabled:cursor-not-allowed disabled:opacity-40"><Send size={16} /></button>
            </form>
            <div className="flex items-center justify-between gap-3 pt-3 text-[11px] text-[#77837A] dark:text-[#A6B0A5]">
              <span>General cosmetic guidance · Not medical advice</span>
              <Link href="/#ritual-studio" onClick={() => setOpen(false)} className="inline-flex shrink-0 items-center gap-1 font-medium text-[#365443] hover:underline dark:text-[#D4E2D2]">Explore <ArrowRight size={12} /></Link>
            </div>
          </div>
        </section>
      )}
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Close Skin Guide' : 'Chat with Skin Guide'} className="ml-auto flex items-center gap-2 rounded-full bg-[#213A30] px-4 py-3 text-sm font-medium text-white shadow-[0_8px_28px_rgba(33,58,48,0.3)] transition hover:-translate-y-0.5 hover:bg-[#365443] focus:outline-none focus:ring-2 focus:ring-[#B7CAB5] focus:ring-offset-2">
        {open ? <X size={18} /> : <><span className="relative"><MessageCircle size={19} /><Bot size={11} className="absolute -bottom-0.5 -right-1 rounded-full bg-[#D4E2D2] p-0.5 text-[#213A30]" /></span><span>Ask Skin Guide</span></>}
      </button>
    </div>
  );
}
