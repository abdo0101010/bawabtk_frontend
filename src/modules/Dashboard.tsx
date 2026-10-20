import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Upload,
  FileText,
  Wifi,
  MapPin,
  Settings,
  User,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Info,
  GraduationCap,
  QrCode,
  TrendingUp,
  Clock,
  X,
  Download,
  Pause,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Trash2,
  Loader2,
  PartyPopper,
  List,
  Route,
  Brain,
  Layers,
  Map as MapIcon,
  Timer,
} from 'lucide-react';
import { COURSES, STUDENT, STATS, type Course, type Lesson } from '@/lib/data';
import {
  CourseJourneyMap,
  FlashcardsDeck,
  MindMapSummary,
  TimestampedNotes,
  FocusTimer,
} from '@/components/StudyTools';

type Tab = 'dashboard' | 'profile';
type FilterType = 'all' | 'online' | 'offline';

export function Dashboard() {
  const [tab, setTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-sand-50 pt-20">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-l from-forest-700 to-jungle-500 p-7 text-sand-50 shadow-deep lg:p-9"
        >
          <div className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-terra-500/30 blur-2xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="text-right">
              <p className="text-sand-200/80">مساء الخير</p>
              <h1 className="mt-1 font-display text-3xl font-extrabold lg:text-4xl">{STUDENT.name}</h1>
              <p className="mt-1 text-sand-200/70">{STUDENT.grade} · انضم في {STUDENT.joined}</p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-sand-50/10 px-5 py-3 backdrop-blur">
              <img src={STUDENT.avatar} alt={STUDENT.name} className="h-14 w-14 rounded-2xl object-cover ring-2 ring-terra-500" />
              <div className="text-right">
                <p className="text-sm text-sand-200/70">رقم الطالب</p>
                <p className="font-mono font-bold">{STUDENT.barcode}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-7 flex w-fit rounded-2xl bg-sand-100 p-1.5">
          {([['dashboard', 'لوحتي', GraduationCap], ['profile', 'الملف الشخصي', Settings]] as const).map(([id, label, Icon]) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => setTab(id as Tab)} className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors ${active ? 'text-sand-50' : 'text-forest-700/60'}`}>
                {active && <motion.div layoutId="dash-tab" className="absolute inset-0 rounded-xl bg-forest-700 shadow-tactile" />}
                <Icon size={16} className="relative z-10" />
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'dashboard' ? (
            <motion.div key="dash" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <DashboardView />
            </motion.div>
          ) : (
            <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <ProfileView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */

function DashboardView() {
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [selected, setSelected] = useState<Course>(COURSES[0]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [confetti, setConfetti] = useState(false);
  const [courseDetail, setCourseDetail] = useState<Course | null>(null);
  const [playingLesson, setPlayingLesson] = useState<{ course: Course; lesson: Lesson } | null>(null);

  const filteredCourses = courses.filter((c) => filter === 'all' || c.type === filter);

  function recomputeProgress(course: Course) {
    const completed = course.lessonList.filter((l) => l.completed).length;
    const progress = Math.round((completed / course.lessonList.length) * 100);
    return { ...course, completedLessons: completed, progress };
  }

  function toggleLessonComplete(courseId: string, lessonId: string) {
    setCourses((prev) => prev.map((c) => {
      if (c.id !== courseId) return c;
      const updatedLessons = c.lessonList.map((l) => (l.id === lessonId ? { ...l, completed: !l.completed } : l));
      return recomputeProgress({ ...c, lessonList: updatedLessons });
    }));
    setSelected((prev) => {
      if (prev.id !== courseId) return prev;
      const updatedLessons = prev.lessonList.map((l) => (l.id === lessonId ? { ...l, completed: !l.completed } : l));
      return recomputeProgress({ ...prev, lessonList: updatedLessons });
    });
  }

  function markLessonComplete(courseId: string, lessonId: string) {
    setCourses((prev) => prev.map((c) => {
      if (c.id !== courseId) return c;
      const updatedLessons = c.lessonList.map((l) => (l.id === lessonId ? { ...l, completed: true } : l));
      return recomputeProgress({ ...c, lessonList: updatedLessons });
    }));
    setSelected((prev) => {
      if (prev.id !== courseId) return prev;
      const updatedLessons = prev.lessonList.map((l) => (l.id === lessonId ? { ...l, completed: true } : l));
      return recomputeProgress({ ...prev, lessonList: updatedLessons });
    });
    setConfetti(true);
    window.setTimeout(() => setConfetti(false), 2600);
  }

  return (
    <>
      {/* Stats */}
      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-sand-200 bg-sand-50 p-5 shadow-tactile">
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-forest-700/10 text-forest-700"><Icon size={20} /></div>
              <p className="font-display text-3xl font-extrabold text-forest-700">{s.value}</p>
              <p className="text-sm text-forest-700/60">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
        {/* My courses grid */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-2xl font-extrabold text-forest-700">كورساتي</h2>
            {/* Filter pills */}
            <div className="flex w-fit rounded-2xl bg-sand-100 p-1.5">
              {([['all', 'الكل'], ['online', 'أونلاين'], ['offline', 'حضوري']] as const).map(([id, label]) => (
                <button key={id} onClick={() => setFilter(id as FilterType)} className={`relative rounded-xl px-4 py-2 text-sm font-bold transition-colors ${filter === id ? 'text-sand-50' : 'text-forest-700/60'}`}>
                  {filter === id && <motion.div layoutId="course-filter-pill" className="absolute inset-0 rounded-xl bg-forest-700 shadow-tactile" transition={{ type: 'spring', stiffness: 320, damping: 28 }} />}
                  <span className="relative z-10 flex items-center gap-1">
                    {id === 'online' && <Wifi size={12} />}
                    {id === 'offline' && <MapPin size={12} />}
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((c, i) => {
                const active = selected.id === c.id;
                return (
                  <motion.button
                    key={c.id}
                    onClick={() => { setSelected(c); setCourseDetail(c); }}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -6 }}
                    className={`group relative overflow-hidden rounded-3xl text-right shadow-tactile transition-all ${active ? 'ring-2 ring-terra-500 ring-offset-2 ring-offset-sand-50' : ''}`}
                  >
                    <div className={`relative h-32 bg-gradient-to-br ${c.color}`}>
                      <img src={c.cover} alt={c.title} className="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-110" />
                      <span className={`absolute right-3 top-3 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold backdrop-blur ${c.type === 'online' ? 'bg-jungle-500/80 text-sand-50' : 'bg-terra-500/85 text-sand-50'}`}>
                        {c.type === 'online' ? <Wifi size={12} /> : <MapPin size={12} />}
                        {c.type === 'online' ? 'أونلاين' : 'حضوري'}
                      </span>
                    </div>
                    <div className="bg-sand-50 p-4">
                      <h3 className="font-display text-lg font-extrabold text-forest-700">{c.title}</h3>
                      <p className="text-sm text-forest-700/60">{c.subtitle}</p>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-forest-700/60">
                          <span>{c.completedLessons}/{c.lessons} درس</span>
                          <span>{c.progress}%</span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sand-200">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${c.progress}%` }} transition={{ duration: 1, delay: 0.2 }} className="h-full rounded-full bg-gradient-to-l from-terra-500 to-jungle-500" />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredCourses.length === 0 && (
            <div className="grid place-items-center rounded-3xl border border-dashed border-sand-300 bg-sand-50 p-12 text-center">
              <BookOpen size={36} className="mb-2 text-forest-700/30" />
              <p className="font-bold text-forest-700/50">لا توجد كورسات في هذا التصنيف</p>
            </div>
          )}
        </div>

        {/* Right column: video player + assignment drop */}
        <div className="space-y-7">
          {/* Video player card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="overflow-hidden rounded-3xl border border-sand-200 bg-sand-50 shadow-tactile">
            <div className="relative aspect-video bg-forest-900">
              <img src={selected.cover} alt={selected.title} className="h-full w-full object-cover opacity-50" />
              <div className="absolute inset-0 grid place-items-center">
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    const nextLesson = selected.lessonList.find((l) => !l.completed) ?? selected.lessonList[0];
                    setPlayingLesson({ course: selected, lesson: nextLesson });
                  }}
                  className="grid h-16 w-16 place-items-center rounded-full bg-sand-50/95 text-forest-700 shadow-deep"
                  aria-label="تشغيل الدرس القادم"
                >
                  <Play size={28} className="mr-1" fill="currentColor" />
                </motion.button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-forest-900/90 to-transparent p-4 text-sand-50">
                <p className="font-bold">{selected.nextLesson}</p>
                <p className="text-xs text-sand-200/70">{selected.title} · {selected.instructor}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2 text-sm text-forest-700/60"><Clock size={15} /> الدرس القادم</div>
              <button
                onClick={() => {
                  const nextLesson = selected.lessonList.find((l) => !l.completed) ?? selected.lessonList[0];
                  setPlayingLesson({ course: selected, lesson: nextLesson });
                }}
                className="rounded-xl bg-forest-700 px-4 py-2 text-sm font-bold text-sand-50 hover:bg-forest-800"
              >
                متابعة
              </button>
            </div>
          </motion.div>

          {/* Homework dropzone */}
          <HomeworkDropzone courses={courses} onCelebrate={() => { setConfetti(true); window.setTimeout(() => setConfetti(false), 2600); }} />
        </div>
      </div>

      {/* Course Detail Modal */}
      <AnimatePresence>
        {courseDetail && (
          <CourseDetailModal
            course={courses.find((c) => c.id === courseDetail.id) ?? courseDetail}
            onClose={() => setCourseDetail(null)}
            onPlayLesson={(lesson) => { setPlayingLesson({ course: courses.find((c) => c.id === courseDetail.id) ?? courseDetail, lesson }); }}
            onToggleComplete={(lessonId) => toggleLessonComplete(courseDetail.id, lessonId)}
          />
        )}
      </AnimatePresence>

      {/* Video Player Modal */}
      <AnimatePresence>
        {playingLesson && (
          <VideoPlayerModal
            course={courses.find((c) => c.id === playingLesson.course.id) ?? playingLesson.course}
            lesson={courses.find((c) => c.id === playingLesson.course.id)?.lessonList.find((l) => l.id === playingLesson.lesson.id) ?? playingLesson.lesson}
            onClose={() => setPlayingLesson(null)}
            onMarkComplete={() => {
              markLessonComplete(playingLesson.course.id, playingLesson.lesson.id);
              setPlayingLesson(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{confetti && <Confetti />}</AnimatePresence>
    </>
  );
}

/* ---------------- Course Detail Modal ---------------- */

type CourseTab = 'list' | 'journey';

function CourseDetailModal({
  course,
  onClose,
  onPlayLesson,
  onToggleComplete,
}: {
  course: Course;
  onClose: () => void;
  onPlayLesson: (lesson: Lesson) => void;
  onToggleComplete: (lessonId: string) => void;
}) {
  const [courseTab, setCourseTab] = useState<CourseTab>('list');

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={handleBackdrop}
      className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-forest-900/60 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 30 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="relative my-4 w-full max-w-2xl overflow-hidden rounded-3xl border border-sand-200 bg-sand-50 shadow-ticket"
      >
        {/* Header */}
        <div className="relative h-40">
          <img src={course.cover} alt={course.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 to-transparent" />
          <button onClick={onClose} className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-xl bg-sand-50/20 text-sand-50 backdrop-blur transition-colors hover:bg-sand-50/30" aria-label="إغلاق">
            <X size={18} />
          </button>
          <div className="absolute bottom-0 right-0 p-5 text-right text-sand-50">
            <span className={`mb-2 flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${course.type === 'online' ? 'bg-jungle-500/80 text-sand-50' : 'bg-terra-500/85 text-sand-50'}`}>
              {course.type === 'online' ? <Wifi size={12} /> : <MapPin size={12} />}
              {course.type === 'online' ? 'أونلاين' : 'حضوري'}
            </span>
            <h2 className="font-display text-2xl font-extrabold">{course.title}</h2>
            <p className="text-sm text-sand-200/80">{course.subtitle} · {course.instructor}</p>
          </div>
        </div>

        <div className="p-6">
          {/* Progress */}
          <div className="mb-5 rounded-2xl bg-sand-100 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-forest-700">تقدّمك في الكورس</span>
              <span className="font-display text-lg font-extrabold text-jungle-600">{course.progress}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-sand-200">
              <motion.div initial={{ width: 0 }} animate={{ width: `${course.progress}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-l from-terra-500 to-jungle-500" />
            </div>
            <p className="mt-2 text-xs text-forest-700/50">{course.completedLessons} من {course.lessons} درس مكتمل</p>
          </div>

          {/* In-person barcode + schedule */}
          {course.type === 'offline' && course.centerSession && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 rounded-2xl border border-terra-500/30 bg-terra-500/5 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-right">
                  <p className="flex items-center gap-1.5 text-sm font-bold text-terra-700"><QrCode size={16} /> باركود الحضور الموحّد</p>
                  <p className="mt-1 font-mono text-xl font-extrabold text-forest-700">{STUDENT.barcode}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="flex items-center gap-1.5 font-bold text-forest-700"><CalendarDays size={15} /> الجلسة القادمة</p>
                  <p className="mt-1 text-forest-700/70">{course.centerSession.day} · {course.centerSession.time}</p>
                  <p className="flex items-center gap-1 text-xs text-forest-700/60"><MapPin size={12} /> {course.centerSession.location}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tabs: Lessons list / Journey map */}
          <div className="mb-4 flex w-fit rounded-2xl bg-sand-100 p-1.5">
            <button onClick={() => setCourseTab('list')} className={`relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${courseTab === 'list' ? 'text-sand-50' : 'text-forest-700/60'}`}>
              {courseTab === 'list' && <motion.div layoutId="course-tab-pill" className="absolute inset-0 rounded-xl bg-forest-700 shadow-tactile" />}
              <List size={14} className="relative z-10" /><span className="relative z-10">قائمة الدروس</span>
            </button>
            <button onClick={() => setCourseTab('journey')} className={`relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${courseTab === 'journey' ? 'text-sand-50' : 'text-forest-700/60'}`}>
              {courseTab === 'journey' && <motion.div layoutId="course-tab-pill" className="absolute inset-0 rounded-xl bg-forest-700 shadow-tactile" />}
              <Route size={14} className="relative z-10" /><span className="relative z-10">خريطة الرحلة</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {courseTab === 'list' ? (
              <motion.div key="list" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-h-[40vh] space-y-2 overflow-y-auto pr-1">
                {course.lessonList.map((lesson, i) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 rounded-2xl border border-sand-200 bg-sand-100 p-3 transition-colors hover:border-terra-500/40"
                  >
                    <button
                      onClick={() => onToggleComplete(lesson.id)}
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg transition-colors ${lesson.completed ? 'bg-jungle-500 text-sand-50' : 'bg-sand-200 text-forest-700/40 hover:bg-sand-300'}`}
                      aria-label={lesson.completed ? 'إلغاء الإكمال' : 'تحديد كمكتمل'}
                    >
                      {lesson.completed ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </button>
                    <div className="flex-1 text-right">
                      <p className={`font-bold ${lesson.completed ? 'text-forest-700/50 line-through' : 'text-forest-700'}`}>{lesson.title}</p>
                      <p className="flex items-center gap-1 text-xs text-forest-700/50"><Clock size={11} /> {lesson.duration}</p>
                    </div>
                    <button
                      onClick={() => onPlayLesson(lesson)}
                      className="flex items-center gap-1.5 rounded-xl bg-forest-700 px-3 py-2 text-xs font-bold text-sand-50 transition-colors hover:bg-forest-800"
                    >
                      <Play size={12} fill="currentColor" /> مشاهدة
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="journey" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="mb-3 text-sm text-forest-700/60">دروسك مرتبة كرحلة ثلاثية الأبعاد — اضغط أي درس مفتوح لفتحه.</p>
                <CourseJourneyMap course={course} onSelectLesson={onPlayLesson} className="h-72 w-full rounded-2xl bg-gradient-to-br from-forest-900/95 to-forest-700/90" />
                <div className="mt-3 flex items-center justify-center gap-5 text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-jungle-600"><span className="h-3 w-3 rounded-full bg-jungle-500" /> مكتمل</span>
                  <span className="flex items-center gap-1.5 font-bold text-terra-600"><span className="h-3 w-3 rounded-full bg-terra-500" /> الدرس الحالي</span>
                  <span className="flex items-center gap-1.5 font-bold text-forest-700/40"><span className="h-3 w-3 rounded-full bg-forest-700/30" /> مغلق</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Video Player Modal ---------------- */

type LessonTab = 'notes' | 'flashcards' | 'mindmap';

function VideoPlayerModal({
  course,
  lesson,
  onClose,
  onMarkComplete,
}: {
  course: Course;
  lesson: Lesson;
  onClose: () => void;
  onMarkComplete: () => void;
}) {
  const [playing, setPlaying] = useState(true);
  const [lessonTab, setLessonTab] = useState<LessonTab>('notes');
  const [currentTime, setCurrentTime] = useState(0);

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function jumpToTimestamp(seconds: number) {
    setCurrentTime(seconds);
    setPlaying(true);
  }

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // Simulate video playback time progression
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setCurrentTime((t) => {
        if (t >= lesson.videoSeconds) { setPlaying(false); return lesson.videoSeconds; }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, lesson.videoSeconds]);

  const progressPct = (currentTime / lesson.videoSeconds) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={handleBackdrop}
      className="fixed inset-0 z-[95] grid place-items-center overflow-y-auto bg-forest-900/80 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 30 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="relative my-4 w-full max-w-4xl overflow-hidden rounded-3xl border border-sand-200 bg-sand-50 shadow-ticket"
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-l from-forest-700 to-jungle-500 p-4 text-sand-50">
          <div className="text-right">
            <h2 className="font-display text-lg font-extrabold">{lesson.title}</h2>
            <p className="text-xs text-sand-200/70">{course.title} · {course.instructor}</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl bg-sand-50/15 text-sand-50 transition-colors hover:bg-sand-50/25" aria-label="إغلاق">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Left: video + timestamped notes + mark complete (2 cols) */}
          <div className="lg:col-span-2">
            {/* Video area */}
            <div className="relative aspect-video bg-forest-900">
              <img src={course.cover} alt={lesson.title} className="h-full w-full object-cover opacity-40" />
              <div className="absolute inset-0 grid place-items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setPlaying((p) => !p)}
                  className="grid h-20 w-20 place-items-center rounded-full bg-sand-50/90 text-forest-700 shadow-deep"
                  aria-label={playing ? 'إيقاف' : 'تشغيل'}
                >
                  {playing ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="mr-1" fill="currentColor" />}
                </motion.button>
              </div>
              {/* Real progress bar with timestamp */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="h-1.5 overflow-hidden rounded-full bg-sand-50/20">
                  <motion.div animate={{ width: `${progressPct}%` }} transition={{ duration: 0.3 }} className="h-full rounded-full bg-terra-500" />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-sand-200/80">
                  <span className="font-mono">{formatTime(currentTime)} / {lesson.duration}</span>
                  <span>{course.title}</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Lesson tabs */}
              <div className="mb-4 flex w-fit flex-wrap gap-1 rounded-2xl bg-sand-100 p-1.5">
                <button onClick={() => setLessonTab('notes')} className={`relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${lessonTab === 'notes' ? 'text-sand-50' : 'text-forest-700/60'}`}>
                  {lessonTab === 'notes' && <motion.div layoutId="lesson-tab-pill" className="absolute inset-0 rounded-xl bg-forest-700 shadow-tactile" />}
                  <FileText size={14} className="relative z-10" /><span className="relative z-10">ملاحظات الدرس</span>
                </button>
                <button onClick={() => setLessonTab('flashcards')} className={`relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${lessonTab === 'flashcards' ? 'text-sand-50' : 'text-forest-700/60'}`}>
                  {lessonTab === 'flashcards' && <motion.div layoutId="lesson-tab-pill" className="absolute inset-0 rounded-xl bg-forest-700 shadow-tactile" />}
                  <Layers size={14} className="relative z-10" /><span className="relative z-10">بطاقات المراجعة</span>
                </button>
                <button onClick={() => setLessonTab('mindmap')} className={`relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${lessonTab === 'mindmap' ? 'text-sand-50' : 'text-forest-700/60'}`}>
                  {lessonTab === 'mindmap' && <motion.div layoutId="lesson-tab-pill" className="absolute inset-0 rounded-xl bg-forest-700 shadow-tactile" />}
                  <MapIcon size={14} className="relative z-10" /><span className="relative z-10">الخريطة الذهنية</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {lessonTab === 'notes' ? (
                  <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    {/* Lesson summary */}
                    <div className="rounded-2xl border border-sand-200 bg-sand-100 p-4">
                      <p className="text-sm leading-relaxed text-forest-700/80">{lesson.notes}</p>
                    </div>
                    {/* Attachments */}
                    {lesson.attachments.length > 0 && (
                      <div className="space-y-2">
                        {lesson.attachments.map((att) => (
                          <div key={att.name} className="flex items-center justify-between rounded-xl border border-sand-200 bg-sand-100 p-3">
                            <div className="flex items-center gap-2 text-right">
                              <FileText size={16} className="text-terra-600" />
                              <div>
                                <p className="text-sm font-bold text-forest-700">{att.name}</p>
                                <p className="text-xs text-forest-700/50">{att.size}</p>
                              </div>
                            </div>
                            <button className="flex items-center gap-1 rounded-lg bg-forest-700/10 px-3 py-1.5 text-xs font-bold text-forest-700 transition-colors hover:bg-forest-700 hover:text-sand-50">
                              <Download size={12} /> تحميل
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Timestamped notes */}
                    <TimestampedNotes currentSeconds={currentTime} onJumpToTimestamp={jumpToTimestamp} />
                  </motion.div>
                ) : lessonTab === 'flashcards' ? (
                  <motion.div key="flash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <FlashcardsDeck lesson={lesson} />
                  </motion.div>
                ) : (
                  <motion.div key="mindmap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <MindMapSummary lesson={lesson} onJumpToTimestamp={jumpToTimestamp} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mark as complete */}
              <div className="mt-6 flex items-center justify-between border-t border-sand-200 pt-4">
                <p className="text-xs text-forest-700/50">{lesson.completed ? 'تم إكمال هذا الدرس' : 'أكملت الدرس؟ حدّث تقدّمك'}</p>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={onMarkComplete}
                  disabled={lesson.completed}
                  className={`flex items-center gap-2 rounded-2xl px-6 py-3 font-bold shadow-tactile transition-all disabled:opacity-60 ${lesson.completed ? 'bg-jungle-500 text-sand-50' : 'bg-forest-700 text-sand-50 hover:bg-forest-800'}`}
                >
                  {lesson.completed ? <><CheckCircle2 size={18} /> تم الإكمال</> : <><CheckCircle2 size={18} /> تم إكمال الدرس</>}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right sidebar: Focus timer */}
          <div className="border-t border-sand-200 bg-sand-100/50 p-5 lg:border-r lg:border-t-0">
            <FocusTimer className="mb-4" />
            <div className="rounded-2xl border border-sand-200 bg-sand-50 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-display text-sm font-extrabold text-forest-700">
                <Brain size={15} /> نصائح الدراسة
              </h4>
              <ul className="space-y-1.5 text-xs text-forest-700/70">
                <li className="flex items-start gap-1.5"><CheckCircle2 size={12} className="mt-0.5 shrink-0 text-jungle-500" /> استخدم بطاقات المراجعة بعد كل درس.</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 size={12} className="mt-0.5 shrink-0 text-jungle-500" /> دوّن ملاحظاتك الزمنية أثناء المشاهدة.</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 size={12} className="mt-0.5 shrink-0 text-jungle-500" /> التزم بوضع التركيز 25 دقيقة كاملة.</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Homework Dropzone ---------------- */

interface SubmittedHomework {
  id: string;
  fileName: string;
  fileSize: string;
  courseTitle: string;
  lessonTitle: string;
  submittedAt: string;
}

function HomeworkDropzone({ courses, onCelebrate }: { courses: Course[]; onCelebrate: () => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedList, setSubmittedList] = useState<SubmittedHomework[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const availableLessons = selectedCourse?.lessonList ?? [];

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function handleFile(file: File) {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('صيغة الملف غير مدعومة. الرجاء رفع ملف PDF أو صورة.');
      return;
    }
    setSelectedFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleSubmit() {
    if (!selectedFile || !selectedCourseId || !selectedLessonId) return;
    setSubmitting(true);
    const course = courses.find((c) => c.id === selectedCourseId);
    const lesson = course?.lessonList.find((l) => l.id === selectedLessonId);
    window.setTimeout(() => {
      const entry: SubmittedHomework = {
        id: `hw-${Date.now()}`,
        fileName: selectedFile.name,
        fileSize: formatSize(selectedFile.size),
        courseTitle: course?.title ?? '',
        lessonTitle: lesson?.title ?? '',
        submittedAt: new Date().toLocaleString('ar-EG'),
      };
      setSubmittedList((prev) => [entry, ...prev]);
      setSelectedFile(null);
      setSelectedCourseId('');
      setSelectedLessonId('');
      setSubmitting(false);
      onCelebrate();
    }, 1500);
  }

  function removeSubmitted(id: string) {
    setSubmittedList((prev) => prev.filter((h) => h.id !== id));
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl border border-sand-200 bg-sand-50 p-5 shadow-tactile">
      <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-extrabold text-forest-700">
        <Upload size={18} /> تسليم الواجب
      </h3>

      {/* Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !selectedFile && fileRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${dragOver ? 'scale-[1.02] border-terra-500 bg-terra-500/10' : selectedFile ? 'border-jungle-500 bg-jungle-500/5' : 'border-sand-300 bg-sand-100/50 hover:border-sand-400'}`}
      >
        <input ref={fileRef} type="file" accept=".pdf,image/*" className="hidden" onChange={onFileChange} />
        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div key="file" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="flex flex-col items-center gap-2">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-jungle-500/15 text-jungle-600">
                <FileText size={24} />
              </div>
              <p className="font-bold text-forest-700">{selectedFile.name}</p>
              <p className="text-xs text-forest-700/50">{formatSize(selectedFile.size)}</p>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                className="mt-1 flex items-center gap-1 text-xs font-bold text-red-500 hover:underline"
              >
                <Trash2 size={12} /> إزالة الملف
              </button>
            </motion.div>
          ) : (
            <motion.div key="idle" className="flex flex-col items-center gap-2">
              <motion.div animate={{ y: dragOver ? -6 : 0 }} className="grid h-14 w-14 place-items-center rounded-2xl bg-forest-700/10 text-forest-700">
                <Upload size={24} />
              </motion.div>
              <p className="font-bold text-forest-700">اسحب واجبك هنا</p>
              <p className="text-xs text-forest-700/50">أو اضغط لاختيار ملف · PDF / صورة</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Course + lesson selectors */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-forest-700/80">الكورس</span>
                <select value={selectedCourseId} onChange={(e) => { setSelectedCourseId(e.target.value); setSelectedLessonId(''); }} className={`w-full rounded-2xl border border-sand-300 bg-sand-50 px-4 py-3 font-bold focus:border-terra-500 focus:outline-none ${selectedCourseId ? 'text-forest-700' : 'text-sand-400'}`}>
                  <option value="" disabled>اختر الكورس</option>
                  {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-forest-700/80">الدرس</span>
                <select value={selectedLessonId} onChange={(e) => setSelectedLessonId(e.target.value)} disabled={!selectedCourseId} className={`w-full rounded-2xl border border-sand-300 bg-sand-50 px-4 py-3 font-bold focus:border-terra-500 focus:outline-none disabled:opacity-50 ${selectedLessonId ? 'text-forest-700' : 'text-sand-400'}`}>
                  <option value="" disabled>اختر الدرس</option>
                  {availableLessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
                </select>
              </label>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={!selectedCourseId || !selectedLessonId || submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-forest-700 py-3.5 font-bold text-sand-50 shadow-tactile transition-all hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <><Loader2 size={18} className="animate-spin" /> جاري التسليم...</>
                ) : (
                  <><CheckCircle2 size={18} /> تسليم الواجب</>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success message */}
      <AnimatePresence>
        {submittedList.length > 0 && submittedList[0] && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center gap-2 rounded-2xl bg-jungle-500/10 p-3 text-sm font-bold text-jungle-600">
            <PartyPopper size={16} /> تم رفع الواجب بنجاح
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recently submitted list */}
      {submittedList.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold text-forest-700/60">الواجبات المسلّمة مؤخراً</p>
          <div className="space-y-2">
            {submittedList.map((hw) => (
              <motion.div key={hw.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex items-center gap-3 rounded-xl border border-sand-200 bg-sand-100 p-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-jungle-500/15 text-jungle-600">
                  <FileText size={16} />
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm font-bold text-forest-700">{hw.fileName}</p>
                  <p className="text-xs text-forest-700/50">{hw.courseTitle} · {hw.lessonTitle} · {hw.fileSize}</p>
                </div>
                <button onClick={() => removeSubmitted(hw.id)} className="text-forest-700/30 transition-colors hover:text-red-500" aria-label="حذف">
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ---------------- Confetti ---------------- */

function Confetti() {
  const colors = ['#D97706', '#1E5E3A', '#0F3823', '#F6B452', '#2C7A4F'];
  const pieces = Array.from({ length: 60 });
  return (
    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const rot = Math.random() * 360;
        const dur = 1.8 + Math.random() * 1.2;
        const size = 6 + Math.random() * 8;
        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
            animate={{ y: '110vh', rotate: rot + 360, opacity: [1, 1, 0.8, 0] }}
            transition={{ duration: dur, delay, ease: 'easeIn' }}
            style={{ left: `${left}%`, width: size, height: size * 0.4, backgroundColor: colors[i % colors.length], borderRadius: 2 }}
            className="absolute top-0"
          />
        );
      })}
    </motion.div>
  );
}

/* ---------------- Profile ---------------- */

function ProfileView() {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-sand-200 bg-sand-50 p-7 text-center shadow-tactile">
        <div className="relative mx-auto h-28 w-28">
          <img src={STUDENT.avatar} alt={STUDENT.name} className="h-full w-full rounded-3xl object-cover ring-4 ring-terra-500/30" />
          <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-jungle-500 text-sand-50"><CheckCircle2 size={16} /></span>
        </div>
        <h2 className="mt-4 font-display text-2xl font-extrabold text-forest-700">{STUDENT.name}</h2>
        <p className="text-forest-700/60">{STUDENT.grade}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-right">
          <MiniStat icon={<TrendingUp size={16} />} label="المعدل" value="92%" />
          <MiniStat icon={<QrCode size={16} />} label="الحضور" value="14/16" />
        </div>
        <div className="mt-5 rounded-2xl bg-forest-700 p-4 text-sand-50">
          <p className="text-xs text-sand-200/70">باركود الطالب</p>
          <p className="font-mono text-lg font-bold">{STUDENT.barcode}</p>
        </div>
      </motion.div>

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={(e) => e.preventDefault()} className="space-y-5 rounded-3xl border border-sand-200 bg-sand-50 p-7 shadow-tactile lg:col-span-2">
        <h2 className="font-display text-2xl font-extrabold text-forest-700">إعدادات الحساب</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SettingField icon={<User size={18} />} label="الاسم الكامل" value={STUDENT.name} />
          <SettingField icon={<Mail size={18} />} label="البريد الإلكتروني" value={STUDENT.email} />
          <SettingField icon={<Calendar size={18} />} label="تاريخ الانضمام" value={STUDENT.joined} />
          <SettingField icon={<FileText size={18} />} label="الصف الدراسي" value={STUDENT.grade} />
        </div>
        <div className="relative">
          <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-forest-700/80">
            <Phone size={15} /> رقم ولي الأمر
            <button type="button" onMouseEnter={() => setShowTip(true)} onMouseLeave={() => setShowTip(false)} onFocus={() => setShowTip(true)} onBlur={() => setShowTip(false)} className="grid h-5 w-5 place-items-center rounded-full bg-terra-500/20 text-terra-600" aria-label="معلومات">
              <Info size={12} />
            </button>
          </label>
          <AnimatePresence>
            {showTip && (
              <motion.div initial={{ opacity: 0, y: 6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.95 }} className="absolute right-0 top-full z-20 mt-2 w-72 rounded-2xl border border-terra-500/30 bg-sand-50 p-3 text-xs text-forest-700/80 shadow-deep">
                يُستخدم هذا الرقم لإرسال تنبيهات واتساب الآلية (عبر n8n) بخصوص الدرجات والحضور تلقائياً لولي الأمر.
              </motion.div>
            )}
          </AnimatePresence>
          <input type="tel" defaultValue={STUDENT.parentPhone} className="w-full rounded-2xl border-2 border-sand-300 bg-sand-50 px-4 py-3.5 font-mono text-forest-700 transition-all placeholder:text-sand-400 focus:border-terra-500 focus:shadow-glow focus:outline-none" placeholder="+963 ..." />
        </div>
        <div className="flex items-center justify-between border-t border-sand-200 pt-5">
          <p className="text-xs text-forest-700/50">آخر تحديث: اليوم</p>
          <button type="submit" className="rounded-2xl bg-forest-700 px-7 py-3 font-bold text-sand-50 shadow-tactile transition-all hover:bg-forest-800">حفظ التغييرات</button>
        </div>
      </motion.form>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-sand-100 p-3">
      <div className="mb-1 flex items-center gap-2 text-forest-700/60">{icon}<span className="text-xs">{label}</span></div>
      <p className="font-display text-lg font-extrabold text-forest-700">{value}</p>
    </div>
  );
}

function SettingField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-forest-700/80">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-sand-300 bg-sand-50 px-4 transition-all focus-within:border-terra-500 focus-within:shadow-glow">
        <span className="text-forest-700/50">{icon}</span>
        <input defaultValue={value} className="w-full bg-transparent py-3.5 text-forest-700 focus:outline-none" />
      </div>
    </label>
  );
}
