import { Contribution, RecentContribution } from '../types/financial';
import { api } from './https';

export const getContributions = async () : Promise<Contribution[]> => {
  const { data } = await api.get('/contributions');
  return data;
};

export const getRecentContributions = async () : Promise<RecentContribution> => {
  const { data } = await api.get('/admin/contributions/recent');
  return data;
}
