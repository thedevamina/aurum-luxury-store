import { motion, type HTMLMotionProps } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

interface AdminButtonProps {
  variant?: Variant;
  size?: Size;
  to?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  primary: 'gold-gradient text-ink-900 font-semibold border-transparent',
  outline: 'border border-white/15 text-cream hover:border-gold hover:text-gold bg-transparent',
  ghost: 'text-cream/60 hover:text-gold bg-transparent',
  danger: 'border border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
};

export default function AdminButton({
  variant = 'primary',
  size = 'md',
  to,
  onClick,
  type = 'button',
  disabled,
  children,
  className = '',
}: AdminButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-md uppercase tracking-wider transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`;
  const motionProps: HTMLMotionProps<'button'> = {
    whileHover: { scale: disabled ? 1 : 1.02 },
    whileTap: { scale: disabled ? 1 : 0.98 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  };

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
