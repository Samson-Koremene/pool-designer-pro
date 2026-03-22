import { usePoolStore } from '@/store/usePoolStore';
import { Waves, Download, Share2 } from 'lucide-react';
import { useState } from 'react';

export function TopBar() {
  const { projectName, setProjectName } = usePoolStore();
  const [editing, setEditing] = useState(false);

  return (
    <header className="h-12 surface-elevated border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Waves className="h-5 w-5 text-pool-accent" />
        {editing ? (
          <input
            autoFocus
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
            className="bg-transparent border-b border-pool text-sm font-medium outline-none w-48"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-sm font-medium hover:text-pool-accent transition-colors"
          >
            {projectName}
          </button>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-all duration-150 active:scale-[0.95]">
          <Share2 className="h-4 w-4" />
        </button>
        <button className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-all duration-150 active:scale-[0.95]">
          <Download className="h-4 w-4" />
        </button>
        <button className="ml-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-150 active:scale-[0.97]">
          Save Project
        </button>
      </div>
    </header>
  );
}
