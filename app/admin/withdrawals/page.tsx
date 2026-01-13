import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { mockWithdrawals } from '@/data/mockData';
import { Withdrawal } from '@/types/financial';
import { useToast } from '@/hooks/use-toast';

export default function AdminWithdrawals() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredWithdrawals = mockWithdrawals.filter(
    (w) => statusFilter === 'all' || w.status === statusFilter
  );

  const handleApprove = (id: string) => {
    toast({
      title: 'Withdrawal approved',
      description: 'The withdrawal has been approved and processed.',
    });
  };

  const handleReject = (id: string) => {
    toast({
      title: 'Withdrawal rejected',
      description: 'The withdrawal request has been rejected.',
      variant: 'destructive',
    });
  };

  const columns = [
    {
      key: 'member',
      header: 'Member',
      cell: (item: Withdrawal) => (
        <div>
          <p className="font-medium">{item.memberName}</p>
          <p className="text-xs text-muted-foreground font-mono">{item.memberId}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (item: Withdrawal) => (
        <span className="font-semibold">{formatCurrency(item.amount)}</span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      cell: (item: Withdrawal) => <span className="text-sm">{item.reason}</span>,
    },
    {
      key: 'date',
      header: 'Request Date',
      cell: (item: Withdrawal) => (
        <span className="text-sm">{formatDate(item.requestDate)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item: Withdrawal) => <StatusBadge status={item.status} />,
    },
    {
      key: 'actions',
      header: '',
      cell: (item: Withdrawal) =>
        item.status === 'pending' ? (
          <div className="flex gap-2 justify-end">
            <Button size="sm" variant="outline" onClick={() => handleApprove(item.id)}>
              <Check className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleReject(item.id)}>
              <X className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>
        ) : null,
      className: 'text-right',
    },
  ];

  const statusCounts = {
    pending: mockWithdrawals.filter((w) => w.status === 'pending').length,
    approved: mockWithdrawals.filter((w) => w.status === 'approved').length,
    rejected: mockWithdrawals.filter((w) => w.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Withdrawal Requests"
        description="Review and process withdrawal requests"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-warning">{statusCounts.pending}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-success">{statusCounts.approved}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-destructive">{statusCounts.rejected}</p>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex justify-end">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredWithdrawals}
        emptyMessage="No withdrawal requests found"
      />
    </div>
  );
}
