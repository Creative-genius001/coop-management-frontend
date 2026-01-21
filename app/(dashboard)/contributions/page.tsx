'use client'

import { useState } from 'react';
import { PageHeader } from '@/app/components/ui/page-header';
import { DataTable } from '@/app/components/ui/data-table';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Search, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '@/app/lib/formatters';
import { mockContributions } from '@/app/data/mockData';
import { Contribution, ContributionType } from '@/app/types/financial';

const typeLabels: Record<ContributionType, string> = {
  monthly: 'Monthly',
  special: 'Special',
  share_capital: 'Share Capital',
};

const typeColors: Record<ContributionType, string> = {
  monthly: 'bg-primary/10 text-primary',
  special: 'bg-success/10 text-success',
  share_capital: 'bg-warning/10 text-warning',
};

export default function Contributions() {
  const [searchQuery, setSearchQuery] = useState('');
  const contributions = mockContributions;

  const filteredContributions = contributions.filter(
    (c) =>
      c.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'date',
      header: 'Date',
      cell: (item: Contribution) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{formatDate(item.date)}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: (item: Contribution) => (
        <Badge variant="secondary" className={typeColors[item.type]}>
          {typeLabels[item.type]}
        </Badge>
      ),
    },
    {
      key: 'reference',
      header: 'Reference',
      cell: (item: Contribution) => (
        <span className="text-sm font-mono text-muted-foreground">
          {item.reference}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (item: Contribution) => (
        <span className="font-semibold text-success">
          +{formatCurrency(item.amount)}
        </span>
      ),
      className: 'text-right',
    },
  ];

  const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contributions"
        description="View your contribution history"
      />

      {/* Summary Card */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Contributions</p>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(totalContributions)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-3xl font-bold text-foreground">
                {contributions.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by reference or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredContributions}
        emptyMessage="No contributions found"
      />
    </div>
  );
}
