import { Contribution } from '../types/financial';
import { api } from './https';

export const getContributions = async () : Promise<Contribution[]> => {
  const { data } = await api.get('/contributions');
  return data;
};
