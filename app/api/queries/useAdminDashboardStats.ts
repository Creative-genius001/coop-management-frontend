import { useQuery } from '@tanstack/react-query';
import { getAdminDashboardStats } from '../adminDashboardStats';

export const useAdminDashboardStats = () =>
  useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getAdminDashboardStats,
  });
