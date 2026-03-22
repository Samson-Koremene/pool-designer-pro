import { usePoolStore } from '@/store/usePoolStore';

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <coneGeometry args={[1.2, 2.5, 8]} />
        <meshStandardMaterial color="#2d6b3f" />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.6]} />
        <meshStandardMaterial color="#5c3a1e" />
      </mesh>
    </group>
  );
}

function LoungeChair({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.05, 1.5]} />
        <meshStandardMaterial color="#f5f0e8" />
      </mesh>
      <mesh position={[0, 0.55, -0.6]} castShadow rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[0.6, 0.05, 0.7]} />
        <meshStandardMaterial color="#f5f0e8" />
      </mesh>
      {[[-0.25, 0], [0.25, 0], [-0.25, -0.5], [0.25, -0.5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.1, z]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.2]} />
          <meshStandardMaterial color="#888" />
        </mesh>
      ))}
    </group>
  );
}

function Umbrella({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.8, 0]} castShadow>
        <coneGeometry args={[1.5, 0.6, 8]} />
        <meshStandardMaterial color="#e05050" />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.8]} />
        <meshStandardMaterial color="#aaa" />
      </mesh>
    </group>
  );
}

function PoolLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <pointLight intensity={2} distance={8} color="#ffe4a0" position={[0, 1.5, 0]} />
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="#fff8dc" emissive="#ffe4a0" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 1.5]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

export function PoolAddOns() {
  const addOns = usePoolStore((s) => s.addOns);

  return (
    <group>
      {addOns.includes('trees') && (
        <>
          <Tree position={[-10, 0, -8]} />
          <Tree position={[10, 0, -7]} />
          <Tree position={[-9, 0, 8]} />
          <Tree position={[12, 0, 6]} />
        </>
      )}
      {addOns.includes('chairs') && (
        <>
          <LoungeChair position={[8, 0, -4]} rotation={-0.8} />
          <LoungeChair position={[8, 0, -2]} rotation={-0.8} />
          <LoungeChair position={[-8, 0, 3]} rotation={0.8} />
        </>
      )}
      {addOns.includes('umbrella') && (
        <>
          <Umbrella position={[8, 0, -3]} />
          <Umbrella position={[-8, 0, 3]} />
        </>
      )}
      {addOns.includes('lights') && (
        <>
          <PoolLight position={[6, 0, 6]} />
          <PoolLight position={[-6, 0, 6]} />
          <PoolLight position={[6, 0, -6]} />
          <PoolLight position={[-6, 0, -6]} />
        </>
      )}
    </group>
  );
}
