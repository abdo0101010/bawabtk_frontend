import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Radio,
  Users,
  DollarSign,
  TrendingUp,
  CalendarCheck,
  Plus,
  Video,
  Wifi,
  MapPin,
  MoreVertical,
  Activity,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  X,
  Sparkles,
  Tag,
  Pencil,
  Trash2,
  Upload,
  Search,
  XCircle,
  AlertCircle,
  Send,
  Loader2,
  GraduationCap,
} from 'lucide-react';
import {
  TEACHER_COURSES,
  INITIAL_ATTENDANCE,
  LIVE_CHECKIN_POOL,
  GRADE_LEVELS,
  formatEGP,
  fetchTeacherDashboardData,
  type AttendanceLog,
  type TeacherCourse,
  type CourseType,
  type DashboardStats,
  type DashboardData,
} from '@/lib/data';

type Tab = 'overview' | 'courses' | 'attendance';

type ModalType = 'createCourse' | 'editCourse' | 'uploadVideo' | null;

const PLACEHOLDER_COVERS = [
  'https://images.pexels.com/photos/531817/pexels-photo-531817.jpeg?auto=compress&cs=tinysrgb&h=300&w=450',
  'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&h=300&w=450',
  'https://images.pexels.com/photos/3825529/pexels-photo-3825529.jpeg?auto=compress&cs=tinysrgb&h=300&w=450',
  'https://images.pexels.com/photos/6238121/pexels-photo-6238121.jpeg?auto=compress&cs=tinysrgb&h=300&w=450',
];

export function TeacherDashboard() {
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [courses, setCourses] = useState<TeacherCourse[]>(TEACHER_COURSES);
  const [attendance, setAttendance] = useState<AttendanceLog[]>(INITIAL_ATTENDANCE);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [editingCourse, setEditingCourse] = useState<TeacherCourse | null>(null);

  // Fetch dashboard data on mount (simulates API call to .NET backend)
  useEffect(() => {
    fetchTeacherDashboardData().then((d) => {
      setData(d);
      setCourses(d.courses);
      setAttendance(d.attendance);
      setStats(d.stats);
      setLoading(false);
    });
  }, []);

  // Recompute stats when courses change
  function recomputeStats(courseList: TeacherCourse[]) {
    if (!stats) return;
    const published = courseList.filter((c) => c.published).length;
    const pending = courseList.filter((c) => !c.published).length;
    setStats({
      ...stats,
      totalStudents: courseList.reduce((s, c) => s + c.students, 0),
      totalRevenue: courseList.reduce((s, c) => s + c.revenue, 0),
      publishedCourses: published,
      pendingCourses: pending,
      coursesDelta: pending > 0 ? `${pending} قيد المراجعة` : 'الكل منشور',
    });
  }

  function addCourse(c: TeacherCourse) {
    const updated = [c, ...courses];
    setCourses(updated);
    recomputeStats(updated);
    setModal(null);
    setTab('courses');
  }

  function updateCourse(c: TeacherCourse) {
    const updated = courses.map((x) => (x.id === c.id ? c : x));
    setCourses(updated);
    recomputeStats(updated);
    setModal(null);
    setEditingCourse(null);
  }

  function deleteCourse(id: string) {
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    recomputeStats(updated);
  }

  function openCreateCourse() {
    setEditingCourse(null);
    setModal('createCourse');
  }

  function openEditCourse(c: TeacherCourse) {
    setEditingCourse(c);
    setModal('editCourse');
  }

  function openUploadVideo() {
    setModal('uploadVideo');
  }

  const teacher = data?.teacher ?? { name: 'أ. كريم منصور', role: 'معلّم', avatar: '' };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-sand-100 pt-20">
        <div className="flex flex-col items-center gap-3 text-forest-700">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-10 w-10 rounded-full border-3 border-forest-700/20 border-t-forest-700"
          />
          <p className="font-bold">جاري تحميل لوحة المعلّم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-100 pt-20">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <Sidebar tab={tab} setTab={setTab} teacher={teacher} stats={stats} />
        <main className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            {tab === 'overview' && (
              <motion.div key="ov" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <Overview
                  stats={stats}
                  revenueWeek={data!.revenueWeek}
                  courses={courses}
                  onGoCourses={() => setTab('courses')}
                  onNewCourse={openCreateCourse}
                  onUploadVideo={openUploadVideo}
                />
              </motion.div>
            )}
            {tab === 'courses' && (
              <motion.div key="co" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <CourseManagement courses={courses} onNewCourse={openCreateCourse} onEditCourse={openEditCourse} onDeleteCourse={deleteCourse} />
              </motion.div>
            )}
            {tab === 'attendance' && (
              <motion.div key="at" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <AttendanceLogs attendance={attendance} setAttendance={setAttendance} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <CourseModal
        open={modal === 'createCourse' || modal === 'editCourse'}
        mode={modal === 'editCourse' ? 'edit' : 'create'}
        course={editingCourse}
        onClose={() => { setModal(null); setEditingCourse(null); }}
        onSave={editingCourse ? updateCourse : addCourse}
      />
      <UploadVideoModal open={modal === 'uploadVideo'} onClose={() => setModal(null)} courses={courses} />
    </div>
  );
}

/* ============ Sidebar ============ */

function Sidebar({ tab, setTab, teacher, stats }: { tab: Tab; setTab: (t: Tab) => void; teacher: { name: string; role: string; avatar: string }; stats: DashboardStats | null }) {
  const items: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'courses', label: 'إدارة الكورسات', icon: BookOpen },
    { id: 'attendance', label: 'سجلّات الحضور', icon: Radio },
  ];
  return (
    <aside className="sticky top-24 hidden h-fit w-60 shrink-0 rounded-3xl border border-sand-200 bg-sand-50 p-4 shadow-tactile md:block">
      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-forest-700 p-3 text-sand-50">
        {teacher.avatar ? (
          <img src={teacher.avatar} alt={teacher.name} className="h-11 w-11 rounded-xl object-cover ring-2 ring-terra-500" />
        ) : (
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-forest-600 text-sand-50">
            <Users size={20} />
          </div>
        )}
        <div className="leading-tight">
          <p className="font-bold">{teacher.name}</p>
          <p className="text-[11px] text-sand-200/70">{teacher.role}</p>
        </div>
      </div>
      <nav className="space-y-1">
        {items.map((it) => {
          const Icon = it.icon;
          const active = tab === it.id;
          return (
            <button key={it.id} onClick={() => setTab(it.id)}
              className={`relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-colors ${active ? 'text-sand-50' : 'text-forest-700/70 hover:bg-sand-100'}`}>
              {active && <motion.div layoutId="sidebar-pill" className="absolute inset-0 rounded-2xl bg-forest-700 shadow-tactile" transition={{ type: 'spring', stiffness: 320, damping: 28 }} />}
              <Icon size={18} className="relative z-10" />
              <span className="relative z-10">{it.label}</span>
            </button>
          );
        })}
      </nav>
      {stats && (
        <div className="mt-5 rounded-2xl bg-terra-500/10 p-3 text-center">
          <p className="text-xs font-semibold text-terra-700">باقة المعلّم المميزة</p>
          <p className="mt-1 text-[11px] text-terra-600/80">{stats.publishedCourses} كورس منشور · {stats.pendingCourses} مسودة</p>
        </div>
      )}
    </aside>
  );
}

/* ============ Overview ============ */

function Overview({
  stats,
  revenueWeek,
  courses,
  onGoCourses,
  onNewCourse,
  onUploadVideo,
}: {
  stats: DashboardStats | null;
  revenueWeek: { day: string; value: number }[];
  courses: TeacherCourse[];
  onGoCourses: () => void;
  onNewCourse: () => void;
  onUploadVideo: () => void;
}) {
  const topCourses = [...courses].sort((a, b) => b.revenue - a.revenue).slice(0, 3);
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="text-right">
          <h1 className="font-display text-3xl font-extrabold text-forest-700">نظرة عامة</h1>
          <p className="text-forest-700/60">ملخص أداء منصتك التعليمية اليوم.</p>
        </div>
        <div className="flex gap-2">
          <QuickAction icon={<Plus size={16} />} label="إنشاء كورس" onClick={onNewCourse} />
          <QuickAction icon={<Video size={16} />} label="رفع فيديو" onClick={onUploadVideo} />
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={<Users size={20} />} value={formatEGP(stats.totalStudents)} label="إجمالي الطلاب" delta={stats.studentsDelta} index={0} />
          <StatCard icon={<DollarSign size={20} />} value={`${formatEGP(stats.totalRevenue)} EGP`} label="الإيرادات الكلية" delta={stats.revenueDelta} index={1} />
          <StatCard icon={<BookOpen size={20} />} value={stats.publishedCourses} label="الكورسات المنشورة" delta={stats.coursesDelta} index={2} />
          <StatCard icon={<CalendarCheck size={20} />} value={`${stats.attendanceRate}%`} label="نسبة الحضور" delta={stats.attendanceDelta} index={3} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl border border-sand-200 bg-sand-50 p-6 shadow-tactile lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div className="text-right">
              <h2 className="font-display text-xl font-extrabold text-forest-700">الإيرادات الأسبوعية</h2>
              <p className="text-xs text-forest-700/50">بالجنيه المصري (EGP)</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-jungle-500/10 px-3 py-1 text-xs font-bold text-jungle-600">
              <TrendingUp size={13} /> +12%
            </span>
          </div>
          <RevenueChart data={revenueWeek} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="rounded-3xl border border-sand-200 bg-sand-50 p-6 shadow-tactile">
          <h2 className="mb-5 font-display text-xl font-extrabold text-forest-700">إجراءات سريعة</h2>
          <div className="space-y-3">
            <BigAction icon={<Plus size={20} />} label="إنشاء كورس جديد" desc="أضف كورساً وحدد نوع الاشتراك" onClick={onNewCourse} />
            <BigAction icon={<Video size={20} />} label="رفع فيديو درس" desc="اسحب ملف الفيديو للكورس" onClick={onUploadVideo} />
            <BigAction icon={<Radio size={20} />} label="فتح جلسة الحضور" desc="تفعيل ماسح الباركود" />
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="rounded-3xl border border-sand-200 bg-sand-50 p-6 shadow-tactile">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold text-forest-700">الكورسات الأعلى دخلاً</h2>
          <button onClick={onGoCourses} className="flex items-center gap-1 text-sm font-bold text-terra-600 hover:underline">
            عرض الكل <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topCourses.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-2xl border border-sand-200 bg-sand-100">
              <div className="relative h-28">
                <img src={c.cover} alt={c.title} className="h-full w-full object-cover" />
                <span className={`absolute right-2 top-2 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${c.type === 'online' ? 'bg-jungle-500/80 text-sand-50' : 'bg-terra-500/85 text-sand-50'}`}>
                  {c.type === 'online' ? <Wifi size={10} /> : <MapPin size={10} />}
                  {c.type === 'online' ? 'أونلاين' : 'حضوري'}
                </span>
              </div>
              <div className="p-3">
                <p className="font-bold text-forest-700">{c.title}</p>
                <div className="mt-1 flex items-center justify-between text-xs text-forest-700/60">
                  <span>{c.students} طالب</span>
                  <span className="font-bold text-jungle-600">{formatEGP(c.revenue)} EGP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, value, label, delta, index }: { icon: React.ReactNode; value: string | number; label: string; delta: string; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }} className="rounded-2xl border border-sand-200 bg-sand-50 p-5 shadow-tactile">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-forest-700/10 text-forest-700">{icon}</div>
      <p className="font-display text-3xl font-extrabold text-forest-700">{value}</p>
      <p className="text-sm text-forest-700/60">{label}</p>
      <p className="mt-1 text-[11px] font-semibold text-jungle-600">{delta}</p>
    </motion.div>
  );
}

function RevenueChart({ data }: { data: { day: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex h-44 items-end justify-between gap-2">
      {data.map((d, i) => {
        const h = (d.value / max) * 100;
        return (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
            <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.08, type: 'spring', stiffness: 80, damping: 14 }} className="relative w-full rounded-t-lg bg-gradient-to-t from-forest-700 to-jungle-500">
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 + 0.3 }} className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-forest-700/60">
                {d.value.toLocaleString('ar-EG')}
              </motion.span>
            </motion.div>
            <span className="text-[10px] text-forest-700/50">{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={onClick} className="flex items-center gap-2 rounded-2xl bg-forest-700 px-4 py-2.5 text-sm font-bold text-sand-50 shadow-tactile hover:bg-forest-800">
      {icon} {label}
    </motion.button>
  );
}

function BigAction({ icon, label, desc, onClick }: { icon: React.ReactNode; label: string; desc: string; onClick?: () => void }) {
  return (
    <motion.button whileHover={{ x: -3 }} onClick={onClick} className="group flex w-full items-center gap-3 rounded-2xl border border-sand-200 bg-sand-100 p-4 text-right transition-colors hover:border-terra-500/40 hover:bg-terra-500/5">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest-700 text-sand-50 transition-transform group-hover:-rotate-6">{icon}</div>
      <div className="flex-1">
        <p className="font-bold text-forest-700">{label}</p>
        <p className="text-xs text-forest-700/55">{desc}</p>
      </div>
      <ArrowUpRight size={16} className="text-forest-700/30 transition-transform group-hover:-translate-y-0.5 group-hover:text-terra-600" />
    </motion.button>
  );
}

/* ============ Course Management ============ */

function CourseManagement({
  courses,
  onNewCourse,
  onEditCourse,
  onDeleteCourse,
}: {
  courses: TeacherCourse[];
  onNewCourse: () => void;
  onEditCourse: (c: TeacherCourse) => void;
  onDeleteCourse: (id: string) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const filtered = courses.filter((c) => filter === 'all' || c.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="text-right">
          <h1 className="font-display text-3xl font-extrabold text-forest-700">إدارة الكورسات</h1>
          <p className="text-forest-700/60">عرض وتعديل وحذف جميع كورساتك.</p>
        </div>
        <QuickAction icon={<Plus size={16} />} label="كورس جديد" onClick={onNewCourse} />
      </div>

      <div className="flex w-fit rounded-2xl bg-sand-100 p-1.5">
        {([['all', 'الكل'], ['online', 'أونلاين'], ['offline', 'حضوري']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} className={`relative rounded-xl px-5 py-2 text-sm font-bold transition-colors ${filter === id ? 'text-sand-50' : 'text-forest-700/60'}`}>
            {filter === id && <motion.div layoutId="course-filter" className="absolute inset-0 rounded-xl bg-forest-700 shadow-tactile" />}
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((c, i) => (
            <motion.div key={c.id} layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -6 }} className="group overflow-hidden rounded-3xl border border-sand-200 bg-sand-50 shadow-tactile">
              <div className="relative h-36">
                <img src={c.cover} alt={c.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent" />
                <span className={`absolute right-3 top-3 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold backdrop-blur ${c.type === 'online' ? 'bg-jungle-500/80 text-sand-50' : 'bg-terra-500/85 text-sand-50'}`}>
                  {c.type === 'online' ? <Wifi size={12} /> : <MapPin size={12} />}
                  {c.type === 'online' ? 'أونلاين' : 'حضوري'}
                </span>
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${c.published ? 'bg-jungle-500 text-sand-50' : 'bg-sand-200 text-forest-700/70'}`}>
                  {c.published ? 'منشور' : 'مسودة'}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg font-extrabold text-forest-700">{c.title}</h3>
                <p className="text-sm text-forest-700/60">{c.subtitle}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-forest-700/50">
                  <GraduationCap size={12} /> {c.gradeLevel}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <Metric value={c.students} label="طالب" />
                  <Metric value={c.lessons} label="درس" />
                  <Metric value={formatEGP(c.price)} label="EGP" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button onClick={() => onEditCourse(c)} className="flex items-center gap-1 rounded-xl bg-sand-100 px-3 py-2 text-sm font-bold text-forest-700 transition-colors hover:bg-forest-700 hover:text-sand-50">
                      <Pencil size={14} /> تعديل
                    </button>
                    <button onClick={() => setConfirmDelete(c.id)} className="flex items-center gap-1 rounded-xl bg-sand-100 px-3 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-500 hover:text-sand-50">
                      <Trash2 size={14} /> حذف
                    </button>
                  </div>
                  <button className="grid h-8 w-8 place-items-center rounded-lg bg-sand-100 text-forest-700/60 hover:bg-sand-200">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="grid place-items-center rounded-3xl border border-dashed border-sand-300 bg-sand-50 p-12 text-center">
          <BookOpen size={40} className="mb-3 text-forest-700/30" />
          <p className="font-bold text-forest-700/60">لا توجد كورسات في هذا التصنيف</p>
          <button onClick={onNewCourse} className="mt-3 flex items-center gap-1 font-bold text-terra-600 hover:underline">
            <Plus size={16} /> إنشاء كورس جديد
          </button>
        </div>
      )}

      {/* Delete confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <ConfirmDialog
            title="حذف الكورس"
            message="هل أنت متأكد من حذف هذا الكورس؟ لا يمكن التراجع عن هذا الإجراء."
            confirmLabel="حذف"
            onConfirm={() => { onDeleteCourse(confirmDelete); setConfirmDelete(null); }}
            onCancel={() => setConfirmDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Metric({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl bg-sand-100 py-2">
      <p className="font-display text-base font-extrabold text-forest-700">{value}</p>
      <p className="text-[10px] text-forest-700/50">{label}</p>
    </div>
  );
}

/* ============ Attendance Logs ============ */

function AttendanceLogs({ attendance, setAttendance }: { attendance: AttendanceLog[]; setAttendance: React.Dispatch<React.SetStateAction<AttendanceLog[]>> }) {
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent'>('all');
  const [pulse, setPulse] = useState(false);
  const poolIdx = useRef(0);

  // Live check-in simulation
  useEffect(() => {
    const interval = window.setInterval(() => {
      const next = LIVE_CHECKIN_POOL[poolIdx.current % LIVE_CHECKIN_POOL.length];
      poolIdx.current += 1;
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const dateTime = now.toISOString().slice(0, 10);
      setAttendance((prev) => [...prev.slice(-20), { ...next, id: `live-${Date.now()}`, time, dateTime }]);
      setPulse(true);
      window.setTimeout(() => setPulse(false), 1200);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [setAttendance]);

  const courses = Array.from(new Set(attendance.map((l) => l.course)));
  const filtered = attendance.filter((l) => {
    if (search && !l.studentName.includes(search) && !l.barcode.includes(search)) return false;
    if (filterCourse !== 'all' && l.course !== filterCourse) return false;
    if (filterStatus !== 'all' && l.status !== filterStatus) return false;
    return true;
  });

  const presentCount = attendance.filter((l) => l.status === 'present').length;
  const sentCount = attendance.filter((l) => l.whatsappSent === 'sent').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="text-right">
          <h1 className="font-display text-3xl font-extrabold text-forest-700">سجلّات الحضور</h1>
          <p className="text-forest-700/60">تحديث مباشر · محاكاة SignalR من ماسح الباركود.</p>
        </div>
        <span className="flex items-center gap-2 rounded-full bg-jungle-500/10 px-4 py-2 text-sm font-bold text-jungle-600">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-jungle-500 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-jungle-500" />
          </span>
          متصل مباشر
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MiniStat value={presentCount} label="حاضر اليوم" icon={<CheckCircle2 size={18} />} />
        <MiniStat value={attendance.length} label="إجمالي المسحات" icon={<Activity size={18} />} />
        <MiniStat value={`${sentCount}/${attendance.length}`} label="واتساب مرسل" icon={<Send size={18} />} />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-3xl border border-sand-200 bg-sand-50 p-4 shadow-tactile sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-2xl border border-sand-300 bg-sand-50 px-4 py-2.5 focus-within:border-terra-500">
          <Search size={18} className="text-forest-700/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث بالاسم أو الباركود..." className="w-full bg-transparent text-forest-700 placeholder:text-sand-400 focus:outline-none" />
        </div>
        <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="rounded-2xl border border-sand-300 bg-sand-50 px-4 py-2.5 font-bold text-forest-700 focus:border-terra-500 focus:outline-none">
          <option value="all">كل الكورسات</option>
          {courses.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex rounded-2xl bg-sand-100 p-1.5">
          {([['all', 'الكل'], ['present', 'حاضر'], ['absent', 'غائب']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setFilterStatus(id)} className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${filterStatus === id ? 'bg-forest-700 text-sand-50' : 'text-forest-700/60'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-sand-200 bg-sand-50 shadow-tactile">
        <div className="mb-4 flex items-center justify-between border-b border-sand-200 p-5">
          <h2 className="font-display text-lg font-extrabold text-forest-700">سجلّات الحضور التفصيلية</h2>
          <AnimatePresence>
            {pulse && (
              <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 rounded-full bg-jungle-500/15 px-3 py-1 text-xs font-bold text-jungle-600">
                <Radio size={12} className="animate-pulse" /> تسجيل جديد
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-sand-200 text-xs font-bold text-forest-700/50">
                <th className="p-4">الطالب</th>
                <th className="p-4">الباركود</th>
                <th className="p-4">المرحلة</th>
                <th className="p-4">التاريخ / الوقت</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">واتساب</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filtered.slice().reverse().map((log) => (
                  <motion.tr key={log.id} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} className="border-b border-sand-100 hover:bg-sand-100/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={log.avatar} alt={log.studentName} className="h-10 w-10 rounded-xl object-cover ring-1 ring-sand-300" />
                        <div>
                          <p className="font-bold text-forest-700">{log.studentName}</p>
                          <p className="text-xs text-forest-700/50">{log.course}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="rounded-lg bg-sand-100 px-2.5 py-1 font-mono text-xs font-bold text-forest-700/70">{log.barcode}</span>
                    </td>
                    <td className="p-4 text-forest-700/70">{log.gradeLevel}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-forest-700/70">{log.dateTime}</span>
                        <span className="flex items-center gap-1 font-mono text-xs text-forest-700/50"><Clock size={11} /> {log.time}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {log.status === 'present' ? (
                        <span className="flex w-fit items-center gap-1 rounded-full bg-jungle-500/15 px-3 py-1 text-xs font-bold text-jungle-600"><CheckCircle2 size={13} /> حاضر</span>
                      ) : (
                        <span className="flex w-fit items-center gap-1 rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-600"><XCircle size={13} /> غائب</span>
                      )}
                    </td>
                    <td className="p-4">
                      {log.whatsappSent === 'sent' ? (
                        <span className="flex w-fit items-center gap-1 rounded-full bg-jungle-500/15 px-3 py-1 text-xs font-bold text-jungle-600"><Send size={11} /> مرسل</span>
                      ) : log.whatsappSent === 'pending' ? (
                        <span className="flex w-fit items-center gap-1 rounded-full bg-terra-500/15 px-3 py-1 text-xs font-bold text-terra-600"><Clock size={11} /> بالانتظار</span>
                      ) : (
                        <span className="flex w-fit items-center gap-1 rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-600"><AlertCircle size={11} /> فشل</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="grid place-items-center p-12 text-center">
            <Search size={32} className="mb-2 text-forest-700/30" />
            <p className="font-bold text-forest-700/50">لا توجد نتائج مطابقة</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({ value, label, icon }: { value: string | number; label: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-sand-200 bg-sand-50 p-4 shadow-tactile">
      <div className="mb-2 text-forest-700/60">{icon}</div>
      <p className="font-display text-2xl font-extrabold text-forest-700">{value}</p>
      <p className="text-xs text-forest-700/55">{label}</p>
    </div>
  );
}

/* ============ Course Modal (Create / Edit) ============ */

function CourseModal({
  open,
  mode,
  course,
  onClose,
  onSave,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  course: TeacherCourse | null;
  onClose: () => void;
  onSave: (c: TeacherCourse) => void;
}) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [type, setType] = useState<CourseType>('online');
  const [cover, setCover] = useState(PLACEHOLDER_COVERS[0]);

  useEffect(() => {
    if (course && mode === 'edit') {
      setTitle(course.title);
      setDesc(course.subtitle);
      setPrice(String(course.price));
      setGradeLevel(course.gradeLevel);
      setType(course.type);
      setCover(course.cover);
    } else if (!course) {
      setTitle(''); setDesc(''); setPrice(''); setGradeLevel(''); setType('online'); setCover(PLACEHOLDER_COVERS[0]);
    }
  }, [course, mode, open]);

  function handleSave() {
    if (!title.trim() || !gradeLevel) return;
    const saved: TeacherCourse = {
      id: course?.id ?? `tc-${Date.now()}`,
      title: title.trim(),
      subtitle: desc.trim() || 'كورس جديد',
      type,
      gradeLevel,
      price: parseInt(price) || 0,
      students: course?.students ?? 0,
      revenue: course?.revenue ?? 0,
      lessons: course?.lessons ?? 0,
      cover,
      published: course?.published ?? false,
    };
    onSave(saved);
    if (mode === 'create') { setTitle(''); setDesc(''); setPrice(''); setGradeLevel(''); setType('online'); setCover(PLACEHOLDER_COVERS[0]); }
  }

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleBackdrop} className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-forest-900/60 p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 30 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }} className="relative my-8 w-full max-w-lg overflow-hidden rounded-3xl border border-sand-200 bg-sand-50 shadow-ticket">
            <div className="relative flex items-center justify-between bg-gradient-to-l from-forest-700 to-jungle-500 p-5 text-sand-50">
              <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-terra-500/30 blur-2xl" />
              <div className="relative flex items-center gap-2">
                <Sparkles size={20} className="text-terra-300" />
                <h2 className="font-display text-xl font-extrabold">{mode === 'edit' ? 'تعديل الكورس' : 'إنشاء كورس جديد'}</h2>
              </div>
              <button onClick={onClose} className="relative grid h-9 w-9 place-items-center rounded-xl bg-sand-50/15 text-sand-50 transition-colors hover:bg-sand-50/25" aria-label="إغلاق">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <ModalField label="عنوان الكورس" icon={<BookOpen size={18} />}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: الفيزياء الحديثة" className="w-full bg-transparent py-3.5 text-forest-700 placeholder:text-sand-400 focus:outline-none" />
              </ModalField>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-forest-700/80">المرحلة الدراسية</span>
                <div className="flex items-center gap-3 rounded-2xl border border-sand-300 bg-sand-50 px-4 transition-all focus-within:border-terra-500 focus-within:shadow-glow">
                  <GraduationCap size={18} className="text-forest-700/50" />
                  <select value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} className={`w-full appearance-none bg-transparent py-3.5 focus:outline-none ${gradeLevel ? 'text-forest-700' : 'text-sand-400'}`}>
                    <option value="" disabled>اختر المرحلة</option>
                    {GRADE_LEVELS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </label>

              <ModalField label="السعر (EGP / شهر)" icon={<Tag size={18} />}>
                <input value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="450" className="w-full bg-transparent py-3.5 font-mono text-forest-700 placeholder:text-sand-400 focus:outline-none" />
              </ModalField>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-forest-700/80">وصف الكورس</span>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="نبذة مختصرة عن محتوى الكورس..." className="w-full resize-none rounded-2xl border border-sand-300 bg-sand-50 px-4 py-3 text-forest-700 placeholder:text-sand-400 transition-all focus:border-terra-500 focus:shadow-glow focus:outline-none" />
              </label>

              <div>
                <span className="mb-2 block text-sm font-semibold text-forest-700/80">نوع الكورس</span>
                <div className="grid grid-cols-2 gap-3">
                  {([['online', 'أونلاين', Wifi], ['offline', 'حضوري · سنتر', MapPin]] as const).map(([id, label, Icon]) => {
                    const active = type === id;
                    return (
                      <button key={id} onClick={() => setType(id as CourseType)} className={`relative flex items-center gap-2 rounded-2xl border-2 p-4 font-bold transition-all ${active ? 'border-terra-500 bg-terra-500/5 shadow-glow' : 'border-sand-200 bg-sand-50 hover:border-sand-300'}`}>
                        <span className={`grid h-9 w-9 place-items-center rounded-xl ${active ? 'bg-forest-700 text-sand-50' : 'bg-sand-100 text-forest-700/60'}`}><Icon size={18} /></span>
                        <span className={active ? 'text-forest-700' : 'text-forest-700/70'}>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="mb-2 block text-sm font-semibold text-forest-700/80">صورة الغلاف</span>
                <div className="flex gap-2 overflow-x-auto">
                  {PLACEHOLDER_COVERS.map((url) => (
                    <button key={url} onClick={() => setCover(url)} className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${cover === url ? 'border-terra-500 ring-2 ring-terra-500/30' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                      <img src={url} alt="غلاف" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-sand-200 bg-sand-100 px-6 py-4">
              <button onClick={onClose} className="rounded-2xl border border-sand-300 bg-sand-50 px-6 py-3 font-bold text-forest-700/70 transition-colors hover:bg-sand-200">إلغاء</button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={!title.trim() || !gradeLevel} className="rounded-2xl bg-forest-700 px-7 py-3 font-bold text-sand-50 shadow-tactile transition-all hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-50">
                {mode === 'edit' ? 'حفظ التعديلات' : 'حفظ الكورس'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============ Upload Video Modal ============ */

function UploadVideoModal({ open, onClose, courses }: { open: boolean; onClose: () => void; courses: TeacherCourse[] }) {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (open) { setSelectedCourse(''); setLessonTitle(''); setVideoUrl(''); setUploadProgress(0); }
  }, [open]);

  function handleUpload() {
    if (!selectedCourse || !lessonTitle.trim()) return;
    setUploading(true);
    setUploadProgress(0);
    const interval = window.setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) { window.clearInterval(interval); setUploading(false); onClose(); return 100; }
        return p + 10;
      });
    }, 150);
  }

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget && !uploading) onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleBackdrop} className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-forest-900/60 p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 30 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }} className="relative my-8 w-full max-w-lg overflow-hidden rounded-3xl border border-sand-200 bg-sand-50 shadow-ticket">
            <div className="relative flex items-center justify-between bg-gradient-to-l from-forest-700 to-jungle-500 p-5 text-sand-50">
              <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-terra-500/30 blur-2xl" />
              <div className="relative flex items-center gap-2">
                <Video size={20} className="text-terra-300" />
                <h2 className="font-display text-xl font-extrabold">رفع فيديو درس</h2>
              </div>
              <button onClick={onClose} disabled={uploading} className="relative grid h-9 w-9 place-items-center rounded-xl bg-sand-50/15 text-sand-50 transition-colors hover:bg-sand-50/25 disabled:opacity-50" aria-label="إغلاق">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-forest-700/80">اختر الكورس</span>
                <div className="flex items-center gap-3 rounded-2xl border border-sand-300 bg-sand-50 px-4 transition-all focus-within:border-terra-500 focus-within:shadow-glow">
                  <BookOpen size={18} className="text-forest-700/50" />
                  <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className={`w-full appearance-none bg-transparent py-3.5 focus:outline-none ${selectedCourse ? 'text-forest-700' : 'text-sand-400'}`}>
                    <option value="" disabled>اختر الكورس</option>
                    {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
              </label>

              <ModalField label="عنوان الدرس" icon={<Video size={18} />}>
                <input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="مثال: الدرس الأول - مقدمة" className="w-full bg-transparent py-3.5 text-forest-700 placeholder:text-sand-400 focus:outline-none" />
              </ModalField>

              <ModalField label="رابط الفيديو (MP4 / YouTube)" icon={<Upload size={18} />}>
                <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." className="w-full bg-transparent py-3.5 text-forest-700 placeholder:text-sand-400 focus:outline-none" />
              </ModalField>

              {/* Drop zone */}
              <div className="rounded-2xl border-2 border-dashed border-sand-300 bg-sand-100/50 p-6 text-center">
                <Upload size={28} className="mx-auto mb-2 text-forest-700/40" />
                <p className="text-sm font-bold text-forest-700/60">اسحب ملف الفيديو هنا</p>
                <p className="text-xs text-forest-700/40">أو الصق رابط الفيديو بالأعلى</p>
              </div>

              {/* Upload progress */}
              <AnimatePresence>
                {uploading && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="flex items-center gap-2 text-sm font-bold text-forest-700">
                      <Loader2 size={16} className="animate-spin" />
                      جاري رفع الفيديو... {uploadProgress}%
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand-200">
                      <motion.div animate={{ width: `${uploadProgress}%` }} className="h-full rounded-full bg-gradient-to-l from-forest-700 to-jungle-500" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-sand-200 bg-sand-100 px-6 py-4">
              <button onClick={onClose} disabled={uploading} className="rounded-2xl border border-sand-300 bg-sand-50 px-6 py-3 font-bold text-forest-700/70 transition-colors hover:bg-sand-200 disabled:opacity-50">إلغاء</button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleUpload} disabled={!selectedCourse || !lessonTitle.trim() || uploading} className="rounded-2xl bg-forest-700 px-7 py-3 font-bold text-sand-50 shadow-tactile transition-all hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-50">
                {uploading ? 'جاري الرفع...' : 'رفع الفيديو'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============ Confirm Dialog ============ */

function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }: { title: string; message: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void }) {
  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onCancel();
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleBackdrop} className="fixed inset-0 z-[95] grid place-items-center bg-forest-900/60 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} className="w-full max-w-sm rounded-3xl border border-sand-200 bg-sand-50 p-6 text-center shadow-ticket">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-red-500/10 text-red-500">
          <AlertCircle size={28} />
        </div>
        <h3 className="font-display text-xl font-extrabold text-forest-700">{title}</h3>
        <p className="mt-2 text-sm text-forest-700/60">{message}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-2xl border border-sand-300 bg-sand-50 py-3 font-bold text-forest-700/70 transition-colors hover:bg-sand-200">إلغاء</button>
          <button onClick={onConfirm} className="flex-1 rounded-2xl bg-red-500 py-3 font-bold text-sand-50 shadow-tactile transition-all hover:bg-red-600">{confirmLabel}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ModalField({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-forest-700/80">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-sand-300 bg-sand-50 px-4 transition-all focus-within:border-terra-500 focus-within:shadow-glow">
        <span className="text-forest-700/50">{icon}</span>
        {children}
      </div>
    </label>
  );
}
