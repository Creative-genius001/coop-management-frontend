import { useState } from 'react';
import { PageHeader } from '@/app/components/ui/page-header';
import { DataTable } from '@/app/components/ui/data-table';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Search, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/app/lib/formatters';
import { mockLedgerEntries } from '@/app/data/mockData';
import { LedgerEntry } from '@/app/types/financial';

export default function Ledger() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const memberLedger = mockLedgerEntries.filter((e) => e.memberId === 'MEM001');
  
  const categories = [...new Set(memberLedger.map((e) => e.category))];

  const filteredLedger = memberLedger.filter((entry) => {
    const matchesSearch =
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || entry.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      key: 'date',
      header: 'Date',
      cell: (item: LedgerEntry) => (
        <span className="text-sm">{formatDate(item.date)}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: (item: LedgerEntry) => (
        <div className="flex items-center gap-2">
          {item.type === 'credit' ? (
            <ArrowDownLeft className="w-4 h-4 text-success" />
          ) : (
            <ArrowUpRight className="w-4 h-4 text-destructive" />
          )}
          <span className="text-sm capitalize">{item.type}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      cell: (item: LedgerEntry) => (
        <span className="text-sm">{item.category}</span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      cell: (item: LedgerEntry) => (
        <div>
          <p className="text-sm">{item.description}</p>
          <p className="text-xs text-muted-foreground font-mono">{item.reference}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (item: LedgerEntry) => (
        <span className={item.type === 'credit' ? 'credit-text' : 'debit-text'}>
          {item.type === 'credit' ? '+' : '-'}{formatCurrency(item.amount)}
        </span>
      ),
      className: 'text-right',
    },
    {
      key: 'balance',
      header: 'Balance',
      cell: (item: LedgerEntry) => (
        <span className="font-semibold">{formatCurrency(item.balance)}</span>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Ledger"
        description="Your complete transaction history"
      />

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by description or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredLedger}
        emptyMessage="No ledger entries found"
      />
    </div>
  );
}
