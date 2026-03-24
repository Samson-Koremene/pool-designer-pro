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
    <header className="h-12 surface-elevated border-b border-border flex items-center justify-between px-3 sm:px-4 shrink-0 z-50">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile panel toggles */}
        <button
          onClick={onToggleLeft}
          className={`lg:hidden p-2 rounded-lg transition-all duration-150 active:scale-[0.95] ${
            leftOpen ? 'bg-primary/15 text-pool-accent' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          {leftOpen ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
        </button>

        <Waves className="h-5 w-5 text-pool-accent shrink-0" />
        {editing ? (
          <input
            autoFocus
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
            className="bg-transparent border-b border-pool text-sm font-medium outline-none w-32 sm:w-48 min-w-0"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-sm font-medium hover:text-pool-accent transition-colors truncate"
          >
            {projectName}
          </button>
        )}
      </div>
      <div className="flex items-center gap-1">
        {/* Mobile properties toggle */}
        <button
          onClick={onToggleRight}
          className={`lg:hidden p-2 rounded-lg transition-all duration-150 active:scale-[0.95] ${
            rightOpen ? 'bg-primary/15 text-pool-accent' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          {rightOpen ? <X className="h-4 w-4" /> : <Info className="h-4 w-4" />}
        </button>

        <button className="hidden sm:flex p-2 rounded-lg text-muted-foreground hover:bg-muted transition-all duration-150 active:scale-[0.95]">
          <Share2 className="h-4 w-4" />
        </button>
        <button className="hidden sm:flex p-2 rounded-lg text-muted-foreground hover:bg-muted transition-all duration-150 active:scale-[0.95]">
          <Download className="h-4 w-4" />
        </button>
        <button className="hidden sm:flex ml-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 active:scale-[0.97]">
          Save Project
        </button>
      </div>
    </header>
  );
}
