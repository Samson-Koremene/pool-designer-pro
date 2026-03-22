import { PoolScene } from '@/components/pool/PoolScene';
import { ControlsSidebar } from '@/components/pool/ControlsSidebar';
import { PropertiesPanel } from '@/components/pool/PropertiesPanel';
import { TopBar } from '@/components/pool/TopBar';

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TopBar />
      <div className="flex flex-1 min-h-0">
        <ControlsSidebar />
        <main className="flex-1 relative">
          <PoolScene />
        </main>
        <PropertiesPanel />
      </div>
    </div>
  );
};

export default Index;
