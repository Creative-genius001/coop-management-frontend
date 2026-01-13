import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { mockMembers } from '@/data/mockData';
import { Member } from '@/types/financial';

export default function AdminMembers() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredMembers = mockMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'memberId',
      header: 'Member ID',
      cell: (item: Member) => (
        <span className="font-mono text-sm">{item.memberId}</span>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      cell: (item: Member) => (
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.email}</p>
        </div>
      ),
    },
    {
      key: 'joinDate',
      header: 'Joined',
      cell: (item: Member) => (
        <span className="text-sm">{formatDate(item.joinDate)}</span>
      ),
    },
    {
      key: 'savings',
      header: 'Savings',
      cell: (item: Member) => (
        <span className="font-medium">{formatCurrency(item.savings)}</span>
      ),
    },
    {
      key: 'loanBalance',
      header: 'Loan Balance',
      cell: (item: Member) => (
        <span className={item.loanBalance > 0 ? 'text-destructive font-medium' : 'text-muted-foreground'}>
          {item.loanBalance > 0 ? formatCurrency(item.loanBalance) : '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item: Member) => <StatusBadge status={item.status} />,
    },
    {
      key: 'actions',
      header: '',
      cell: (item: Member) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/admin/member/${item.id}`)}
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
            <p className="text-2xl font-bold">{mockMembers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-success">
              {mockMembers.filter((m) => m.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Inactive</p>
            <p className="text-2xl font-bold text-muted-foreground">
              {mockMembers.filter((m) => m.status === 'inactive').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, member ID, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredMembers}
        emptyMessage="No members found"
      />
    </div>
  );
}
