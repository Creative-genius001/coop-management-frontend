import { useQuery } from '@tanstack/react-query';
import { getContributions } from '../contribution';

export const useContributions = () =>
  useQuery({
    queryKey: ['contributions'],
    queryFn: getContributions,
  });
