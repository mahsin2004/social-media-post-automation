'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

    if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-pink-50 to-pink-100">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            
            <Sparkles className="absolute inset-0 w-16 h-16 text-pink-400 animate-spin animation-delay-200" />
          </div>
          <p className="text-lg font-medium text-gray-700">Generating your content...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}