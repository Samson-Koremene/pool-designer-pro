import { useState } from 'react';
import { PoolScene } from '@/components/pool/PoolScene';
import { ControlsSidebar } from '@/components/pool/ControlsSidebar';
import { PropertiesPanel } from '@/components/pool/PropertiesPanel';
import { TopBar } from '@/components/pool/TopBar';

const Index = () => {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

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
        <div className="hidden lg:flex">
          <ControlsSidebar />
        </div>

        {/* Mobile/tablet overlay - left */}
        {leftOpen && (
          <>
            <div className="fixed inset-0 top-12 bg-black/50 z-30 lg:hidden" onClick={() => setLeftOpen(false)} />
            <div className="fixed left-0 top-12 bottom-0 z-40 lg:hidden animate-slide-in-left">
              <ControlsSidebar />
            </div>
          </>
        )}

        <main className="flex-1 relative">
          <PoolScene />

          {/* Mobile price badge */}
          <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            <MobilePriceBadge />
          </div>
        </main>

        {/* Desktop properties */}
        <div className="hidden lg:flex">
          <PropertiesPanel />
        </div>

        {/* Mobile/tablet overlay - right */}
        {rightOpen && (
          <>
            <div className="fixed inset-0 top-12 bg-black/50 z-30 lg:hidden" onClick={() => setRightOpen(false)} />
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
  const { calculatePrice, ...rest } = await import('@/store/usePoolStore').then(() => ({})) as any;
  // Use inline import to avoid complexity
  return null;
}

export default Index;
