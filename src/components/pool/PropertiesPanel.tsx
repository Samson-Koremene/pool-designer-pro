import { usePoolStore, calculatePrice } from '@/store/usePoolStore';
import { Ruler, Layers, DollarSign, Sun, Moon } from 'lucide-react';

export function PropertiesPanel() {
  const store = usePoolStore();
  const price = calculatePrice(store);

  return (
    <aside className="w-64 surface-elevated border-l border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Properties</h3>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Dimensions summary */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Ruler className="h-3.5 w-3.5" />
            <span className="font-medium">Dimensions</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'L', value: store.length },
              { label: 'W', value: store.width },
              { label: 'D', value: store.depth },
            ].map(({ label, value }) => (
              <div key={label} className="bg-muted/50 rounded-lg p-2 text-center">
                <div className="text-[10px] text-muted-foreground">{label}</div>
                <div className="text-sm font-mono font-semibold">{value}<span className="text-[10px] text-muted-foreground">ft</span></div>
              </div>
            ))}
          </div>
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <div className="text-[10px] text-muted-foreground">Area</div>
            <div className="text-sm font-mono font-semibold">{store.length * store.width}<span className="text-[10px] text-muted-foreground"> sq ft</span></div>
          </div>
        </div>

        {/* Materials summary */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Layers className="h-3.5 w-3.5" />
            <span className="font-medium">Materials</span>
          </div>
          <div className="space-y-1.5 text-xs">
            {[
              { label: 'Shape', value: store.shape },
              { label: 'Interior', value: store.interiorMaterial },
              { label: 'Deck', value: store.deckMaterial },
              { label: 'Water', value: store.waterColor },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1">
                <span className="text-muted-foreground">{label}</span>
                <span className="capitalize font-medium">{value.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Day/Night toggle */}
        <div>
          <button
            onClick={store.toggleDayMode}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium bg-muted/50 hover:bg-muted transition-all duration-150 active:scale-[0.97]"
          >
            {store.dayMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            {store.dayMode ? 'Day Mode' : 'Night Mode'}
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <DollarSign className="h-3.5 w-3.5" />
          <span className="font-medium">Estimated Cost</span>
        </div>
        <div className="text-2xl font-semibold text-price font-mono tracking-tight">
          ${price.toLocaleString()}
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5">Approximate total</div>
      </div>
    </aside>
  );
}
