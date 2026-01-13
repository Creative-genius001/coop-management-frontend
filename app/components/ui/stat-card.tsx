import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
};

const iconContainerStyles = {
  default: 'bg-primary/10 text-primary',
  primary: 'bg-primary-foreground/20 text-primary-foreground',
  success: 'bg-success-foreground/20 text-success-foreground',
  warning: 'bg-warning-foreground/20 text-warning-foreground',
};

export function StatCard({
  title,
  value,
  icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const isDefaultVariant = variant === 'default';

  return (
    <div
      className={cn(
        'stat-card animate-slide-up',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className={cn(
              'text-sm font-medium mb-1',
              isDefaultVariant ? 'text-muted-foreground' : 'opacity-90'
            )}
          >
            {title}
          </p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 mt-2 text-xs font-medium',
                isDefaultVariant
                  ? trend.isPositive
                    ? 'text-success'
                    : 'text-destructive'
                  : 'opacity-80'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{Math.abs(trend.value)}% from last month</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'p-3 rounded-xl',
            iconContainerStyles[variant]
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
