import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}



const NavLink = ({ to, children, className = '' }: NavLinkProps) => (
  <Link 
    to={to} 
    className={`text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors ${className}`}
  >
    {children}
  </Link>
);

const LegalLink = ({ to, children }: NavLinkProps) => (
  <Link 
    to={to} 
    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
  >
    {children}
  </Link>
);


const BrandLogo = () => (
  <Link to="/" className="flex items-center gap-2 group">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-lg shadow-sm group-hover:bg-[var(--primary-hover)] transition-colors">
      S
    </div>
    <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">Sublea</span>
  </Link>
);

const AuthenticatedLinks = () => (
  <>
    <NavLink to="/dashboard">My Listings</NavLink>
  </>
);

const NavigationLinks = ({ isLoggedIn }: { isLoggedIn: boolean }) => (
  <nav className="flex flex-wrap gap-6 md:gap-8">
    <NavLink to="/">Home</NavLink>
    <NavLink to="/browse">Browse</NavLink>
    {isLoggedIn && <AuthenticatedLinks />}
    <NavLink to="/contact">About Us</NavLink>
    <NavLink to="/contact">Contact Us</NavLink>
  </nav>
);

const LegalLinks = () => (
  <div className="flex gap-6 order-2 md:order-1">
    <LegalLink to="/help">Help Center</LegalLink>
    <LegalLink to="/terms">Terms of Service</LegalLink>
    <LegalLink to="/privacy">Privacy Policy</LegalLink>
  </div>
);



const Copyright = () => (
  <p className="text-xs text-[var(--text-muted)]">
    &copy; {new Date().getFullYear()} Sublea Inc.
  </p>
);

const BottomSection = () => (
  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
    <LegalLinks />
    <div className="flex items-center gap-6 order-1 md:order-2">
      <Copyright />
    </div>
  </div>
);

const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('authToken');
      setIsLoggedIn(!!updatedToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return isLoggedIn;
};

export const Footer = () => {
  const isLoggedIn = useAuthStatus();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <BrandLogo />
          </div>
          <NavigationLinks isLoggedIn={isLoggedIn} />
        </div>
        
        <div className="h-px w-full bg-[var(--border)] mb-8"></div>

        <BottomSection />
      </div>
    </footer>
  );
};