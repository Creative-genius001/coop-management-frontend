import { useQuery } from '@tanstack/react-query';
import { getContributions, getRecentContributions } from '../contribution';

export const useContributions = () =>
  useQuery({
    queryKey: ['contributions'],
    queryFn: getContributions,
  });

  export const useGetRecentContributions = () =>
  useQuery({
    queryKey: ['recent-contributions'],
    queryFn: getRecentContributions,
  });