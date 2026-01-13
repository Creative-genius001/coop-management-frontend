import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Download, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { mockLedgerEntries } from '@/data/mockData';
import { LedgerEntry } from '@/types/financial';
import { useToast } from '@/hooks/use-toast';

export default function AdminLedger() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { toast } = useToast();

  const categories = [...new Set(mockLedgerEntries.map((e) => e.category))];

  const filteredLedger = mockLedgerEntries.filter((entry) => {
    const matchesSearch =
      entry.memberName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || entry.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleExportCSV = () => {
    toast({
      title: 'Export started',
      description: 'Your CSV file will be downloaded shortly.',
    });
  };

  const columns = [
    {
      key: 'date',
      header: 'Date',
      cell: (item: LedgerEntry) => (
        <span className="text-sm">{formatDate(item.date)}</span>
      ),
    },
    {
      key: 'member',
      header: 'Member',
      cell: (item: LedgerEntry) => (
        <div>
          <p className="font-medium text-sm">{item.memberName}</p>
          <p className="text-xs text-muted-foreground font-mono">{item.memberId}</p>
        </div>
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
  ];

  const totalCredits = mockLedgerEntries
    .filter((e) => e.type === 'credit')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalDebits = mockLedgerEntries
    .filter((e) => e.type === 'debit')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Ledger"
        description="Complete financial transaction history"
        action={
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Total Credits</p>
            <p className="text-2xl font-bold text-success">{formatCurrency(totalCredits)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Total Debits</p>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(totalDebits)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Net Balance</p>
            <p className="text-2xl font-bold">{formatCurrency(totalCredits - totalDebits)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by member, ID, or reference..."
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
