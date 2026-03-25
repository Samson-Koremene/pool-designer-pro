import { usePoolStore, POOL_PRESETS, type PoolShape, type InteriorMaterial, type DeckMaterial, type WaterColor, type AddOn } from '@/store/usePoolStore';
import { Square, Circle, Heart, LayoutDashboard, TreePine, Armchair, Umbrella, Lightbulb, Crown, Users, Palmtree, Check } from 'lucide-react';

const SHAPES: { id: PoolShape; label: string; icon: typeof Square }[] = [
  { id: 'rectangle', label: 'Rectangle', icon: Square },
  { id: 'oval', label: 'Oval', icon: Circle },
  { id: 'kidney', label: 'Kidney', icon: Heart },
  { id: 'l-shape', label: 'L-Shape', icon: LayoutDashboard },
];

const INTERIOR_MATERIALS: { id: InteriorMaterial; label: string; swatch: string }[] = [
  { id: 'tile', label: 'Tile', swatch: '#7ec8e3' },
  { id: 'concrete', label: 'Concrete', swatch: '#a8a29e' },
  { id: 'fiberglass', label: 'Fiberglass', swatch: '#bae6fd' },
];

const DECK_MATERIALS: { id: DeckMaterial; label: string; swatch: string }[] = [
  { id: 'wood', label: 'Wood', swatch: '#92400e' },
  { id: 'stone', label: 'Stone', swatch: '#a8a29e' },
  { id: 'marble', label: 'Marble', swatch: '#e7e5e4' },
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
    <h3 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-2.5 mt-1">
      {children}
    </h3>
  );
}

function SectionDivider() {
  return <div className="border-t border-border" />;
}

export function ControlsSidebar() {
  const store = usePoolStore();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-full overflow-y-auto scrollbar-thin">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <span className="font-semibold text-sm">Pool Builder</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Presets */}
        <div className="p-4">
          <SectionLabel>Templates</SectionLabel>
          <div className="grid grid-cols-3 gap-1.5">
            {POOL_PRESETS.map((preset) => {
              const Icon = preset.name === 'Luxury' ? Crown : preset.name === 'Family' ? Users : Palmtree;
              return (
                <button
                  key={preset.name}
                  onClick={() => store.applyPreset(preset)}
                  className="flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-md text-[10px] font-medium text-muted-foreground bg-secondary hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        <SectionDivider />

        {/* Shape */}
        <div className="p-4">
          <SectionLabel>Shape</SectionLabel>
          <div className="grid grid-cols-2 gap-1.5">
            {SHAPES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => store.setShape(id)}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                  store.shape === id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <SectionDivider />

        {/* Dimensions */}
        <div className="p-4">
          <SectionLabel>Dimensions (ft)</SectionLabel>
          <div className="space-y-4">
            {[
              { label: 'Length', value: store.length, set: store.setLength, min: 10, max: 40 },
              { label: 'Width', value: store.width, set: store.setWidth, min: 5, max: 25 },
              { label: 'Depth', value: store.depth, set: store.setDepth, min: 3, max: 12 },
            ].map(({ label, value, set, min, max }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono font-semibold text-foreground tabular-nums">{value}</span>
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

        <SectionDivider />

        {/* Interior Material */}
        <div className="p-4">
          <SectionLabel>Interior</SectionLabel>
          <div className="grid grid-cols-3 gap-1.5">
            {INTERIOR_MATERIALS.map(({ id, label, swatch }) => (
              <button
                key={id}
                onClick={() => store.setInteriorMaterial(id)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-md text-[10px] font-medium transition-colors ${
                  store.interiorMaterial === id
                    ? 'ring-2 ring-primary ring-inset bg-secondary text-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <div className="w-6 h-6 rounded" style={{ backgroundColor: swatch }} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <SectionDivider />

        {/* Deck Material */}
        <div className="p-4">
          <SectionLabel>Deck</SectionLabel>
          <div className="grid grid-cols-3 gap-1.5">
            {DECK_MATERIALS.map(({ id, label, swatch }) => (
              <button
                key={id}
                onClick={() => store.setDeckMaterial(id)}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-md text-[10px] font-medium transition-colors ${
                  store.deckMaterial === id
                    ? 'ring-2 ring-primary ring-inset bg-secondary text-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <div className="w-6 h-6 rounded" style={{ backgroundColor: swatch }} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <SectionDivider />

        {/* Water Color */}
        <div className="p-4">
          <SectionLabel>Water Color</SectionLabel>
          <div className="flex gap-2.5">
            {WATER_COLORS.map(({ id, label, hex }) => (
              <button
                key={id}
                onClick={() => store.setWaterColor(id)}
                title={label}
                className={`relative w-8 h-8 rounded-md transition-all ${
                  store.waterColor === id
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-card'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: hex }}
              >
                {store.waterColor === id && (
                  <Check className="absolute inset-0 m-auto h-3 w-3 text-foreground drop-shadow" />
                )}
              </button>
            ))}
          </div>
        </div>

        <SectionDivider />

        {/* Add-Ons */}
        <div className="p-4">
          <SectionLabel>Add-Ons</SectionLabel>
          <div className="space-y-1.5">
            {ADD_ONS.map(({ id, label, icon: Icon, price }) => {
              const active = store.addOns.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => store.toggleAddOn(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  <span className={`font-mono text-[10px] ${active ? 'text-primary-foreground/70' : 'opacity-50'}`}>
                    +${price}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
