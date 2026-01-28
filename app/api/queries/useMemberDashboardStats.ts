import { useQuery } from '@tanstack/react-query';
import { getMemberDashboardStats } from '../dashboardStats';

export const useMemberDashboardStats = (memberId : string) =>
  useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => getMemberDashboardStats(memberId),
  });
