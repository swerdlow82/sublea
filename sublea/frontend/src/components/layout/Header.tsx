import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
  isLoggedIn: boolean;
  onLogout: () => void;
  isMobile?: boolean;
}

const Logo = ({ onClick }: LogoProps) => (
  <div className="flex items-center gap-2 cursor-pointer" onClick={onClick}>
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold shadow-sm">
      S
    </div>
    <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">Sublea</span>
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

const AuthActions = ({ isLoggedIn, onLogout, isMobile = false }: AuthActionsProps) => {
  if (isLoggedIn) {
    return (
      <div className={isMobile ? "space-y-3" : "flex items-center gap-3"}>
        <button
          onClick={onLogout}
          className={isMobile ? "btn btn-outline w-full justify-center" : "text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)]"}
        >
          Log out
        </button>
        {!isMobile && (
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] hover:border-primary transition-colors">
            <span className="text-sm font-bold text-[var(--text-main)]">JD</span>
          </button>
        )}
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
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => setIsLoggedIn(false);

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


    // PROLLY change TBD TODO 
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

    // same here TBD 
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
          <AuthActions isLoggedIn={isLoggedIn} onLogout={handleLogout} />
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
              <AuthActions isLoggedIn={isLoggedIn} onLogout={handleLogout} isMobile />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};