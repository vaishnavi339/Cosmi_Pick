import { HeroCinematic } from '@/components/landing/HeroCinematic';
import { PinnedScrollStory } from '@/components/landing/PinnedScrollStory';
import { FeaturedProducts } from '@/components/landing/FeaturedProducts';
import { UndertonePicker } from '@/components/landing/UndertonePicker';
import { IngredientMarquee } from '@/components/landing/IngredientMarquee';
import { TextureSection } from '@/components/landing/TextureSection';
import { PrivacySection } from '@/components/landing/PrivacySection';
import { FaqAccordion } from '@/components/landing/FaqAccordion';
import { CtaBanner } from '@/components/landing/CtaBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroCinematic />
      <PinnedScrollStory />
      <FeaturedProducts />
      <UndertonePicker />
      <IngredientMarquee />
      <TextureSection />
      <PrivacySection />
      <FaqAccordion />
      <CtaBanner />
    </div>
  );
}
