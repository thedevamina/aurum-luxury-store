import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  to?: string;
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variants: Record<Variant, string> = {
  primary: 'gold-gradient text-ink-900 font-semibold',
  outline: 'border border-white/20 text-cream hover:border-gold hover:text-gold',
  ghost: 'text-cream/70 hover:text-gold',
};

const sizes: Record<Size, string> = {
  sm: 'px-5 py-2 text-xs tracking-wider',
  md: 'px-8 py-3 text-sm tracking-wider',
  lg: 'px-10 py-4 text-sm tracking-wider',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const classes = `relative overflow-hidden inline-flex items-center justify-center gap-2 uppercase tracking-wider transition-colors duration-300 rounded-none ${variants[variant]} ${sizes[size]} ${className}`;

  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
  };

  if (to) {
    return (
      <Link to={to}>
        <motion.span className={classes} {...motionProps}>
          {children}
        </motion.span>
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className="inline-block">
        <motion.span className={classes} {...motionProps}>
          {children}
        </motion.span>
      </a>
    );
  }

  return (
    <motion.button
      className={classes}
      {...motionProps}
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type ?? 'button'}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
