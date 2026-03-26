import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PoolShape = 'rectangle' | 'oval' | 'kidney' | 'l-shape';
export type InteriorMaterial = 'tile' | 'concrete' | 'fiberglass';
export type DeckMaterial = 'wood' | 'stone' | 'marble';
export type WaterColor = 'light-blue' | 'deep-blue' | 'turquoise' | 'emerald';
export type AddOn = 'trees' | 'chairs' | 'umbrella' | 'lights' | 'waterfall' | 'fence' | 'bbq' | 'flowers' | 'pergola' | 'slide' | 'divingboard' | 'fountain' | 'firepit' | 'bar';

interface PoolState {
  shape: PoolShape;
  length: number;
  width: number;
  depth: number;
  interiorMaterial: InteriorMaterial;
  deckMaterial: DeckMaterial;
  waterColor: WaterColor;
  addOns: AddOn[];
  projectName: string;
  dayMode: boolean;
  hasSpa: boolean;
  hasSteps: boolean;
  isEditMode: boolean;
  spaAngle: number;

  setShape: (s: PoolShape) => void;
  setLength: (v: number) => void;
  setWidth: (v: number) => void;
  setDepth: (v: number) => void;
  setInteriorMaterial: (m: InteriorMaterial) => void;
  setDeckMaterial: (m: DeckMaterial) => void;
  setWaterColor: (c: WaterColor) => void;
  toggleAddOn: (a: AddOn) => void;
  setProjectName: (n: string) => void;
  toggleDayMode: () => void;
  applyPreset: (preset: PoolPreset) => void;
  setHasSpa: (v: boolean) => void;
  setHasSteps: (v: boolean) => void;
  setIsEditMode: (v: boolean) => void;
  setSpaAngle: (v: number) => void;
  resetToDefaults: () => void;
}

export interface PoolPreset {
  name: string;
  shape: PoolShape;
  length: number;
  width: number;
  depth: number;
  interiorMaterial: InteriorMaterial;
  deckMaterial: DeckMaterial;
  waterColor: WaterColor;
  addOns: AddOn[];
}

export const POOL_PRESETS: PoolPreset[] = [
  {
    name: 'Luxury',
    shape: 'kidney',
    length: 35,
    width: 18,
    depth: 8,
    interiorMaterial: 'tile',
    deckMaterial: 'marble',
    waterColor: 'deep-blue',
    addOns: ['trees', 'chairs', 'umbrella', 'lights'],
  },
  {
    name: 'Family',
    shape: 'rectangle',
    length: 22,
    width: 12,
    depth: 5,
    interiorMaterial: 'fiberglass',
    deckMaterial: 'wood',
    waterColor: 'light-blue',
    addOns: ['chairs', 'umbrella'],
  },
  {
    name: 'Resort',
    shape: 'l-shape',
    length: 30,
    width: 20,
    depth: 7,
    interiorMaterial: 'tile',
    deckMaterial: 'stone',
    waterColor: 'turquoise',
    addOns: ['trees', 'chairs', 'lights'],
  },
];

export const PRICING = {
  basePricePerSqFt: 85,
  materials: { tile: 1.4, concrete: 1.0, fiberglass: 1.2 },
  deck: { wood: 1.1, stone: 1.3, marble: 1.6 },
  depthMultiplier: (d: number) => 0.8 + d * 0.1,
  addOns: { trees: 450, chairs: 280, umbrella: 180, lights: 650, waterfall: 3200, fence: 1800, bbq: 950, flowers: 320, pergola: 4500, slide: 2800, divingboard: 1500, fountain: 2200, firepit: 1100, bar: 3800 },
  spa: 8500,
  steps: 1200,
} as const;

export function calculatePrice(state: Pick<PoolState, 'length' | 'width' | 'depth' | 'interiorMaterial' | 'deckMaterial' | 'addOns' | 'hasSpa' | 'hasSteps'>): number {
  const area = state.length * state.width;
  let price = area * PRICING.basePricePerSqFt;
  price *= PRICING.materials[state.interiorMaterial];
  price *= PRICING.deck[state.deckMaterial];
  price *= PRICING.depthMultiplier(state.depth);
  state.addOns.forEach((a) => (price += PRICING.addOns[a]));
  if (state.hasSpa) price += PRICING.spa;
  if (state.hasSteps) price += PRICING.steps;
  return Math.round(price);
}

const DEFAULT_STATE = {
  shape: 'rectangle' as PoolShape,
  length: 20,
  width: 10,
  depth: 5,
  interiorMaterial: 'tile' as InteriorMaterial,
  deckMaterial: 'stone' as DeckMaterial,
  waterColor: 'turquoise' as WaterColor,
  addOns: [] as AddOn[],
  projectName: 'My Dream Pool',
  dayMode: true,
  hasSpa: false,
  hasSteps: false,
  isEditMode: true,
  spaAngle: 0,
};

export const usePoolStore = create<PoolState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      setShape: (shape) => set({ shape }),
      setLength: (length) => set({ length }),
      setWidth: (width) => set({ width }),
      setDepth: (depth) => set({ depth }),
      setInteriorMaterial: (interiorMaterial) => set({ interiorMaterial }),
      setDeckMaterial: (deckMaterial) => set({ deckMaterial }),
      setWaterColor: (waterColor) => set({ waterColor }),
      toggleAddOn: (a) =>
        set((s) => ({
          addOns: s.addOns.includes(a) ? s.addOns.filter((x) => x !== a) : [...s.addOns, a],
        })),
      setProjectName: (projectName) => set({ projectName }),
      toggleDayMode: () => set((s) => ({ dayMode: !s.dayMode })),
      applyPreset: (preset) =>
        set({
          shape: preset.shape,
          length: preset.length,
          width: preset.width,
          depth: preset.depth,
          interiorMaterial: preset.interiorMaterial,
          deckMaterial: preset.deckMaterial,
          waterColor: preset.waterColor,
          addOns: [...preset.addOns],
          projectName: `${preset.name} Pool`,
        }),
      setHasSpa: (hasSpa) => set({ hasSpa }),
      setHasSteps: (hasSteps) => set({ hasSteps }),
      setIsEditMode: (isEditMode) => set({ isEditMode }),
      setSpaAngle: (spaAngle) => set({ spaAngle }),
      resetToDefaults: () => set({ ...DEFAULT_STATE }),
    }),
    {
      name: 'pool-designer-storage',
      // Always start in edit mode regardless of persisted state
      partialize: (state) => ({ ...state, isEditMode: true }),
    }
  )
);
