'use client';

import DashboardLayout from '@/components/dashboard/Dashboard';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  );
}