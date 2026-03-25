import { usePoolStore, calculatePrice } from '@/store/usePoolStore';
import { Ruler, Layers, DollarSign, Sun, Moon } from 'lucide-react';

export function PropertiesPanel() {
  const store = usePoolStore();
  const price = calculatePrice(store);

  return (
    <aside className="w-56 bg-card border-l border-border flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Properties</h3>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Dimensions */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <Ruler className="h-3 w-3" />
            <span className="font-medium">Dimensions</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: 'L', value: store.length },
              { label: 'W', value: store.width },
              { label: 'D', value: store.depth },
            ].map(({ label, value }) => (
              <div key={label} className="bg-secondary rounded-md p-2 text-center">
                <div className="text-[9px] text-muted-foreground uppercase font-medium">{label}</div>
                <div className="text-sm font-mono font-bold text-foreground">{value}<span className="text-[9px] text-muted-foreground font-normal">ft</span></div>
              </div>
            ))}
          </div>
          <div className="bg-secondary rounded-md p-2 text-center mt-1.5">
            <div className="text-[9px] text-muted-foreground uppercase font-medium">Area</div>
            <div className="text-sm font-mono font-bold text-foreground">{store.length * store.width}<span className="text-[9px] text-muted-foreground font-normal"> sq ft</span></div>
          </div>
        </div>

        {/* Materials */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <Layers className="h-3 w-3" />
            <span className="font-medium">Materials</span>
          </div>
          <div className="bg-secondary rounded-md divide-y divide-border overflow-hidden">
            {[
              { label: 'Shape', value: store.shape },
              { label: 'Interior', value: store.interiorMaterial },
              { label: 'Deck', value: store.deckMaterial },
              { label: 'Water', value: store.waterColor },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between px-3 py-1.5 text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="capitalize font-medium text-foreground">{value.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Day/Night */}
        <button
          onClick={store.toggleDayMode}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-xs font-medium bg-secondary text-foreground hover:bg-muted transition-colors"
        >
          {store.dayMode ? <Sun className="h-3.5 w-3.5 text-pool-accent" /> : <Moon className="h-3.5 w-3.5 text-pool-accent" />}
          {store.dayMode ? 'Day Mode' : 'Night Mode'}
        </button>
      </div>

      {/* Price */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <DollarSign className="h-3 w-3" />
          <span className="font-medium">Estimated Cost</span>
        </div>
        <div className="text-2xl font-bold text-price font-mono tracking-tight">
          ${price.toLocaleString()}
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5">Approximate total</div>
      </div>
    </aside>
  );
}
