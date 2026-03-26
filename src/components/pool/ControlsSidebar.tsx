import { memo } from 'react';
import {
  usePoolStore, POOL_PRESETS,
  type PoolShape, type InteriorMaterial, type DeckMaterial, type WaterColor, type AddOn,
} from '@/store/usePoolStore';
import { Square, Circle, Heart, LayoutDashboard, TreePine, Armchair, Umbrella, Lightbulb, Plus, Minus, Waves, Fence, Flame, Flower2, PanelTop, Zap, Droplets, Wine } from 'lucide-react';

const SHAPES: { id: PoolShape; label: string; icon: typeof Square }[] = [
  { id: 'rectangle', label: 'Rectangle', icon: Square },
  { id: 'oval', label: 'Oval', icon: Circle },
  { id: 'kidney', label: 'Kidney', icon: Heart },
  { id: 'l-shape', label: 'L-Shape', icon: LayoutDashboard },
];

const INTERIOR_MATERIALS: { id: InteriorMaterial; label: string }[] = [
  { id: 'tile', label: 'Tile' },
  { id: 'concrete', label: 'Concrete' },
  { id: 'fiberglass', label: 'Fiberglass' },
];

const DECK_MATERIALS: { id: DeckMaterial; label: string }[] = [
  { id: 'wood', label: 'Wood' },
  { id: 'stone', label: 'Stone' },
  { id: 'marble', label: 'Marble' },
];

const WATER_COLORS: { id: WaterColor; label: string; hex: string }[] = [
  { id: 'light-blue', label: 'Light Blue', hex: '#7ec8e3' },
  { id: 'deep-blue', label: 'Deep Blue', hex: '#2e6b9e' },
  { id: 'turquoise', label: 'Turquoise', hex: '#40c9c0' },
  { id: 'emerald', label: 'Emerald', hex: '#2d8a6e' },
];

const ADD_ONS: { id: AddOn; label: string; icon: typeof TreePine }[] = [
  { id: 'trees',       label: 'Trees',        icon: TreePine   },
  { id: 'chairs',      label: 'Chairs',       icon: Armchair   },
  { id: 'umbrella',    label: 'Umbrellas',    icon: Umbrella   },
  { id: 'lights',      label: 'Lighting',     icon: Lightbulb  },
  { id: 'waterfall',   label: 'Waterfall',    icon: Waves      },
  { id: 'fence',       label: 'Fence',        icon: Fence      },
  { id: 'bbq',         label: 'BBQ Grill',    icon: Flame      },
  { id: 'flowers',     label: 'Flowers',      icon: Flower2    },
  { id: 'pergola',     label: 'Pergola',      icon: PanelTop   },
  { id: 'slide',       label: 'Slide',        icon: Zap        },
  { id: 'divingboard', label: 'Diving Board', icon: Droplets   },
  { id: 'fountain',    label: 'Fountain',     icon: Droplets   },
  { id: 'firepit',     label: 'Fire Pit',     icon: Flame      },
  { id: 'bar',         label: 'Outdoor Bar',  icon: Wine       },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[13px] font-bold text-slate-800 tracking-wide mb-4">{children}</h3>
  );
}

function SectionDivider({ className = 'my-5' }: { className?: string }) {
  return <div className={`border-t border-slate-300/40 w-full ${className}`} />;
}

const glassCard =
  'bg-white/40 backdrop-blur-3xl border-[1.5px] border-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-[2rem] p-5 w-full transition-all duration-300 relative overflow-hidden';

export const ControlsSidebar = memo(function ControlsSidebar() {
  const shape = usePoolStore((s) => s.shape);
  const length = usePoolStore((s) => s.length);
  const width = usePoolStore((s) => s.width);
  const depth = usePoolStore((s) => s.depth);
  const interiorMaterial = usePoolStore((s) => s.interiorMaterial);
  const deckMaterial = usePoolStore((s) => s.deckMaterial);
  const waterColor = usePoolStore((s) => s.waterColor);
  const addOns = usePoolStore((s) => s.addOns);
  const hasSpa = usePoolStore((s) => s.hasSpa);
  const hasSteps = usePoolStore((s) => s.hasSteps);

  const setShape = usePoolStore((s) => s.setShape);
  const setLength = usePoolStore((s) => s.setLength);
  const setWidth = usePoolStore((s) => s.setWidth);
  const setDepth = usePoolStore((s) => s.setDepth);
  const setInteriorMaterial = usePoolStore((s) => s.setInteriorMaterial);
  const setDeckMaterial = usePoolStore((s) => s.setDeckMaterial);
  const setWaterColor = usePoolStore((s) => s.setWaterColor);
  const toggleAddOn = usePoolStore((s) => s.toggleAddOn);
  const setHasSpa = usePoolStore((s) => s.setHasSpa);
  const setHasSteps = usePoolStore((s) => s.setHasSteps);
  const applyPreset = usePoolStore((s) => s.applyPreset);

  const dimensions = [
    { label: 'Length', value: length, set: setLength, min: 10, max: 40, step: 1, unit: 'm' },
    { label: 'Width', value: width, set: setWidth, min: 5, max: 25, step: 1, unit: 'm' },
    { label: 'Depth', value: depth, set: setDepth, min: 3, max: 12, step: 0.5, unit: 'm' },
  ];

  return (
    <aside className="w-full h-full flex flex-col gap-4 overflow-y-auto scrollbar-none pb-8 pointer-events-auto">

      {/* Presets */}
      <div className={glassCard}>
        <SectionLabel>Quick Presets</SectionLabel>
        <div className="flex gap-2">
          {POOL_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              aria-label={`Apply ${preset.name} preset`}
              className="flex-1 py-2 rounded-xl text-[11px] font-bold border border-white/60 bg-white/40 text-slate-600 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all shadow-sm"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Shape & Dimensions */}
      <div className={glassCard}>
        <SectionLabel>Shape</SectionLabel>
        <div className="flex gap-2 mb-2 bg-white/40 p-1.5 rounded-2xl border border-white/60 shadow-sm">
          {SHAPES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setShape(id)}
              aria-label={`${label} pool shape`}
              aria-pressed={shape === id}
              className={`flex-1 flex justify-center items-center py-2 rounded-xl text-[11px] font-bold transition-all duration-300 ${
                shape === id ? 'bg-blue-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="h-3.5 w-3.5 sm:hidden" aria-hidden />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <SectionDivider />

        <SectionLabel>Dimensions</SectionLabel>
        <div className="space-y-4">
          {dimensions.map(({ label, value, set, min, max, step, unit }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-[12px] font-semibold text-slate-600 w-24">{label}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => set(Math.max(min, value - step))}
                  aria-label={`Decrease ${label}`}
                  className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <Minus className="h-3 w-3" aria-hidden />
                </button>
                <div className="w-12 text-center text-[12px] font-bold text-slate-800">
                  {value}{unit}
                </div>
                <button
                  onClick={() => set(Math.min(max, value + step))}
                  aria-label={`Increase ${label}`}
                  className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <Plus className="h-3 w-3" aria-hidden />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div className={glassCard}>
        <SectionLabel>Materials</SectionLabel>

        <div className="flex items-center justify-between mb-4">
          <span className="text-[12px] font-semibold text-slate-600">Interior</span>
          <div className="flex gap-1.5 p-1 rounded-full bg-white/40 border border-white/60 shadow-inner">
            {INTERIOR_MATERIALS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setInteriorMaterial(id)}
                aria-label={`${label} interior`}
                aria-pressed={interiorMaterial === id}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                  interiorMaterial === id ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-[12px] font-semibold text-slate-600">Finishing</span>
          <div className="flex gap-1.5 p-1 rounded-full bg-white/40 border border-white/60 shadow-inner">
            {DECK_MATERIALS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setDeckMaterial(id)}
                aria-label={`${label} deck`}
                aria-pressed={deckMaterial === id}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                  deckMaterial === id ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-slate-600">Water Tone</span>
          <div className="flex gap-2">
            {WATER_COLORS.map(({ id, label, hex }) => (
              <button
                key={id}
                onClick={() => setWaterColor(id)}
                aria-label={label}
                aria-pressed={waterColor === id}
                className={`w-5 h-5 rounded-full border border-white shadow-sm transition-transform ${
                  waterColor === id ? 'scale-125 ring-2 ring-blue-500 ring-offset-1 ring-offset-transparent' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features & Add-Ons */}
      <div className={glassCard}>
        <SectionLabel>Structural Features</SectionLabel>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setHasSpa(!hasSpa)}
            aria-pressed={hasSpa}
            className={`flex-1 py-2 rounded-xl text-[11px] font-bold border border-white/60 shadow-sm transition-all ${
              hasSpa ? 'bg-blue-500 text-white' : 'bg-white/40 text-slate-500 hover:text-slate-800 hover:bg-white/60'
            }`}
          >
            Hot Tub Spa
          </button>
          <button
            onClick={() => setHasSteps(!hasSteps)}
            aria-pressed={hasSteps}
            className={`flex-1 py-2 rounded-xl text-[11px] font-bold border border-white/60 shadow-sm transition-all ${
              hasSteps ? 'bg-blue-500 text-white' : 'bg-white/40 text-slate-500 hover:text-slate-800 hover:bg-white/60'
            }`}
          >
            Walk-in Steps
          </button>
        </div>

        <SectionDivider className="my-4" />

        <SectionLabel>Environment Add-Ons</SectionLabel>
        <div className="overflow-y-auto max-h-48 scrollbar-none rounded-2xl bg-white/30 border border-white/50 p-2 shadow-inner">
          <div className="grid grid-cols-4 gap-2">
            {ADD_ONS.map(({ id, label, icon: Icon }) => {
            const active = addOns.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggleAddOn(id)}
                aria-label={`${active ? 'Remove' : 'Add'} ${label}`}
                aria-pressed={active}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${
                  active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-blue-500' : ''}`} aria-hidden />
                <span className="text-[9px] font-bold text-center leading-tight">{label}</span>
              </button>
            );
          })}
          </div>
        </div>

    </aside>
  );
});
