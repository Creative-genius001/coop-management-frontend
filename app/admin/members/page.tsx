'use client'

import { useMemo, useState } from 'react';
import { PageHeader } from '@/app/components/ui/page-header';
import { DataTable } from '@/app/components/ui/data-table';
import { StatusBadge } from '@/app/components/ui/status-badge';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Search, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '@/app/lib/formatters';
import { MemberWithFinancials } from '@/app/types/financial';
import { useDebounce } from 'use-debounce';
import { useGetAllMembers } from '@/app/api/queries/useAdminQueries';
import { toast } from 'sonner';

export default function AdminMembers() {

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 1000);

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('all');
  const [limit] = useState(10);

  

  const params = useMemo(() => ({
    page,
    limit,
    search: debouncedSearch,
  }), [page, limit, debouncedSearch]);

  const { data, isPending, isError } = useGetAllMembers(params);

  const membersData = data?.data || [];
  const meta = data?.meta;

  const { activeMembers, inactiveMembers, suspendedMembers, totalMembers } = data?.stats || {};

  const totalActiveMembers = activeMembers || 0;

  const totalInactiveMembers = inactiveMembers || 0;
  
  const totalSuspendedMembers = suspendedMembers || 0;

  const totalMembersCount = totalMembers || 0;

  const columns = [
    {
      key: 'memberId',
      header: 'Member ID',
      cell: (item: MemberWithFinancials) => (
        <span className="font-mono text-sm">{item.memberId}</span>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      cell: (item: MemberWithFinancials) => (
        <div>
          <p className="font-medium">{`${item.firstname} ${item.lastname}`}</p>
          <p className="text-xs text-muted-foreground">{item.email}</p>
        </div>
      ),
    },
    {
      key: 'joinDate',
      header: 'Joined',
      cell: (item: MemberWithFinancials) => (
        <span className="text-sm">{formatDate(item.joinedAt)}</span>
      ),
    },
    {
      key: 'savings',
      header: 'Savings',
      cell: (item: MemberWithFinancials) => (
        <span className="font-medium">{formatCurrency(item.totalSavings)}</span>
      ),
    },
    {
      key: 'loanBalance',
      header: 'Loan Balance',
      cell: (item: MemberWithFinancials) => (
        <span className={item.totalLoans > 0 ? 'text-destructive font-medium' : 'text-muted-foreground'}>
          {item.totalLoans > 0 ? formatCurrency(item.totalLoans) : 'No loans'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item: MemberWithFinancials) => {
        const status = item.status === 'active' ? 'active' : item.status === 'inactive' ? 'inactive' : 'rejected';
        return <StatusBadge status={status} />;
      },
    },
    {
      key: 'actions',
      header: '',
      cell: (item: MemberWithFinancials) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toast('View member details', {
            description: `You clicked to view details for ${item.firstname} ${item.lastname}.`,
          })}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members Management"
        description="View and manage cooperative members"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Total Members</p>
            <p className="text-2xl font-bold">{totalMembersCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-success">
              {totalActiveMembers}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Inactive</p>
            <p className="text-2xl font-bold text-muted-foreground">
              {totalInactiveMembers}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Suspended</p>
            <p className="text-2xl font-bold text-red-500">
              {totalSuspendedMembers}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, member ID, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <>
        <DataTable
          columns={columns}
          data={membersData}
          emptyMessage="No members found"
        />

        <div className="flex justify-between items-center mt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <span>
              Page {meta?.page} of {meta?.totalPages}
            </span>

            <Button
              disabled={page === meta?.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
      </>
    </div>
  );
}
