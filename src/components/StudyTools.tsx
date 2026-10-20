import { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Edges, Float } from '@react-three/drei';
import * as THREE from 'three';
import {
  Play,
  Lock,
  CheckCircle2,
  RotateCw,
  Plus,
  X,
  Clock,
  Bookmark,
  Timer,
  Coffee,
  Pause,
  Users,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Brain,
  Layers,
  Map as MapIcon,
  StickyNote,
} from 'lucide-react';
import type { Course, Lesson, Flashcard, MindMapNode } from '@/lib/data';

/* ============================================================
   1. 3D Course Journey Map ("خريطة رحلة الكورس")
   ============================================================ */

interface JourneyNodeData {
  lesson: Lesson;
  index: number;
  status: 'completed' | 'active' | 'locked';
}

function JourneyNode({
  data,
  position,
  onClick,
  isHovered,
  onHover,
}: {
  data: JourneyNodeData;
  position: [number, number, number];
  onClick: () => void;
  isHovered: boolean;
  onHover: (h: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const color = data.status === 'completed' ? '#2C7A4F' : data.status === 'active' ? '#D97706' : '#3a4a40';
  const emissive = data.status === 'completed' ? '#2C7A4F' : data.status === 'active' ? '#D97706' : '#000000';

  useFrame((state) => {
    if (data.status === 'active' && meshRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.12;
      meshRef.current.scale.set(s, s, s);
    }
    if (ringRef.current && data.status !== 'locked') {
      ringRef.current.rotation.z = state.clock.elapsedTime * (data.status === 'active' ? 1.5 : 0.5);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); if (data.status !== 'locked') onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover(true); document.body.style.cursor = data.status === 'locked' ? 'not-allowed' : 'pointer'; }}
        onPointerOut={() => { onHover(false); document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={data.status === 'completed' ? 0.5 : data.status === 'active' ? 0.7 : 0.1}
          metalness={0.7}
          roughness={0.25}
        />
        {data.status !== 'locked' && <Edges color={data.status === 'active' ? '#F6B452' : '#F4F5F0'} threshold={15} />}
      </mesh>

      {/* Orbiting ring for active/completed */}
      {data.status !== 'locked' && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.015, 8, 32]} />
          <meshBasicMaterial color={data.status === 'active' ? '#F6B452' : '#2C7A4F'} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Hover label */}
      {isHovered && (
        <Text position={[0, 0.75, 0]} fontSize={0.18} color="#F4F5F0" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#0E3A24">
          {data.lesson.title}
        </Text>
      )}

      {/* Status icon text */}
      <Text position={[0, -0.55, 0]} fontSize={0.12} color={data.status === 'completed' ? '#2C7A4F' : data.status === 'active' ? '#F6B452' : '#5a6a60'} anchorX="center" anchorY="middle">
        {data.status === 'completed' ? '✓' : data.status === 'active' ? '●' : '🔒'}
      </Text>
    </group>
  );
}

function JourneyPath({ nodes }: { nodes: JourneyNodeData[] }) {
  const points = useMemo(() => {
    return nodes.map((_, i) => {
      const total = nodes.length;
      const angle = (i / Math.max(total - 1, 1)) * Math.PI * 1.6 - Math.PI * 0.8;
      const radius = 3;
      return [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.5, 0] as [number, number, number];
    });
  }, [nodes]);

  const lineGeometry = useMemo(() => {
    const linePts = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      linePts[i * 3] = p[0];
      linePts[i * 3 + 1] = p[1];
      linePts[i * 3 + 2] = p[2];
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(linePts, 3));
    return geo;
  }, [points]);

  return (
    <>
      {/* Path line */}
      <line>
        <primitive object={lineGeometry} attach="geometry" />
        <lineBasicMaterial color="#1E5E3A" transparent opacity={0.4} />
      </line>
      {/* Nodes */}
      {points.map((pos, i) => (
        <JourneyNodeWrapper key={nodes[i].lesson.id} data={nodes[i]} position={pos} />
      ))}
    </>
  );
}

function JourneyNodeWrapper({ data, position }: { data: JourneyNodeData; position: [number, number, number] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <JourneyNode
      data={data}
      position={position}
      isHovered={hovered}
      onHover={setHovered}
      onClick={() => {
        if (data.status !== 'locked' && (window as unknown as { __journeySelect?: (l: Lesson) => void }).__journeySelect) {
          (window as unknown as { __journeySelect: (l: Lesson) => void }).__journeySelect(data.lesson);
        }
      }}
    />
  );
}

function JourneyScene({ course, onSelectLesson }: { course: Course; onSelectLesson: (l: Lesson) => void }) {
  useEffect(() => {
    (window as unknown as { __journeySelect?: (l: Lesson) => void }).__journeySelect = onSelectLesson;
    return () => { delete (window as unknown as { __journeySelect?: (l: Lesson) => void }).__journeySelect; };
  }, [onSelectLesson]);

  const nodes: JourneyNodeData[] = useMemo(() => {
    const firstIncomplete = course.lessonList.findIndex((l) => !l.completed);
    return course.lessonList.map((lesson, index) => ({
      lesson,
      index,
      status: lesson.completed ? 'completed' as const : index === firstIncomplete ? 'active' as const : 'locked' as const,
    }));
  }, [course]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={1} color="#F4F5F0" />
      <pointLight position={[-4, 2, 3]} intensity={1.2} color="#2C7A4F" />
      <pointLight position={[4, -2, 2]} intensity={0.8} color="#D97706" />
      <JourneyPath nodes={nodes} />
    </>
  );
}

function Journey3DCanvas({ course, onSelectLesson, className = '' }: { course: Course; onSelectLesson: (l: Lesson) => void; className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
        <Suspense fallback={null}>
          <JourneyScene course={course} onSelectLesson={onSelectLesson} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function CourseJourneyMap({ course, onSelectLesson, className = '' }: { course: Course; onSelectLesson: (l: Lesson) => void; className?: string }) {
  const [lowEnd, setLowEnd] = useState(false);
  useEffect(() => {
    setLowEnd(window.matchMedia('(max-width: 640px)').matches || (navigator.hardwareConcurrency ?? 4) <= 2);
  }, []);

  if (lowEnd) {
    return <JourneyFallback course={course} onSelectLesson={onSelectLesson} className={className} />;
  }

  return (
    <Suspense fallback={<JourneyFallback course={course} onSelectLesson={onSelectLesson} className={className} />}>
      <Journey3DCanvas course={course} onSelectLesson={onSelectLesson} className={className} />
    </Suspense>
  );
}

function JourneyFallback({ course, onSelectLesson, className = '' }: { course: Course; onSelectLesson: (l: Lesson) => void; className?: string }) {
  const firstIncomplete = course.lessonList.findIndex((l) => !l.completed);
  return (
    <div className={`${className} flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-forest-700/5 p-6`}>
      {course.lessonList.map((lesson, i) => {
        const status = lesson.completed ? 'completed' : i === firstIncomplete ? 'active' : 'locked';
        return (
          <button
            key={lesson.id}
            onClick={() => status !== 'locked' && onSelectLesson(lesson)}
            disabled={status === 'locked'}
            className={`flex flex-col items-center gap-1 rounded-2xl p-3 transition-all ${status === 'locked' ? 'cursor-not-allowed opacity-40' : 'hover:scale-105'} ${status === 'active' ? 'bg-terra-500/20 ring-2 ring-terra-500' : status === 'completed' ? 'bg-jungle-500/15' : 'bg-sand-200'}`}
          >
            <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${status === 'completed' ? 'bg-jungle-500 text-sand-50' : status === 'active' ? 'bg-terra-500 text-sand-50' : 'bg-sand-300 text-forest-700/50'}`}>
              {status === 'completed' ? <CheckCircle2 size={16} /> : status === 'locked' ? <Lock size={14} /> : i + 1}
            </span>
            <span className="max-w-[80px] truncate text-[10px] font-bold text-forest-700">{lesson.title}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   2. 3D Interactive Flashcards Deck ("بطاقات المراجعة الذكية")
   ============================================================ */

type CardStatus = 'none' | 'mastered' | 'review';

interface FlashcardState extends Flashcard {
  status: CardStatus;
  custom?: boolean;
}

export function FlashcardsDeck({ lesson }: { lesson: Lesson }) {
  const [cards, setCards] = useState<FlashcardState[]>(() =>
    lesson.flashcards.map((f) => ({ ...f, status: 'none' as CardStatus }))
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [swipeDir, setSwipeDir] = useState<0 | 1 | -1>(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  const active = cards[activeIndex];
  const masteredCount = cards.filter((c) => c.status === 'mastered').length;
  const reviewCount = cards.filter((c) => c.status === 'review').length;

  function next() {
    if (activeIndex < cards.length - 1) {
      setSwipeDir(-1);
      window.setTimeout(() => { setActiveIndex((i) => i + 1); setFlipped(false); setSwipeDir(0); }, 200);
    }
  }
  function prev() {
    if (activeIndex > 0) {
      setSwipeDir(1);
      window.setTimeout(() => { setActiveIndex((i) => i - 1); setFlipped(false); setSwipeDir(0); }, 200);
    }
  }
  function markStatus(status: CardStatus) {
    setCards((prev) => prev.map((c, i) => (i === activeIndex ? { ...c, status } : c)));
    setSwipeDir(status === 'mastered' ? -1 : 1);
    window.setTimeout(() => {
      if (activeIndex < cards.length - 1) { setActiveIndex((i) => i + 1); setFlipped(false); }
      setSwipeDir(0);
    }, 300);
  }
  function addCard() {
    if (!newFront.trim() || !newBack.trim()) return;
    setCards((prev) => [...prev, { id: `custom-${Date.now()}`, front: newFront.trim(), back: newBack.trim(), status: 'none', custom: true }]);
    setNewFront(''); setNewBack(''); setShowAddForm(false);
    setActiveIndex(cards.length);
  }

  if (cards.length === 0 && !showAddForm) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-sand-300 bg-sand-100/50 p-12 text-center">
        <Layers size={36} className="mb-2 text-forest-700/30" />
        <p className="font-bold text-forest-700/50">لا توجد بطاقات مراجعة بعد</p>
        <button onClick={() => setShowAddForm(true)} className="mt-3 flex items-center gap-1.5 rounded-xl bg-forest-700 px-4 py-2 text-sm font-bold text-sand-50 hover:bg-forest-800">
          <Plus size={15} /> أضف بطاقة جديدة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress + counts */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-forest-700">{activeIndex + 1} / {cards.length}</span>
        <div className="flex gap-3">
          <span className="flex items-center gap-1 font-bold text-jungle-600"><CheckCircle2 size={12} /> {masteredCount} أتقنتها</span>
          <span className="flex items-center gap-1 font-bold text-terra-600"><RotateCw size={12} /> {reviewCount} للمراجعة</span>
        </div>
      </div>

      {/* 3D perspective card stack */}
      <div className="relative h-64 [perspective:1200px]">
        {/* Stack peek behind */}
        {cards.slice(activeIndex + 1, activeIndex + 3).reverse().map((c, i) => (
          <div
            key={c.id}
            className="absolute inset-0 rounded-3xl border border-sand-200 bg-sand-100"
            style={{ transform: `translateY(${(i + 1) * 8}px) scale(${1 - (i + 1) * 0.04})`, opacity: 0.5 - i * 0.15, zIndex: 0 }}
          />
        ))}

        {/* Active card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active?.id}
            initial={{ opacity: 0, x: swipeDir * 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: swipeDir * -80, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            onClick={() => setFlipped((f) => !f)}
            className="relative z-10 h-full w-full cursor-pointer [transform-style:preserve-3d]"
            style={{ transform: `rotateY(${flipped ? 180 : 0}deg)`, transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            {/* Front */}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border-2 border-forest-700/20 bg-gradient-to-br from-forest-700 to-forest-900 p-6 text-center [backface-visibility:hidden]">
              <span className="absolute right-4 top-4 rounded-lg bg-terra-500/30 px-2 py-0.5 text-[10px] font-bold text-terra-300">سؤال</span>
              <Brain size={28} className="mb-3 text-jungle-400" />
              <p className="font-display text-xl font-extrabold text-sand-50">{active?.front}</p>
              <p className="mt-4 text-xs text-sand-200/50">اضغط للقلب</p>
            </div>
            {/* Back */}
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border-2 border-terra-500/30 bg-gradient-to-br from-jungle-500 to-forest-700 p-6 text-center [backface-visibility:hidden]" style={{ transform: 'rotateY(180deg)' }}>
              <span className="absolute right-4 top-4 rounded-lg bg-sand-50/20 px-2 py-0.5 text-[10px] font-bold text-sand-50">إجابة</span>
              <CheckCircle2 size={28} className="mb-3 text-terra-300" />
              <p className="text-lg font-bold leading-relaxed text-sand-50">{active?.back}</p>
              <p className="mt-4 text-xs text-sand-200/50">اضغط للعودة</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <button onClick={prev} disabled={activeIndex === 0} className="grid h-10 w-10 place-items-center rounded-xl bg-sand-200 text-forest-700 transition-colors hover:bg-sand-300 disabled:opacity-30">
          <ChevronRight size={20} />
        </button>
        <div className="flex flex-1 gap-2">
          <button onClick={() => markStatus('review')} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-terra-500/15 py-2.5 text-sm font-bold text-terra-600 transition-all hover:bg-terra-500/25">
            <RotateCw size={15} /> للمراجعة لاحقاً
          </button>
          <button onClick={() => markStatus('mastered')} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-jungle-500/15 py-2.5 text-sm font-bold text-jungle-600 transition-all hover:bg-jungle-500/25">
            <CheckCircle2 size={15} /> أتقنتها
          </button>
        </div>
        <button onClick={next} disabled={activeIndex >= cards.length - 1} className="grid h-10 w-10 place-items-center rounded-xl bg-sand-200 text-forest-700 transition-colors hover:bg-sand-300 disabled:opacity-30">
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Add custom card */}
      <AnimatePresence>
        {showAddForm ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="space-y-3 rounded-2xl border border-sand-200 bg-sand-100 p-4">
              <input value={newFront} onChange={(e) => setNewFront(e.target.value)} placeholder="السؤال / المفهوم الأمامي" className="w-full rounded-xl border border-sand-300 bg-sand-50 px-4 py-2.5 font-bold text-forest-700 focus:border-terra-500 focus:outline-none" />
              <textarea value={newBack} onChange={(e) => setNewBack(e.target.value)} placeholder="الإجابة / الشرح" rows={2} className="w-full rounded-xl border border-sand-300 bg-sand-50 px-4 py-2.5 font-bold text-forest-700 focus:border-terra-500 focus:outline-none" />
              <div className="flex gap-2">
                <button onClick={addCard} disabled={!newFront.trim() || !newBack.trim()} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-forest-700 py-2.5 text-sm font-bold text-sand-50 disabled:opacity-50">
                  <Plus size={15} /> إضافة البطاقة
                </button>
                <button onClick={() => setShowAddForm(false)} className="rounded-xl bg-sand-200 px-4 py-2.5 text-sm font-bold text-forest-700/60">إلغاء</button>
              </div>
            </div>
          </motion.div>
        ) : (
          <button onClick={() => setShowAddForm(true)} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-forest-700/30 py-2.5 text-sm font-bold text-forest-700/60 transition-colors hover:border-forest-700/50 hover:bg-forest-700/5">
            <Plus size={15} /> أضف بطاقة مراجعة خاصة بك
          </button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   3. 3D Mind Map Summary ("الخريطة الذهنية للدرس")
   ============================================================ */

function MindMapNode3D({
  node,
  position,
  isActive,
  isHovered,
  onClick,
  onHover,
}: {
  node: MindMapNode;
  position: [number, number, number];
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (h: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.1;
      const s = isActive ? 1.3 : isHovered ? 1.15 : 1;
      meshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); onHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { onHover(false); document.body.style.cursor = 'default'; }}
      >
        <icosahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={isActive ? '#D97706' : '#1E5E3A'}
          emissive={isActive ? '#D97706' : '#2C7A4F'}
          emissiveIntensity={isActive ? 0.7 : isHovered ? 0.5 : 0.3}
          metalness={0.6}
          roughness={0.3}
          flatShading
        />
        <Edges color={isActive ? '#F6B452' : '#F4F5F0'} threshold={15} />
      </mesh>
      <Text position={[0, 0.6, 0]} fontSize={0.16} color="#F4F5F0" anchorX="center" anchorY="middle" outlineWidth={0.015} outlineColor="#0E3A24">
        {node.label}
      </Text>
    </group>
  );
}

function MindMapScene({ nodes, activeId, onSelect }: { nodes: MindMapNode[]; activeId: string | null; onSelect: (id: string) => void }) {
  const positions = useMemo(() => nodes.map((n) => [n.position[0], n.position[1], 0] as [number, number, number]), [nodes]);

  const lineGeometry = useMemo(() => {
    if (nodes.length < 2) return null;
    const pts: number[] = [];
    for (let i = 0; i < positions.length - 1; i++) {
      pts.push(...positions[i], ...positions[i + 1]);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, [positions, nodes.length]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 3]} intensity={1} color="#F4F5F0" />
      <pointLight position={[-3, 2, 2]} intensity={1.2} color="#2C7A4F" />
      <pointLight position={[3, -2, 2]} intensity={0.8} color="#D97706" />

      {lineGeometry && (
        <lineSegments>
          <primitive object={lineGeometry} attach="geometry" />
          <lineBasicMaterial color="#2C7A4F" transparent opacity={0.4} />
        </lineSegments>
      )}

      {nodes.map((node, i) => (
        <MindMapNode3D
          key={node.id}
          node={node}
          position={positions[i]}
          isActive={activeId === node.id}
          isHovered={hoveredId === node.id}
          onClick={() => onSelect(node.id)}
          onHover={(h) => setHoveredId(h ? node.id : null)}
        />
      ))}
    </>
  );
}

function MindMap3DCanvas({ nodes, activeId, onSelect, className = '' }: { nodes: MindMapNode[]; activeId: string | null; onSelect: (id: string) => void; className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
        <Suspense fallback={null}>
          <MindMapScene nodes={nodes} activeId={activeId} onSelect={onSelect} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function MindMapSummary({
  lesson,
  onJumpToTimestamp,
  className = '',
}: {
  lesson: Lesson;
  onJumpToTimestamp: (seconds: number) => void;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(lesson.mindMapNodes[0]?.id ?? null);
  const [lowEnd, setLowEnd] = useState(false);

  useEffect(() => {
    setLowEnd(window.matchMedia('(max-width: 640px)').matches || (navigator.hardwareConcurrency ?? 4) <= 2);
  }, []);

  const activeNode = lesson.mindMapNodes.find((n) => n.id === activeId);

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  if (lesson.mindMapNodes.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-sand-300 bg-sand-100/50 p-12 text-center">
        <MapIcon size={36} className="mb-2 text-forest-700/30" />
        <p className="font-bold text-forest-700/50">لا توجد خريطة ذهنية لهذا الدرس</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-forest-700/60">اضغط على أي عقدة لعرض ملخصها والقفز إلى توقيتها في الفيديو.</p>

      {/* 3D canvas or fallback */}
      {lowEnd ? (
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-forest-700/5 p-6">
          {lesson.mindMapNodes.map((node) => (
            <button
              key={node.id}
              onClick={() => setActiveId(node.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl p-3 transition-all hover:scale-105 ${activeId === node.id ? 'bg-terra-500/20 ring-2 ring-terra-500' : 'bg-sand-200'}`}
            >
              <span className={`grid h-9 w-9 place-items-center rounded-full ${activeId === node.id ? 'bg-terra-500 text-sand-50' : 'bg-jungle-500/80 text-sand-50'}`}>
                <MapIcon size={16} />
              </span>
              <span className="max-w-[100px] text-center text-[10px] font-bold text-forest-700">{node.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <Suspense fallback={<div className="h-56 animate-pulse rounded-2xl bg-sand-200" />}>
          <MindMap3DCanvas nodes={lesson.mindMapNodes} activeId={activeId} onSelect={setActiveId} className={`${className} h-56 w-full rounded-2xl`} />
        </Suspense>
      )}

      {/* Active node summary card */}
      <AnimatePresence mode="wait">
        {activeNode && (
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-terra-500/30 bg-terra-500/5 p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-display text-lg font-extrabold text-forest-700">{activeNode.label}</h4>
              <span className="flex items-center gap-1 rounded-lg bg-forest-700/10 px-2 py-1 font-mono text-xs font-bold text-forest-700">
                <Clock size={11} /> {formatTime(activeNode.timestamp)}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-forest-700/80">{activeNode.summary}</p>
            <button
              onClick={() => onJumpToTimestamp(activeNode.timestamp)}
              className="mt-3 flex items-center gap-1.5 rounded-xl bg-forest-700 px-4 py-2 text-sm font-bold text-sand-50 transition-colors hover:bg-forest-800"
            >
              <Play size={13} fill="currentColor" /> انتقل إلى توقيت الفيديو
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   4. Timestamped Video Notes + Pomodoro Focus Timer
   ============================================================ */

interface TimestampNote {
  id: string;
  text: string;
  timestamp: number;
}

export function TimestampedNotes({
  currentSeconds,
  onJumpToTimestamp,
}: {
  currentSeconds: number;
  onJumpToTimestamp: (s: number) => void;
}) {
  const [notes, setNotes] = useState<TimestampNote[]>([]);
  const [text, setText] = useState('');

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function addNote() {
    if (!text.trim()) return;
    setNotes((prev) => [{ id: `n-${Date.now()}`, text: text.trim(), timestamp: currentSeconds }, ...prev]);
    setText('');
  }

  function removeNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 font-display text-base font-extrabold text-forest-700">
        <StickyNote size={16} /> ملاحظاتي الزمنية
      </h4>

      {/* Add note input */}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addNote()}
          placeholder="اكتب ملاحظتك..."
          className="flex-1 rounded-xl border border-sand-300 bg-sand-50 px-4 py-2.5 text-sm font-bold text-forest-700 focus:border-terra-500 focus:outline-none"
        />
        <button onClick={addNote} disabled={!text.trim()} className="flex items-center gap-1 rounded-xl bg-forest-700 px-4 py-2.5 text-sm font-bold text-sand-50 transition-colors hover:bg-forest-800 disabled:opacity-50">
          <Plus size={15} /> أضف
        </button>
      </div>

      {/* Current timestamp badge */}
      <div className="flex items-center gap-2 text-xs text-forest-700/50">
        <Clock size={12} /> سيُسجّل عند:
        <span className="rounded-lg bg-forest-700/10 px-2 py-0.5 font-mono font-bold text-forest-700">{formatTime(currentSeconds)}</span>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="py-4 text-center text-sm text-forest-700/40">لا توجد ملاحظات بعد — ابدأ بكتابة ملاحظتك.</p>
      ) : (
        <div className="max-h-[200px] space-y-2 overflow-y-auto pr-1">
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-start gap-2 rounded-xl border border-sand-200 bg-sand-100 p-3"
              >
                <button
                  onClick={() => onJumpToTimestamp(note.timestamp)}
                  className="mt-0.5 flex shrink-0 items-center gap-1 rounded-lg bg-terra-500/15 px-2 py-1 font-mono text-xs font-bold text-terra-600 transition-colors hover:bg-terra-500/25"
                >
                  <Bookmark size={11} /> {formatTime(note.timestamp)}
                </button>
                <p className="flex-1 text-sm text-forest-700/80">{note.text}</p>
                <button onClick={() => removeNote(note.id)} className="text-forest-700/30 transition-colors hover:text-red-500" aria-label="حذف">
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ----- Pomodoro Focus Timer ("وضع التركيز") ----- */

type FocusPhase = 'study' | 'break' | 'idle';

export function FocusTimer({ className = '' }: { className?: string }) {
  const [phase, setPhase] = useState<FocusPhase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [studyingNow] = useState(() => Math.floor(Math.random() * 200) + 340);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = phase === 'break' ? 5 * 60 : 25 * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  useEffect(() => {
    if (running && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            // Phase complete — switch
            setPhase((p) => {
              const next = p === 'study' ? 'break' : 'study';
              return next;
            });
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, secondsLeft]);

  useEffect(() => {
    if (phase === 'study') setSecondsLeft(25 * 60);
    else if (phase === 'break') setSecondsLeft(5 * 60);
  }, [phase]);

  function startStudy() { setPhase('study'); setSecondsLeft(25 * 60); setRunning(true); }
  function startBreak() { setPhase('break'); setSecondsLeft(5 * 60); setRunning(true); }
  function toggleRunning() {
    if (phase === 'idle') { startStudy(); return; }
    setRunning((r) => !r);
  }
  function reset() { setPhase('idle'); setSecondsLeft(25 * 60); setRunning(false); }

  const mm = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const ss = (secondsLeft % 60).toString().padStart(2, '0');

  const ringColor = phase === 'break' ? '#2C7A4F' : '#D97706';
  const circumference = 2 * Math.PI * 52;

  return (
    <div className={`${className} rounded-2xl border border-forest-700/15 bg-gradient-to-br from-forest-700 to-forest-900 p-5 text-sand-50 shadow-tactile`}>
      <div className="mb-4 flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-display text-base font-extrabold">
          <Timer size={16} /> وضع التركيز
        </h4>
        <span className="flex items-center gap-1.5 rounded-full bg-sand-50/10 px-3 py-1 text-xs font-bold text-jungle-300">
          <Users size={12} /> {studyingNow} طالب يدرس الآن
        </span>
      </div>

      {/* 3D-style progress ring */}
      <div className="relative mx-auto grid h-36 w-36 place-items-center [perspective:400px]">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" style={{ transform: 'rotateX(15deg)' }}>
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(244,245,240,0.1)" strokeWidth="6" />
          <circle
            cx="60" cy="60" r="52" fill="none" stroke={ringColor} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            style={{ transition: 'stroke-dashoffset 1s linear', filter: `drop-shadow(0 0 6px ${ringColor})` }}
          />
        </svg>
        <div className="relative z-10 text-center">
          <p className="font-mono text-3xl font-extrabold">{mm}:{ss}</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-sand-200/60">
            {phase === 'study' ? 'تركيز' : phase === 'break' ? 'استراحة' : 'جاهز'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button onClick={toggleRunning} className="flex items-center gap-1.5 rounded-xl bg-terra-500 px-5 py-2.5 text-sm font-bold text-sand-50 shadow-glow transition-transform hover:scale-105">
          {running ? <><Pause size={15} /> إيقاف</> : phase === 'idle' ? <><Play size={15} fill="currentColor" /> ابدأ التركيز</> : <><Play size={15} fill="currentColor" /> متابعة</>}
        </button>
        <button onClick={reset} className="grid h-10 w-10 place-items-center rounded-xl bg-sand-50/10 text-sand-50 transition-colors hover:bg-sand-50/20" aria-label="إعادة">
          <RotateCw size={16} />
        </button>
      </div>

      {/* Phase quick-switch */}
      <div className="mt-3 flex gap-2">
        <button onClick={startStudy} className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-xs font-bold transition-colors ${phase === 'study' ? 'bg-terra-500/30 text-terra-300' : 'bg-sand-50/5 text-sand-200/60'}`}>
          <Timer size={12} /> 25 دقيقة دراسة
        </button>
        <button onClick={startBreak} className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-xs font-bold transition-colors ${phase === 'break' ? 'bg-jungle-500/30 text-jungle-300' : 'bg-sand-50/5 text-sand-200/60'}`}>
          <Coffee size={12} /> 5 دقائق راحة
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Re-exports for convenience
   ============================================================ */

export type { Course, Lesson };
