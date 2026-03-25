import { usePoolStore, POOL_PRESETS, type PoolShape, type InteriorMaterial, type DeckMaterial, type WaterColor, type AddOn } from '@/store/usePoolStore';
import { Waves, Square, Circle, Heart, LayoutDashboard, TreePine, Armchair, Umbrella, Lightbulb, Crown, Users, Palmtree, Check } from 'lucide-react';

const SHAPES: { id: PoolShape; label: string; icon: typeof Square }[] = [
  { id: 'rectangle', label: 'Rectangle', icon: Square },
  { id: 'oval', label: 'Oval', icon: Circle },
  { id: 'kidney', label: 'Kidney', icon: Heart },
  { id: 'l-shape', label: 'L-Shape', icon: LayoutDashboard },
];

const INTERIOR_MATERIALS: { id: InteriorMaterial; label: string; color: string }[] = [
  { id: 'tile', label: 'Tile', color: '#7ec8e3' },
  { id: 'concrete', label: 'Concrete', color: '#a8a29e' },
  { id: 'fiberglass', label: 'Fiberglass', color: '#bae6fd' },
];

const DECK_MATERIALS: { id: DeckMaterial; label: string; color: string }[] = [
  { id: 'wood', label: 'Wood', color: '#92400e' },
  { id: 'stone', label: 'Stone', color: '#a8a29e' },
  { id: 'marble', label: 'Marble', color: '#e7e5e4' },
];

const WATER_COLORS: { id: WaterColor; label: string; hex: string }[] = [
  { id: 'light-blue', label: 'Light Blue', hex: '#7ec8e3' },
  { id: 'deep-blue', label: 'Deep Blue', hex: '#2e6b9e' },
  { id: 'turquoise', label: 'Turquoise', hex: '#40c9c0' },
  { id: 'emerald', label: 'Emerald', hex: '#2d8a6e' },
];

const ADD_ONS: { id: AddOn; label: string; icon: typeof TreePine; price: number }[] = [
  { id: 'trees', label: 'Trees', icon: TreePine, price: 450 },
  { id: 'chairs', label: 'Lounge Chairs', icon: Armchair, price: 280 },
  { id: 'umbrella', label: 'Umbrellas', icon: Umbrella, price: 180 },
  { id: 'lights', label: 'Lighting', icon: Lightbulb, price: 650 },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3 flex items-center gap-2">
      <span className="w-5 h-px bg-border" />
      {children}
    </h3>
  );
}

export function ControlsSidebar() {
  const store = usePoolStore();

  return (
    <aside className="w-[280px] surface-glass border-r border-border/60 flex flex-col h-full overflow-y-auto scrollbar-thin">
      <div className="p-5 border-b border-border/60 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
          <Waves className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <div>
          <span className="font-semibold text-sm tracking-tight">Pool Builder</span>
          <span className="text-[10px] text-muted-foreground block -mt-0.5">Configure your design</span>
        </div>
      </div>

      <div className="p-4 space-y-6 flex-1">
        {/* Presets */}
        <div>
          <SectionLabel>Templates</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            {POOL_PRESETS.map((preset) => {
              const Icon = preset.name === 'Luxury' ? Crown : preset.name === 'Family' ? Users : Palmtree;
              return (
                <button
                  key={preset.name}
                  onClick={() => store.applyPreset(preset)}
                  className="group flex flex-col items-center gap-2 p-3 rounded-xl text-[10px] font-semibold bg-card hover:bg-primary/10 hover:text-pool-accent border border-border/40 hover:border-pool transition-all duration-200 active:scale-[0.96]"
                >
                  <Icon className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Shape */}
        <div>
          <SectionLabel>Shape</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {SHAPES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => store.setShape(id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 active:scale-[0.96] ${
                  store.shape === id
                    ? 'gradient-primary text-primary-foreground shadow-glow'
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border/40 hover:border-border'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <SectionLabel>Dimensions (ft)</SectionLabel>
          <div className="space-y-4">
            {[
              { label: 'Length', value: store.length, set: store.setLength, min: 10, max: 40 },
              { label: 'Width', value: store.width, set: store.setWidth, min: 5, max: 25 },
              { label: 'Depth', value: store.depth, set: store.setDepth, min: 3, max: 12 },
            ].map(({ label, value, set, min, max }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground font-medium">{label}</span>
                  <span className="font-mono font-semibold text-pool-accent tabular-nums">{value}</span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={value}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Interior Material */}
        <div>
          <SectionLabel>Interior Material</SectionLabel>
          <div className="flex gap-2">
            {INTERIOR_MATERIALS.map(({ id, label, color }) => (
              <button
                key={id}
                onClick={() => store.setInteriorMaterial(id)}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl text-[10px] font-semibold transition-all duration-200 active:scale-[0.96] ${
                  store.interiorMaterial === id
                    ? 'border-2 border-pool bg-primary/10 shadow-glow'
                    : 'border border-border/40 bg-card hover:border-border'
                }`}
              >
                <div className="w-7 h-7 rounded-lg shadow-inner" style={{ backgroundColor: color }} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Deck Material */}
        <div>
          <SectionLabel>Deck Material</SectionLabel>
          <div className="flex gap-2">
            {DECK_MATERIALS.map(({ id, label, color }) => (
              <button
                key={id}
                onClick={() => store.setDeckMaterial(id)}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl text-[10px] font-semibold transition-all duration-200 active:scale-[0.96] ${
                  store.deckMaterial === id
                    ? 'border-2 border-pool bg-primary/10 shadow-glow'
                    : 'border border-border/40 bg-card hover:border-border'
                }`}
              >
                <div className="w-7 h-7 rounded-lg shadow-inner" style={{ backgroundColor: color }} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Water Color */}
        <div>
          <SectionLabel>Water Color</SectionLabel>
          <div className="flex gap-3">
            {WATER_COLORS.map(({ id, label, hex }) => (
              <button
                key={id}
                onClick={() => store.setWaterColor(id)}
                title={label}
                className={`relative w-9 h-9 rounded-xl transition-all duration-200 active:scale-95 ${
                  store.waterColor === id
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-card scale-110'
                    : 'hover:scale-110 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: hex }}
              >
                {store.waterColor === id && (
                  <Check className="absolute inset-0 m-auto h-3.5 w-3.5 text-white drop-shadow-md" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Add-Ons */}
        <div>
          <SectionLabel>Add-Ons</SectionLabel>
          <div className="space-y-2">
            {ADD_ONS.map(({ id, label, icon: Icon, price }) => {
              const active = store.addOns.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => store.toggleAddOn(id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-all duration-200 active:scale-[0.97] ${
                    active
                      ? 'gradient-primary text-primary-foreground shadow-glow'
                      : 'bg-card text-muted-foreground hover:text-foreground border border-border/40 hover:border-border'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{label}</span>
                  <span className={`font-mono text-[10px] ${active ? 'text-primary-foreground/70' : 'opacity-50'}`}>+${price}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
