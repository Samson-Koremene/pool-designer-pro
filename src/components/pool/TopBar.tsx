import { usePoolStore } from '@/store/usePoolStore';
import { Waves, Download, Share2, SlidersHorizontal, Info, X } from 'lucide-react';
import { useState } from 'react';

interface TopBarProps {
  onToggleLeft: () => void;
  onToggleRight: () => void;
  leftOpen: boolean;
  rightOpen: boolean;
  onExport: () => void;
}

export function TopBar({ onToggleLeft, onToggleRight, leftOpen, rightOpen, onExport }: TopBarProps) {
  const { projectName, setProjectName } = usePoolStore();
  const [editing, setEditing] = useState(false);

  return (
    <header className="h-14 surface-glass border-b border-border/60 flex items-center justify-between px-4 sm:px-5 shrink-0 z-50">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile panel toggles */}
        <button
          onClick={onToggleLeft}
          className={`lg:hidden p-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
            leftOpen
              ? 'gradient-primary text-primary-foreground shadow-glow'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
          }`}
        >
          {leftOpen ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Waves className="h-4 w-4 text-primary-foreground" />
          </div>
          {editing ? (
            <input
              autoFocus
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={() => setEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
              className="bg-transparent border-b border-pool text-sm font-semibold outline-none w-32 sm:w-48 min-w-0 tracking-tight"
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-sm font-semibold hover:text-pool-accent transition-colors truncate tracking-tight"
            >
              {projectName}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Mobile properties toggle */}
        <button
          onClick={onToggleRight}
          className={`lg:hidden p-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
            rightOpen
              ? 'gradient-primary text-primary-foreground shadow-glow'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
          }`}
        >
          {rightOpen ? <X className="h-4 w-4" /> : <Info className="h-4 w-4" />}
        </button>

        <button className="hidden sm:flex p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200 active:scale-95">
          <Share2 className="h-4 w-4" />
        </button>
        <button
          onClick={onExport}
          className="hidden sm:flex p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200 active:scale-95"
          title="Export as PNG"
        >
          <Download className="h-4 w-4" />
        </button>
        <button className="hidden sm:flex ml-2 px-4 py-2 rounded-xl text-xs font-semibold gradient-primary text-primary-foreground hover:opacity-90 transition-all duration-200 active:scale-[0.97] shadow-glow tracking-wide uppercase">
          Save
        </button>
      </div>
    </header>
  );
}
