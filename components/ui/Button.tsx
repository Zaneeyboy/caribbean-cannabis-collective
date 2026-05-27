import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-lime text-forest font-bold hover:bg-lime/90 active:bg-lime/80 disabled:bg-smoke disabled:text-mist',
  secondary: 'border border-gold text-gold bg-transparent hover:bg-gold hover:text-forest active:bg-gold/90 disabled:border-smoke disabled:text-mist',
  ghost: 'text-cream underline underline-offset-4 hover:text-lime disabled:text-mist',
  danger: 'bg-coral text-white font-bold hover:bg-coral/90 active:bg-coral/80 disabled:bg-smoke disabled:text-mist',
};

const sizeClasses = {
  sm: 'px-4 py-1.5 text-xs',
  md: 'px-6 py-2.5 text-xs',
  lg: 'px-8 py-3.5 text-sm',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ variant = 'primary', size = 'md', fullWidth = false, className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md tracking-widest uppercase transition-all duration-200 cursor-pointer disabled:cursor-not-allowed select-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
