import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Sky, Stars, Grid } from '@react-three/drei';
import { Suspense, forwardRef, useImperativeHandle, useRef, useCallback, Component, type ReactNode } from 'react';
import { usePoolStore } from '@/store/usePoolStore';
import { PoolModel } from './PoolModel';
import { PoolAddOns } from './PoolAddOns';
import type { WebGLRenderer } from 'three';

// ─── Error boundary ────────────────────────────────────────────────────────────
interface ErrorBoundaryState { hasError: boolean; message: string }

class CanvasErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-500 gap-2">
          <p className="text-sm font-semibold">3D renderer failed to load</p>
          <p className="text-xs opacity-70">{this.state.message}</p>
          <button
            className="mt-2 px-4 py-1.5 rounded-full bg-slate-800 text-white text-xs font-bold"
            onClick={() => this.setState({ hasError: false, message: '' })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Scene capture helper ──────────────────────────────────────────────────────
function SceneCapture({ onRendererReady }: { onRendererReady: (gl: WebGLRenderer) => void }) {
  const { gl } = useThree();
  const called = useRef(false);
  if (!called.current) {
    called.current = true;
    onRendererReady(gl as unknown as WebGLRenderer);
  }
  return null;
}

// ─── Scene lighting ────────────────────────────────────────────────────────────
function SceneLighting({ dayMode }: { dayMode: boolean }) {
  if (dayMode) {
    return (
      <>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[15, 20, 10]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
      </>
    );
  }
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 15, 5]} intensity={0.4} />
      <pointLight position={[0, 3, 0]} intensity={1.5} color="#4dd9e8" />
    </>
  );
}

// ─── Main scene ────────────────────────────────────────────────────────────────
export interface PoolSceneHandle {
  exportPNG: () => void;
  getScreenshot: () => string;
}

export const PoolScene = forwardRef<PoolSceneHandle>(function PoolScene(_, ref) {
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const dayMode = usePoolStore((s) => s.dayMode);

  const handleExport = useCallback(() => {
    const gl = rendererRef.current;
    if (!gl) return;
    const link = document.createElement('a');
    link.download = 'pool-design.png';
    link.href = gl.domElement.toDataURL('image/png');
    link.click();
  }, []);

  useImperativeHandle(ref, () => ({
    exportPNG: handleExport,
    getScreenshot: () => rendererRef.current?.domElement.toDataURL('image/png') ?? '',
  }), [handleExport]);

  return (
    <div className="w-full h-full">
      <CanvasErrorBoundary>
        <Canvas
          shadows
          camera={{ position: [25, 18, 25], fov: 45 }}
          gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        >
          <color attach="background" args={[dayMode ? '#87CEEB' : '#0a0e1a']} />
          <Suspense fallback={null}>
            <SceneCapture onRendererReady={(gl) => { rendererRef.current = gl; }} />

            {dayMode
              ? <Sky distance={450000} sunPosition={[15, 20, 10]} inclination={0} azimuth={0.25} turbidity={0.6} rayleigh={0.5} />
              : <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            }

            <SceneLighting dayMode={dayMode} />

            <PoolModel />
            <PoolAddOns />

            {/* Ground plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
              <planeGeometry args={[200, 200]} />
              <meshStandardMaterial color={dayMode ? '#f1f5f9' : '#020617'} roughness={1} />
            </mesh>

            <Grid
              position={[0, -0.005, 0]}
              infiniteGrid
              cellSize={2}
              cellThickness={0.4}
              cellColor={dayMode ? '#cbd5e1' : '#1e293b'}
              sectionSize={10}
              sectionThickness={0.8}
              sectionColor={dayMode ? '#94a3b8' : '#334155'}
              fadeDistance={80}
            />

            <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={50} blur={2} far={20} />
            <Environment preset={dayMode ? 'city' : 'night'} />

            <OrbitControls
              enablePan
              enableZoom
              enableRotate
              minPolarAngle={0.2}
              maxPolarAngle={Math.PI / 2.2}
              minDistance={10}
              maxDistance={60}
            />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
});
