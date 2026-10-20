import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  Wifi,
  MapPin,
  CreditCard,
  Check,
  MessageCircle,
  Calendar,
  User,
  Sparkles,
  RotateCcw,
  AlertCircle,
  Lock,
  ShieldCheck,
  Wallet,
  Smartphone,
} from 'lucide-react';

type PayMethod = 'card' | 'wallet';

const WALLETS = [
  { id: 'vodafone', label: 'فودافون كاش', color: 'bg-red-600' },
  { id: 'orange', label: 'أورانج كاش', color: 'bg-orange-500' },
  { id: 'instapay', label: 'InstaPay', color: 'bg-blue-600' },
  { id: 'etisalat', label: 'إتصالات كاش', color: 'bg-emerald-600' },
];
import { COURSES, STUDENT } from '@/lib/data';

type Plan = 'online' | 'offline';

export function Checkout() {
  const [plan, setPlan] = useState<Plan>('online');
  const [courseId, setCourseId] = useState(COURSES[1].id);
  const [stage, setStage] = useState<'idle' | 'processing' | 'success'>('idle');
  const [payMethod, setPayMethod] = useState<PayMethod>('card');
  const [walletNumber, setWalletNumber] = useState('');
  const [walletProvider, setWalletProvider] = useState('vodafone');

  // Payment form state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const cardDisplay = cardNumber || '•••• •••• •••• ••••';
  const expiryDisplay = expiry;

  function onCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    const grouped = digits.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(grouped);
  }

  function onExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    let formatted = digits;
    if (digits.length >= 3) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    setExpiry(formatted);
  }

  function onCardKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      const target = e.currentTarget;
      if (target.selectionStart === target.selectionEnd && target.selectionStart === target.value.length && target.value.endsWith(' ')) {
        e.preventDefault();
        const trimmed = target.value.trimEnd().slice(0, -1);
        if (target === document.activeElement && target.placeholder.includes('0000')) {
          setCardNumber(trimmed.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim());
        } else if (target.placeholder.includes('MM')) {
          setExpiry(trimmed.replace(/\D/g, '').slice(0, 2));
        }
      }
    }
  }

  const course = COURSES.find((c) => c.id === courseId)!;
  const price = plan === 'online' ? 45000 : 90000;
  const formatted = price.toLocaleString('ar-EG');

  function pay() {
    setStage('processing');
    window.setTimeout(() => setStage('success'), 2200);
  }

  function reset() {
    setStage('idle');
  }

  return (
    <div className="min-h-screen bg-sand-50 pt-20">
      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-right">
          <h1 className="font-display text-4xl font-extrabold text-forest-700">الدفع والاشتراك</h1>
          <p className="mt-1 text-forest-700/60">اختر نوع الاشتراك وكورسك المفضل ثم أكّد الدفع.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-5">
          {/* Left: plan + course selection */}
          <div className="space-y-7 lg:col-span-3">
            {/* Tactile toggle switch */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-sand-200 bg-sand-50 p-7 shadow-tactile"
            >
              <h2 className="mb-5 font-display text-xl font-extrabold text-forest-700">
                نوع الاشتراك
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { id: 'online', label: 'اشتراك أونلاين - منصة فقط', icon: Wifi, price: '45,000' },
                    { id: 'offline', label: 'اشتراك سنتر - يشمل الباركود', icon: MapPin, price: '90,000' },
                  ] as const
                ).map((p) => {
                  const Icon = p.icon;
                  const active = plan === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPlan(p.id as Plan)}
                      className={`relative overflow-hidden rounded-2xl border-2 p-5 text-right transition-all ${
                        active
                          ? 'border-terra-500 bg-terra-500/5 shadow-glow'
                          : 'border-sand-200 bg-sand-50 hover:border-sand-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="grid h-11 w-11 place-items-center rounded-xl bg-forest-700 text-sand-50">
                          <Icon size={20} />
                        </div>
                        {/* toggle knob */}
                        <div
                          className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors ${
                            active ? 'bg-terra-500' : 'bg-sand-300'
                          }`}
                        >
                          <motion.div
                            layout
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className={`h-5 w-5 rounded-full bg-sand-50 shadow ${
                              active ? 'ml-0' : 'mr-0'
                            }`}
                            style={{ marginLeft: active ? 'auto' : 0 }}
                          />
                        </div>
                      </div>
                      <p className="mt-3 font-bold text-forest-700">{p.label}</p>
                      <p className="text-sm text-forest-700/60">{p.price} ل.س / شهر</p>
                    </button>
                  );
                })}
              </div>

              {/* Offline amber warning tooltip */}
              <AnimatePresence>
                {plan === 'offline' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 14 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-3 rounded-2xl border border-terra-500/40 bg-terra-500/10 p-4">
                      <span className="mt-0.5 shrink-0 text-terra-600">
                        <AlertCircle size={18} />
                      </span>
                      <p className="text-sm font-semibold text-terra-700">
                        سيتم إنشاء باركود موحد وإرساله لولي الأمر.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Course selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-3xl border border-sand-200 bg-sand-50 p-7 shadow-tactile"
            >
              <h2 className="mb-5 font-display text-xl font-extrabold text-forest-700">اختر الكورس</h2>
              <div className="space-y-3">
                {COURSES.map((c) => {
                  const active = courseId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCourseId(c.id)}
                      className={`flex w-full items-center gap-4 rounded-2xl border-2 p-3 text-right transition-all ${
                        active ? 'border-forest-700 bg-forest-700/5' : 'border-sand-200 hover:border-sand-300'
                      }`}
                    >
                      <img src={c.cover} alt={c.title} className="h-14 w-20 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="font-bold text-forest-700">{c.title}</p>
                        <p className="text-xs text-forest-700/60">{c.subtitle} · {c.lessons} درس</p>
                      </div>
                      <div
                        className={`grid h-6 w-6 place-items-center rounded-full border-2 transition-colors ${
                          active ? 'border-forest-700 bg-forest-700 text-sand-50' : 'border-sand-300'
                        }`}
                      >
                        {active && <Check size={14} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Payment method — full credit card form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="rounded-3xl border border-sand-200 bg-sand-50 p-7 shadow-tactile"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-xl font-extrabold text-forest-700">طريقة الدفع</h2>
                <span className="flex items-center gap-1.5 rounded-full bg-jungle-500/10 px-3 py-1 text-xs font-bold text-jungle-600">
                  <ShieldCheck size={14} /> دفع آمن ومشفّر
                </span>
              </div>

              {/* Card / Wallet toggle */}
              <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-sand-100 p-1.5">
                {([
                  { id: 'card', label: 'بطاقة ائتمان', icon: CreditCard },
                  { id: 'wallet', label: 'محفظة إلكترونية', icon: Wallet },
                ] as const).map((m) => {
                  const Icon = m.icon;
                  const active = payMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPayMethod(m.id as PayMethod)}
                      className={`relative flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors ${active ? 'text-sand-50' : 'text-forest-700/60'}`}
                    >
                      {active && <motion.div layoutId="paymethod-pill" className="absolute inset-0 rounded-xl bg-forest-700 shadow-tactile" />}
                      <Icon size={16} className="relative z-10" />
                      <span className="relative z-10">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {payMethod === 'card' ? (
                  <motion.div key="card-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                    {/* Card preview */}
              <div className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-forest-700 to-forest-900 p-5 text-sand-50 shadow-deep">
                <div className="pointer-events-none absolute -left-6 -top-8 h-32 w-32 rounded-full bg-terra-500/25 blur-2xl" />
                <div className="relative flex items-start justify-between">
                  <div className="grid h-9 w-12 place-items-center rounded-md bg-sand-50/15">
                    <div className="h-6 w-8 rounded-sm bg-gradient-to-br from-terra-300 to-terra-600" />
                  </div>
                  <CreditCard size={26} className="text-sand-50/40" />
                </div>
                <p className="relative mt-6 font-mono text-lg tracking-[0.15em]">
                  {cardDisplay}
                </p>
                <div className="relative mt-4 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-sand-200/60">حامل البطاقة</p>
                    <p className="font-semibold">{cardName || '—'}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sand-200/60">الانتهاء</p>
                    <p className="font-semibold">{expiryDisplay || '--/--'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Cardholder name */}
                <PayField icon={<User size={18} />} label="اسم صاحب البطاقة">
                  <input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="ليث الحسيني"
                    className="w-full bg-transparent py-3.5 text-forest-700 placeholder:text-sand-400 focus:outline-none"
                  />
                </PayField>

                {/* Card number */}
                <PayField icon={<CreditCard size={18} />} label="رقم البطاقة">
                  <input
                    value={cardNumber}
                    onChange={onCardNumberChange}
                    onKeyDown={onCardKeyDown}
                    inputMode="numeric"
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-transparent py-3.5 font-mono text-forest-700 placeholder:text-sand-400 focus:outline-none"
                  />
                </PayField>

                {/* Expiry + CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <PayField icon={<Calendar size={18} />} label="تاريخ الانتهاء (MM/YY)">
                    <input
                      value={expiry}
                      onChange={onExpiryChange}
                      onKeyDown={onCardKeyDown}
                      inputMode="numeric"
                      placeholder="MM/YY"
                      className="w-full bg-transparent py-3.5 font-mono text-forest-700 placeholder:text-sand-400 focus:outline-none"
                    />
                  </PayField>
                  <PayField icon={<Lock size={18} />} label="رمز الأمان (CVC)">
                    <input
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      onKeyDown={onCardKeyDown}
                      inputMode="numeric"
                      placeholder="123"
                      className="w-full bg-transparent py-3.5 font-mono text-forest-700 placeholder:text-sand-400 focus:outline-none"
                    />
                  </PayField>
                </div>
              </div>
                  </motion.div>
                ) : (
                  <motion.div key="wallet-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="space-y-4">
                    {/* Wallet number with +20 prefix */}
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold text-forest-700/80">رقم المحفظة</span>
                      <div className="flex items-stretch overflow-hidden rounded-2xl border border-sand-300 bg-sand-50 transition-all focus-within:border-terra-500 focus-within:shadow-glow">
                        <span className="flex items-center gap-1.5 border-l border-sand-200 bg-sand-100 px-4 font-mono text-sm font-bold text-forest-700/70">
                          <Smartphone size={16} /> +20
                        </span>
                        <input
                          value={walletNumber}
                          onChange={(e) => setWalletNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                          inputMode="numeric"
                          placeholder="10XXXXXXXXX"
                          className="w-full bg-transparent px-4 py-3.5 font-mono text-forest-700 placeholder:text-sand-400 focus:outline-none"
                        />
                      </div>
                    </label>

                    {/* Provider selection */}
                    <div>
                      <span className="mb-2 block text-sm font-semibold text-forest-700/80">اختر مزوّد المحفظة</span>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {WALLETS.map((w) => {
                          const active = walletProvider === w.id;
                          return (
                            <button
                              key={w.id}
                              onClick={() => setWalletProvider(w.id)}
                              className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 text-center transition-all ${active ? 'border-terra-500 bg-terra-500/5 shadow-glow' : 'border-sand-200 hover:border-sand-300'}`}
                            >
                              <span className={`grid h-9 w-9 place-items-center rounded-xl ${w.color} text-[10px] font-extrabold text-sand-50`}>
                                {w.label.charAt(0)}
                              </span>
                              <span className="text-[11px] font-bold text-forest-700">{w.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl bg-sand-100 p-3 text-xs text-forest-700/60">
                      <ShieldCheck size={15} className="shrink-0 text-jungle-600" />
                      سيتم إرسال طلب تأكيد إلى رقم محفظتك لإتمام الدفع.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right: summary + pay button */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-24 rounded-3xl border border-sand-200 bg-sand-50 p-7 shadow-tactile"
            >
              <h2 className="mb-5 font-display text-xl font-extrabold text-forest-700">ملخص الطلب</h2>
              <div className="mb-4 flex items-center gap-4 rounded-2xl bg-sand-100 p-3">
                <img src={course.cover} alt={course.title} className="h-16 w-16 rounded-xl object-cover" />
                <div>
                  <p className="font-bold text-forest-700">{course.title}</p>
                  <p className="text-xs text-forest-700/60">
                    {plan === 'online' ? 'اشتراك أونلاين' : 'اشتراك في المركز'}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <Row label="السعر الأساسي" value={`${formatted} ل.س`} />
                <Row label="ضريبة" value="مشمولة" />
                <div className="my-3 border-t border-dashed border-sand-300" />
                <Row label="الإجمالي" value={`${formatted} ل.س`} bold />
              </div>

              <motion.button
                onClick={pay}
                disabled={stage !== 'idle'}
                whileTap={{ scale: 0.97 }}
                className="relative mt-6 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-forest-700 font-bold text-sand-50 shadow-tactile transition-all hover:bg-forest-800 disabled:opacity-90"
              >
                <AnimatePresence mode="wait">
                  {stage === 'idle' && (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      تأكيد الدفع <CreditCard size={18} />
                    </motion.span>
                  )}
                  {stage === 'processing' && (
                    <motion.span
                      key="proc"
                      initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
                      className="flex items-center gap-2"
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                        className="inline-block h-5 w-5 rounded-full border-2 border-sand-50/40 border-t-sand-50"
                      />
                      جاري المعالجة...
                    </motion.span>
                  )}
                  {stage === 'success' && (
                    <motion.span
                      key="ok"
                      initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={18} /> تم الدفع
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <p className="mt-3 text-center text-xs text-forest-700/50">
                دفع آمن · يتم إرسال الباركود لولي الأمر تلقائياً
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ===== TICKET DROP OVERLAY ===== */}
      <AnimatePresence>
        {stage === 'success' && <TicketDrop course={course} plan={plan} onReset={reset} />}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? 'font-bold text-forest-700' : 'text-forest-700/60'}>{label}</span>
      <span className={bold ? 'font-extrabold text-forest-700' : 'font-semibold text-forest-700'}>{value}</span>
    </div>
  );
}

function PayField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
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

function TicketDrop({
  course,
  plan,
  onReset,
}: {
  course: typeof COURSES[number];
  plan: Plan;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[85] grid place-items-center overflow-hidden p-4"
    >
      {/* Dimmed backdrop */}
      <motion.div
        initial={{ backdropFilter: 'blur(0px)', opacity: 0 }}
        animate={{ backdropFilter: 'blur(14px)', opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-forest-900/60"
      />

      {/* Golden checkmark draw */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
        className="absolute top-[22%] z-10 grid h-24 w-24 place-items-center rounded-full bg-terra-500 text-sand-50 shadow-glow"
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <motion.path
            d="M12 24 L20 32 L36 16"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
        </svg>
      </motion.div>

      {/* Ticket spring drop */}
      <motion.div
        initial={{ y: '-110%', rotate: -4, opacity: 0 }}
        animate={{ y: 0, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.9 }}
        className="relative z-20 w-full max-w-md"
      >
        <div className="overflow-hidden rounded-3xl border border-terra-500/30 bg-sand-50 shadow-ticket">
          {/* Header */}
          <div className="relative bg-gradient-to-l from-forest-700 to-jungle-500 p-5 text-sand-50">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-terra-500/30 blur-2xl" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-terra-300" />
                <span className="font-display text-lg font-extrabold">تذكرة الدخول</span>
              </div>
              <span className="rounded-full bg-sand-50/15 px-3 py-1 text-xs font-bold">
                {plan === 'online' ? 'أونلاين' : 'حضوري 📍'}
              </span>
            </div>
          </div>

          {/* Perforation */}
          <div className="relative flex items-center justify-between bg-sand-50 px-5">
            <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-forest-900/90" />
            <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-forest-900/90" />
            <div className="my-3 w-full border-t-2 border-dashed border-sand-300" />
          </div>

          {/* Body */}
          <div className="grid grid-cols-3 gap-4 p-5">
            <div className="col-span-2 space-y-3 text-right">
              <div>
                <p className="text-xs text-forest-700/50">الكورس</p>
                <p className="font-display text-xl font-extrabold text-forest-700">{course.title}</p>
                <p className="text-sm text-forest-700/60">{course.subtitle}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-forest-700/70">
                <User size={14} /> {STUDENT.name}
              </div>
              <div className="flex items-center gap-2 text-sm text-forest-700/70">
                <Calendar size={14} /> صالح لـ 30 يوماً
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-jungle-600">
                <CreditCard size={14} /> {plan === 'offline' ? '90,000' : '45,000'} ل.س · {plan === 'offline' ? 'سنتر' : 'أونلاين'}
              </div>
            </div>

            {/* QR — only for offline subscription */}
            <div className="flex flex-col items-center justify-center">
              {plan === 'offline' ? (
                <>
                  <div className="rounded-2xl bg-sand-50 p-2.5 ring-1 ring-sand-300">
                    <QRCodeSVG
                      value={`BW|${STUDENT.barcode}|${course.id}|${plan}`}
                      size={96}
                      bgColor="#FBFBFA"
                      fgColor="#0F3823"
                      level="M"
                    />
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] text-forest-700/60">{STUDENT.barcode}</p>
                </>
              ) : (
                <div className="grid h-[112px] w-[112px] place-items-center rounded-2xl bg-jungle-500/10 text-jungle-600">
                  <Wifi size={36} />
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp pulse banner */}
          <motion.div
            animate={{ boxShadow: ['0 0 0 0 rgba(34,197,94,0.5)', '0 0 0 12px rgba(34,197,94,0)'] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="flex items-center justify-center gap-2 bg-jungle-500 p-4 text-sand-50"
          >
            <motion.div
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              <MessageCircle size={20} className="fill-sand-50" />
            </motion.div>
            <span className="font-bold">تم تسجيل الدفع وإرسال الباركود لولي الأمر.</span>
          </motion.div>
        </div>

        {/* Reset button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          onClick={onReset}
          className="mx-auto mt-5 flex items-center gap-2 rounded-2xl bg-sand-50 px-6 py-3 font-bold text-forest-700 shadow-tactile transition-transform hover:scale-105"
        >
          <RotateCcw size={16} /> إجراء دفع آخر
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
