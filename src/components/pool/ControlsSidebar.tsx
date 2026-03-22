import { usePoolStore, POOL_PRESETS, type PoolShape, type InteriorMaterial, type DeckMaterial, type WaterColor, type AddOn } from '@/store/usePoolStore';
import { Waves, Square, Circle, Heart, LayoutDashboard, TreePine, Armchair, Umbrella, Lightbulb, Crown, Users, Palmtree } from 'lucide-react';

const SHAPES: { id: PoolShape; label: string; icon: typeof Square }[] = [
  { id: 'rectangle', label: 'Rectangle', icon: Square },
  { id: 'oval', label: 'Oval', icon: Circle },
  { id: 'kidney', label: 'Kidney', icon: Heart },
  { id: 'l-shape', label: 'L-Shape', icon: LayoutDashboard },
];

const INTERIOR_MATERIALS: { id: InteriorMaterial; label: string; color: string }[] = [
  { id: 'tile', label: 'Tile', color: 'bg-blue-200' },
  { id: 'concrete', label: 'Concrete', color: 'bg-stone-300' },
  { id: 'fiberglass', label: 'Fiberglass', color: 'bg-sky-100' },
];

const DECK_MATERIALS: { id: DeckMaterial; label: string; color: string }[] = [
  { id: 'wood', label: 'Wood', color: 'bg-amber-700' },
  { id: 'stone', label: 'Stone', color: 'bg-stone-400' },
  { id: 'marble', label: 'Marble', color: 'bg-stone-100' },
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
  return <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">{children}</h3>;
}

export function ControlsSidebar() {
  const store = usePoolStore();

  return (
    <aside className="w-72 surface-elevated border-r border-border flex flex-col h-full overflow-y-auto scrollbar-thin">
      <div className="p-5 border-b border-border flex items-center gap-2">
        <Waves className="h-5 w-5 text-pool-accent" />
        <span className="font-semibold text-sm">Pool Builder</span>
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
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg text-[10px] font-medium bg-muted/50 hover:bg-primary/15 hover:text-pool-accent border border-transparent hover:border-pool transition-all duration-150 active:scale-[0.97]"
                >
                  <Icon className="h-4 w-4" />
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
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-[0.97] ${
                  store.shape === id
                    ? 'bg-primary/15 text-pool-accent border border-pool'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent'
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
          <div className="space-y-3">
            {[
              { label: 'Length', value: store.length, set: store.setLength, min: 10, max: 40 },
              { label: 'Width', value: store.width, set: store.setWidth, min: 5, max: 25 },
              { label: 'Depth', value: store.depth, set: store.setDepth, min: 3, max: 12 },
            ].map(({ label, value, set, min, max }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono font-medium">{value}</span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={value}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
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
                className={`flex-1 flex flex-col items-center gap-1.5 p-2.5 rounded-lg text-[10px] font-medium transition-all duration-150 active:scale-[0.97] ${
                  store.interiorMaterial === id
                    ? 'border border-pool bg-primary/10'
                    : 'border border-transparent bg-muted/50 hover:bg-muted'
                }`}
              >
                <div className={`w-6 h-6 rounded-md ${color}`} />
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
                className={`flex-1 flex flex-col items-center gap-1.5 p-2.5 rounded-lg text-[10px] font-medium transition-all duration-150 active:scale-[0.97] ${
                  store.deckMaterial === id
                    ? 'border border-pool bg-primary/10'
                    : 'border border-transparent bg-muted/50 hover:bg-muted'
                }`}
              >
                <div className={`w-6 h-6 rounded-md ${color}`} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Water Color */}
        <div>
          <SectionLabel>Water Color</SectionLabel>
          <div className="flex gap-2">
            {WATER_COLORS.map(({ id, label, hex }) => (
              <button
                key={id}
                onClick={() => store.setWaterColor(id)}
                title={label}
                className={`w-8 h-8 rounded-full transition-all duration-150 active:scale-[0.95] ${
                  store.waterColor === id ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>

        {/* Add-Ons */}
        <div>
          <SectionLabel>Add-Ons</SectionLabel>
          <div className="space-y-1.5">
            {ADD_ONS.map(({ id, label, icon: Icon, price }) => (
              <button
                key={id}
                onClick={() => store.toggleAddOn(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 active:scale-[0.97] ${
                  store.addOns.includes(id)
                    ? 'bg-primary/15 text-pool-accent border border-pool'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="flex-1 text-left">{label}</span>
                <span className="font-mono text-[10px] opacity-70">+${price}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
