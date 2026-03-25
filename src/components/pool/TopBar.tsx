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
    <header className="h-12 bg-card border-b border-border flex items-center justify-between px-4 shrink-0 z-50">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleLeft}
          className={`lg:hidden p-2 rounded-md transition-colors ${
            leftOpen ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
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
            className="bg-transparent border-b border-primary text-sm font-semibold outline-none w-32 sm:w-48 min-w-0"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-sm font-semibold hover:text-pool-accent transition-colors truncate"
          >
            {projectName}
          </button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onToggleRight}
          className={`lg:hidden p-2 rounded-md transition-colors ${
            rightOpen ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          {rightOpen ? <X className="h-4 w-4" /> : <Info className="h-4 w-4" />}
        </button>

        <button className="hidden sm:flex p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Share2 className="h-4 w-4" />
        </button>
        <button onClick={onExport} className="hidden sm:flex p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Export as PNG">
          <Download className="h-4 w-4" />
        </button>
        <button className="hidden sm:flex ml-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          Save
        </button>
      </div>
    </header>
  );
}
