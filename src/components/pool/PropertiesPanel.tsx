import { usePoolStore, calculatePrice } from '@/store/usePoolStore';
import { Ruler, Layers, DollarSign, Sun, Moon, TrendingUp } from 'lucide-react';

export function PropertiesPanel() {
  const store = usePoolStore();
  const price = calculatePrice(store);

  return (
    <aside className="w-[260px] surface-glass border-l border-border/60 flex flex-col h-full">
      <div className="p-4 border-b border-border/60">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground flex items-center gap-2">
          <span className="w-5 h-px bg-border" />
          Properties
        </h3>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Dimensions summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Ruler className="h-3.5 w-3.5" />
            <span className="font-semibold">Dimensions</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'L', value: store.length },
              { label: 'W', value: store.width },
              { label: 'D', value: store.depth },
            ].map(({ label, value }) => (
              <div key={label} className="bg-card rounded-xl p-2.5 text-center border border-border/40">
                <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">{label}</div>
                <div className="text-sm font-mono font-bold mt-0.5">{value}<span className="text-[9px] text-muted-foreground font-normal">ft</span></div>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-xl p-2.5 text-center border border-border/40">
            <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">Total Area</div>
            <div className="text-sm font-mono font-bold mt-0.5">{store.length * store.width}<span className="text-[9px] text-muted-foreground font-normal"> sq ft</span></div>
          </div>
        </div>

        {/* Materials summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Layers className="h-3.5 w-3.5" />
            <span className="font-semibold">Materials</span>
          </div>
          <div className="space-y-0 bg-card rounded-xl border border-border/40 overflow-hidden divide-y divide-border/30">
            {[
              { label: 'Shape', value: store.shape },
              { label: 'Interior', value: store.interiorMaterial },
              { label: 'Deck', value: store.deckMaterial },
              { label: 'Water', value: store.waterColor },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between px-3 py-2 text-xs">
                <span className="text-muted-foreground">{label}</span>
                <span className="capitalize font-semibold">{value.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Day/Night toggle */}
        <div>
          <button
            onClick={store.toggleDayMode}
            className="w-full flex items-center justify-center gap-2.5 px-3 py-3 rounded-xl text-xs font-semibold bg-card hover:bg-muted/80 border border-border/40 transition-all duration-200 active:scale-[0.97]"
          >
            {store.dayMode ? <Sun className="h-4 w-4 text-pool-accent" /> : <Moon className="h-4 w-4 text-pool-accent" />}
            {store.dayMode ? 'Day Mode' : 'Night Mode'}
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="p-4 border-t border-border/60">
        <div className="bg-card rounded-xl p-4 border border-border/40">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="font-semibold">Estimated Cost</span>
          </div>
          <div className="text-3xl font-bold text-price font-mono tracking-tighter">
            ${price.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1 font-medium">Approximate total</div>
        </div>
      </div>
    </aside>
  );
}
