import { useState, useRef, useCallback, memo } from 'react';
import { PoolScene, type PoolSceneHandle } from '@/components/pool/PoolScene';
import { ControlsSidebar } from '@/components/pool/ControlsSidebar';
import { PropertiesPanel } from '@/components/pool/PropertiesPanel';
import { TopBar } from '@/components/pool/TopBar';
import { PrintableSpecSheet } from '@/components/pool/PrintableSpecSheet';
import { usePoolStore, calculatePrice } from '@/store/usePoolStore';
import { DollarSign } from 'lucide-react';

const MobilePriceBadge = memo(function MobilePriceBadge() {
  const length = usePoolStore((s) => s.length);
  const width = usePoolStore((s) => s.width);
  const depth = usePoolStore((s) => s.depth);
  const interiorMaterial = usePoolStore((s) => s.interiorMaterial);
  const deckMaterial = usePoolStore((s) => s.deckMaterial);
  const addOns = usePoolStore((s) => s.addOns);
  const hasSpa = usePoolStore((s) => s.hasSpa);
  const hasSteps = usePoolStore((s) => s.hasSteps);

  const price = calculatePrice({ length, width, depth, interiorMaterial, deckMaterial, addOns, hasSpa, hasSteps });

  return (
    <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-card border border-border rounded-md px-4 py-2 flex items-center gap-2 shadow-lg">
      <DollarSign className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
      <span className="text-sm font-bold text-price font-mono">${price.toLocaleString()}</span>
    </div>
  );
});

const Index = () => {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [screenshot, setScreenshot] = useState<string>('');
  const sceneRef = useRef<PoolSceneHandle>(null);

  const handlePrint = useCallback(() => {
    if (!sceneRef.current) return;
    const img = sceneRef.current.getScreenshot();
    setScreenshot(img);
    // Use afterprint / requestAnimationFrame to ensure React has flushed the screenshot state
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
      });
    });
  }, []);

  const handleToggleLeft = useCallback(() => {
    setLeftOpen((v) => !v);
    setRightOpen(false);
  }, []);

  const handleToggleRight = useCallback(() => {
    setRightOpen((v) => !v);
    setLeftOpen(false);
  }, []);

  return (
    <>
      <div className="h-screen w-screen bg-background overflow-hidden relative font-sans print:hidden">
        {/* Background Scene */}
        <div className="absolute inset-0 z-0">
          <PoolScene ref={sceneRef} />
        </div>

        {/* UI Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col pt-4">
          <div className="pointer-events-auto max-w-[1800px] mx-auto w-full px-4">
            <TopBar
              onToggleLeft={handleToggleLeft}
              onToggleRight={handleToggleRight}
              leftOpen={leftOpen}
              rightOpen={rightOpen}
              onExport={() => sceneRef.current?.exportPNG()}
              onPrint={handlePrint}
            />
          </div>

          <div className="flex flex-1 min-h-0 relative justify-between px-8 py-6 pointer-events-none gap-6 max-w-[1800px] mx-auto w-full">
            {/* Desktop sidebar */}
            <div className="hidden lg:flex h-full w-[340px] pointer-events-none">
              <ControlsSidebar />
            </div>

            {/* Desktop properties */}
            <div className="hidden lg:flex h-full w-[280px] pointer-events-none">
              <PropertiesPanel />
            </div>
          </div>
        </div>

        {/* Mobile overlays */}
        <div className="pointer-events-auto z-50">
          {leftOpen && (
            <>
              <div
                className="fixed inset-0 top-16 bg-background/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                onClick={() => setLeftOpen(false)}
                aria-hidden
              />
              <div className="fixed left-0 top-16 bottom-0 z-50 lg:hidden animate-slide-in-left w-80 p-4">
                <ControlsSidebar />
              </div>
            </>
          )}

          <MobilePriceBadge />

          {rightOpen && (
            <>
              <div
                className="fixed inset-0 top-16 bg-background/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                onClick={() => setRightOpen(false)}
                aria-hidden
              />
              <div className="fixed right-0 top-16 bottom-0 z-50 lg:hidden animate-slide-in-right w-72 p-4">
                <PropertiesPanel />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="hidden print:block bg-white text-black min-h-screen">
        <PrintableSpecSheet screenshot={screenshot} />
      </div>
    </>
  );
};

export default Index;
