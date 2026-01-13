import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { mockMembers, mockContributions } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function AdminContributions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const { toast } = useToast();

  const filteredMembers = mockMembers.filter(
    (m) =>
      m.status === 'active' &&
      (m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.memberId.toLowerCase().includes(memberSearch.toLowerCase()))
  );

  const totalContributions = mockContributions.reduce((sum, c) => sum + c.amount, 0);

  const handleRecordContribution = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Contribution recorded',
      description: 'The contribution has been recorded and ledger updated.',
    });
    setIsDialogOpen(false);
    setSelectedMember('');
    setMemberSearch('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Record Contributions"
        description="Record cash contributions for members"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Record Contribution
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Record Contribution</DialogTitle>
                <DialogDescription>
                  Enter the contribution details. This will update the member's account and ledger.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRecordContribution} className="space-y-4 mt-4">
                {/* Member Search */}
                <div className="space-y-2">
                  <Label>Select Member</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search member..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {memberSearch && (
                    <div className="max-h-32 overflow-y-auto border rounded-lg">
                      {filteredMembers.map((member) => (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => {
                            setSelectedMember(member.id);
                            setMemberSearch(member.name);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex justify-between"
                        >
                          <span>{member.name}</span>
                          <span className="text-muted-foreground font-mono">{member.memberId}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contribution Type</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly Contribution</SelectItem>
                      <SelectItem value="special">Special Contribution</SelectItem>
                      <SelectItem value="share_capital">Share Capital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={!selectedMember}>
                    Record Contribution
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">Total Contributions (All Time)</p>
            <p className="text-3xl font-bold">{formatCurrency(totalContributions)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">Total Records</p>
            <p className="text-3xl font-bold">{mockContributions.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Contributions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockContributions.slice(0, 5).map((contribution) => (
              <div
                key={contribution.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">{contribution.memberId}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {contribution.type.replace('_', ' ')}
                  </p>
                </div>
                <span className="font-semibold text-success">
                  +{formatCurrency(contribution.amount)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
