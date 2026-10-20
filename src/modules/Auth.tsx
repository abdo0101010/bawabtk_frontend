import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  User as UserIcon,
  ArrowLeft,
  DoorOpen,
  Sun,
  Phone,
  GraduationCap,
  School,
  Image as ImageIcon,
  MessageCircle,
  Users,
  Briefcase,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronLeft,
  ShieldCheck,
} from 'lucide-react';
import type { RouteId } from '@/components/TopNav';

interface AuthProps {
  onNavigate: (r: RouteId) => void;
}

type Role = 'student' | 'parent' | 'teacher';

const ROLES: { id: Role; label: string; icon: typeof GraduationCap }[] = [
  { id: 'student', label: 'طالب', icon: GraduationCap },
  { id: 'parent', label: 'ولي أمر', icon: Users },
  { id: 'teacher', label: 'معلم / إدارة', icon: ShieldCheck },
];

const GRADE_LEVELS = [
  'الصف الأول الثانوي',
  'الصف الثاني الثانوي',
  'الصف الثالث الثانوي',
];

const RELATION_TYPES = ['الأب', 'الأم', 'الأخ', 'أخرى'];

const EMPTY_PAYLOAD: RegisterPayload = {
  studentFullName: '',
  studentPhoneNumber: '',
  studentEmail: '',
  password: '',
  gradeLevel: '',
  schoolName: '',
  profilePictureUrl: '',
  parentFullName: '',
  parentWhatsAppNumber: '',
  relationType: '',
  parentJobTitle: '',
  address: '',
};

interface RegisterPayload {
  studentFullName: string;
  studentPhoneNumber: string;
  studentEmail: string;
  password: string;
  gradeLevel: string;
  schoolName: string;
  profilePictureUrl: string;
  parentFullName: string;
  parentWhatsAppNumber: string;
  relationType: string;
  parentJobTitle: string;
  address: string;
}

export function Auth({ onNavigate }: AuthProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [doorOpen, setDoorOpen] = useState(false);
  const [role, setRole] = useState<Role>('student');

  // Register wizard state
  const [step, setStep] = useState<1 | 2>(1);
  const [payload, setPayload] = useState<RegisterPayload>(EMPTY_PAYLOAD);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterPayload, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(false);

  function set<K extends keyof RegisterPayload>(key: K, value: string) {
    setPayload((p) => ({ ...p, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDoorOpen(true);
    const dest: RouteId = role === 'teacher' ? 'teacher' : 'dashboard';
    window.setTimeout(() => onNavigate(dest), 3400);
  }

  function validateStep1(): boolean {
    const e: Partial<Record<keyof RegisterPayload, string>> = {};
    if (!payload.studentFullName.trim()) e.studentFullName = 'الاسم الكامل مطلوب';
    if (!/^(010|011|012|015)\d{8}$/.test(payload.studentPhoneNumber))
      e.studentPhoneNumber = 'رقم هاتف مصري غير صحيح (مثال: 01012345678)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.studentEmail))
      e.studentEmail = 'البريد الإلكتروني غير صحيح';
    if (payload.password.length < 6) e.password = 'كلمة المرور لا تقل عن 6 أحرف';
    if (!payload.gradeLevel) e.gradeLevel = 'اختر المرحلة الدراسية';
    if (!payload.schoolName.trim()) e.schoolName = 'اسم المدرسة مطلوب';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2(): boolean {
    const e: Partial<Record<keyof RegisterPayload, string>> = {};
    if (!payload.parentFullName.trim()) e.parentFullName = 'اسم ولي الأمر مطلوب';
    if (!/^(010|011|012|015)\d{8}$/.test(payload.parentWhatsAppNumber))
      e.parentWhatsAppNumber = 'رقم واتساب غير صحيح (مثال: 01012345678)';
    if (payload.parentWhatsAppNumber && payload.parentWhatsAppNumber === payload.studentPhoneNumber)
      e.parentWhatsAppNumber = 'لا يمكن أن يكون رقم ولي الأمر نفس رقم الطالب';
    if (!payload.relationType) e.relationType = 'اختر صلة القرابة';
    if (!payload.parentJobTitle.trim()) e.parentJobTitle = 'وظيفة ولي الأمر مطلوبة';
    if (!payload.address.trim()) e.address = 'العنوان مطلوب';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (validateStep1()) setStep(2);
  }

  function prevStep() {
    setStep(1);
  }

  function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep2()) return;
    // Payload is structured with the exact camelCase keys the .NET backend expects.
    setRegistered(true);
    window.setTimeout(() => onNavigate('dashboard'), 3000);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-forest-700 pt-20">
      {/* Ambient warm light behind the door */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest-800 via-forest-700 to-forest-900" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl grid-cols-1 items-center gap-10 px-6 py-10 lg:grid-cols-2 lg:px-10">
        {/* ===== LEFT: the illustrated gateway ===== */}
        <div className="relative order-2 flex h-[420px] items-center justify-center lg:order-1 lg:h-[600px]">
          {/* Warm light spill */}
          <motion.div
            animate={doorOpen || registered ? { opacity: 1, scale: 2.5 } : { opacity: 0.35, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute h-72 w-72 rounded-full bg-terra-500/40 blur-3xl"
          />

          {/* The Doorway */}
          <div className="relative h-[380px] w-[260px] lg:h-[520px] lg:w-[360px]">
            {/* Door frame */}
            <div className="absolute inset-0 rounded-t-[8rem] border-[6px] border-forest-900/60 bg-forest-900/30" />
            {/* Interior warm glow (revealed when open) */}
            <motion.div
              animate={doorOpen || registered ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-2 rounded-t-[7.5rem] bg-gradient-to-b from-terra-400 via-terra-500 to-terra-600"
            >
              <motion.div
                animate={doorOpen || registered ? { y: [0, -12, 0], opacity: [0.4, 0.7, 0.4] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute left-1/2 top-1/3 -translate-x-1/2"
              >
                <Sun className="text-sand-50" size={64} />
              </motion.div>
            </motion.div>

            {/* Left door panel */}
            <motion.div
              animate={doorOpen || registered ? { rotateY: -105 } : { rotateY: 0 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'right center' }}
              className="absolute inset-y-0 right-0 left-1/2 rounded-t-[8rem] border-l-2 border-forest-900/40 bg-gradient-to-l from-forest-800 to-forest-700 shadow-deep"
            >
              <div className="absolute inset-4 rounded-t-[6rem] border border-terra-500/30" />
              <div className="absolute right-6 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-terra-500 shadow-glow" />
            </motion.div>

            {/* Right door panel (RTL — appears on left when closed) */}
            <motion.div
              animate={doorOpen || registered ? { rotateY: 105 } : { rotateY: 0 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left center' }}
              className="absolute inset-y-0 right-1/2 left-0 rounded-t-[8rem] border-r-2 border-forest-900/40 bg-gradient-to-r from-forest-800 to-forest-700 shadow-deep"
            >
              <div className="absolute inset-4 rounded-t-[6rem] border border-terra-500/30" />
              <div className="absolute left-6 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-terra-500 shadow-glow" />
            </motion.div>

            {/* Silhouette stepping through (revealed when open) */}
            <AnimatePresence>
              {(doorOpen || registered) && (
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="grid h-28 w-28 place-items-end rounded-t-full bg-forest-900/80 lg:h-36 lg:w-36" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Caption */}
          <motion.p
            animate={doorOpen || registered ? { opacity: 0 } : { opacity: 1 }}
            className="absolute bottom-0 text-center text-sand-200/70"
          >
            <DoorOpen className="mx-auto mb-2" size={20} />
            اعبر البوابة نحو مستقبلك التعليمي
          </motion.p>
        </div>

        {/* ===== RIGHT: auth form ===== */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: doorOpen || registered ? 0 : 1, x: doorOpen || registered ? -30 : 0, scale: doorOpen || registered ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
          className={`order-1 rounded-[2rem] border border-sand-200/20 bg-sand-50/95 p-8 shadow-deep backdrop-blur-xl lg:order-2 lg:p-10 ${mode === 'signup' ? 'lg:max-w-xl' : ''}`}
        >
          {/* Mode toggle */}
          <div className="mb-8 flex rounded-2xl bg-sand-100 p-1.5">
            {(['signin', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setStep(1); setErrors({}); }}
                className={`relative flex-1 rounded-xl py-2.5 text-sm font-bold transition-colors ${
                  mode === m ? 'text-sand-50' : 'text-forest-700/60'
                }`}
              >
                {mode === m && (
                  <motion.div
                    layoutId="auth-pill"
                    className="absolute inset-0 rounded-xl bg-forest-700 shadow-tactile"
                  />
                )}
                <span className="relative z-10">
                  {m === 'signin' ? 'تسجيل الدخول' : 'حساب جديد'}
                </span>
              </button>
            ))}
          </div>

          <h2 className="mb-1 font-display text-3xl font-extrabold text-forest-700">
            {mode === 'signin' ? 'مرحباً بعودتك' : 'أنشئ حسابك'}
          </h2>
          <p className="mb-7 text-forest-700/60">
            {mode === 'signin'
              ? 'ادخل بياناتك لفتح بوابتك.'
              : 'انضم لمئات الطلاب في رحلة التميّز.'}
          </p>

          {/* ============ LOGIN ============ */}
          {mode === 'signin' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Role selector */}
              <div>
                <span className="mb-2 block text-sm font-semibold text-forest-700/80">اختر دورك</span>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    const active = role === r.id;
                    return (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        className={`relative flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center transition-all ${
                          active ? 'border-terra-500 bg-terra-500/5 shadow-glow' : 'border-sand-200 hover:border-sand-300'
                        }`}
                      >
                        <span className={`grid h-9 w-9 place-items-center rounded-xl transition-colors ${active ? 'bg-forest-700 text-sand-50' : 'bg-sand-100 text-forest-700/60'}`}>
                          <Icon size={18} />
                        </span>
                        <span className={`text-xs font-bold ${active ? 'text-forest-700' : 'text-forest-700/60'}`}>{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Field icon={<Phone size={18} />} label="رقم الهاتف أو البريد الإلكتروني" placeholder="01012345678 أو student@bawabtek.edu" type="text" />

              {/* Password with show/hide */}
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-forest-700/80">كلمة المرور</span>
                <div className="flex items-center gap-3 rounded-2xl border border-sand-300 bg-sand-50 px-4 transition-all focus-within:border-terra-500 focus-within:shadow-glow">
                  <span className="text-forest-700/50"><Lock size={18} /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-transparent py-3.5 text-forest-700 placeholder:text-sand-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-forest-700/40 transition-colors hover:text-forest-700/70"
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-forest-700/70">
                  <input type="checkbox" className="accent-terra-500" /> تذكّرني
                </label>
                <button type="button" className="font-semibold text-terra-600 hover:underline">
                  نسيت كلمة المرور؟
                </button>
              </div>

              <SubmitButton loading={doorOpen} loadingText="جاري الفتح..." label="ادخل الآن" />
            </form>
          )}

          {/* ============ REGISTER (2-step wizard) ============ */}
          {mode === 'signup' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Step indicator */}
              <div className="mb-2 flex items-center gap-3">
                {([1, 2] as const).map((s) => (
                  <div key={s} className="flex flex-1 items-center gap-2">
                    <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-all ${
                      step >= s ? 'bg-forest-700 text-sand-50' : 'bg-sand-200 text-forest-700/50'
                    }`}>
                      {step > s ? <CheckCircle2 size={16} /> : s}
                    </div>
                    <div className={`h-1 flex-1 rounded-full transition-all ${step > s ? 'bg-forest-700' : 'bg-sand-200'}`} />
                  </div>
                ))}
              </div>
              <div className="mb-4 flex justify-between text-xs font-bold">
                <span className={step === 1 ? 'text-forest-700' : 'text-forest-700/40'}>بيانات الطالب</span>
                <span className={step === 2 ? 'text-forest-700' : 'text-forest-700/40'}>بيانات ولي الأمر</span>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  >
                    <Field icon={<UserIcon size={18} />} label="الاسم الكامل للطالب" placeholder="يوسف طارق علي" value={payload.studentFullName} onChange={(v) => set('studentFullName', v)} error={errors.studentFullName} />
                    <Field icon={<Phone size={18} />} label="رقم هاتف الطالب" placeholder="01012345678" type="tel" value={payload.studentPhoneNumber} onChange={(v) => set('studentPhoneNumber', v)} error={errors.studentPhoneNumber} />
                    <Field icon={<Mail size={18} />} label="البريد الإلكتروني للطالب" placeholder="student@bawabtek.edu" type="email" value={payload.studentEmail} onChange={(v) => set('studentEmail', v)} error={errors.studentEmail} />
                    <Field icon={<Lock size={18} />} label="كلمة المرور" placeholder="••••••••" type={showPassword ? 'text' : 'password'} value={payload.password} onChange={(v) => set('password', v)} error={errors.password} trailing={
                      <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-forest-700/40 transition-colors hover:text-forest-700/70" aria-label="إظهار/إخفاء كلمة المرور">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    } />
                    <SelectField icon={<GraduationCap size={18} />} label="المرحلة الدراسية" placeholder="اختر المرحلة" options={GRADE_LEVELS} value={payload.gradeLevel} onChange={(v) => set('gradeLevel', v)} error={errors.gradeLevel} />
                    <Field icon={<School size={18} />} label="اسم المدرسة" placeholder="مدرسة النور الثانوية" value={payload.schoolName} onChange={(v) => set('schoolName', v)} error={errors.schoolName} />
                    <div className="sm:col-span-2">
                      <Field icon={<ImageIcon size={18} />} label="رابط الصورة الشخصية (اختياري)" placeholder="https://..." value={payload.profilePictureUrl} onChange={(v) => set('profilePictureUrl', v)} />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-forest-700 py-4 font-bold text-sand-50 shadow-tactile transition-all hover:bg-forest-800 hover:shadow-deep"
                      >
                        التالي: بيانات ولي الأمر
                        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  >
                    <Field icon={<UserIcon size={18} />} label="اسم ولي الأمر بالكامل" placeholder="طارق علي" value={payload.parentFullName} onChange={(v) => set('parentFullName', v)} error={errors.parentFullName} />
                    <Field icon={<MessageCircle size={18} />} label="رقم واتساب ولي الأمر" placeholder="01012345678" type="tel" value={payload.parentWhatsAppNumber} onChange={(v) => set('parentWhatsAppNumber', v)} error={errors.parentWhatsAppNumber} />
                    <div className="sm:col-span-2">
                      <p className="flex items-center gap-2 rounded-xl bg-jungle-500/10 px-3 py-2 text-xs font-semibold text-jungle-600">
                        <MessageCircle size={13} className="shrink-0" />
                        يُستخدم هذا الرقم لإرسال إشعارات الحضور عبر واتساب، ولا يمكن أن يكون نفس رقم هاتف الطالب.
                      </p>
                    </div>
                    <SelectField icon={<Users size={18} />} label="صلة القرابة" placeholder="اختر صلة القرابة" options={RELATION_TYPES} value={payload.relationType} onChange={(v) => set('relationType', v)} error={errors.relationType} />
                    <Field icon={<Briefcase size={18} />} label="وظيفة ولي الأمر" placeholder="مهندس / طبيب / موظف..." value={payload.parentJobTitle} onChange={(v) => set('parentJobTitle', v)} error={errors.parentJobTitle} />
                    <div className="sm:col-span-2">
                      <Field icon={<MapPin size={18} />} label="العنوان بالتفصيل" placeholder="المدينة، الحي، الشارع..." value={payload.address} onChange={(v) => set('address', v)} error={errors.address} />
                    </div>

                    <div className="flex gap-3 sm:col-span-2">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center justify-center gap-1.5 rounded-2xl border border-sand-300 bg-sand-50 px-6 py-4 font-bold text-forest-700/70 transition-colors hover:bg-sand-100"
                      >
                        <ChevronLeft size={18} className="rotate-180" />
                        السابق
                      </button>
                      <button
                        type="submit"
                        disabled={registered}
                        className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-forest-700 py-4 font-bold text-sand-50 shadow-tactile transition-all hover:bg-forest-800 hover:shadow-deep disabled:opacity-70"
                      >
                        {registered ? (
                          <span className="flex items-center gap-2">
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="inline-block h-5 w-5 rounded-full border-2 border-sand-50/40 border-t-sand-50"
                            />
                            جاري الإنشاء...
                          </span>
                        ) : (
                          <>
                            أنشئ حسابي
                            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-forest-700/60">
            بدخولك أنت توافق على شروط الاستخدام وسياسة الخصوصية.
          </p>
        </motion.div>
      </div>

      {/* ===== FULL-SCREEN DOORWAY ZOOM TRANSITION ===== */}
      <AnimatePresence>
        {(doorOpen || registered) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden"
          >
            {/* Warm expanding glow */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 6, opacity: 1 }}
              transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
              className="h-72 w-72 rounded-full bg-gradient-to-b from-terra-400 to-terra-600 blur-2xl"
            />
            {/* Camera zoom rectangle (the "through the doorway" feel) */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 18, opacity: [0, 1, 0.9] }}
              transition={{ duration: 2.8, ease: [0.7, 0, 0.3, 1], delay: 0.5 }}
              className="h-[420px] w-[300px] rounded-t-[8rem] bg-gradient-to-b from-terra-300 via-terra-400 to-terra-600"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 1, 0], y: 0 }}
              transition={{ duration: 1.8, delay: 0.8 }}
              className="absolute z-10 font-display text-2xl font-extrabold text-sand-50"
            >
              {registered ? 'تم إنشاء حسابك بنجاح' : 'مرحباً بك في بوابتك'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============ Reusable field components ============ */

function SubmitButton({ loading, loadingText, label }: { loading: boolean; loadingText: string; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-forest-700 py-4 font-bold text-sand-50 shadow-tactile transition-all hover:bg-forest-800 hover:shadow-deep disabled:opacity-70"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block h-5 w-5 rounded-full border-2 border-sand-50/40 border-t-sand-50"
          />
          {loadingText}
        </span>
      ) : (
        <>
          {label}
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        </>
      )}
    </button>
  );
}

function Field({
  icon,
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
  error?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-forest-700/80">{label}</span>
      <div className={`flex items-center gap-3 rounded-2xl border bg-sand-50 px-4 transition-all focus-within:border-terra-500 focus-within:shadow-glow ${
        error ? 'border-red-400' : 'border-sand-300'
      }`}>
        <span className="text-forest-700/50">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className="w-full bg-transparent py-3.5 text-forest-700 placeholder:text-sand-400 focus:outline-none"
        />
        {trailing}
      </div>
      {error && <span className="mt-1 block text-xs font-semibold text-red-500">{error}</span>}
    </label>
  );
}

function SelectField({
  icon,
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-forest-700/80">{label}</span>
      <div className={`flex items-center gap-3 rounded-2xl border bg-sand-50 px-4 transition-all focus-within:border-terra-500 focus-within:shadow-glow ${
        error ? 'border-red-400' : 'border-sand-300'
      }`}>
        <span className="text-forest-700/50">{icon}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none bg-transparent py-3.5 focus:outline-none ${value ? 'text-forest-700' : 'text-sand-400'}`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-forest-700">{opt}</option>
          ))}
        </select>
        <ChevronLeft size={16} className="rotate-[-90deg] text-forest-700/40" />
      </div>
      {error && <span className="mt-1 block text-xs font-semibold text-red-500">{error}</span>}
    </label>
  );
}
