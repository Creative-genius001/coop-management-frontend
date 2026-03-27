import { Contribution, RecentContribution } from '../types/financial';
import { api } from './https';

export const getContributions = async () : Promise<Contribution[]> => {
  const { data } = await api.get('/contribution');
  return data;
};

export const getRecentContributions = async () : Promise<RecentContribution> => {
  const { data } = await api.get('/admin/contribution/recent');
  return data;
}

export const recordContribution = async (contributionData: { memberId: string; amount: number;}) => {
  const { data } = await api.post('/admin/contribution/record', contributionData);
  return data;
}
