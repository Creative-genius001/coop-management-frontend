import { PageHeader } from '@/app/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { formatDateLong } from '@/app/lib/formatters';
import { User, Mail, Phone, Calendar, CreditCard } from 'lucide-react';
import { useAuthStore } from '@/app/store/auth-store';

export default function Profile() {
  const { user } = useAuthStore();

  const fullname = user ? `${user.firstname} ${user.lastname}` : '';

  const profileFields = [
    { icon: User, label: 'Full Name', value: fullname },
    { icon: Mail, label: 'Email Address', value: user?.email },
    // { icon: Phone, label: 'Phone Number', value: user?. || 'Not provided' },
    { icon: CreditCard, label: 'Member ID', value: user?.memberId },
    { icon: Calendar, label: 'Member Since', value: user?.joinedAt ? formatDateLong(user.joinedAt) : '-' },
  ];

  return (

    <>
      { user &&  <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="View and manage your account information"
      />

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">
                  {fullname}
                </span>
              </div>
              <div>
                <CardTitle className="text-xl">{user?.firstname}</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">
                  {user?.role} Account
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {profileFields.map((field) => (
                <div key={field.label} className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <field.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{field.label}</p>
                    <p className="font-medium">{field.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>}
    </>
    
  );
}
