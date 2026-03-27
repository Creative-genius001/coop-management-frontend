'use client'

import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/app/components/ui/page-header';
import { DataTable } from '@/app/components/ui/data-table';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent } from '@/app/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Download, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/app/lib/formatters';
import { toast } from "sonner"
import { useGetAllLedgerEntry } from '@/app/api/queries/useLedgers';
import { useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { getAllLedgerEntries } from '@/app/api/ledger';
import { LedgerEntry } from '@/app/types/financial';

export default function AdminLedger() {
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [limit] = useState(10);
  const [debouncedSearch] = useDebounce(search, 1000);
  const [directionFilter, setDirectionFilter] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'createdAt' | 'amount' | 'direction'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  

  const params = useMemo(() => ({
    page,
    limit,
    search: debouncedSearch,
    direction: directionFilter !== 'all' ? directionFilter : undefined,
    sortBy,
    sortOrder,
  }), [page, limit, debouncedSearch, directionFilter, sortBy, sortOrder]);

  const { data, isPending, isError } = useGetAllLedgerEntry(params);

  // useEffect(() => {
  //   setPage(1);
  // }, [debouncedSearch, directionFilter, sortBy, sortOrder]);

  useEffect(() => {
    if (!data) return;

    const totalPages = data.meta.totalPages;

    if (page < totalPages) {
      const nextPageParams = {
        ...params,
        page: page + 1,
      };

      queryClient.prefetchQuery({
        queryKey: ['all-ledger-entries', nextPageParams],
        queryFn: () => getAllLedgerEntries(nextPageParams),
      });
    }
  }, [data, page, params, queryClient]);

  const ledgerData = data?.data || [];
  const meta = data?.meta;

  const totalCredits = data?.numOfCredits || 0;

  const totalDebits = data?.numOfDebits || 0;

  const handleExportCSV = () => {
    toast.info('Export started', {
      position: 'top-center',
      description: 'Your CSV file will be downloaded shortly.',
    });
  };

  const columns = [
    {
      key: 'date',
      header: 'Date',
      cell: (item: LedgerEntry) => (
        <span className="text-sm">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      key: 'memberId',
      header: 'Member ID',
      cell: (item: LedgerEntry) => (
        <span className="text-sm font-mono">{item.memberId}</span>
      ),
    },
    {
      key: 'direction',
      header: 'Type',
      cell: (item: LedgerEntry) => (
        <div className="flex items-center gap-2">
          {item.direction === 'CREDIT' ? (
            <ArrowDownLeft className="w-4 h-4 text-success" />
          ) : (
            <ArrowUpRight className="w-4 h-4 text-destructive" />
          )}
          <span className="text-sm capitalize">
            {item.direction.toLowerCase()}
          </span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Category',
      cell: (item: LedgerEntry) => (
        <span className="text-sm">{item.category}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      cell: (item: LedgerEntry) => (
        <span
          className={
            item.direction === 'CREDIT'
              ? 'credit-text'
              : 'debit-text'
          }
        >
          {item.direction === 'CREDIT' ? '+' : '-'}
          {formatCurrency(item.amount)}
        </span>
      ),
      className: 'text-right',
    },
  ];

  return (
    <>
      { isPending && <div>Loading ledger entries...</div> }
      { isError && <div><p>Cannot display ledger entries</p></div> }
      { data && (
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

    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Total Credits</p>
            <p className="text-2xl font-bold text-success">
              {formatCurrency(totalCredits)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Total Debits</p>
            <p className="text-2xl font-bold text-destructive">
              {formatCurrency(totalDebits)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Net Balance</p>
            <p className="text-2xl font-bold">
              {formatCurrency(totalCredits - totalDebits)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS */}
      <Card>
        <CardContent className="py-4 flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search by Member ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <Select
            value={directionFilter || 'ALL'}
            onValueChange={(val) => {
              setDirectionFilter(val === 'ALL' ? undefined : val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="CREDIT">Credit</SelectItem>
              <SelectItem value="DEBIT">Debit</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(val: 'asc' | 'desc') =>
              setSortOrder(val)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest</SelectItem>
              <SelectItem value="asc">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* TABLE */}
      {isPending && <p>Loading ledger entries...</p>}
      {isError && <p>Failed to load ledger entries</p>}

      {!isPending && (
        <>
          <DataTable
            columns={columns}
            data={ledgerData}
            emptyMessage="No ledger entries found"
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
      )}
    </div>
      )}
    </>
  );
}