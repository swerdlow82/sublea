import { useEffect, useState, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

interface LoadingSpinnerProps {
  message: string;
}

const LoadingSpinner = ({ message }: LoadingSpinnerProps) => (
  <div className="flex min-h-screen w-full items-center justify-center bg-[var(--background)]">
    <div className="flex flex-col items-center gap-3">
      <svg 
        className="h-10 w-10 animate-spin text-[var(--primary)]" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="text-sm font-medium text-[var(--text-muted)] animate-pulse">
        {message}
      </span>
    </div>
  </div>
);

const checkAuthentication = (): boolean => {
  try {
    const token = localStorage.getItem('authToken');
    return !!token;
  } catch (error) {
    console.error("Auth check failed", error);
    return false;
  }
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const authStatus = checkAuthentication();
    setIsAuthenticated(authStatus);
  }, []);

  if (isAuthenticated === null) {
    return <LoadingSpinner message="Verifying access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};