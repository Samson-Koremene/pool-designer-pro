import { useMemo } from 'react';
import { usePoolStore, type PoolShape, type WaterColor } from '@/store/usePoolStore';
import * as THREE from 'three';

const WATER_COLORS: Record<WaterColor, string> = {
  'light-blue': '#7ec8e3',
  'deep-blue': '#2e6b9e',
  'turquoise': '#40c9c0',
  'emerald': '#2d8a6e',
};

const INTERIOR_COLORS = {
  tile: '#b8d4e3',
  concrete: '#c4bfb6',
  fiberglass: '#d5e5ef',
};

const DECK_COLORS = {
  wood: '#8b6f47',
  stone: '#9e9689',
  marble: '#e8e4de',
};

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
      const cx = hl * 0.3;
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

export function PoolModel() {
  const { shape, length, width, depth, interiorMaterial, deckMaterial, waterColor } = usePoolStore();

  const scale = 0.5;
  const sl = length * scale;
  const sw = width * scale;
  const sd = depth * scale * 0.4;
  const deckWidth = 0.8;

  const poolShape = useMemo(() => createPoolShape(shape, sl, sw), [shape, sl, sw]);
  const deckShape = useMemo(() => createPoolShape(shape, sl + deckWidth * 2, sw + deckWidth * 2), [shape, sl, sw]);

  const poolGeo = useMemo(() => {
    const extrudeSettings = { depth: sd, bevelEnabled: false };
    return new THREE.ExtrudeGeometry(poolShape, extrudeSettings);
  }, [poolShape, sd]);

  const deckGeo = useMemo(() => {
    const extrudeSettings = { depth: 0.3, bevelEnabled: false };
    return new THREE.ExtrudeGeometry(deckShape, extrudeSettings);
  }, [deckShape]);

  return (
    <group position={[0, 0, 0]}>
      {/* Deck */}
      <mesh geometry={deckGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow castShadow>
        <meshStandardMaterial color={DECK_COLORS[deckMaterial]} roughness={0.7} />
      </mesh>

      {/* Pool interior (walls) */}
      <mesh geometry={poolGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <meshStandardMaterial color={INTERIOR_COLORS[interiorMaterial]} roughness={0.4} side={THREE.BackSide} />
      </mesh>

      {/* Water surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, sd * 0.7, 0]}>
        <shapeGeometry args={[poolShape]} />
        <meshPhysicalMaterial
          color={WATER_COLORS[waterColor]}
          transparent
          opacity={0.75}
          roughness={0.05}
          metalness={0.1}
          transmission={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </group>
  );
}
