import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { mockLoans } from '@/data/mockData';
import { Loan, LoanStatus } from '@/types/financial';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoans() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const filteredLoans = mockLoans.filter(
    (loan) => statusFilter === 'all' || loan.status === statusFilter
  );

  const handleApprove = (loanId: string) => {
    toast({
      title: 'Loan approved',
      description: 'The loan has been approved and the member has been notified.',
    });
  };

  const handleReject = (loanId: string) => {
    toast({
      title: 'Loan rejected',
      description: 'The loan has been rejected and the member has been notified.',
      variant: 'destructive',
    });
  };

  const columns = [
    {
      key: 'member',
      header: 'Member',
      cell: (item: Loan) => (
        <div>
          <p className="font-medium">{item.memberName}</p>
          <p className="text-xs text-muted-foreground font-mono">{item.memberId}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (item: Loan) => (
        <span className="font-semibold">{formatCurrency(item.amount)}</span>
      ),
    },
    {
      key: 'purpose',
      header: 'Purpose',
      cell: (item: Loan) => <span className="text-sm">{item.purpose}</span>,
    },
    {
      key: 'term',
      header: 'Term',
      cell: (item: Loan) => <span className="text-sm">{item.term} months</span>,
    },
    {
      key: 'date',
      header: 'Applied Date',
      cell: (item: Loan) => (
        <span className="text-sm">{formatDate(item.appliedDate)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item: Loan) => <StatusBadge status={item.status} />,
    },
    {
      key: 'actions',
      header: '',
      cell: (item: Loan) =>
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
    pending: mockLoans.filter((l) => l.status === 'pending').length,
    approved: mockLoans.filter((l) => l.status === 'approved').length,
    active: mockLoans.filter((l) => l.status === 'active').length,
    completed: mockLoans.filter((l) => l.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Loan Management"
        description="Review and manage loan applications"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <p className="text-2xl font-bold text-primary">{statusCounts.active}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">{statusCounts.completed}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredLoans}
        emptyMessage="No loans found"
      />
    </div>
  );
}
