import { CategoryConfig } from '@/types';

export const activeCategoryConfig: CategoryConfig = {
  id: 'skincare',
  name: 'Skincare & Clinical Beauty',
  tagline: 'Precision dermal solutions matched to your facial skin profile',
  description: 'AI-driven formulation matching for skin type, tone, concerns, and clean ingredient requirements.',
  defaultCurrency: 'INR',
  currencySymbol: '₹',
  maxBudgetLimit: 5000,
  defaultBudget: 1500,

  traitLabels: {
    faceShapes: {
      oval: { label: 'Oval', description: 'Balanced proportions with gently rounded jawline' },
      round: { label: 'Round', description: 'Similar width and length with soft curved angles' },
      square: { label: 'Square', description: 'Defined angles with uniform forehead and jaw width' },
      heart: { label: 'Heart', description: 'Broader forehead tapering gracefully to a pointed chin' },
      oblong: { label: 'Oblong', description: 'Elongated facial profile with straight cheek lines' },
    },
    skinTones: {
      fair: { label: 'Fair (Fitzpatrick I-II)', hexSample: '#FDEDE2' },
      light: { label: 'Light (Fitzpatrick II-III)', hexSample: '#F7DFD0' },
      medium: { label: 'Medium (Fitzpatrick III-IV)', hexSample: '#E5B89A' },
      tan: { label: 'Tan (Fitzpatrick IV-V)', hexSample: '#B87B56' },
      deep: { label: 'Deep (Fitzpatrick V-VI)', hexSample: '#6E432A' },
    },
    skinUndertones: {
      warm: { label: 'Warm (Golden/Peachy)', description: 'Yellow, peachy, or golden undertones that tan easily' },
      cool: { label: 'Cool (Rosy/Blue)', description: 'Pink, red, or subtle bluish undertones prone to flushing' },
      neutral: { label: 'Neutral (Balanced)', description: 'A harmonious blend of warm and cool pigments' },
    },
    concerns: {
      oiliness: { label: 'T-Zone Oiliness / Excess Sebum', description: 'Elevated shine or active lipid production' },
      redness: { label: 'Erythema / Redness', description: 'Visible vascular reactivity or sensitivity flushing' },
      dryness: { label: 'Surface Dehydration', description: 'Dullness or compromised lipid moisture barrier' },
      dark_circles: { label: 'Periorbital Pigmentation', description: 'Under-eye vascularity or melanin shadowing' },
      enlarged_pores: { label: 'Pore Congestion', description: 'Visible pore dilation in central face' },
      uneven_texture: { label: 'Uneven Surface Texture', description: 'Keratin buildup or rough surface profile' },
    },
  },

  filterOptions: {
    concerns: [
      { id: 'acne', label: 'Acne & Breakouts' },
      { id: 'oiliness', label: 'Excess Sebum / Shine' },
      { id: 'hyperpigmentation', label: 'Dark Spots & Melasma' },
      { id: 'redness', label: 'Redness & Sensitivity' },
      { id: 'dryness', label: 'Dryness & Flaking' },
      { id: 'dark_circles', label: 'Dark Circles & Puffiness' },
      { id: 'anti_aging', label: 'Fine Lines & Firmness' },
      { id: 'barrier_repair', label: 'Damaged Moisture Barrier' },
      { id: 'dullness', label: 'Dullness & Glow Boost' },
      { id: 'clogged_pores', label: 'Clogged Pores & Blackheads' },
    ],
    avoidIngredients: [
      { id: 'fragrance', label: 'Synthetic Fragrance / Parfum' },
      { id: 'essential_oils', label: 'Essential Oils' },
      { id: 'drying_alcohol', label: 'Denatured / Drying Alcohol' },
      { id: 'sulfates', label: 'Sulfates (SLS / SLES)' },
      { id: 'parabens', label: 'Parabens' },
      { id: 'silicones', label: 'Silicones (Dimethicone)' },
      { id: 'comedogenic_oils', label: 'Heavy Mineral / Comedogenic Oils' },
    ],
    productTypes: [
      { id: 'cleanser', label: 'Cleansers & Face Washes' },
      { id: 'serum', label: 'Concentrated Serums & Ampoules' },
      { id: 'moisturizer', label: 'Moisturizers & Gel Creams' },
      { id: 'sunscreen', label: 'Broad Spectrum Sunscreens' },
      { id: 'toner', label: 'Toners & Essences' },
      { id: 'treatment', label: 'Targeted Spot Treatments & Exfoliants' },
    ],
    budgetPresets: [500, 1000, 1500, 2500, 4000],
  },

  scoringWeights: {
    traitMatchWeight: 0.25,
    concernMatchWeight: 0.35,
    requirementMatchWeight: 0.20,
    budgetFitWeight: 0.10,
    ratingWeight: 0.10,
  },
};
