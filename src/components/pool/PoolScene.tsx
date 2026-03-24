import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Suspense, forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { usePoolStore } from '@/store/usePoolStore';
import { PoolModel } from './PoolModel';
import { PoolAddOns } from './PoolAddOns';
import type { WebGLRenderer } from 'three';

export interface PoolSceneHandle {
  exportPNG: () => void;
}

function SceneCapture({ onRendererReady }: { onRendererReady: (gl: WebGLRenderer) => void }) {
  const { gl } = useThree();
  const called = useRef(false);
  if (!called.current) { called.current = true; onRendererReady(gl as unknown as WebGLRenderer); }
  return null;
}

export const PoolScene = forwardRef<PoolSceneHandle>(function PoolScene(_, ref) {
  const rendererRef = useRef<WebGLRenderer | null>(null);

  const handleExport = useCallback(() => {
    const gl = rendererRef.current;
    if (!gl) return;
    const link = document.createElement('a');
    link.download = 'pool-design.png';
    link.href = gl.domElement.toDataURL('image/png');
    link.click();
  }, []);

  useImperativeHandle(ref, () => ({ exportPNG: handleExport }), [handleExport]);
  const dayMode = usePoolStore((s) => s.dayMode);

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [25, 18, 25], fov: 45 }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        style={{ background: dayMode ? '#87CEEB' : '#0a0e1a' }}
      >
        <Suspense fallback={null}>
          <SceneCapture onRendererReady={(gl) => { rendererRef.current = gl; }} />
          {dayMode ? (
            <>
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[15, 20, 10]}
                intensity={1.8}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
            </>
          ) : (
            <>
              <ambientLight intensity={0.15} />
              <directionalLight position={[10, 15, 5]} intensity={0.4} />
              <pointLight position={[0, 3, 0]} intensity={1.5} color="#4dd9e8" />
            </>
          )}

          <PoolModel />
          <PoolAddOns />

          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[80, 80]} />
            <meshStandardMaterial color={dayMode ? '#4a7c59' : '#1a2a1f'} />
          </mesh>

          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.5}
            scale={50}
            blur={2}
            far={20}
          />

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
    </div>
  );
});
