import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoinDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  animated?: boolean;
}

export function CoinDisplay({ 
  amount, 
  size = 'md', 
  showIcon = true, 
  className,
  animated = false 
}: CoinDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm gap-1',
    md: 'text-lg gap-1.5',
    lg: 'text-2xl gap-2 font-bold',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  return (
    <div 
      className={cn(
        'inline-flex items-center font-semibold text-primary',
        sizeClasses[size],
        animated && 'coin-bounce',
        className
      )}
    >
      {showIcon && (
        <Coins 
          size={iconSizes[size]} 
          className="text-coin shadow-coin rounded-full"
        />
      )}
      <span>{amount.toLocaleString()}</span>
    </div>
  );
}
