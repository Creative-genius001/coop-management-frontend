import { useQuery } from '@tanstack/react-query';
import { GetMembersParams } from '@/app/types/financial';
import { getAllMemebers } from '../admin';

export const useGetAllMembers = (params: GetMembersParams) =>
  useQuery({
    queryKey: ['all-members', params],
    queryFn: () => getAllMemebers(params),
  });
