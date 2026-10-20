import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  PlayCircle,
  Video,
  FileText,
  ClipboardCheck,
  BookOpen,
  Users,
  Trophy,
  GraduationCap,
  CalendarDays,
  Layers,
  PenTool,
  RefreshCw,
  HeartHandshake,
  Quote,
  Gift,
  Star,
  Award,
  CheckCircle2,
  MonitorPlay,
  Scan,
} from 'lucide-react';
import type { RouteId } from '@/components/TopNav';

interface HomeProps {
  onNavigate: (r: RouteId) => void;
}

const HERO_VISUAL =
  'https://images.pexels.com/photos/8419491/pexels-photo-8419491.jpeg?auto=compress&cs=tinysrgb&h=900&w=1200';
const HERO_PORTRAIT =
  'https://images.pexels.com/photos/8199566/pexels-photo-8199566.jpeg?auto=compress&cs=tinysrgb&h=900&w=700';

const GRADE_BANNERS = [
  'https://images.pexels.com/photos/37898351/pexels-photo-37898351.jpeg?auto=compress&cs=tinysrgb&h=500&w=800',
  'https://images.pexels.com/photos/8419261/pexels-photo-8419261.jpeg?auto=compress&cs=tinysrgb&h=500&w=800',
  'https://images.pexels.com/photos/39191014/pexels-photo-39191014.jpeg?auto=compress&cs=tinysrgb&h=500&w=800',
];

const COURSE_THUMBS = [
  'https://images.pexels.com/photos/39191004/pexels-photo-39191004.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  'https://images.pexels.com/photos/5428257/pexels-photo-5428257.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  'https://images.pexels.com/photos/32279024/pexels-photo-32279024.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
];

const REASONS = [
  { n: 1, title: 'شرح بسيط ومفهوم', icon: BookOpen },
  { n: 2, title: 'فيديوهات ورسومات توضيحية', icon: Video },
  { n: 3, title: 'تمارين تفاعلية على الدروس', icon: PenTool },
  { n: 4, title: 'مرونة كاملة في المذاكرة (سنتر وأونلاين)', icon: MonitorPlay },
  { n: 5, title: 'اختبارات مستمرة وتصحيح فوري', icon: ClipboardCheck },
  { n: 6, title: 'محتوى متكامل وملازم PDF منظمة', icon: FileText },
  { n: 7, title: 'تحديث مستمر ومراجعات حسب المنهج', icon: RefreshCw },
  { n: 8, title: 'مجتمع طلابي ضخم ومتابعة دورية', icon: Users },
];

const GRADES = [
  { title: 'الصف الأول الثانوي', desc: 'تأسيس قوي وشرح مبسط لكل أجزاء المنهج', tag: 'تأسيس', icon: BookOpen },
  { title: 'الصف الثاني الثانوي', desc: 'فهم عميق وتدريب مكثف على نظام الأسئلة الجديد', tag: 'تدريب', icon: Layers },
  { title: 'الصف الثالث الثانوي', desc: 'معسكر التقفيل والمراجعات النهائية وبنوك الأسئلة', tag: 'تقفيل', icon: Trophy },
];

const COURSES = [
  {
    title: 'كورس الشهر الأول 2027 - شرح وحل شامل ⚡',
    price: '250 ج.م',
    grade: 'الصف الثالث الثانوي',
    date: 'أكتوبر 2026',
    videos: 42,
    exams: 6,
    desc: 'شرح تفصيلي لكل أبواب المنهج مع حل المسائل بأكثر من طريقة وتمارين متنوعة.',
  },
  {
    title: 'ورشة العمل الأولى والثانية (أونلاين + سنتر) 🔥',
    price: '300 ج.م',
    grade: 'الصف الثاني الثانوي',
    date: 'سبتمبر 2026',
    videos: 28,
    exams: 4,
    desc: 'ورش مكثفة تجمع بين الحضور الأونلاين والسنتر لتطبيق ما تم شرحه عملياً.',
  },
  {
    title: 'معسكر التقفيل النهائي 2027 🎯',
    price: '400 ج.م',
    grade: 'الصف الثالث الثانوي',
    date: 'ديسمبر 2026',
    videos: 60,
    exams: 12,
    desc: 'مراجعات نهائية شاملة مع بنك أسئلة متنوع وامتحانات تجريبية وتصحيح فوري.',
  },
];

const HERO_BADGES = [
  { label: 'شرح + حل', icon: BookOpen },
  { label: 'امتحانات دورية', icon: ClipboardCheck },
  { label: 'متابعة أونلاين وسنتر', icon: MonitorPlay },
];

export function Home({ onNavigate }: HomeProps) {
  const [courseFilter, setCourseFilter] = useState<'all' | 'ثالث' | 'ثاني' | 'أول'>('all');
  const { scrollYProgress } = useScroll();
  const heroFloat = useTransform(scrollYProgress, [0, 0.15], [0, -40]);

  const visibleCourses = COURSES.filter((c) => {
    if (courseFilter === 'all') return true;
    if (courseFilter === 'ثالث') return c.grade.includes('الثالث');
    if (courseFilter === 'ثاني') return c.grade.includes('الثاني');
    return c.grade.includes('الأول');
  });

  return (
    <div className="min-h-screen overflow-hidden bg-sand-50 pt-20">
      {/* ===== HERO ===== */}
      <section className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-12 pt-8 lg:grid-cols-2 lg:gap-8 lg:px-10 lg:pt-12">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-jungle-500/10 blur-3xl" />
          <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-terra-500/10 blur-3xl" />
        </div>

        {/* Right side — text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-right"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-jungle-500/10 px-4 py-1.5 text-sm font-semibold text-jungle-600">
            <Sparkles size={15} /> منصة بوابتك التعليمية · 2026/2027
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.2] text-forest-700 text-drop lg:text-5xl">
            منصتك الأولى لتعلّم وفهم المنهج
            <br />
            <span className="text-jungle-500">بأسلوب بسيط وممتع</span>
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-forest-700/70 lg:text-xl">
            معاك خطوة بخطوة من أول حصة لحد ليلة الامتحان.. شرح مبسط، حل بأكتر من طريقة، ومتابعة مستمرة لحد ما تقفّل المادة.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={() => onNavigate('auth')}
              className="group inline-flex items-center gap-2 rounded-2xl bg-terra-500 px-7 py-3.5 font-bold text-sand-50 shadow-glow transition-all hover:scale-[1.03] hover:bg-terra-600"
            >
              اشترك دلوقتي !
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="group inline-flex items-center gap-2 rounded-2xl border-2 border-forest-700/30 bg-transparent px-7 py-3.5 font-bold text-forest-700 transition-all hover:border-forest-700 hover:bg-forest-700/5"
            >
              استكشف الكورسات
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            </button>
          </div>

          {/* Bottom stats row */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-sand-200 pt-6">
            {[
              { n: '+50,000', l: 'طالب متفوق' },
              { n: '+1,200', l: 'محاضرة وامتحان' },
              { n: '24/7', l: 'دعم فني وعلمي معاك' },
            ].map((s) => (
              <div key={s.l} className="text-right">
                <p className="font-display text-2xl font-extrabold text-jungle-500 lg:text-3xl">{s.n}</p>
                <p className="text-xs text-forest-700/60 lg:text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Left side — hero visual */}
        <motion.div
          style={{ y: heroFloat }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-md lg:max-w-lg"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-terra-500/20 via-jungle-500/15 to-transparent blur-3xl" />

          {/* Main visual card */}
          <div className="relative overflow-hidden rounded-[2rem] border-4 border-sand-50 shadow-deep">
            <img
              src={HERO_VISUAL}
              alt="غرفة دراسة تفاعلية"
              className="h-[380px] w-full object-cover lg:h-[440px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 via-transparent to-forest-900/20" />

            {/* Top floating label */}
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-2xl bg-sand-50/90 px-3 py-2 shadow-tactile backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-jungle-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-jungle-500" />
              </span>
              <span className="text-xs font-bold text-forest-700">بث مباشر · شرح تفاعلي</span>
            </div>

            {/* Bottom info strip */}
            <div className="absolute bottom-4 right-4 left-4 flex items-center gap-3 rounded-2xl bg-sand-50/90 px-4 py-3 backdrop-blur-md">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-forest-700 text-sand-50">
                <GraduationCap size={20} />
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-forest-700">أ. كريم منصور</p>
                <p className="text-[11px] text-forest-700/60">مدرّس الفيزياء والكيمياء</p>
              </div>
              <span className="mr-auto flex items-center gap-1 rounded-lg bg-terra-500/15 px-2 py-1 text-[10px] font-bold text-terra-600">
                <Star size={10} /> 4.9
              </span>
            </div>
          </div>

          {/* Floating badges around visual */}
          {HERO_BADGES.map((b, i) => {
            const Icon = b.icon;
            const pos = [
              'right-0 -top-4 lg:-right-6',
              'left-0 top-1/3 lg:-left-6',
              'bottom-8 right-0 lg:-right-4',
            ][i];
            return (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.18, type: 'spring', stiffness: 200, damping: 16 }}
                className={`absolute ${pos} z-20 flex items-center gap-2 rounded-2xl bg-sand-50 px-3 py-2 shadow-tactile ring-1 ring-sand-200`}
              >
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-jungle-500/15 text-jungle-600">
                  <Icon size={14} />
                </div>
                <span className="text-xs font-bold text-forest-700">{b.label}</span>
              </motion.div>
            );
          })}

          {/* Side portrait accent */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute -bottom-6 left-2 hidden h-28 w-24 overflow-hidden rounded-2xl border-4 border-sand-50 shadow-tactile lg:block"
          >
            <img src={HERO_PORTRAIT} alt="طالب مذاكر" className="h-full w-full object-cover" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== SECTION: ليه تشترك معانا؟ ===== */}
      <Section
        eyebrow="ليه تشترك معانا؟"
        title="مميزات تجعل مذاكرتك أسهل وأمتع"
        subtitle="كل اللي تحتاجه عشان تفهم وتنجح في مكان واحد"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.n}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ type: 'spring', stiffness: 90, damping: 14, delay: (i % 4) * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border border-sand-200 bg-sand-50 p-6 shadow-tactile transition-colors hover:border-jungle-500/40"
              >
                {/* Decorative dot pattern */}
                <div className="pointer-events-none absolute left-4 top-4 opacity-40 [background-image:radial-gradient(circle,rgba(46,82,56,0.35)_1.5px,transparent_1.5px)] [background-size:10px_10px] [height:44px] [width:44px]" />

                {/* Big number */}
                <span className="absolute left-5 top-5 font-display text-6xl font-extrabold text-forest-700/10 transition-colors group-hover:text-jungle-500/20">
                  {r.n}
                </span>

                <div className="relative text-right">
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-forest-700 text-sand-50 shadow-tactile transition-transform group-hover:-rotate-6">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-base font-bold leading-snug text-forest-700">{r.title}</h3>
                </div>

                <div className="mt-4 h-1 w-0 rounded-full bg-terra-500 transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ===== SECTION: نظمتهالك يا صديقي ===== */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="mb-10 text-right">
          <p className="text-sm font-bold text-terra-600">نظمتهالك يا صديقي</p>
          <div className="mt-2 inline-block">
            <h2 className="font-display text-3xl font-extrabold text-forest-700 lg:text-4xl">
              اختار صفك الدراسي
            </h2>
            <div className="mx-auto mt-2 h-1 w-32 rounded-full bg-gradient-to-l from-terra-500 via-jungle-500 to-transparent shadow-[0_0_12px_rgba(217,119,6,0.5)]" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {GRADES.map((g, i) => {
            const Icon = g.icon;
            return (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ type: 'spring', stiffness: 90, damping: 14, delay: i * 0.12 }}
                className="group relative overflow-hidden rounded-3xl border border-sand-200 bg-sand-50 shadow-tactile transition-shadow hover:shadow-deep"
              >
                {/* Banner */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={GRADE_BANNERS[i]}
                    alt={g.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-forest-900/30 to-transparent" />
                  <span className="absolute right-4 top-4 rounded-full bg-terra-500 px-3 py-1 text-xs font-bold text-sand-50 shadow-glow">
                    {g.tag}
                  </span>
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sand-50/90 text-forest-700 backdrop-blur-sm">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-display text-xl font-extrabold text-sand-50 text-drop">{g.title}</h3>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 text-right">
                  <p className="leading-relaxed text-forest-700/70">{g.desc}</p>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-forest-700/20 px-4 py-3 font-bold text-forest-700 transition-colors hover:border-forest-700 hover:bg-forest-700/5"
                  >
                    تصفّح كورسات الصف
                    <ArrowLeft size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== SECTION: كورساتنا المتاحة ===== */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 text-right sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold text-terra-600">الكورسات</p>
            <h2 className="mt-1 font-display text-3xl font-extrabold text-forest-700 lg:text-4xl">
              كورساتنا المتاحة للعام 2026/2027
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {([
              { id: 'all', label: 'الكل' },
              { id: 'ثالث', label: 'ثالث ثانوي' },
              { id: 'ثاني', label: 'ثاني ثانوي' },
              { id: 'أول', label: 'أول ثانوي' },
            ] as const).map((f) => (
              <button
                key={f.id}
                onClick={() => setCourseFilter(f.id)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  courseFilter === f.id
                    ? 'bg-forest-700 text-sand-50 shadow-tactile'
                    : 'border border-sand-200 bg-sand-50 text-forest-700/70 hover:border-forest-700/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleCourses.map((c, i) => (
            <motion.div
              key={c.title}
              layout
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ type: 'spring', stiffness: 90, damping: 14, delay: i * 0.1 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-sand-200 bg-sand-50 shadow-tactile transition-shadow hover:shadow-deep"
            >
              {/* Thumbnail */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={COURSE_THUMBS[i % COURSE_THUMBS.length]}
                  alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 to-transparent" />
                <span className="absolute right-4 top-4 rounded-xl bg-terra-500 px-3 py-1.5 text-sm font-extrabold text-sand-50 shadow-glow">
                  {c.price}
                </span>
                <span className="absolute left-4 top-4 rounded-full bg-sand-50/90 px-3 py-1 text-xs font-bold text-forest-700 backdrop-blur-sm">
                  {c.grade}
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5 text-right">
                <h3 className="font-display text-lg font-extrabold leading-snug text-forest-700">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-forest-700/60">{c.desc}</p>

                {/* Metadata */}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-forest-700/55">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={13} /> {c.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Video size={13} /> {c.videos} فيديو
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ClipboardCheck size={13} /> {c.exams} امتحان
                  </span>
                </div>

                {/* Buttons */}
                <div className="mt-5 space-y-2.5">
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-forest-700/25 px-4 py-3 font-bold text-forest-700 transition-colors hover:border-forest-700 hover:bg-forest-700/5"
                  >
                    <PlayCircle size={17} /> الدخول للكورس
                  </button>
                  <button
                    onClick={() => onNavigate('checkout')}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-terra-500 px-4 py-3 font-bold text-sand-50 shadow-glow transition-transform hover:scale-[1.02] hover:bg-terra-600"
                  >
                    اشترك في الكورس !
                    <ArrowLeft size={17} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== SECTION: ذاكر واكسب ===== */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-terra-500/30 bg-gradient-to-l from-forest-700 to-forest-800 shadow-deep"
        >
          <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-terra-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 right-1/4 h-48 w-48 rounded-full bg-jungle-500/30 blur-3xl" />

          <div className="relative grid grid-cols-1 items-center gap-8 p-8 lg:grid-cols-2 lg:p-12">
            {/* Text side */}
            <div className="text-right">
              <span className="inline-flex items-center gap-2 rounded-full bg-terra-500/20 px-3 py-1 text-sm font-bold text-terra-300">
                <Gift size={15} /> مسابقات وجوائز
              </span>
              <h2 className="mt-4 font-display text-4xl font-extrabold text-sand-50 lg:text-5xl">ذاكر واكسب! 🎁</h2>
              <p className="mt-4 text-lg leading-relaxed text-sand-200/80">
                وفرنالك أجواء منافسة بينك وبين زمايلك عشان تشجعك تذاكر.. لو طلعت من الأوائل في الامتحانات الشهرية والـ Quizzes هتحصل على جوائز وهدايا قيمة ومفاجآت مستمرة!
              </p>
              <button
                onClick={() => onNavigate('auth')}
                className="group mt-7 inline-flex items-center gap-2 rounded-2xl bg-terra-500 px-7 py-3.5 font-bold text-sand-50 shadow-glow transition-transform hover:scale-[1.03]"
              >
                سجل وجرب الآن
                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              </button>
            </div>

            {/* Visual side — trophy + floating reward cards */}
            <div className="relative grid place-items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                className="grid h-40 w-40 place-items-center rounded-full bg-terra-500/20 ring-4 ring-terra-500/30"
              >
                <div className="grid h-28 w-28 place-items-center rounded-full bg-terra-500 text-sand-50 shadow-glow">
                  <Trophy size={56} />
                </div>
              </motion.div>

              {[
                { icon: Award, label: 'الأوائل', pos: 'right-0 top-2' },
                { icon: Star, label: 'Quizzes', pos: 'left-2 top-10' },
                { icon: Gift, label: 'هدايا', pos: 'bottom-4 right-6' },
              ].map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.div
                    key={b.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className={`absolute ${b.pos} flex items-center gap-2 rounded-2xl bg-sand-50/95 px-3 py-2 shadow-tactile backdrop-blur-sm`}
                  >
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-jungle-500/15 text-jungle-600">
                      <Icon size={14} />
                    </div>
                    <span className="text-xs font-bold text-forest-700">{b.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== SECTION: كلمة من معلمك ===== */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 overflow-hidden rounded-[2rem] border border-sand-200 shadow-deep lg:grid-cols-2"
        >
          {/* Emerald quote side */}
          <div className="relative bg-forest-700 p-8 text-right lg:p-12">
            <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-jungle-500/30 blur-2xl" />
            <Quote className="text-jungle-400" size={48} />
            <p className="mt-4 font-display text-2xl font-bold leading-relaxed text-sand-50 lg:text-3xl">
              "صحصح شوية وشد حيلك معانا... هنمشيها سوا خطوة بخطوة لحد ما نختم المنهج، تقفّل المادة، وتبقى فرحة في بيتك!"
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <div className="text-right">
                <p className="font-bold text-sand-50">أ. كريم منصور</p>
                <p className="text-sm text-sand-200/70">مدرّس الفيزياء والكيمياء · مؤسس بوابتك</p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-jungle-500 text-sand-50 shadow-glow">
                <GraduationCap size={24} />
              </div>
            </div>
          </div>

          {/* Pillars side */}
          <div className="bg-sand-50 p-8 lg:p-12">
            <p className="mb-6 text-right text-sm font-bold text-terra-600">ليه تختار بوابتك؟</p>
            <div className="space-y-4">
              {[
                { icon: Video, title: 'محاضرات بجودة فائقة', desc: 'صوت وصورة واضحة مع إمكانية المراجعة في أي وقت.' },
                { icon: PenTool, title: 'تطبيقات وتمارين تفاعلية', desc: 'تمارين بعد كل درس مع تصحيح فوري وتتبع تقدّمك.' },
                { icon: ClipboardCheck, title: 'امتحانات ومتابعة دورية', desc: 'امتحانات شهرية وأسبوعية مع تقارير ترسل لأولياء الأمور.' },
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    className="group flex items-start gap-4 rounded-2xl border border-sand-200 bg-sand-50 p-4 transition-colors hover:border-jungle-500/40"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-forest-700 text-sand-50 shadow-tactile transition-transform group-hover:-rotate-6">
                      <Icon size={22} />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <h3 className="font-display text-lg font-bold text-forest-700">{p.title}</h3>
                        <CheckCircle2 size={16} className="text-jungle-500" />
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-forest-700/60">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== CTA STRIP ===== */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-l from-terra-500 to-terra-600 px-8 py-12 text-sand-50 shadow-deep lg:px-14 lg:py-16"
        >
          <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-sand-50/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-6 h-56 w-56 rounded-full bg-forest-700/20 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-right">
              <h3 className="font-display text-3xl font-extrabold lg:text-4xl">جاهز تبدأ رحلتك للتفوق؟</h3>
              <p className="mt-2 text-sand-50/80">انضم ل+50,000 طالب متفوق دلوقتي واطّلع على كل كورساتنا.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('auth')}
                className="inline-flex items-center gap-2 rounded-2xl bg-forest-700 px-8 py-4 font-bold text-sand-50 shadow-tactile transition-transform hover:scale-105"
              >
                سجّل دلوقتي <ArrowLeft size={18} />
              </button>
              <button
                onClick={() => onNavigate('scanner')}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-sand-50/40 bg-sand-50/10 px-6 py-4 font-bold text-sand-50 backdrop-blur-sm transition-colors hover:bg-sand-50/20"
              >
                <Scan size={18} /> ماسح الحضور
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

/* ============ Section wrapper ============ */
function Section({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <div className="mb-10 text-right">
        <p className="text-sm font-bold text-terra-600">{eyebrow}</p>
        <h2 className="mt-1 font-display text-3xl font-extrabold text-forest-700 lg:text-4xl">{title}</h2>
        <p className="mt-2 text-forest-700/60">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
