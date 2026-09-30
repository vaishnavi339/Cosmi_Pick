/**
 * Ingredient checking and active detection logic for Open Beauty Facts ingredients lists.
 */

export interface AvoidMatch {
  ruleId: string;
  ruleLabel: string;
  matchedIngredient: string;
}

export interface DetectedActive {
  id: string;
  name: string;
  matchedTerm: string;
  tagline: string;
}

const AVOID_DICTIONARY: Record<string, { label: string; patterns: RegExp[] }> = {
  fragrance: {
    label: 'Synthetic Fragrance',
    patterns: [
      /\bfragrance\b/i,
      /\bparfum\b/i,
      /\baroma\b/i,
      /\bperfume\b/i,
      /\blinalool\b/i,
      /\blimonene\b/i,
      /\bgeraniol\b/i,
      /\bcitronellol\b/i,
      /\beugenol\b/i,
    ],
  },
  parabens: {
    label: 'Parabens',
    patterns: [
      /\bmethylparaben\b/i,
      /\bpropylparaben\b/i,
      /\bbutylparaben\b/i,
      /\bethylparaben\b/i,
      /\bisobutylparaben\b/i,
      /\bparaben\b/i,
    ],
  },
  sulfates: {
    label: 'Sulfates',
    patterns: [
      /\bsodium lauryl sulfate\b/i,
      /\bsodium laureth sulfate\b/i,
      /\bammonium lauryl sulfate\b/i,
      /\bsls\b/i,
      /\bsles\b/i,
    ],
  },
  alcohol: {
    label: 'Drying Alcohols',
    patterns: [
      /\balcohol denat\b/i,
      /\bdenatured alcohol\b/i,
      /\bisopropyl alcohol\b/i,
      /\bsd alcohol\b/i,
      /\bethanol\b/i,
      /\bethyl alcohol\b/i,
    ],
  },
  'essential-oils': {
    label: 'Essential Oils',
    patterns: [
      /\blavender oil\b/i,
      /\blavandula angustifolia\b/i,
      /\btea tree oil\b/i,
      /\bmelaleuca alternifolia\b/i,
      /\beucalyptus oil\b/i,
      /\brose flower oil\b/i,
      /\brosemary leaf oil\b/i,
      /\bcitrus aurantium\b/i,
      /\bbergamot\b/i,
    ],
  },
  silicones: {
    label: 'Silicones',
    patterns: [
      /\bdimethicone\b/i,
      /\bcyclopentasiloxane\b/i,
      /\bcyclomethicone\b/i,
      /\bamodimethicone\b/i,
    ],
  },
};

const ACTIVES_DICTIONARY: { id: string; name: string; tagline: string; patterns: RegExp[] }[] = [
  {
    id: 'niacinamide',
    name: 'Niacinamide (Vitamin B3)',
    tagline: 'Pore & sebum balancer',
    patterns: [/\bniacinamide\b/i, /\bnicotinamide\b/i, /\bvitamin b3\b/i],
  },
  {
    id: 'ceramides',
    name: 'Ceramides NP / AP / EOP',
    tagline: 'Essential skin barrier mortar',
    patterns: [/\bceramide\b/i, /\bceramides\b/i, /\bphytosphingosine\b/i],
  },
  {
    id: 'hyaluronic',
    name: 'Hyaluronic Acid',
    tagline: 'Deep cellular moisture magnet',
    patterns: [/\bhyaluronic acid\b/i, /\bsodium hyaluronate\b/i, /\bhydrolyzed hyaluronic acid\b/i],
  },
  {
    id: 'salicylic',
    name: 'Salicylic Acid (BHA)',
    tagline: 'Lipid-soluble deep pore unclogger',
    patterns: [/\bsalicylic acid\b/i, /\bbetaine salicylate\b/i],
  },
  {
    id: 'centella',
    name: 'Centella Asiatica (Cica)',
    tagline: 'Botanical redness & capillary calmer',
    patterns: [/\bcentella asiatica\b/i, /\bmadecassoside\b/i, /\basiaticoside\b/i, /\bcica\b/i],
  },
  {
    id: 'vitaminc',
    name: 'Vitamin C (Ascorbic Acid)',
    tagline: 'Luminosity & daytime antioxidant',
    patterns: [
      /\bascorbic acid\b/i,
      /\bethyl ascorbic acid\b/i,
      /\bsodium ascorbyl phosphate\b/i,
      /\bascorbyl glucoside\b/i,
    ],
  },
  {
    id: 'azelaic',
    name: 'Azelaic Acid',
    tagline: 'Tone clarity & redness defense',
    patterns: [/\bazelaic acid\b/i, /\bpotassium azeloyl diglycinate\b/i],
  },
  {
    id: 'squalane',
    name: 'Plant Squalane',
    tagline: 'Weightless bio-mimetic lipid seal',
    patterns: [/\bsqualane\b/i, /\bsqualene\b/i],
  },
];

/**
 * Checks ingredients text against user avoid preferences.
 */
export function checkAvoidIngredients(
  ingredientsText: string,
  userAvoidList: string[] = []
): {
  passed: boolean;
  matches: AvoidMatch[];
  warningCount: number;
} {
  if (!ingredientsText || !userAvoidList || userAvoidList.length === 0) {
    return { passed: true, matches: [], warningCount: 0 };
  }

  const matches: AvoidMatch[] = [];

  for (const avoidKey of userAvoidList) {
    const normKey = avoidKey.toLowerCase().trim().replace(/\s+/g, '-');
    const entry = AVOID_DICTIONARY[normKey];

    if (entry) {
      for (const pattern of entry.patterns) {
        const found = ingredientsText.match(pattern);
        if (found) {
          matches.push({
            ruleId: normKey,
            ruleLabel: entry.label,
            matchedIngredient: found[0],
          });
          break; // One match per category is enough
        }
      }
    } else {
      // Direct substring match for custom ingredient string
      const escaped = avoidKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const customRegex = new RegExp(`\\b${escaped}\\b`, 'i');
      const found = ingredientsText.match(customRegex);
      if (found) {
        matches.push({
          ruleId: normKey,
          ruleLabel: avoidKey,
          matchedIngredient: found[0],
        });
      }
    }
  }

  return {
    passed: matches.length === 0,
    matches,
    warningCount: matches.length,
  };
}

/**
 * Detects beneficial active ingredients in an ingredients list.
 */
export function detectActives(ingredientsText: string): DetectedActive[] {
  if (!ingredientsText) return [];

  const detected: DetectedActive[] = [];

  for (const active of ACTIVES_DICTIONARY) {
    for (const pattern of active.patterns) {
      const match = ingredientsText.match(pattern);
      if (match) {
        detected.push({
          id: active.id,
          name: active.name,
          matchedTerm: match[0],
          tagline: active.tagline,
        });
        break;
      }
    }
  }

  return detected;
}
