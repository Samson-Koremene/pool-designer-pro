import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePoolStore } from '@/store/usePoolStore';
import * as THREE from 'three';

// ─── Existing models ───────────────────────────────────────────────────────────

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
      {([[-0.25, 0], [0.25, 0], [-0.25, -0.5], [0.25, -0.5]] as [number, number][]).map(([x, z], i) => (
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

// ─── New models ────────────────────────────────────────────────────────────────

/** Animated waterfall: rock base + cascading water sheet */
function Waterfall({ position }: { position: [number, number, number] }) {
  const waterRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!waterRef.current) return;
    // Scroll the UV offset to simulate flowing water
    const mat = waterRef.current.material as THREE.MeshPhysicalMaterial;
    if (mat.map) {
      mat.map.offset.y = (clock.getElapsedTime() * 0.6) % 1;
    }
    // Gentle opacity pulse
    mat.opacity = 0.65 + Math.sin(clock.getElapsedTime() * 3) * 0.08;
  });

  return (
    <group position={position}>
      {/* Rock base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 1.0, 1.2]} />
        <meshStandardMaterial color="#7a7060" roughness={0.9} />
      </mesh>
      {/* Top cap rock */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[2.2, 0.3, 1.0]} />
        <meshStandardMaterial color="#6b6050" roughness={0.95} />
      </mesh>
      {/* Water sheet */}
      <mesh ref={waterRef} position={[0, 0.5, 0.62]}>
        <planeGeometry args={[2.0, 1.0, 1, 8]} />
        <meshPhysicalMaterial
          color="#7ec8e3"
          transparent
          opacity={0.7}
          roughness={0.1}
          transmission={0.4}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Splash pool */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 1.1]}>
        <circleGeometry args={[1.0, 16]} />
        <meshPhysicalMaterial color="#7ec8e3" transparent opacity={0.5} roughness={0.05} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Decorative fence panel */
function FencePanel({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const posts = [-0.9, -0.3, 0.3, 0.9];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Rails */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[2.0, 0.08, 0.08]} />
        <meshStandardMaterial color="#c8b89a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[2.0, 0.08, 0.08]} />
        <meshStandardMaterial color="#c8b89a" roughness={0.8} />
      </mesh>
      {/* Pickets */}
      {posts.map((x, i) => (
        <mesh key={i} position={[x, 0.6, 0]} castShadow>
          <boxGeometry args={[0.08, 1.2, 0.08]} />
          <meshStandardMaterial color="#d4c4a8" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/** BBQ grill with glowing coals */
function BBQGrill({ position }: { position: [number, number, number] }) {
  const coalRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (!coalRef.current) return;
    const mat = coalRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.6 + Math.sin(clock.getElapsedTime() * 2.5) * 0.3;
  });

  return (
    <group position={position}>
      {/* Bowl */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#222" roughness={0.3} metalness={0.7} side={THREE.BackSide} />
      </mesh>
      {/* Lid */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <sphereGeometry args={[0.52, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Glowing coals */}
      <mesh ref={coalRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.72, 0]}>
        <circleGeometry args={[0.42, 16]} />
        <meshStandardMaterial color="#ff4500" emissive="#ff2200" emissiveIntensity={0.8} roughness={1} />
      </mesh>
      {/* Legs */}
      {([[-0.3, -0.3], [0.3, -0.3], [0, 0.38]] as [number, number][]).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.3, z]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.6]} />
          <meshStandardMaterial color="#555" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      {/* Grill grate */}
      {([-0.3, -0.1, 0.1, 0.3] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.74, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.04, 0.02, 0.8]} />
          <meshStandardMaterial color="#666" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/** Flower bed: low planter box with colourful blooms */
function FlowerBed({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const blooms: { x: number; z: number; color: string }[] = [
    { x: -0.5, z: 0, color: '#ff6b9d' },
    { x: -0.15, z: 0.1, color: '#ffcc00' },
    { x: 0.2, z: -0.05, color: '#ff4444' },
    { x: 0.5, z: 0.08, color: '#cc44ff' },
    { x: 0.05, z: -0.15, color: '#ff9944' },
  ];

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Planter box */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.2, 0.5]} />
        <meshStandardMaterial color="#8b6f47" roughness={0.9} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.21, 0]}>
        <boxGeometry args={[1.3, 0.02, 0.4]} />
        <meshStandardMaterial color="#3d2b1f" roughness={1} />
      </mesh>
      {/* Stems */}
      {blooms.map((b, i) => (
        <mesh key={i} position={[b.x, 0.45, b.z]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.45]} />
          <meshStandardMaterial color="#3a7d44" roughness={0.8} />
        </mesh>
      ))}
      {/* Blooms */}
      {blooms.map((b, i) => (
        <mesh key={i} position={[b.x, 0.72, b.z]} castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={b.color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/** Pergola: 4 posts + cross beams + slatted roof */
function Pergola({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const posts: [number, number][] = [[-1.8, -1.2], [1.8, -1.2], [-1.8, 1.2], [1.8, 1.2]];
  const slats = [-1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Posts */}
      {posts.map(([x, z], i) => (
        <mesh key={i} position={[x, 1.5, z]} castShadow>
          <boxGeometry args={[0.15, 3.0, 0.15]} />
          <meshStandardMaterial color="#c8a96e" roughness={0.85} />
        </mesh>
      ))}
      {/* Long beams */}
      <mesh position={[0, 3.05, -1.2]} castShadow>
        <boxGeometry args={[3.8, 0.15, 0.15]} />
        <meshStandardMaterial color="#b8945a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 3.05, 1.2]} castShadow>
        <boxGeometry args={[3.8, 0.15, 0.15]} />
        <meshStandardMaterial color="#b8945a" roughness={0.85} />
      </mesh>
      {/* Roof slats */}
      {slats.map((x, i) => (
        <mesh key={i} position={[x, 3.2, 0]} castShadow>
          <boxGeometry args={[0.1, 0.08, 2.6]} />
          <meshStandardMaterial color="#c8a96e" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/** Pool slide: curved ramp + ladder */
function PoolSlide({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Support tower */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.8, 3.0, 0.8]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.6} />
      </mesh>
      {/* Slide chute — angled box approximation */}
      <mesh position={[0.6, 1.2, 1.2]} rotation={[0.5, 0, -0.15]} castShadow>
        <boxGeometry args={[0.7, 0.12, 3.2]} />
        <meshStandardMaterial color="#e05050" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Side rails */}
      <mesh position={[0.95, 1.4, 1.2]} rotation={[0.5, 0, -0.15]} castShadow>
        <boxGeometry args={[0.06, 0.3, 3.2]} />
        <meshStandardMaterial color="#cc3030" roughness={0.4} />
      </mesh>
      <mesh position={[0.25, 1.4, 1.2]} rotation={[0.5, 0, -0.15]} castShadow>
        <boxGeometry args={[0.06, 0.3, 3.2]} />
        <meshStandardMaterial color="#cc3030" roughness={0.4} />
      </mesh>
      {/* Ladder rungs */}
      {[0.4, 0.9, 1.4, 1.9, 2.4].map((y, i) => (
        <mesh key={i} position={[-0.5, y, -0.1]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.05]} />
          <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/** Diving board: platform + springboard */
function DivingBoard({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const boardRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (!boardRef.current) return;
    boardRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 2.5) * 0.04;
  });
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Platform */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.2, 1.2]} />
        <meshStandardMaterial color="#d0cfc8" roughness={0.7} />
      </mesh>
      {/* Support legs */}
      {([[-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45], [0.45, 0.45]] as [number,number][]).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.3, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.6]} />
          <meshStandardMaterial color="#aaa" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* Springboard */}
      <mesh ref={boardRef} position={[0, 0.72, 1.3]} castShadow>
        <boxGeometry args={[0.6, 0.06, 2.4]} />
        <meshStandardMaterial color="#4a90d9" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Non-slip strips */}
      {[-0.8, -0.3, 0.2, 0.7, 1.2].map((z, i) => (
        <mesh key={i} position={[0, 0.76, 1.3 + z]} castShadow>
          <boxGeometry args={[0.6, 0.02, 0.06]} />
          <meshStandardMaterial color="#2a5a99" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** Animated fountain: basin + central jet */
function Fountain({ position }: { position: [number, number, number] }) {
  const jetRef = useRef<THREE.Mesh>(null!);
  const dropRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (jetRef.current) {
      jetRef.current.scale.y = 0.85 + Math.sin(t * 3) * 0.15;
    }
    dropRefs.current.forEach((m, i) => {
      if (!m) return;
      const phase = (t * 1.2 + i * 0.7) % 1;
      m.position.y = 0.3 + phase * 1.8;
      m.position.x = Math.sin(i * 1.3) * phase * 0.6;
      m.position.z = Math.cos(i * 1.3) * phase * 0.6;
      (m.material as THREE.MeshPhysicalMaterial).opacity = 1 - phase;
    });
  });

  return (
    <group position={position}>
      {/* Basin */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <ringGeometry args={[0.6, 1.4, 32]} />
        <meshStandardMaterial color="#c8c0b0" roughness={0.7} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <circleGeometry args={[0.6, 32]} />
        <meshPhysicalMaterial color="#7ec8e3" transparent opacity={0.7} roughness={0.05} depthWrite={false} />
      </mesh>
      {/* Central pillar */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.8, 12]} />
        <meshStandardMaterial color="#b0a898" roughness={0.6} />
      </mesh>
      {/* Water jet */}
      <mesh ref={jetRef} position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.04, 0.08, 0.8, 8]} />
        <meshPhysicalMaterial color="#a8dff0" transparent opacity={0.75} roughness={0.05} depthWrite={false} />
      </mesh>
      {/* Droplets */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) dropRefs.current[i] = el; }}
          position={[0, 0.3, 0]}
        >
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshPhysicalMaterial color="#7ec8e3" transparent opacity={0.8} roughness={0.05} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Fire pit with animated flame */
function FirePit({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (flameRef.current) {
      flameRef.current.scale.x = 0.8 + Math.sin(t * 7) * 0.2;
      flameRef.current.scale.y = 0.9 + Math.sin(t * 5 + 1) * 0.15;
      flameRef.current.position.y = 0.55 + Math.sin(t * 6) * 0.05;
    }
    if (glowRef.current) {
      glowRef.current.intensity = 1.8 + Math.sin(t * 8) * 0.6;
    }
  });

  return (
    <group position={position}>
      {/* Stone ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow castShadow>
        <ringGeometry args={[0.45, 0.7, 16]} />
        <meshStandardMaterial color="#7a6a5a" roughness={0.95} />
      </mesh>
      {/* Ash bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <circleGeometry args={[0.44, 16]} />
        <meshStandardMaterial color="#3a3530" roughness={1} />
      </mesh>
      {/* Logs */}
      <mesh position={[0, 0.12, 0]} rotation={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.8, 8]} />
        <meshStandardMaterial color="#4a3020" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.8, 8]} />
        <meshStandardMaterial color="#3e2818" roughness={0.95} />
      </mesh>
      {/* Flame */}
      <mesh ref={flameRef} position={[0, 0.55, 0]}>
        <coneGeometry args={[0.2, 0.6, 8]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={1.2} transparent opacity={0.85} depthWrite={false} />
      </mesh>
      {/* Inner flame */}
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[0.1, 0.4, 8]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffaa00" emissiveIntensity={1.5} transparent opacity={0.9} depthWrite={false} />
      </mesh>
      <pointLight ref={glowRef} position={[0, 0.8, 0]} intensity={2} distance={6} color="#ff6600" />
    </group>
  );
}

/** Outdoor bar: counter + stools + bottles */
function OutdoorBar({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const bottleColors = ['#2d6b3f', '#8b1a1a', '#c8a020', '#1a3a6b'];
  const stoolPositions: number[] = [-1.2, -0.6, 0, 0.6, 1.2];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Counter */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.12, 0.8]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.7} />
      </mesh>
      {/* Counter body */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[3.0, 0.9, 0.75]} />
        <meshStandardMaterial color="#7a5030" roughness={0.8} />
      </mesh>
      {/* Back shelf */}
      <mesh position={[0, 1.5, -0.3]} castShadow>
        <boxGeometry args={[2.8, 0.08, 0.3]} />
        <meshStandardMaterial color="#5c3a1e" roughness={0.7} />
      </mesh>
      {/* Bottles on shelf */}
      {bottleColors.map((color, i) => (
        <mesh key={i} position={[-1.0 + i * 0.65, 1.75, -0.3]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.5, 8]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} transparent opacity={0.85} />
        </mesh>
      ))}
      {/* Stools */}
      {stoolPositions.map((x, i) => (
        <group key={i} position={[x, 0, 0.9]}>
          <mesh position={[0, 0.55, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.06, 12]} />
            <meshStandardMaterial color="#2a1a0a" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.28, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.56, 6]} />
            <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
          </mesh>
          {([[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]] as [number,number][]).map(([lx, lz], j) => (
            <mesh key={j} position={[lx, 0.1, lz]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.2, 6]} />
              <meshStandardMaterial color="#777" metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

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

      {addOns.includes('waterfall') && (
        <>
          <Waterfall position={[0, 0, -9]} />
          <Waterfall position={[8, 0, 0]} />
        </>
      )}

      {addOns.includes('fence') && (
        <>
          <FencePanel position={[-6, 0, -11]} />
          <FencePanel position={[-4, 0, -11]} />
          <FencePanel position={[-2, 0, -11]} />
          <FencePanel position={[0, 0, -11]} />
          <FencePanel position={[2, 0, -11]} />
          <FencePanel position={[4, 0, -11]} />
          <FencePanel position={[6, 0, -11]} />
          <FencePanel position={[-11, 0, -6]} rotation={Math.PI / 2} />
          <FencePanel position={[-11, 0, -4]} rotation={Math.PI / 2} />
          <FencePanel position={[-11, 0, -2]} rotation={Math.PI / 2} />
          <FencePanel position={[-11, 0, 0]} rotation={Math.PI / 2} />
          <FencePanel position={[-11, 0, 2]} rotation={Math.PI / 2} />
          <FencePanel position={[-11, 0, 4]} rotation={Math.PI / 2} />
          <FencePanel position={[-11, 0, 6]} rotation={Math.PI / 2} />
        </>
      )}

      {addOns.includes('bbq') && (
        <>
          <BBQGrill position={[10, 0, 4]} />
          <BBQGrill position={[10, 0, 7]} />
        </>
      )}

      {addOns.includes('flowers') && (
        <>
          <FlowerBed position={[-7, 0, -10]} />
          <FlowerBed position={[-4, 0, -10]} rotation={0.1} />
          <FlowerBed position={[-1, 0, -10]} />
          <FlowerBed position={[2, 0, -10]} rotation={-0.1} />
          <FlowerBed position={[5, 0, -10]} />
        </>
      )}

      {addOns.includes('pergola') && (
        <>
          <Pergola position={[-14, 0, 0]} />
          <Pergola position={[14, 0, 0]} rotation={Math.PI / 2} />
        </>
      )}

      {addOns.includes('slide') && (
        <PoolSlide position={[-7, 0, -6]} />
      )}

      {addOns.includes('divingboard') && (
        <DivingBoard position={[7, 0, -6]} rotation={Math.PI} />
      )}

      {addOns.includes('fountain') && (
        <>
          <Fountain position={[-13, 0, -10]} />
          <Fountain position={[13, 0, -10]} />
        </>
      )}

      {addOns.includes('firepit') && (
        <>
          <FirePit position={[-11, 0, 8]} />
          <FirePit position={[11, 0, 8]} />
        </>
      )}

      {addOns.includes('bar') && (
        <OutdoorBar position={[0, 0, 14]} />
      )}
    </group>
  );
}
