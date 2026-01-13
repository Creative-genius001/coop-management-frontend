import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Layouts
import AppLayout from "@/components/layout/AppLayout";

// Auth
import Login from "@/pages/Login";

// Member Pages
import MemberDashboard from "@/pages/member/Dashboard";
import Contributions from "@/pages/member/Contributions";
import Loans from "@/pages/member/Loans";
import Withdrawals from "@/pages/member/Withdrawals";
import Accounts from "@/pages/member/Accounts";
import Ledger from "@/pages/member/Ledger";
import Profile from "@/pages/member/Profile";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminMembers from "@/pages/admin/Members";
import MemberDetail from "@/pages/admin/MemberDetail";
import AdminLoans from "@/pages/admin/Loans";
import AdminContributions from "@/pages/admin/Contributions";
import AdminWithdrawals from "@/pages/admin/Withdrawals";
import AdminLedger from "@/pages/admin/Ledger";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Member Routes */}
            <Route element={<AppLayout requiredRole="member" />}>
              <Route path="/dashboard" element={<MemberDashboard />} />
              <Route path="/contributions" element={<Contributions />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/withdrawals" element={<Withdrawals />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/ledger" element={<Ledger />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AppLayout requiredRole="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/members" element={<AdminMembers />} />
              <Route path="/admin/member/:memberId" element={<MemberDetail />} />
              <Route path="/admin/loans" element={<AdminLoans />} />
              <Route path="/admin/contributions" element={<AdminContributions />} />
              <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
              <Route path="/admin/ledger" element={<AdminLedger />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
