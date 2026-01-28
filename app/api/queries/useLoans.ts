import { useQuery } from '@tanstack/react-query';
import { getLoans } from '../loan';

export const useLoans = () =>
  useQuery({
    queryKey: ['loans'],
    queryFn: getLoans,
  });