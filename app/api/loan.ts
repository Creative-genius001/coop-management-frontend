import { Loan } from '../types/financial';
import { api } from './https';

export const getLoans = async (): Promise<Loan[]> => {
  const { data } = await api.get('/loans');
  return data;
};