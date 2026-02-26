import { GetMembersParams, PaginatedMembersResponse } from '../types/financial';
import { api } from './https';

export const getAllMemebers = async (params: GetMembersParams) : Promise<PaginatedMembersResponse> => {
  const { data } = await api.get('/admin/members/all', { params });
  return data;
}