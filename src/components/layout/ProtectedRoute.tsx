import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

/** Guards child routes, redirecting to /login when no user is signed in */
export default function ProtectedRoute() {
  const { user, initializing } = useAuthStore();

  if (initializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-[rgb(18,22,14)]">
        <Loader2 className="h-6 w-6 animate-spin text-matcha-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
