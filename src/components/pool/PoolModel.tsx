import { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';
import { usePoolStore, type PoolShape, type WaterColor } from '@/store/usePoolStore';
import * as THREE from 'three';

// ─── Constants ────────────────────────────────────────────────────────────────
const SCALE = 0.5;
const DECK_WIDTH = 0.8;
const DECK_HEIGHT = 0.3;
const DEPTH_SCALE = 0.4;
const SPA_RADIUS_OUTER = 2.5;
const SPA_RADIUS_INNER = 1.8;
const SPA_OFFSET = 1.2;
const HANDLE_OFFSET = 4.2;
const HANDLE_SPHERE_RADIUS = 0.5;
const RADIAL_HANDLE_SPHERE_RADIUS = 0.7;
const WAVE_FREQ_X = 1.2;
const WAVE_FREQ_Y = 1.5;
const WAVE_FREQ_XY = 0.8;
const WAVE_AMP_X = 0.04;
const WAVE_AMP_Y = 0.03;
const WAVE_AMP_XY = 0.02;
const WAVE_SPEED_X = 1.8;
const WAVE_SPEED_Y = 2.2;
const WAVE_SPEED_XY = 1.1;

const WATER_COLORS: Record<WaterColor, string> = {
  'light-blue': '#7ec8e3',
  'deep-blue': '#2e6b9e',
  'turquoise': '#40c9c0',
  'emerald': '#2d8a6e',
};

const INTERIOR_COLORS: Record<string, string> = {
  tile: '#b8d4e3',
  concrete: '#c4bfb6',
  fiberglass: '#d5e5ef',
};

const DECK_COLORS: Record<string, string> = {
  wood: '#8b6f47',
  stone: '#9e9689',
  marble: '#e8e4de',
};

// ─── Shape helpers ─────────────────────────────────────────────────────────────
function createPoolShape(shape: PoolShape, length: number, width: number): THREE.Shape {
  const s = new THREE.Shape();
  const hw = width / 2;
  const hl = length / 2;

  switch (shape) {
    case 'rectangle':
      s.moveTo(-hl, -hw);
      s.lineTo(hl, -hw);
      s.lineTo(hl, hw);
      s.lineTo(-hl, hw);
      s.closePath();
      break;
    case 'oval':
      s.absellipse(0, 0, hl, hw, 0, Math.PI * 2, false, 0);
      break;
    case 'kidney': {
      s.moveTo(-hl, -hw * 0.6);
      s.bezierCurveTo(-hl, -hw, hl * 0.3, -hw, hl * 0.3, -hw * 0.5);
      s.bezierCurveTo(hl * 0.3, -hw * 0.1, hl, -hw * 0.3, hl, 0);
      s.bezierCurveTo(hl, hw * 0.6, hl * 0.2, hw, -hl * 0.1, hw * 0.8);
      s.bezierCurveTo(-hl * 0.5, hw * 0.6, -hl, hw * 0.4, -hl, 0);
      s.lineTo(-hl, -hw * 0.6);
      break;
    }
    case 'l-shape':
      s.moveTo(-hl, -hw);
      s.lineTo(hl * 0.3, -hw);
      s.lineTo(hl * 0.3, -hw * 0.2);
      s.lineTo(hl, -hw * 0.2);
      s.lineTo(hl, hw);
      s.lineTo(-hl, hw);
      s.closePath();
      break;
  }
  return s;
}

function getPerimeterPoint(shape: PoolShape, sl: number, sw: number, angle: number): [number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  if (shape === 'oval' || shape === 'kidney') {
    return [sl * cos, sw * sin];
  }
  const r_x = Math.abs(cos) > 0.001 ? Math.abs(sl / cos) : Infinity;
  const r_z = Math.abs(sin) > 0.001 ? Math.abs(sw / sin) : Infinity;
  const r = Math.min(r_x, r_z);
  return [r * cos, r * sin];
}

// ─── Handle components ─────────────────────────────────────────────────────────
type PointerEvent3D = React.PointerEvent<THREE.Mesh>;

function useDragHandle(
  axis: 'x' | 'z' | 'radial',
  direction: 1 | -1,
  value: number,
  onChange: (v: number) => void,
  min?: number,
  max?: number,
) {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const lastPos = useRef(0);

  // Clean up cursor on unmount
  useEffect(() => {
    return () => { document.body.style.cursor = 'auto'; };
  }, []);

  const bind = {
    onPointerDown: (e: PointerEvent3D) => {
      e.stopPropagation();
      (e.target as Element).setPointerCapture(e.pointerId);
      setActive(true);
      lastPos.current = axis === 'z' ? e.clientY : e.clientX;
      document.body.style.cursor = axis === 'z' ? 'ns-resize' : 'ew-resize';
    },
    onPointerUp: (e: PointerEvent3D) => {
      (e.target as Element).releasePointerCapture(e.pointerId);
      setActive(false);
      document.body.style.cursor = hovered ? 'grab' : 'auto';
    },
    onPointerMove: (e: PointerEvent3D) => {
      if (!active) return;
      const currentPos = axis === 'z' ? e.clientY : e.clientX;
      const delta = currentPos - lastPos.current;
      lastPos.current = currentPos;

      if (axis === 'radial') {
        onChange(value - delta * 0.02);
      } else {
        const next = value + delta * 0.05 * direction;
        onChange(Math.max(min ?? -Infinity, Math.min(max ?? Infinity, next)));
      }
    },
    onPointerOver: () => {
      setHovered(true);
      if (!active) document.body.style.cursor = 'grab';
    },
    onPointerOut: () => {
      setHovered(false);
      if (!active) document.body.style.cursor = 'auto';
    },
  };

  return { active, hovered, bind };
}

function RadialHandle({ position, onChange, value }: {
  position: [number, number, number];
  onChange: (v: number) => void;
  value: number;
}) {
  const { active, hovered, bind } = useDragHandle('radial', 1, value, onChange);

  return (
    <mesh position={position} {...bind}>
      <sphereGeometry args={[RADIAL_HANDLE_SPHERE_RADIUS, 32, 32]} />
      <meshStandardMaterial
        color={active ? '#10b981' : hovered ? '#34d399' : '#ffffff'}
        emissive={active ? '#10b981' : hovered ? '#6ee7b7' : '#ffffff'}
        emissiveIntensity={0.6}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

function InteractiveHandle({ position, axis, direction, onChange, min, max, value }: {
  position: [number, number, number];
  axis: 'x' | 'z';
  direction: 1 | -1;
  onChange: (v: number) => void;
  min: number;
  max: number;
  value: number;
}) {
  const { active, hovered, bind } = useDragHandle(axis, direction, value, onChange, min, max);

  return (
    <mesh position={position} {...bind}>
      <sphereGeometry args={[HANDLE_SPHERE_RADIUS, 32, 32]} />
      <meshStandardMaterial
        color={active ? '#3b82f6' : hovered ? '#93c5fd' : '#ffffff'}
        emissive={active ? '#3b82f6' : hovered ? '#bfdbfe' : '#ffffff'}
        emissiveIntensity={0.6}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

// ─── Water surface ─────────────────────────────────────────────────────────────
function WaterSurface({ poolShape, color, yPosition }: {
  poolShape: THREE.Shape;
  color: string;
  yPosition: number;
}) {
  const geoRef = useRef<THREE.ShapeGeometry>(null!);
  const basePositions = useMemo(() => {
    const geo = new THREE.ShapeGeometry(poolShape, 32);
    const copy = new Float32Array(geo.attributes.position.array);
    geo.dispose();
    return copy;
  }, [poolShape]);

  useFrame(({ clock }) => {
    if (!geoRef.current) return;
    const pos = geoRef.current.attributes.position;
    const t = clock.getElapsedTime();
    for (let i = 0; i < pos.count; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const wave =
        Math.sin(bx * WAVE_FREQ_X + t * WAVE_SPEED_X) * WAVE_AMP_X +
        Math.sin(by * WAVE_FREQ_Y + t * WAVE_SPEED_Y) * WAVE_AMP_Y +
        Math.sin((bx + by) * WAVE_FREQ_XY + t * WAVE_SPEED_XY) * WAVE_AMP_XY;
      pos.setZ(i, basePositions[i * 3 + 2] + wave);
    }
    pos.needsUpdate = true;
    geoRef.current.computeVertexNormals();
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, yPosition, 0]}>
      <shapeGeometry ref={geoRef} args={[poolShape, 32]} />
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={0.9}
        roughness={0.08}
        metalness={0.1}
        transmission={0.95}
        ior={1.33}
        thickness={1.5}
        clearcoat={1}
        clearcoatRoughness={0.05}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Main pool model ───────────────────────────────────────────────────────────
export function PoolModel() {
  const {
    shape, length, width, depth,
    interiorMaterial, deckMaterial, waterColor,
    hasSpa, hasSteps,
    setLength, setWidth,
    isEditMode, spaAngle, setSpaAngle,
  } = usePoolStore();

  const sl = length * SCALE;
  const sw = width * SCALE;
  const sd = depth * SCALE * DEPTH_SCALE;

  const poolShape = useMemo(() => createPoolShape(shape, sl, sw), [shape, sl, sw]);
  const deckShape = useMemo(
    () => createPoolShape(shape, sl + DECK_WIDTH * 2, sw + DECK_WIDTH * 2),
    [shape, sl, sw],
  );

  const poolGeo = useMemo(
    () => new THREE.ExtrudeGeometry(poolShape, { depth: sd, bevelEnabled: false }),
    [poolShape, sd],
  );
  const deckGeo = useMemo(
    () => new THREE.ExtrudeGeometry(deckShape, { depth: DECK_HEIGHT, bevelEnabled: false }),
    [deckShape],
  );

  // Dispose geometries when they're replaced
  useEffect(() => () => { poolGeo.dispose(); }, [poolGeo]);
  useEffect(() => () => { deckGeo.dispose(); }, [deckGeo]);

  const [px, pz] = getPerimeterPoint(shape, sl, sw, spaAngle);
  const dist = Math.sqrt(px * px + pz * pz) || 1;
  const spaX = px + (px / dist) * SPA_OFFSET;
  const spaZ = pz + (pz / dist) * SPA_OFFSET;
  const handleX = px + (px / dist) * HANDLE_OFFSET;
  const handleZ = pz + (pz / dist) * HANDLE_OFFSET;

  const interiorColor = INTERIOR_COLORS[interiorMaterial];
  const deckColor = DECK_COLORS[deckMaterial];
  const waterHex = WATER_COLORS[waterColor];

  return (
    <group>
      {/* Interactive Resizing Handles */}
      {isEditMode && (
        <>
          <InteractiveHandle position={[sl + DECK_WIDTH + 0.5, 1.5, 0]} axis="x" direction={1} onChange={setLength} min={10} max={40} value={length} />
          <InteractiveHandle position={[-sl - DECK_WIDTH - 0.5, 1.5, 0]} axis="x" direction={-1} onChange={setLength} min={10} max={40} value={length} />
          <InteractiveHandle position={[0, 1.5, sw + DECK_WIDTH + 0.5]} axis="z" direction={1} onChange={setWidth} min={5} max={25} value={width} />
          <InteractiveHandle position={[0, 1.5, -sw - DECK_WIDTH - 0.5]} axis="z" direction={-1} onChange={setWidth} min={5} max={25} value={width} />
          {hasSpa && <RadialHandle position={[handleX, 1.5, handleZ]} onChange={setSpaAngle} value={spaAngle} />}
        </>
      )}

      {/* Deck */}
      <mesh geometry={deckGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow castShadow>
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={15}
          roughness={0.7}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color={deckColor}
          metalness={0.15}
          mirror={1}
        />
      </mesh>

      {/* Pool interior (walls) */}
      <mesh geometry={poolGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <meshStandardMaterial color={interiorColor} roughness={0.4} side={THREE.BackSide} />
      </mesh>

      {/* Walk-in Steps */}
      {hasSteps && (
        <group position={[-sl + 1, -0.3, 0]}>
          <mesh receiveShadow castShadow position={[0, -0.2, 0]}>
            <boxGeometry args={[1.5, 0.4, sw * 1.5]} />
            <meshStandardMaterial color={interiorColor} roughness={0.4} />
          </mesh>
          <mesh receiveShadow castShadow position={[0.8, -0.6, 0]}>
            <boxGeometry args={[1.5, 0.4, sw * 1.5]} />
            <meshStandardMaterial color={interiorColor} roughness={0.4} />
          </mesh>
        </group>
      )}

      {/* Hot Tub Spa */}
      {hasSpa && (
        <group position={[spaX, 0, spaZ]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.011, 0]} receiveShadow castShadow>
            <circleGeometry args={[SPA_RADIUS_OUTER, 32]} />
            <MeshReflectorMaterial blur={[300, 100]} resolution={512} mixBlur={1} mixStrength={15} roughness={0.7} color={deckColor} metalness={0.15} mirror={1} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.021, 0]} receiveShadow>
            <circleGeometry args={[SPA_RADIUS_INNER, 32]} />
            <meshStandardMaterial color={interiorColor} roughness={0.4} side={THREE.BackSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, sd * 0.7 + 0.1, 0]}>
            <circleGeometry args={[SPA_RADIUS_INNER, 32]} />
            <meshPhysicalMaterial
              color={waterHex}
              transparent opacity={0.9}
              roughness={0.08} metalness={0.1} transmission={0.95} ior={1.33} thickness={1.5} clearcoat={1} depthWrite={false}
            />
          </mesh>
        </group>
      )}

      {/* Animated Water surface */}
      <WaterSurface poolShape={poolShape} color={waterHex} yPosition={sd * 0.7} />
    </group>
  );
}
