import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'new' | 'sale' | 'soldout' | 'bestseller';
  className?: string;
}

const variantClasses = {
  new: 'bg-lime text-forest',
  sale: 'bg-coral text-white',
  soldout: 'bg-smoke text-mist',
  bestseller: 'bg-gold text-forest',
};

const variantLabels = {
  new: 'New',
  sale: 'Sale',
  soldout: 'Sold Out',
  bestseller: 'Best Seller',
};

export default function Badge({ variant = 'new', className }: BadgeProps) {
  return <span className={cn('inline-block text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm', variantClasses[variant], className)}>{variantLabels[variant]}</span>;
}
