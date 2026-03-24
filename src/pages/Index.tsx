import { useState, useRef } from 'react';
import { PoolScene, type PoolSceneHandle } from '@/components/pool/PoolScene';
import { ControlsSidebar } from '@/components/pool/ControlsSidebar';
import { PropertiesPanel } from '@/components/pool/PropertiesPanel';
import { TopBar } from '@/components/pool/TopBar';
import { usePoolStore, calculatePrice } from '@/store/usePoolStore';
import { DollarSign } from 'lucide-react';

const Index = () => {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const sceneRef = useRef<PoolSceneHandle>(null);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TopBar
        onToggleLeft={() => { setLeftOpen((v) => !v); setRightOpen(false); }}
        onToggleRight={() => { setRightOpen((v) => !v); setLeftOpen(false); }}
        leftOpen={leftOpen}
        rightOpen={rightOpen}
      />
      <div className="flex flex-1 min-h-0 relative">
        {/* Desktop sidebar */}
        <div className="hidden lg:flex h-full">
          <ControlsSidebar />
        </div>

        {/* Mobile/tablet overlay - left */}
        {leftOpen && (
          <>
            <div className="fixed inset-0 top-12 bg-black/50 z-30 lg:hidden animate-fade-in" onClick={() => setLeftOpen(false)} />
            <div className="fixed left-0 top-12 bottom-0 z-40 lg:hidden animate-slide-in-left">
              <ControlsSidebar />
            </div>
          </>
        )}

        <main className="flex-1 relative">
          <PoolScene />
          {/* Mobile price badge */}
          <MobilePriceBadge />
        </main>

        {/* Desktop properties */}
        <div className="hidden lg:flex h-full">
          <PropertiesPanel />
        </div>

        {/* Mobile/tablet overlay - right */}
        {rightOpen && (
          <>
            <div className="fixed inset-0 top-12 bg-black/50 z-30 lg:hidden animate-fade-in" onClick={() => setRightOpen(false)} />
            <div className="fixed right-0 top-12 bottom-0 z-40 lg:hidden animate-slide-in-right">
              <PropertiesPanel />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function MobilePriceBadge() {
  const store = usePoolStore();
  const price = calculatePrice(store);

  return (
    <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-20 surface-elevated border border-border rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
      <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-sm font-semibold text-price font-mono">${price.toLocaleString()}</span>
    </div>
  );
}

export default Index;
