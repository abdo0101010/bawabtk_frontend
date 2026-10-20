import { GraduationCap, LogIn, LayoutDashboard, CreditCard, ScanLine, Home, Presentation } from 'lucide-react';
import { motion } from 'framer-motion';
export type RouteId = 'home' | 'auth' | 'dashboard' | 'checkout' | 'scanner' | 'teacher';

export const ROUTES: { id: RouteId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'auth', label: 'تسجيل الدخول', icon: LogIn },
  { id: 'dashboard', label: 'لوحة الطالب', icon: LayoutDashboard },
  { id: 'teacher', label: 'لوحة المعلّم', icon: Presentation },
  { id: 'checkout', label: 'الدفع والاشتراك', icon: CreditCard },
  { id: 'scanner', label: 'ماسح الحضور', icon: ScanLine },
];

interface TopNavProps {
  current: RouteId;
  onNavigate: (r: RouteId) => void;
}

export function TopNav({ current, onNavigate }: TopNavProps) {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      className="fixed inset-x-0 top-0 z-[60] border-b border-emerald-800/50 bg-emerald-950/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 transition-transform hover:scale-[1.02]"
        >
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-700 text-sand-50 shadow-tactile">
            <GraduationCap size={22} />
          </div>
          <div className="leading-none text-right">
            <p className="font-display text-lg font-extrabold text-sand-50">بوابتك</p>
            <p className="text-[9px] tracking-[0.28em] text-emerald-300/70">BAWABTEK · LMS</p>
          </div>
        </button>

        <nav className="hidden items-center gap-1 rounded-full bg-emerald-900/60 p-1 shadow-inner md:flex">
          {ROUTES.map((r) => {
            const Icon = r.icon;
            const active = current === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onNavigate(r.id)}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active ? 'text-sand-50' : 'text-emerald-200/70 hover:text-emerald-100'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-emerald-700 shadow-tactile"
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  />
                )}
                <Icon size={16} className="relative z-10" />
                <span className="relative z-10">{r.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile compact nav */}
        <div className="flex items-center gap-1 md:hidden">
          {ROUTES.map((r) => {
            const Icon = r.icon;
            const active = current === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onNavigate(r.id)}
                className={`grid h-9 w-9 place-items-center rounded-xl transition-colors ${
                  active ? 'bg-emerald-700 text-sand-50' : 'text-emerald-200/60'
                }`}
                aria-label={r.label}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      </div>
    </motion.header>
  );
}
