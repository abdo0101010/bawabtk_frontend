import { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree, type ThreeElements } from '@react-three/fiber';
import { Float, Text, Edges } from '@react-three/drei';
import * as THREE from 'three';

/* ============ Interactive Virtual Student Dashboard Screen ============ */

interface MiniCourse {
  title: string;
  progress: number;
  cta: string;
}

const COURSES_3D: MiniCourse[] = [
  { title: 'الفيزياء الحديثة', progress: 72, cta: 'متابعة' },
  { title: 'الكيمياء العضوية', progress: 45, cta: 'ابدأ الآن' },
];

function VirtualDashboard({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const screenMat = useRef<THREE.MeshStandardMaterial>(null);
  const playPulse = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!group.current) return;
    const tx = mouse.current.y * 0.4;
    const ty = mouse.current.x * 0.6;
    group.current.rotation.x += (tx - group.current.rotation.x) * 0.05;
    group.current.rotation.y += (ty - group.current.rotation.y) * 0.05;

    // Subtle screen glow pulse
    if (screenMat.current) {
      screenMat.current.emissiveIntensity = 0.22 + Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
    }
    // Play button pulse
    if (playPulse.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.08;
      playPulse.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35}>
        {/* Screen body — dark emerald glass */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.2, 2.4, 0.1]} />
          <meshStandardMaterial
            ref={screenMat}
            color="#0E3A24"
            metalness={0.8}
            roughness={0.2}
            emissive="#1E5E3A"
            emissiveIntensity={0.25}
            transparent
            opacity={0.97}
          />
          <Edges color="#D97706" threshold={15} />
        </mesh>

        {/* Gold bezel */}
        <mesh position={[0, 0, 0.052]}>
          <ringGeometry args={[0, 0, 4]} />
          <meshBasicMaterial color="#D97706" transparent opacity={0} />
        </mesh>

        {/* Header bar */}
        <mesh position={[0, 0.98, 0.052]}>
          <planeGeometry args={[3.0, 0.4]} />
          <meshStandardMaterial color="#0A2617" metalness={0.6} roughness={0.3} emissive="#0E3A24" emissiveIntensity={0.3} />
        </mesh>
        <Text position={[0, 0.98, 0.06]} fontSize={0.18} color="#F4F5F0" anchorX="center" anchorY="middle">
          كورساتي
        </Text>
        {/* Online status dot */}
        <mesh position={[-1.3, 0.98, 0.06]}>
          <circleGeometry args={[0.05, 16]} />
          <meshBasicMaterial color="#2C7A4F" />
        </mesh>
        <Text position={[-1.15, 0.98, 0.06]} fontSize={0.1} color="#2C7A4F" anchorX="center" anchorY="middle">
          أونلاين
        </Text>

        {/* Course mini cards */}
        {COURSES_3D.map((c, i) => {
          const y = 0.35 - i * 0.75;
          const barWidth = (c.progress / 100) * 2.4;
          return (
            <group key={i} position={[0, y, 0.052]}>
              {/* Card bg */}
              <mesh position={[0, 0, 0]}>
                <planeGeometry args={[2.8, 0.55]} />
                <meshStandardMaterial color="#1E5E3A" metalness={0.4} roughness={0.5} emissive="#2C7A4F" emissiveIntensity={0.12} transparent opacity={0.9} />
              </mesh>
              {/* Course title */}
              <Text position={[-0.2, 0.12, 0.01]} fontSize={0.13} color="#F4F5F0" anchorX="center" anchorY="middle">
                {c.title}
              </Text>
              {/* Progress label */}
              <Text position={[1.15, 0.12, 0.01]} fontSize={0.11} color="#F6B452" anchorX="center" anchorY="middle">
                {`${c.progress}%`}
              </Text>
              {/* Progress track */}
              <mesh position={[-0.2, -0.12, 0.01]}>
                <planeGeometry args={[2.4, 0.07]} />
                <meshBasicMaterial color="#0A2617" />
              </mesh>
              {/* Progress fill */}
              <mesh position={[-0.2 + (barWidth - 2.4) / 2, -0.12, 0.02]}>
                <planeGeometry args={[barWidth, 0.07]} />
                <meshBasicMaterial color="#2C7A4F" />
              </mesh>
              {/* CTA button */}
              <mesh position={[1.05, -0.12, 0.02]}>
                <planeGeometry args={[0.55, 0.16]} />
                <meshStandardMaterial color="#0E3A24" emissive="#2C7A4F" emissiveIntensity={0.4} metalness={0.6} roughness={0.3} />
              </mesh>
              <Text position={[1.05, -0.12, 0.03]} fontSize={0.08} color="#F4F5F0" anchorX="center" anchorY="middle">
                {c.cta}
              </Text>
            </group>
          );
        })}

        {/* Video lesson card with play button */}
        <group position={[-0.85, -1.15, 0.052]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[1.3, 0.5]} />
            <meshStandardMaterial color="#0A2617" metalness={0.5} roughness={0.4} emissive="#1E5E3A" emissiveIntensity={0.2} />
          </mesh>
          {/* Play button circle */}
          <mesh ref={playPulse} position={[-0.45, 0, 0.02]}>
            <circleGeometry args={[0.12, 24]} />
            <meshStandardMaterial color="#D97706" emissive="#D97706" emissiveIntensity={0.6} metalness={0.5} roughness={0.3} />
          </mesh>
          {/* Play triangle */}
          <mesh position={[-0.43, 0, 0.03]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.06, 0.1, 3]} />
            <meshBasicMaterial color="#F4F5F0" />
          </mesh>
          <Text position={[0.15, 0.05, 0.02]} fontSize={0.08} color="#F4F5F0" anchorX="center" anchorY="middle">
            تشغيل الدرس
          </Text>
          <Text position={[0.15, -0.1, 0.02]} fontSize={0.06} color="#9FB8A6" anchorX="center" anchorY="middle">
            24:15
          </Text>
        </group>

        {/* Sound wave bars */}
        <group position={[0.6, -1.15, 0.052]}>
          {Array.from({ length: 9 }).map((_, i) => (
            <SoundBar key={i} index={i} />
          ))}
        </group>

        {/* PDF document icon */}
        <group position={[1.25, -1.15, 0.052]}>
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.28, 0.36, 0.02]} />
            <meshStandardMaterial color="#F4F5F0" metalness={0.1} roughness={0.6} />
          </mesh>
          <mesh position={[0.08, 0.16, 0.015]} rotation={[0, 0, 0.1]}>
            <planeGeometry args={[0.12, 0.12]} />
            <meshBasicMaterial color="#0E3A24" />
          </mesh>
          <Text position={[0, -0.02, 0.02]} fontSize={0.07} color="#D97706" anchorX="center" anchorY="middle" rotation={[0, 0, 0.1]}>
            PDF
          </Text>
        </group>
      </Float>
    </group>
  );
}

function SoundBar({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const h = 0.1 + Math.abs(Math.sin(state.clock.elapsedTime * 4 + index * 0.5)) * 0.25;
      ref.current.scale.y = h / 0.1;
    }
  });
  return (
    <mesh ref={ref} position={[-0.32 + index * 0.08, 0, 0.01]}>
      <planeGeometry args={[0.04, 0.1]} />
      <meshBasicMaterial color={index % 2 === 0 ? '#2C7A4F' : '#F6B452'} />
    </mesh>
  );
}

/* ============ Gamified Achievement Assets ============ */

function AchievementStar({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z = state.clock.elapsedTime * 0.6;
      const s = hovered ? 1.3 : 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      mesh.current.scale.set(s, s, s);
    }
  });
  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh
          ref={mesh}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color="#D97706" emissive="#D97706" emissiveIntensity={hovered ? 0.9 : 0.5} metalness={0.8} roughness={0.15} flatShading />
          <Edges color="#F6B452" threshold={15} />
        </mesh>
        {hovered && (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshBasicMaterial color="#F6B452" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
          </mesh>
        )}
      </Float>
    </group>
  );
}

function CheckMark({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.5;
  });
  return (
    <group ref={group} position={position}>
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Badge circle */}
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 24]} />
          <meshStandardMaterial color="#2C7A4F" emissive="#2C7A4F" emissiveIntensity={0.4} metalness={0.6} roughness={0.3} />
          <Edges color="#F6B452" threshold={15} />
        </mesh>
        {/* Check mark (two boxes forming a V) */}
        <mesh position={[-0.05, -0.05, 0.04]} rotation={[0, 0, 0.6]}>
          <boxGeometry args={[0.04, 0.12, 0.02]} />
          <meshBasicMaterial color="#F4F5F0" />
        </mesh>
        <mesh position={[0.06, 0.02, 0.04]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.04, 0.2, 0.02]} />
          <meshBasicMaterial color="#F4F5F0" />
        </mesh>
      </Float>
    </group>
  );
}

function OnlineTag({ position }: { position: [number, number, number] }) {
  const dot = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (dot.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
      dot.current.scale.set(s, s, s);
    }
  });
  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
        <mesh>
          <planeGeometry args={[0.7, 0.22]} />
          <meshStandardMaterial color="#2C7A4F" emissive="#2C7A4F" emissiveIntensity={0.35} metalness={0.5} roughness={0.4} transparent opacity={0.9} />
        </mesh>
        <mesh ref={dot} position={[-0.25, 0, 0.01]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#F4F5F0" />
        </mesh>
        <Text position={[0.05, 0, 0.02]} fontSize={0.08} color="#F4F5F0" anchorX="center" anchorY="middle">
          أونلاين
        </Text>
      </Float>
    </group>
  );
}

/* ============ Educational Science Meshes ============ */

function DNAHelix({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const spheres = useMemo(() => {
    const arr: { y: number; offset: number }[] = [];
    for (let i = 0; i < 14; i++) {
      arr.push({ y: -0.7 + i * 0.1, offset: i * 0.45 });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.4;
  });

  return (
    <group ref={group} position={position}>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
        {spheres.map((s, i) => {
          const x1 = Math.cos(s.offset) * 0.2;
          const z1 = Math.sin(s.offset) * 0.2;
          const x2 = -x1;
          const z2 = -z1;
          return (
            <group key={i}>
              <mesh position={[x1, s.y, z1]}>
                <sphereGeometry args={[0.045, 12, 12]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#2C7A4F' : '#D97706'} emissive={i % 2 === 0 ? '#2C7A4F' : '#D97706'} emissiveIntensity={0.5} />
              </mesh>
              <mesh position={[x2, s.y, z2]}>
                <sphereGeometry args={[0.045, 12, 12]} />
                <meshStandardMaterial color={i % 2 === 0 ? '#D97706' : '#2C7A4F'} emissive={i % 2 === 0 ? '#D97706' : '#2C7A4F'} emissiveIntensity={0.5} />
              </mesh>
              {/* Connection rung */}
              {i % 2 === 0 && (
                <mesh position={[0, s.y, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.008, 0.008, 0.4, 8]} />
                  <meshBasicMaterial color="#F6B452" transparent opacity={0.5} />
                </mesh>
              )}
            </group>
          );
        })}
      </Float>
    </group>
  );
}

function AtomOrbital({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.5;
      group.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });
  return (
    <group ref={group} position={position}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.7}>
        <mesh>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#D97706" emissive="#D97706" emissiveIntensity={0.5} metalness={0.7} roughness={0.2} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[i * 1.05, i * 0.7, 0]}>
            <torusGeometry args={[0.42, 0.01, 8, 48]} />
            <meshStandardMaterial color="#2C7A4F" emissive="#2C7A4F" emissiveIntensity={0.4} metalness={0.6} roughness={0.3} />
          </mesh>
        ))}
        {[0, 1, 2].map((i) => {
          const angle = (i / 3) * Math.PI * 2;
          return (
            <mesh key={`e-${i}`} position={[Math.cos(angle) * 0.42, 0, Math.sin(angle) * 0.42]} rotation={[i * 1.05, i * 0.7, 0]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#F6B452" emissive="#F6B452" emissiveIntensity={0.8} />
            </mesh>
          );
        })}
      </Float>
    </group>
  );
}

function IcosahedronShape({ position }: { position: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.3;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.35} floatIntensity={0.55} position={position}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#0E3A24" metalness={0.8} roughness={0.15} emissive="#1E5E3A" emissiveIntensity={0.2} flatShading transparent opacity={0.85} />
        <Edges color="#F6B452" threshold={15} />
      </mesh>
    </Float>
  );
}

function GraduationCap({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.4;
  });
  return (
    <group ref={group} position={position}>
      <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.6, 0.04, 0.6]} />
          <meshStandardMaterial color="#0E3A24" metalness={0.7} roughness={0.25} emissive="#1E5E3A" emissiveIntensity={0.15} />
          <Edges color="#D97706" threshold={15} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.15, 0.19, 0.19, 16]} />
          <meshStandardMaterial color="#1E5E3A" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0.27, -0.04, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#D97706" emissive="#D97706" emissiveIntensity={0.4} />
        </mesh>
      </Float>
    </group>
  );
}

/* ============ Interactive Particle Network ============ */

function ParticleNetwork({ count = 50 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { viewport, pointer } = useThree();
  const hoverGlow = useRef(0);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#2C7A4F'),
      new THREE.Color('#D97706'),
      new THREE.Color('#1E5E3A'),
      new THREE.Color('#F6B452'),
    ];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * viewport.width * 1.4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 1.4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [count, viewport.width, viewport.height]);

  const velocities = useMemo(() => {
    const v = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      v[i * 3] = (Math.random() - 0.5) * 0.003;
      v[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      v[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return v;
  }, [count]);

  useFrame(() => {
    if (!points.current || !linesRef.current) return;

    // Increase glow when pointer is active (hovering)
    const targetGlow = Math.abs(pointer.x) > 0.01 || Math.abs(pointer.y) > 0.01 ? 1 : 0;
    hoverGlow.current += (targetGlow - hoverGlow.current) * 0.08;

    const geom = points.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];

      if (Math.abs(pos[i * 3]) > viewport.width * 0.7) velocities[i * 3] *= -1;
      if (Math.abs(pos[i * 3 + 1]) > viewport.height * 0.7) velocities[i * 3 + 1] *= -1;
      if (Math.abs(pos[i * 3 + 2]) > 3) velocities[i * 3 + 2] *= -1;
    }
    posAttr.needsUpdate = true;

    const linePositions: number[] = [];
    const lineColors: number[] = [];
    const maxDist = 2.2 + hoverGlow.current * 0.6;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * (0.4 + hoverGlow.current * 0.6);
          linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
          lineColors.push(0.17 * alpha, 0.48 * alpha, 0.31 * alpha, 0.85 * alpha, 0.55 * alpha, 0.02 * alpha);
        }
      }
    }
    const lineGeom = linesRef.current.geometry;
    lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeom.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
    lineGeom.attributes.position.needsUpdate = true;
    lineGeom.attributes.color.needsUpdate = true;

    // Pulse point size on hover
    const pMat = points.current.material as THREE.PointsMaterial;
    pMat.size = 0.07 + hoverGlow.current * 0.04;
    pMat.opacity = 0.8 + hoverGlow.current * 0.2;
  });

  return (
    <>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.07} vertexColors transparent opacity={0.8} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </>
  );
}

/* ============ Mouse tracker ============ */

function MouseTracker({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const { gl } = useThree();
  useFrame(() => {
    const canvas = gl.domElement;
    canvas.onmousemove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    canvas.onmouseleave = () => {
      mouse.current.x = 0;
      mouse.current.y = 0;
    };
  });
  return null;
}

/* ============ Scene composition ============ */

function Scene({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} color="#F4F5F0" />
      <pointLight position={[-4, 2, 2]} intensity={1.5} color="#2C7A4F" />
      <pointLight position={[4, -2, 3]} intensity={1} color="#D97706" />
      <spotLight position={[0, 0, 6]} intensity={0.8} angle={0.6} penumbra={1} color="#F6B452" />

      <MouseTracker mouse={mouse} />

      {/* Background particle network — interactive */}
      <ParticleNetwork count={50} />

      {/* Central virtual dashboard */}
      <VirtualDashboard mouse={mouse} />

      {/* Gamified achievement assets */}
      <AchievementStar position={[2.6, 1.5, -0.5]} />
      <AchievementStar position={[-2.8, -1.2, -0.8]} />
      <CheckMark position={[2.4, -0.8, -0.3]} />
      <OnlineTag position={[-2.5, 1.8, -0.5]} />

      {/* Educational science meshes */}
      <DNAHelix position={[-3.0, 0.3, -1]} />
      <AtomOrbital position={[3.0, -0.2, -1.2]} />
      <IcosahedronShape position={[2.2, 1.9, -1.5]} />
      <GraduationCap position={[-2.3, -1.8, -1]} />
    </>
  );
}

/* ============ Exported canvas wrapper ============ */

export function Hero3DScene({ className = '' }: { className?: string }) {
  const mouse = useRef({ x: 0, y: 0 });

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 50 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <Scene mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export type { ThreeElements };
