'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, Check, ChevronDown, Leaf, LockKeyhole, ScanFace, SlidersHorizontal, Sparkles, SunMedium } from 'lucide-react';
import productsData from '@/data/products.json';
import { Product } from '@/types';
import { formatINR } from '@/lib/utils';
import { ProductVisual } from '@/components/common/ProductVisual';

const products = productsData as Product[];
const concerns = [
  { id: 'dryness', label: 'A little more hydration' },
  { id: 'acne', label: 'Fewer breakouts' },
  { id: 'redness', label: 'Calmer looking skin' },
  { id: 'uneven_texture', label: 'Smoother texture' },
];

const methodSteps = [
  {
    number: '01',
    title: 'Get to know your skin',
    body: 'A quick camera scan reads visible tone and facial contours right in your browser. Prefer not to use your camera? Browse the catalog by goal and budget in the Ritual Studio.',
    image: '/images/mood/step-01-daylight-scan.webp',
    alt: 'Soft natural daylight on skin',
    icon: ScanFace,
  },
  {
    number: '02',
    title: 'Set your own ground rules',
    body: 'Choose the concerns you care about, ingredients you avoid, and a budget that feels comfortable. Your priorities guide every pick.',
    image: '/images/mood/step-02-dropper-rules.webp',
    alt: 'A skincare serum dropper in warm light',
    icon: SlidersHorizontal,
  },
  {
    number: '03',
    title: 'Find a routine that fits',
    body: 'See thoughtful product matches with clear reasons, ingredient notes, and simple AM and PM order. Keep what works for you.',
    image: '/images/mood/step-03-routine-picks.webp',
    alt: 'A considered skincare routine with product bottles',
    icon: Sparkles,
  },
];

const faqs = [
  {
    question: 'Do I have to use the camera?',
    answer: 'No. Explore catalog products in the Ritual Studio by concern and budget without opening your camera. For a full personal match, use the private on-device scan.',
  },
  {
    question: 'What happens to my scan?',
    answer: 'The camera analysis runs in your browser. Photos are not saved or uploaded; only the skin traits you confirm are used to shape recommendations.',
  },
  {
    question: 'Are these medical recommendations?',
    answer: 'No. CosmicPick helps you explore cosmetic products and ingredients. It does not diagnose or treat skin conditions. For medical concerns, speak with a dermatologist.',
  },
];

export function CosmicHome() {
  const [concern, setConcern] = useState('dryness');
  const [budget, setBudget] = useState(1500);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  const finderProducts = useMemo(() => {
    return products
      .filter((product) => product.targetedConcerns.includes(concern) && product.priceINR <= budget)
      .sort((a, b) => b.rating - a.rating || a.priceINR - b.priceINR)
      .slice(0, 3);
  }, [concern, budget]);

  const bestsellers = useMemo(
    () => [...products].filter((product) => product.image).sort((a, b) => b.rating - a.rating).slice(0, 4),
    [],
  );

  return (
    <div className="overflow-hidden">
      {/* Cinematic, full-bleed editorial hero */}
      <section className="relative isolate flex min-h-[min(700px,calc(88svh-72px))] overflow-hidden bg-[#17201B] text-[#F7F6F0]">
        <motion.div aria-hidden="true" className="absolute inset-0" initial={false} animate={reduceMotion ? {} : { scale: [1.02, 1.08] }} transition={{ duration: 24, ease: 'linear', repeat: Infinity, repeatType: 'mirror' }}>
          <Image src="/images/mood/hero-woman-applying.webp" alt="" fill priority sizes="100vw" className="object-cover object-[58%_center]" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#14251E]/95 via-[#14251E]/72 to-[#14251E]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14251E]/55 via-transparent to-[#14251E]/10" />
        <div aria-hidden="true" className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#D4E2D2]/10 blur-[100px]" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 xl:px-12">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="max-w-5xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E2EADD] backdrop-blur-md"><span className="h-px w-7 bg-[#D5AD7D]" /> Skin first. Always.</div>
            <h1 className="mt-6 max-w-5xl font-serif text-[clamp(3rem,7vw,6.5rem)] leading-[0.98] tracking-[-0.045em] text-white">Good skin days,<span className="block font-normal italic text-[#E4C59D]">made personal.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/80 sm:text-lg">A clearer way to find skincare that fits your skin, your standards, and your everyday life.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/scan" className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#E2EADD] px-7 py-4 text-sm font-semibold text-[#213A30] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-white">Find my routine <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
              <Link href="#ritual-studio" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">Explore by concern <ArrowDown className="h-4 w-4" /></Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-medium text-white/75">
              <span className="inline-flex items-center gap-2"><LockKeyhole className="h-3.5 w-3.5 text-[#D4E2D2]" />Private by design</span>
              <span className="inline-flex items-center gap-2"><Leaf className="h-3.5 w-3.5 text-[#D4E2D2]" />Your rules come first</span>
              <span className="inline-flex items-center gap-2"><SunMedium className="h-3.5 w-3.5 text-[#D4E2D2]" />Always free to explore</span>
            </div>
          </motion.div>
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.8 }} className="absolute bottom-7 right-5 hidden items-center gap-4 text-right text-white/80 sm:flex sm:right-8 xl:right-12">
            <div><p className="text-[9px] uppercase tracking-[0.2em]">A better place to begin</p><p className="mt-1 font-serif text-xl text-white">Your skin, understood.</p></div>
            <a href="#ritual-method" aria-label="Explore how CosmicPick works" className="grid h-11 w-11 place-items-center rounded-full border border-white/50 bg-white/10 backdrop-blur transition hover:bg-white/20"><ArrowDown className="h-4 w-4" /></a>
          </motion.div>
          <span className="absolute bottom-8 left-5 text-[9px] uppercase tracking-[0.24em] text-white/55 sm:left-8 xl:left-12">CosmicPick · Personal skincare, considered</span>
        </div>
        <div className="border-y border-[#DADDD1] bg-[#F9F8F3]">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 xl:px-12 py-4 flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-2 text-[10px] sm:text-[11px] uppercase tracking-[0.13em] text-[#68766C]">
            <span>Thoughtful matches</span><span className="hidden sm:block w-1 h-1 rounded-full bg-[#B86A4B]" />
            <span>No sponsored ranking</span><span className="hidden sm:block w-1 h-1 rounded-full bg-[#B86A4B]" />
            <span>Real product photography</span><span className="hidden sm:block w-1 h-1 rounded-full bg-[#B86A4B]" />
            <span>Your budget respected</span>
          </div>
        </div>
      </section>

      {/* Clear, reassuring process */}
      <section id="ritual-method" className="scroll-mt-24 bg-[#F9F8F3] py-20 sm:py-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 xl:px-12">
          <div className="max-w-2xl mb-11 sm:mb-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B86A4B]">A routine with room to breathe</p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl text-[#213A30] tracking-tight">Thoughtful care, in three easy steps.</h2>
            <p className="mt-4 text-sm sm:text-base leading-7 text-[#68766C]">No ten-step rules to follow. Just a useful starting point built around the things that matter to you.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
            {methodSteps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.article key={step.number} initial={reduceMotion ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65, delay: Number(step.number) * 0.08 }} className="group overflow-hidden rounded-[1.5rem] border border-[#E5E3D9] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-38px_rgba(33,58,48,.36)]">
                  <div className="relative aspect-[1.55] overflow-hidden bg-[#E8E8DE]">
                    <Image src={step.image} alt={step.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                    <span className="absolute left-4 top-4 grid place-items-center w-9 h-9 rounded-full bg-[#F9F8F3]/90 text-[11px] font-semibold text-[#213A30]">{step.number}</span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-[#54715C]"><Icon className="w-4 h-4" /><span className="text-[9px] font-semibold uppercase tracking-[0.17em]">Step {step.number}</span></div>
                    <h3 className="mt-3 font-serif text-2xl text-[#213A30]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#68766C]">{step.body}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* New interactive feature: concern and budget product finder */}
      <section id="ritual-studio" className="scroll-mt-24 bg-[#E9EDE4] py-20 sm:py-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 xl:px-12">
          <div className="grid lg:grid-cols-[0.72fr_1.28fr] gap-10 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B86A4B]">Meet the Ritual Studio</p>
              <h2 className="mt-4 font-serif text-4xl sm:text-5xl leading-[1.03] tracking-tight text-[#213A30]">A small edit, made around you.</h2>
              <p className="mt-4 text-sm sm:text-base leading-7 text-[#68766C]">Choose what you’d like to focus on and set a comfortable budget. Explore the catalog before you start your personal match.</p>

              <fieldset className="mt-8">
                <legend className="text-xs font-semibold text-[#213A30] mb-3">What would you like to focus on?</legend>
                <div className="flex flex-wrap gap-2">
                  {concerns.map((item) => (
                    <button key={item.id} type="button" aria-pressed={concern === item.id} onClick={() => setConcern(item.id)} className={`rounded-full border px-3.5 py-2.5 text-xs font-medium transition ${concern === item.id ? 'border-[#213A30] bg-[#213A30] text-white shadow-sm' : 'border-[#CFD8CB] bg-white/60 text-[#526257] hover:border-[#839783] hover:bg-white'}`}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-7 rounded-2xl border border-[#CFD8CB] bg-[#F8F8F1]/70 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="ritual-budget" className="text-xs font-semibold text-[#213A30]">Your maximum budget</label>
                  <span className="font-serif text-xl text-[#213A30]">{formatINR(budget)}</span>
                </div>
                <input id="ritual-budget" type="range" min="300" max="5000" step="100" value={budget} onChange={(event) => setBudget(Number(event.target.value))} className="mt-4 w-full accent-[#54715C]" />
                <div className="mt-1 flex justify-between text-[10px] text-[#819084]"><span>₹300</span><span>₹5,000</span></div>
              </div>
              <p className="mt-3 text-[10px] leading-5 text-[#78847A]">A browsing shortcut based on catalog details. Your full recommendations are personalized in the scan.</p>
            </div>

            <div className="min-w-0">
              <div className="flex items-end justify-between gap-4 mb-5">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#718172]">Your first edit</p>
                  <h3 className="mt-1 font-serif text-2xl sm:text-3xl text-[#213A30]">A few ideas to explore</h3>
                </div>
                <span className="text-[10px] text-[#718172]">{finderProducts.length} {finderProducts.length === 1 ? 'match' : 'matches'}</span>
              </div>
              {finderProducts.length ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  {finderProducts.map((product) => (
                    <article key={product.id} className="group rounded-2xl border border-[#E1E2D8] bg-white p-3.5 transition hover:-translate-y-1 hover:shadow-[0_20px_45px_-32px_rgba(33,58,48,.5)]">
                      <div className="aspect-[1.1] overflow-hidden rounded-xl bg-[#F6F5F0]">
                        <ProductVisual product={product} size="fill" showAttribution={false} showHoverEffect={false} className="!w-full !h-full !rounded-xl" />
                      </div>
                      <div className="px-1 pt-4">
                        <p className="text-[9px] uppercase tracking-[0.16em] text-[#849184]">{product.brand} · {product.category}</p>
                        <h4 className="mt-1.5 min-h-10 font-medium text-[13px] leading-5 text-[#293C31] line-clamp-2">{product.name}</h4>
                        <div className="mt-3 flex items-center justify-between border-t border-[#ECECE5] pt-3">
                          <span className="text-sm font-semibold text-[#213A30]">{formatINR(product.priceINR)}</span>
                          <span className="text-[10px] text-[#718172]">★ {product.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#B9C6B9] bg-white/50 p-10 text-center">
                  <p className="font-serif text-2xl text-[#213A30]">Nothing in this range just yet.</p>
                  <p className="mt-2 text-sm text-[#68766C]">Raise your budget a little to explore more options.</p>
                </div>
              )}
              <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between rounded-2xl bg-[#213A30] p-5 text-white sm:px-6">
                <div><p className="text-[9px] uppercase tracking-[0.18em] text-[#D4E2D2]">Ready for a personal edit?</p><p className="mt-1 font-serif text-xl">Let’s get to know your skin.</p></div>
                <Link href="/scan" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F7F6F0] px-5 py-3 text-xs font-semibold text-[#213A30] transition hover:bg-white">Start my scan <ArrowRight className="w-3.5 h-3.5" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product shelf with local product photography */}
      <section id="shop" className="scroll-mt-24 bg-[#F9F8F3] py-20 sm:py-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 xl:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-9 sm:mb-12">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B86A4B]">A thoughtful shelf</p><h2 className="mt-3 font-serif text-4xl sm:text-5xl tracking-tight text-[#213A30]">Good formulas, clearly considered.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#68766C]">Browse real product photos and ingredient details from our growing catalog.</p></div>
            <Link href="/scan" className="inline-flex items-center gap-2 text-xs font-semibold text-[#365443] hover:text-[#B86A4B] transition">Get my personal match <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {bestsellers.map((product) => (
              <article key={product.id} className="group rounded-2xl border border-[#E7E5DB] bg-white p-3 sm:p-4">
                <div className="relative aspect-[0.95] rounded-xl bg-[#F7F6F1] overflow-hidden"><ProductVisual product={product} size="fill" showAttribution={false} showHoverEffect={false} className="!w-full !h-full !rounded-xl" /><span className="absolute left-2 top-2 rounded-full bg-[#F9F8F3]/90 px-2.5 py-1 text-[8px] sm:text-[9px] uppercase tracking-[0.12em] text-[#526257]">{product.category}</span></div>
                <p className="mt-3 text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-[#849184]">{product.brand}</p>
                <h3 className="mt-1 font-medium text-xs sm:text-sm text-[#293C31] leading-5 line-clamp-2 min-h-10">{product.name}</h3>
                <div className="mt-2 flex items-center justify-between text-xs"><span className="font-semibold text-[#213A30]">{formatINR(product.priceINR)}</span><span className="text-[#718172]">★ {product.rating.toFixed(1)}</span></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Brand promise */}
      <section id="our-approach" className="scroll-mt-24 bg-[#213A30] text-[#F7F6F0]">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 min-h-[520px]">
          <div className="relative min-h-[300px] lg:min-h-full order-2 lg:order-1">
            <Image src="/images/mood/ingredients-flatlay.webp" alt="Skincare ingredients and botanicals arranged in soft daylight" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#213A30]/20" />
            <div className="absolute bottom-5 left-5 rounded-full bg-[#F7F6F0]/90 px-3 py-2 text-[9px] uppercase tracking-[0.15em] text-[#405C45]">Skin care, with more context</div>
          </div>
          <div className="px-5 sm:px-10 xl:px-16 py-16 sm:py-20 flex flex-col justify-center order-1 lg:order-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C7A77A]">Better-informed choices</p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl sm:text-5xl leading-[1.05]">A good routine should make sense to you.</h2>
            <p className="mt-5 max-w-lg text-sm sm:text-base leading-7 text-[#D5DFD4]">We explain the why behind every pick, make ingredients easier to understand, and keep your preferences visible at every step.</p>
            <ul className="mt-7 space-y-3 text-sm text-[#E6EBE2]">
              {['See why each product made your list', 'Filter around ingredients you avoid', 'Compare price, actives, and product details'].map((item) => <li key={item} className="flex items-center gap-3"><span className="grid place-items-center w-5 h-5 rounded-full bg-white/10 text-[#C7A77A]"><Check className="w-3 h-3" /></span>{item}</li>)}
            </ul>
            <Link href="/privacy" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-white hover:text-[#C7A77A] transition">Read our privacy promise <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
        </div>
      </section>

      {/* Minimal helpful FAQs */}
      <section id="faq" className="scroll-mt-24 bg-[#F9F8F3] py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 grid md:grid-cols-[0.75fr_1.25fr] gap-10 md:gap-20">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B86A4B]">A few good things to know</p><h2 className="mt-4 font-serif text-4xl sm:text-5xl text-[#213A30]">Questions, answered.</h2><p className="mt-4 text-sm leading-6 text-[#68766C]">We want your routine to feel simple before you even begin.</p></div>
          <div className="divide-y divide-[#E1E2D8] border-y border-[#E1E2D8]">
            {faqs.map((faq, index) => (
              <div key={faq.question}>
                <button type="button" className="flex w-full items-center justify-between gap-5 py-5 text-left text-sm font-medium text-[#213A30]" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  {faq.question}<ChevronDown className={`h-4 w-4 shrink-0 text-[#718172] transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && <p className="max-w-xl pb-5 pr-8 text-sm leading-6 text-[#68766C]">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple final invitation */}
      <section className="bg-[#E9EDE4] px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <span className="mx-auto grid place-items-center w-11 h-11 rounded-2xl bg-white text-[#54715C] shadow-sm"><Sparkles className="w-5 h-5" /></span>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B86A4B]">Make space for what works</p>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl text-[#213A30]">Your next good skin day starts here.</h2>
          <p className="mt-4 text-sm sm:text-base text-[#68766C]">Start with a private scan, or tell us what you know in a quick quiz.</p>
          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/scan" className="inline-flex justify-center items-center gap-2 rounded-full bg-[#213A30] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#162B22]">Start my scan <ArrowRight className="w-4 h-4" /></Link>
            <Link href="#ritual-studio" className="inline-flex justify-center items-center gap-2 rounded-full border border-[#C8D2C6] bg-white/60 px-7 py-4 text-sm font-semibold text-[#213A30] transition hover:bg-white">Explore by concern <ArrowDown className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
