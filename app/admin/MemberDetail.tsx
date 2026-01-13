import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { ArrowLeft, User, Wallet, HandCoins, PiggyBank } from 'lucide-react';
import { formatCurrency, formatDateLong } from '@/lib/formatters';
import { mockMembers } from '@/data/mockData';

export default function MemberDetail() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  
  const member = mockMembers.find((m) => m.id === memberId);

  if (!member) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Member not found</p>
        <Button variant="outline" onClick={() => navigate('/admin/members')} className="mt-4">
          Back to Members
        </Button>
      </div>
    );
  }

  const financialCards = [
    {
      title: 'Total Savings',
      value: member.savings,
      icon: Wallet,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Share Capital',
      value: member.shareCapital,
      icon: PiggyBank,
      color: 'bg-success/10 text-success',
    },
    {
      title: 'Loan Balance',
      value: member.loanBalance,
      icon: HandCoins,
      color: 'bg-destructive/10 text-destructive',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/members')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <PageHeader
          title="Member Profile"
          description={`Viewing details for ${member.memberId}`}
        />
      </div>

      {/* Member Info Card */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-foreground">
                {member.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{member.name}</h2>
                <StatusBadge status={member.status} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Member ID</p>
                  <p className="font-medium font-mono">{member.memberId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{member.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{member.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p className="font-medium">{formatDateLong(member.joinDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {financialCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${card.color}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold">{formatCurrency(card.value)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Net Worth */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="py-6">
          <div className="text-center">
            <p className="text-primary-foreground/80">Net Account Balance</p>
            <p className="text-3xl font-bold mt-1">
              {formatCurrency(member.savings + member.shareCapital - member.loanBalance)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
