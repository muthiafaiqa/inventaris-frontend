import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, loading } = useAuth();

  // Show a modern spinner while verifying the active session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium text-sm">Memeriksa sesi...</p>
        </div>
      </div>
    );
  }

  // If there's no active Supabase session, redirect to the login page
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Render children or fallback to Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
}
