import { memo } from 'react';
import { usePoolStore, calculatePrice } from '@/store/usePoolStore';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[13px] font-bold text-slate-800 tracking-wide mb-4">
      {children}
    </h3>
  );
}

const glassCard =
  'bg-white/40 backdrop-blur-3xl border-[1.5px] border-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-[2rem] p-6 w-full transition-all duration-300 pointer-events-auto relative overflow-hidden';

// Granular selectors avoid re-rendering on unrelated store changes
export const PropertiesPanel = memo(function PropertiesPanel() {
  const length = usePoolStore((s) => s.length);
  const width = usePoolStore((s) => s.width);
  const depth = usePoolStore((s) => s.depth);
  const interiorMaterial = usePoolStore((s) => s.interiorMaterial);
  const deckMaterial = usePoolStore((s) => s.deckMaterial);
  const addOns = usePoolStore((s) => s.addOns);
  const hasSpa = usePoolStore((s) => s.hasSpa);
  const hasSteps = usePoolStore((s) => s.hasSteps);
  const dayMode = usePoolStore((s) => s.dayMode);
  const toggleDayMode = usePoolStore((s) => s.toggleDayMode);

  const price = calculatePrice({ length, width, depth, interiorMaterial, deckMaterial, addOns, hasSpa, hasSteps });
  const area = length * width;

  return (
    <div className="flex flex-col gap-4 h-full pointer-events-none w-full">
      <div className={glassCard}>
        <SectionLabel>Project Summary</SectionLabel>
        <div className="grid grid-cols-2 gap-y-5 gap-x-2">
          <div>
            <div className="text-[10px] font-semibold text-slate-500 mb-1">Cost</div>
            <div className="text-[18px] font-extrabold text-slate-800 tracking-tight leading-none">
              ${price.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-slate-500 mb-1">Floors</div>
            <div className="text-[14px] font-bold text-slate-800 tracking-tight leading-none">1</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-slate-500 mb-1">Area</div>
            <div className="text-[14px] font-bold text-slate-800 tracking-tight leading-none">{area} m²</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-slate-500 mb-1">Build time</div>
            <div className="text-[14px] font-bold text-slate-800 tracking-tight leading-none">4 weeks</div>
          </div>
        </div>
      </div>

      <div className={`${glassCard} mt-auto`}>
        <div className="flex justify-between items-center">
          <span className="text-[12px] font-semibold text-slate-600">Time of Day</span>
          <button
            onClick={toggleDayMode}
            aria-label={dayMode ? 'Switch to night mode' : 'Switch to day mode'}
            className="px-4 py-2 rounded-full bg-white/60 hover:bg-white text-[10px] font-bold text-slate-800 border border-white/80 shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            {dayMode ? '☀️ Day' : '🌙 Night'}
          </button>
        </div>
      </div>
    </div>
  );
});
