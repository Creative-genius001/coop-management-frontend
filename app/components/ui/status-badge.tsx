import { cn } from '@/lib/utils';

type Status = 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'inactive';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'status-badge-pending',
  },
  approved: {
    label: 'Approved',
    className: 'status-badge-approved',
  },
  rejected: {
    label: 'Rejected',
    className: 'status-badge-rejected',
  },
  active: {
    label: 'Active',
    className: 'status-badge-active',
  },
  completed: {
    label: 'Completed',
    className: 'status-badge-approved',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-muted text-muted-foreground',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn('status-badge', config.className, className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
