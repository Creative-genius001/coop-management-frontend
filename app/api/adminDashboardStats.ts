import { AdminDashboardStats } from '../types/financial';
import { api } from './https';

export const getAdminDashboardStats = async () : Promise<AdminDashboardStats> => {
  const { data } = await api.get(`/dashboard/overview`);
  return data;
};
