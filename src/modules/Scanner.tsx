import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  Send,
  UserCheck,
  UserX,
  Activity,
  Search,
  Users,
  Clock,
  UserMinus,
  X,
  AlertOctagon,
  Radar,
  QrCode,
} from 'lucide-react';
import { SCANNER_STUDENTS, type ScannerStudent } from '@/lib/data';

export type RouteId = 'home' | 'auth' | 'dashboard' | 'checkout' | 'scanner' | 'teacher';

type Status = 'present' | 'late' | 'absent' | 'rejected';

interface FeedEntry {
  id: string;
  name: string;
  barcode: string;
  course: string;
  time: string;
  status: Status;
}

const SESSION = {
  title: 'مراجعة الفيزياء - المجموعة أ',
  subtitle: 'الأحد · 4:00 م - 6:00 م · قاعة C',
  totalRoster: 18,
};

export function Scanner() {
  const [input, setInput] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [result, setResult] = useState<ScannerStudent | null>(null);
  const [resultType, setResultType] = useState<'ok' | 'fail' | null>(null);
  const [resultStatus, setResultStatus] = useState<'present' | 'late' | 'rejected' | null>(null);
  const [scanning, setScanning] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [sessionClosed, setSessionClosed] = useState(false);
  const [feed, setFeed] = useState<FeedEntry[]>([
    { id: 'f1', name: 'ليث الحسيني', barcode: 'BW-2026-0007-LH', course: SESSION.title, time: '08:01:14', status: 'present' },
    { id: 'f2', name: 'ميرا عبد الله', barcode: 'BW-2026-0011-MR', course: SESSION.title, time: '08:03:42', status: 'late' },
  ]);
  const [query, setQuery] = useState('');
  const feedRef = useRef<HTMLDivElement>(null);

  const presentCount = feed.filter((e) => e.status === 'present').length;
  const lateCount = feed.filter((e) => e.status === 'late').length;
  const remainingCount = Math.max(0, SESSION.totalRoster - presentCount - lateCount);

  const filteredFeed = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return feed;
    return feed.filter((e) =>
      e.name.toLowerCase().includes(q) ||
      e.barcode.toLowerCase().includes(q) ||
      e.status.includes(q),
    );
  }, [feed, query]);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [feed]);

  function submit(barcodeArg?: string) {
    if (sessionClosed) return;
    const code = (barcodeArg ?? input).trim();
    if (!code) return;
    setScanning(true);
    setResult(null);
    setResultType(null);
    setResultStatus(null);

    window.setTimeout(() => {
      const match = SCANNER_STUDENTS.find((s) => s.barcode.toLowerCase() === code.toLowerCase());
      setScanning(false);
      if (match && match.enrolled) {
        const isLate = match.id === 's2';
        const status: 'present' | 'late' = isLate ? 'late' : 'present';
        setResult(match);
        setResultType('ok');
        setResultStatus(status);
        setFeed((prev) => [
          { id: `f${Date.now()}`, name: match.name, barcode: match.barcode, course: SESSION.title, time: now(), status },
          ...prev,
        ]);
      } else if (match && !match.enrolled) {
        setResult(match);
        setResultType('fail');
        setResultStatus('rejected');
        setFeed((prev) => [
          { id: `f${Date.now()}`, name: match.name, barcode: match.barcode, course: SESSION.title, time: now(), status: 'rejected' as Status },
          ...prev,
        ]);
      } else {
        setResult({ id: 'unknown', name: 'غير معروف', grade: '—', avatar: '', enrolled: false, barcode: code });
        setResultType('fail');
        setResultStatus('rejected');
        setFeed((prev) => [
          { id: `f${Date.now()}`, name: 'غير معروف', barcode: code, course: SESSION.title, time: now(), status: 'rejected' as Status },
          ...prev,
        ]);
      }
      setInput('');
    }, 650);
  }

  function quickScan(s: ScannerStudent) {
    submit(s.barcode);
  }

  return (
    <div className="min-h-screen bg-emerald-950 pt-24">
      {/* Ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-emerald-600/15 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-8 lg:px-10">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-right">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                <Activity size={12} /> SignalR · متصل
              </span>
              <h1 className="mt-3 font-display text-4xl font-extrabold text-emerald-50">ماسح الحضور</h1>
              <p className="text-emerald-200/60">واجهة المساعد · بوابة القاعة</p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-900/50 text-emerald-400 ring-1 ring-emerald-700/40">
              <Radar size={32} className="animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Session stats & control bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 overflow-hidden rounded-3xl border border-emerald-800/60 bg-emerald-900/40 shadow-deep backdrop-blur-md"
        >
          <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <div className="text-right">
                <h2 className="font-display text-lg font-bold text-emerald-50">{SESSION.title}</h2>
                <p className="text-xs text-emerald-300/70">{SESSION.subtitle}</p>
              </div>
              <div className="hidden h-10 w-px bg-emerald-800/60 sm:block" />
              <div className="flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-950/60 px-3 py-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs font-bold text-emerald-200">
                  {sessionClosed ? 'تم إغلاق الجلسة' : 'جلسة نشطة • جاري المسح'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <StatCounter icon={Users} value={presentCount} label="إجمالي الحضور" color="emerald" />
              <StatCounter icon={Clock} value={lateCount} label="متأخر" color="amber" />
              <StatCounter icon={UserMinus} value={remainingCount} label="الغياب المتبقي" color="rose" />
              <button
                onClick={() => setShowCloseModal(true)}
                disabled={sessionClosed}
                className="ml-1 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-l from-rose-600 to-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-900/40 transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                <AlertOctagon size={16} />
                {sessionClosed ? 'تم الإغلاق' : 'إغلاق الجلسة وتسجيل الغياب'}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Scanner column */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-3xl border border-emerald-800/60 bg-emerald-900/40 shadow-deep backdrop-blur-md">
              {/* Scanner viewport */}
              <div className="relative h-64 overflow-hidden bg-emerald-950">
                {/* Radar grid */}
                <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(16,185,129,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.35)_1px,transparent_1px)] [background-size:28px_28px]" />
                {/* Radar rings */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="h-40 w-40 rounded-full border border-emerald-500/30" />
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="h-28 w-28 rounded-full border border-emerald-500/20" />
                </div>
                {/* Corner brackets */}
                <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-emerald-400/70" />
                <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-emerald-400/70" />
                <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-emerald-400/70" />
                <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-emerald-400/70" />

                {/* Scanning laser line */}
                <div className="absolute inset-x-0 top-0 h-64 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 animate-scan bg-gradient-to-l from-transparent via-emerald-300 to-transparent shadow-[0_0_24px_6px_rgba(52,211,153,0.55)]" />
                  <div className="absolute inset-x-6 top-0 h-px animate-scan bg-emerald-200/40" />
                </div>

                {/* Center icon with pulsing rings */}
                <div className="absolute inset-0 grid place-items-center">
                  <div className="relative grid place-items-center">
                    <span className="absolute h-20 w-20 animate-pulseRing rounded-full bg-emerald-500/30" />
                    <span className="absolute h-20 w-20 animate-pulseRing rounded-full bg-emerald-500/20 [animation-delay:1s]" />
                    <motion.div
                      animate={scanning ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                      transition={{ duration: 0.6, repeat: scanning ? Infinity : 0 }}
                      className="relative grid h-16 w-16 place-items-center rounded-2xl bg-emerald-900/70 ring-1 ring-emerald-500/40"
                    >
                      <QrCode size={32} className="text-emerald-300" />
                    </motion.div>
                  </div>
                </div>

                {/* Status label */}
                <div className="absolute bottom-3 right-4 flex items-center gap-2 rounded-full bg-emerald-950/70 px-3 py-1 text-xs font-mono text-emerald-200/80">
                  <span className={`h-2 w-2 rounded-full ${scanning ? 'animate-pulse bg-amber-400' : 'bg-emerald-400'}`} />
                  {scanning ? 'جاري المسح...' : 'جاهز للمسح'}
                </div>
                <div className="absolute bottom-3 left-4 rounded-full bg-emerald-950/70 px-3 py-1 font-mono text-[10px] text-emerald-300/60">
                  RDR-2026
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-emerald-800/60 p-5">
                <form
                  onSubmit={(e) => { e.preventDefault(); submit(); }}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`flex flex-1 items-center gap-3 rounded-2xl border bg-emerald-950/60 px-4 transition-all duration-200 ${
                      inputFocused
                        ? 'border-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.15),0_0_24px_rgba(52,211,153,0.2)]'
                        : 'border-emerald-700/50'
                    }`}
                  >
                    <ScanLine size={18} className={inputFocused ? 'text-emerald-300' : 'text-emerald-500/70'} />
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      placeholder="أدخل الباركود أو امسحه..."
                      className="w-full bg-transparent py-3.5 font-mono text-emerald-50 placeholder:text-emerald-200/30 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500 text-emerald-950 shadow-glow transition-transform hover:scale-105"
                  >
                    <Send size={18} className="-rotate-180" />
                  </button>
                </form>

                {/* Quick scan chips */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-emerald-200/40">مسح سريع:</span>
                  {SCANNER_STUDENTS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => quickScan(s)}
                      className="rounded-full border border-emerald-700/50 bg-emerald-950/60 px-3 py-1 font-mono text-xs text-emerald-200/70 transition-colors hover:border-emerald-400 hover:text-emerald-50"
                    >
                      {s.barcode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Verified student card */}
            <AnimatePresence mode="wait">
              {result && resultType && (
                <motion.div
                  key={result.id + (resultStatus ?? '')}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  className={`mt-5 overflow-hidden rounded-3xl border-2 shadow-deep ${
                    resultType === 'ok'
                      ? 'border-emerald-400 bg-emerald-900/50'
                      : 'border-rose-500/70 bg-emerald-900/50'
                  }`}
                >
                  <div className="flex items-center gap-4 p-5">
                    {/* Avatar / checkmark animation */}
                    <div className="relative">
                      {result.avatar ? (
                        <img
                          src={result.avatar}
                          alt={result.name}
                          className={`h-20 w-20 rounded-2xl object-cover ring-4 ${
                            resultType === 'ok' ? 'ring-emerald-400' : 'ring-rose-500/70'
                          }`}
                        />
                      ) : (
                        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-emerald-950 text-rose-400">
                          <UserX size={36} />
                        </div>
                      )}
                      {resultType === 'ok' && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.2 }}
                          className="absolute -bottom-2 -left-2 grid h-8 w-8 place-items-center rounded-full bg-emerald-400 text-emerald-950 shadow-lg ring-2 ring-emerald-900"
                        >
                          <CheckCircle2 size={18} />
                        </motion.span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 text-right">
                      {resultType === 'ok' ? (
                        <>
                          <div className="flex items-center justify-end gap-2 text-emerald-300">
                            <span className="font-display text-xl font-extrabold">تم تسجيل الحضور</span>
                            <CheckCircle2 size={24} />
                          </div>
                          <p className="mt-1 font-bold text-emerald-50">{result.name}</p>
                          <p className="text-sm text-emerald-200/60">{result.grade} · {result.barcode}</p>
                          <p className="mt-1 text-xs text-emerald-300/50">الكورس: {SESSION.title} · {now()}</p>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-end gap-2 text-rose-400">
                            <span className="font-display text-xl font-extrabold">الطالب غير مشترك</span>
                            <AlertTriangle size={24} />
                          </div>
                          <p className="mt-1 font-bold text-emerald-50">{result.name}</p>
                          <p className="text-sm text-emerald-200/60">الباركود: {result.barcode}</p>
                        </>
                      )}
                    </div>

                    {/* Status badge */}
                    {resultType === 'ok' && resultStatus && (
                      <span
                        className={`animate-badgePop self-start rounded-full px-3 py-1 text-xs font-bold ${
                          resultStatus === 'late'
                            ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/50'
                            : 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/50'
                        }`}
                      >
                        {resultStatus === 'late' ? 'متأخر' : 'حاضر'}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Live attendance feed */}
          <div className="lg:col-span-2">
            <div className="flex h-[600px] flex-col overflow-hidden rounded-3xl border border-emerald-800/60 bg-emerald-900/40 shadow-deep backdrop-blur-md">
              {/* Header */}
              <div className="border-b border-emerald-800/60 bg-emerald-950/40 px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-display text-base font-bold text-emerald-50">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </span>
                    سجل الحضور الفوري
                  </h3>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-300">
                    {feed.length} سجل
                  </span>
                </div>
                {/* Search / filter mini-bar */}
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-800/60 bg-emerald-950/50 px-3 py-2">
                  <Search size={15} className="text-emerald-400/70" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ابحث بالاسم أو الباركود..."
                    className="w-full bg-transparent text-sm text-emerald-50 placeholder:text-emerald-200/30 focus:outline-none"
                  />
                  {query && (
                    <button onClick={() => setQuery('')} className="text-emerald-400/60 hover:text-emerald-200">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Feed list */}
              <div ref={feedRef} className="flex-1 space-y-2.5 overflow-y-auto p-4">
                {filteredFeed.length === 0 && (
                  <div className="grid h-full place-items-center text-center text-sm text-emerald-200/40">
                    لا توجد سجلات مطابقة
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {filteredFeed.map((entry) => (
                    <motion.div
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 24 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="animate-slideIn flex items-center gap-3 rounded-2xl border border-emerald-800/40 bg-emerald-950/40 p-3 backdrop-blur-sm transition-colors hover:border-emerald-700/60"
                    >
                      {/* Avatar / initials */}
                      <div
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-bold ${
                          entry.status === 'present'
                            ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                            : entry.status === 'late'
                              ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                              : 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40'
                        }`}
                      >
                        {initials(entry.name)}
                      </div>

                      {/* Name + barcode */}
                      <div className="flex-1 text-right">
                        <p className="text-sm font-bold text-emerald-50">{entry.name}</p>
                        <p className="font-mono text-[11px] text-emerald-300/60">{entry.barcode}</p>
                      </div>

                      {/* Status + time */}
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            entry.status === 'present'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : entry.status === 'late'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {entry.status === 'present' ? 'حاضر' : entry.status === 'late' ? 'متأخر' : 'مرفوض'}
                        </span>
                        <span className="font-mono text-[10px] text-emerald-300/50">{entry.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Footer summary */}
              <div className="border-t border-emerald-800/60 bg-emerald-950/40 px-5 py-3 text-xs text-emerald-200/60">
                <span className="font-bold text-emerald-300">{presentCount}</span> حاضر ·{' '}
                <span className="font-bold text-amber-300">{lateCount}</span> متأخر ·{' '}
                <span className="font-bold text-rose-300">{remainingCount}</span> متبقي
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close session confirmation modal */}
      <AnimatePresence>
        {showCloseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-emerald-950/70 p-5 backdrop-blur-sm"
            onClick={() => setShowCloseModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-3xl border border-rose-500/40 bg-emerald-900 shadow-deep"
            >
              <div className="flex items-center gap-3 border-b border-rose-500/20 bg-rose-500/10 p-5">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-500/20 text-rose-300">
                  <AlertOctagon size={24} />
                </div>
                <div className="text-right">
                  <h3 className="font-display text-lg font-bold text-emerald-50">إغلاق الجلسة وتسجيل الغياب</h3>
                  <p className="text-xs text-emerald-200/60">سيتم تسجيل {remainingCount} طالب كغائبين وإرسال تنبيهات واتساب لأولياء الأمور.</p>
                </div>
              </div>
              <div className="space-y-3 p-5 text-right">
                <div className="flex items-center justify-between rounded-2xl bg-emerald-950/50 px-4 py-2.5 text-sm">
                  <span className="font-bold text-emerald-300">{presentCount + lateCount}</span>
                  <span className="text-emerald-200/70">حاضر فعلياً</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-emerald-950/50 px-4 py-2.5 text-sm">
                  <span className="font-bold text-rose-300">{remainingCount}</span>
                  <span className="text-emerald-200/70">سيُسجل كغائب</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-emerald-950/50 px-4 py-2.5 text-sm">
                  <span className="font-bold text-amber-300">{lateCount}</span>
                  <span className="text-emerald-200/70">تسجيلات متأخرة</span>
                </div>
              </div>
              <div className="flex gap-3 border-t border-emerald-800/60 p-5">
                <button
                  onClick={() => setShowCloseModal(false)}
                  className="flex-1 rounded-2xl border border-emerald-700/50 bg-emerald-950/60 px-4 py-3 text-sm font-bold text-emerald-200 transition-colors hover:bg-emerald-900/60"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    setSessionClosed(true);
                    setShowCloseModal(false);
                  }}
                  className="flex-1 rounded-2xl bg-gradient-to-l from-rose-600 to-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rose-900/40 transition-transform hover:scale-[1.02]"
                >
                  تأكيد الإغلاق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCounter({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: typeof Users;
  value: number;
  label: string;
  color: 'emerald' | 'amber' | 'rose';
}) {
  const palette = {
    emerald: 'text-emerald-300 bg-emerald-500/10 ring-emerald-500/30',
    amber: 'text-amber-300 bg-amber-500/10 ring-amber-500/30',
    rose: 'text-rose-300 bg-rose-500/10 ring-rose-500/30',
  }[color];

  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-800/40 bg-emerald-950/40 px-3 py-2">
      <div className={`grid h-9 w-9 place-items-center rounded-xl ring-1 ${palette}`}>
        <Icon size={16} />
      </div>
      <div className="text-right">
        <p className={`font-display text-lg font-extrabold leading-none ${palette.split(' ')[0]}`}>{value}</p>
        <p className="text-[10px] text-emerald-200/50">{label}</p>
      </div>
    </div>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return parts[0][0] + parts[1][0];
}

function now(): string {
  return new Date().toLocaleTimeString('en-GB');
}
