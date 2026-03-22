import { create } from 'zustand';

export type PoolShape = 'rectangle' | 'oval' | 'kidney' | 'l-shape';
export type InteriorMaterial = 'tile' | 'concrete' | 'fiberglass';
export type DeckMaterial = 'wood' | 'stone' | 'marble';
export type WaterColor = 'light-blue' | 'deep-blue' | 'turquoise' | 'emerald';
export type AddOn = 'trees' | 'chairs' | 'umbrella' | 'lights';

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
}

const PRICING = {
  basePricePerSqFt: 85,
  materials: { tile: 1.4, concrete: 1.0, fiberglass: 1.2 },
  deck: { wood: 1.1, stone: 1.3, marble: 1.6 },
  depthMultiplier: (d: number) => 0.8 + d * 0.1,
  addOns: { trees: 450, chairs: 280, umbrella: 180, lights: 650 },
};

export function calculatePrice(state: PoolState): number {
  const area = state.length * state.width;
  let price = area * PRICING.basePricePerSqFt;
  price *= PRICING.materials[state.interiorMaterial];
  price *= PRICING.deck[state.deckMaterial];
  price *= PRICING.depthMultiplier(state.depth);
  state.addOns.forEach((a) => (price += PRICING.addOns[a]));
  return Math.round(price);
}

export const usePoolStore = create<PoolState>((set) => ({
  shape: 'rectangle',
  length: 20,
  width: 10,
  depth: 5,
  interiorMaterial: 'tile',
  deckMaterial: 'stone',
  waterColor: 'turquoise',
  addOns: [],
  projectName: 'My Dream Pool',
  dayMode: true,

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
}));
