import { useQuery } from '@tanstack/react-query';
import { getMemberLoans } from '../loan';

export const useGetMemberLoans = (memberId: string) =>
  useQuery({
    queryKey: ['loans'],
    queryFn: () => getMemberLoans(memberId),
  });