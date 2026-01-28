import { DashboardStats } from '../types/financial';
import { api } from './https';

export const getMemberDashboardStats = async (memberId: string) : Promise<DashboardStats> => {
  const { data } = await api.get(`/dashboard/stats?memberId=${memberId}`);
  return data;
};
