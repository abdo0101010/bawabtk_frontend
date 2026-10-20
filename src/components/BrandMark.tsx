import { motion } from 'framer-motion';

interface BrandMarkProps {
  size?: number;
  withText?: boolean;
  className?: string;
}

export function BrandMark({ size = 36, withText = true, className = '' }: BrandMarkProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        initial={{ rotate: -8, scale: 0.9 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 12 }}
        className="grid place-items-center rounded-2xl bg-forest-700 text-sand-50 shadow-tactile"
        style={{ width: size, height: size }}
      >
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 19V8.5C4 7.9 4.27 7.34 4.73 6.97L9.23 3.47C10.3 2.64 11.7 2.64 12.77 3.47L17.27 6.97C17.73 7.34 18 7.9 18 8.5V19"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path d="M4 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="11" cy="11" r="1.6" fill="#D97706" />
        </svg>
      </motion.div>
      {withText && (
        <div className="leading-none">
          <p className="font-display text-xl font-extrabold text-forest-700">بوابتك</p>
          <p className="text-[10px] tracking-[0.25em] text-sand-400">BAWABTEK · LMS</p>
        </div>
      )}
    </div>
  );
}
