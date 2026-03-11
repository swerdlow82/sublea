import { ReactNode } from 'react';

export type BadgeVariant = 'primary' | 'neutral' | 'active' | 'draft' | 'expired';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

// maps variant name → tailwind classes — change colors in one spot for the whole app
const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary: 'badge-primary',
  neutral:  'badge-neutral',
  active:   'badge bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
  draft:    'badge bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
  expired:  'badge bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
};

export const Badge = ({ children, variant = 'neutral', className = '' }: BadgeProps) => (
  <span className={`badge ${VARIANT_CLASSES[variant]} ${className}`}>
    {children}
  </span>
);
