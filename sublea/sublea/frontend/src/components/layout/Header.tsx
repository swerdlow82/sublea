import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface LogoProps {
  onClick: () => void;
}

interface NavLinkProps {
  href: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  className?: string;
  key?: string;
}

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

interface AuthActionsProps {
  isMobile?: boolean;
}

const Logo = ({ onClick }: LogoProps) => (
  <div className="flex items-center gap-2 cursor-pointer" onClick={onClick}>
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold shadow-sm">
      S
    </div>
    <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">Sublea.</span>
  </div>
);

const NavLink = ({ href, onClick, children, className = '' }: NavLinkProps) => (
  <a
    href={href}
    onClick={onClick}
    className={className || "text-sm font-medium text-[var(--text-muted)] hover:text-primary transition-colors"}
  >
    {children}
  </a>
);

const MobileMenuButton = ({ isOpen, onClick }: MobileMenuButtonProps) => (
  <button
    className="md:hidden p-2 text-[var(--text-main)] hover:bg-[var(--surface)] rounded-md"
    onClick={onClick}
    aria-label="Toggle menu"
  >
    {isOpen ? (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ) : (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )}
  </button>
);

const AuthActions = ({ isMobile = false }: AuthActionsProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  if (user) {
    const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'U';
    
    if (isMobile) {
      return (
        <div className="space-y-3">
          <Link to="/settings" className="block rounded-md px-3 py-2 text-base font-medium text-[var(--text-main)] hover:bg-[var(--surface)]">
            Profile
          </Link>
          <Link to="/dashboard" className="block rounded-md px-3 py-2 text-base font-medium text-[var(--text-main)] hover:bg-[var(--surface)]">
            My Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-outline w-full justify-center"
          >
            Sign out
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <Link to="/settings" className="text-sm font-medium text-[var(--text-muted)] hover:text-primary transition-colors">
          Profile
        </Link>
        <Link to="/dashboard" className="text-sm font-medium text-[var(--text-muted)] hover:text-primary transition-colors">
          My Dashboard
        </Link>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] hover:border-primary transition-colors overflow-hidden"
          >
            {user.profile_picture ? (
              <img src={user.profile_picture} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-[var(--text-main)]">{initials}</span>
            )}
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md bg-[var(--surface)] shadow-lg ring-1 ring-black ring-opacity-5 py-1 box-border border border-[var(--border)]">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--surface-hover)]"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Link
        to="/login"
        className={isMobile ? "btn btn-outline w-full justify-center" : "text-sm font-medium text-[var(--text-main)] hover:text-primary transition-colors px-3 py-2"}
      >
        Log in
      </Link>
      <Link
        to="/register"
        className={isMobile ? "btn btn-primary w-full justify-center" : "btn btn-primary text-sm px-4 py-2"}
      >
        Sign up
      </Link>
    </>
  );
};

interface NavigationItem {
  label: string;
  href: string;
  target: string;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { label: 'Home', href: '/', target: '/' },
  { label: 'Listings', href: '/browse', target: '/browse' },
  { label: 'How it Works', href: '/#how-it-works', target: '#how-it-works' },
  { label: 'FAQ', href: '/#faq', target: '#faq' },
  { label: 'Messages', href: '/inbox', target: '/inbox' },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogoClick = () => navigate('/');

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const element = document.getElementById(location.hash.substring(1));
    if (!element) {
      return;
    }

    setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', window.location.pathname);
    }, 100);
  }, [location]);

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, target: string) => {
    e.preventDefault();
    setIsMenuOpen(false);



    if (target.startsWith('#')) {
      if (location.pathname === '/') {
        const element = document.getElementById(target.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        navigate('/' + target);
      }
      return;
    }


    if (target === '/') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.replaceState(null, '', '/');
      } else {
        navigate('/');
      }
      return;
    }

    navigate(target);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo onClick={handleLogoClick} />

        <nav className="hidden md:flex items-center gap-8">
          {NAVIGATION_ITEMS.map((item) => (
            <NavLink
              key={item.target}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.target)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <AuthActions />
        </div>

        <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)]">
          <div className="space-y-1 px-4 py-4">
            {NAVIGATION_ITEMS.map((item) => (
              <NavLink
                key={item.target}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.target)}
                className="block rounded-md px-3 py-2 text-base font-medium text-[var(--text-main)] hover:bg-[var(--surface)]"
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3">
              <AuthActions isMobile />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};