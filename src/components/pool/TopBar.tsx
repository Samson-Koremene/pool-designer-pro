import { memo, useState } from 'react';
import { usePoolStore } from '@/store/usePoolStore';
import { Waves, Download, SlidersHorizontal, Info, X, Camera, Edit3, RotateCcw } from 'lucide-react';

interface TopBarProps {
  onToggleLeft: () => void;
  onToggleRight: () => void;
  leftOpen: boolean;
  rightOpen: boolean;
  onExport: () => void;
  onPrint?: () => void;
}

export const TopBar = memo(function TopBar({
  onToggleLeft, onToggleRight, leftOpen, rightOpen, onExport, onPrint,
}: TopBarProps) {
  const projectName = usePoolStore((s) => s.projectName);
  const setProjectName = usePoolStore((s) => s.setProjectName);
  const isEditMode = usePoolStore((s) => s.isEditMode);
  const setIsEditMode = usePoolStore((s) => s.setIsEditMode);
  const resetToDefaults = usePoolStore((s) => s.resetToDefaults);

  const [editing, setEditing] = useState(false);

  return (
    <header className="h-14 rounded-full bg-white/40 backdrop-blur-3xl border-[1.5px] border-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex items-center justify-between px-6 shrink-0 z-50 transition-all duration-300">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleLeft}
          aria-label={leftOpen ? 'Close controls' : 'Open controls'}
          aria-expanded={leftOpen}
          className={`lg:hidden p-2 rounded-md transition-colors ${
            leftOpen ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          {leftOpen ? <X className="h-4 w-4" aria-hidden /> : <SlidersHorizontal className="h-4 w-4" aria-hidden />}
        </button>

        <Waves className="h-5 w-5 text-pool-accent shrink-0" aria-hidden />

        {editing ? (
          <input
            autoFocus
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
            aria-label="Project name"
            className="bg-transparent border-b border-primary text-sm font-semibold outline-none w-32 sm:w-48 min-w-0"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            aria-label={`Edit project name: ${projectName}`}
            className="text-sm font-semibold hover:text-pool-accent transition-colors truncate"
          >
            {projectName}
          </button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onToggleRight}
          aria-label={rightOpen ? 'Close properties' : 'Open properties'}
          aria-expanded={rightOpen}
          className={`lg:hidden p-2 rounded-md transition-colors ${
            rightOpen ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          {rightOpen ? <X className="h-4 w-4" aria-hidden /> : <Info className="h-4 w-4" aria-hidden />}
        </button>

        <button
          onClick={resetToDefaults}
          aria-label="Reset to defaults"
          title="Reset to defaults"
          className="hidden sm:flex p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
        </button>

        <button
          onClick={onExport}
          aria-label="Export as PNG"
          title="Export as PNG"
          className="hidden sm:flex p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <Download className="h-4 w-4" aria-hidden />
        </button>

        <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block" aria-hidden />

        <button
          onClick={() => setIsEditMode(!isEditMode)}
          aria-label={isEditMode ? 'Switch to camera mode' : 'Switch to edit mode'}
          aria-pressed={isEditMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
            isEditMode ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {isEditMode ? <Edit3 className="h-4 w-4" aria-hidden /> : <Camera className="h-4 w-4" aria-hidden />}
          {isEditMode ? 'Edit Mode' : 'Camera Mode'}
        </button>

        <button
          onClick={onPrint}
          aria-label="Export as PDF"
          className="hidden sm:flex ml-1 px-4 py-1.5 rounded-full text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-sm"
        >
          Export PDF
        </button>
      </div>
    </header>
  );
});
