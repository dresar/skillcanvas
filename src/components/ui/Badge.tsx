import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'outline' | 'neutral' | 'accent' | 'success' | 'warning';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<string, string> = {
  default: 'bg-neutral-100 text-neutral-800 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700',
  outline: 'bg-transparent text-neutral-800 border border-neutral-300 dark:text-neutral-200 dark:border-neutral-600',
  neutral: 'bg-neutral-200 text-neutral-700 border border-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-600',
  accent: 'bg-neutral-900 text-white border border-neutral-800 dark:bg-white dark:text-neutral-900 dark:border-neutral-200',
  success: 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
  warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-[12px]',
};

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-md font-medium leading-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export { Badge };
