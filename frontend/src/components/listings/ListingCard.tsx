import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Listing } from '../../types/listing';
import { formatShortDate } from '../../utils/formatDate';

// re-export so existing code that imported Listing from here still compiles
export type { Listing };

interface ListingCardProps {
  listing: Listing;
}

interface BadgeProps {
  children: ReactNode;
  className: string;
}

interface IconProps {
  className: string;
  children: ReactNode;
}


const Badge = ({ children, className }: BadgeProps) => (
  <span className={`badge backdrop-blur-md shadow-sm ${className}`}>{children}</span>
);

const Icon = ({ className, children }: IconProps) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">{children}</svg>
);

const VerifiedBadge = () => (
  <Badge className="bg-white/90 dark:bg-gray-800/90 text-[var(--primary)] font-semibold flex items-center gap-1">
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    Verified
  </Badge>
);

const AnonymousBadge = () => (
  <Badge className="bg-gray-900/90 dark:bg-gray-700/90 text-white flex items-center gap-1">
    <Icon className="w-3 h-3">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243" />
    </Icon>
    Anonymous
  </Badge>
);

const ListingImage = ({ thumbnail, title, isVerified, isAnonymous }: { thumbnail: string | null; title: string; isVerified?: boolean; isAnonymous: boolean }) => (
  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface)]">
    {thumbnail ? (
      <img src={thumbnail} alt={title} className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-800 text-[var(--text-muted)]">
        <svg className="h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )}
    <div className="absolute top-3 left-3 flex gap-2">
      {isVerified  && <VerifiedBadge />}
      {isAnonymous && <AnonymousBadge />}
    </div>
  </div>
);

const ListingHeader = ({ title, address }: { title: string; address: string }) => (
  <div className="mb-2">
    <h3 className="font-heading text-lg font-semibold text-[var(--text-main)] truncate" title={title}>{title}</h3>
    <p className="text-sm text-[var(--text-muted)] truncate flex items-center gap-1 mt-1">
      <Icon className="w-3.5 h-3.5 flex-shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </Icon>
      {address}
    </p>
  </div>
);

const ListingDetails = ({ bedrooms, bathrooms }: { bedrooms: number; bathrooms: number }) => (
  <div className="flex items-center gap-4 text-sm text-[var(--text-main)] mb-4">
    <div className="flex items-center gap-1.5" title={`${bedrooms} Bedrooms`}>
      <Icon className="w-4 h-4 text-[var(--text-muted)]">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </Icon>
      <span>{bedrooms} Bed</span>
    </div>
    <div className="flex items-center gap-1.5" title={`${bathrooms} Bathrooms`}>
      <Icon className="w-4 h-4 text-[var(--text-muted)]">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </Icon>
      <span>{bathrooms} Bath</span>
    </div>
  </div>
);

const ListingFooter = ({ availableFrom, availableTo, rent }: { availableFrom: string; availableTo: string; rent: number }) => (
  <div className="mt-auto pt-3 border-t border-[var(--border)] flex items-center justify-between">
    <div className="flex flex-col">
      <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] font-medium uppercase tracking-wide">
        <Icon className="w-3 h-3">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </Icon>
        {formatShortDate(availableFrom)} - {formatShortDate(availableTo)}
      </div>
      <div className="text-[var(--primary)] font-bold text-lg leading-tight mt-1">
        ${rent.toLocaleString()}
        <span className="text-xs text-[var(--text-muted)] font-normal ml-1">/mo</span>
      </div>
    </div>
    <span className="btn btn-primary bg-opacity-0 text-[var(--primary)] hover:bg-[var(--surface)] hover:text-[var(--primary-hover)] p-2 rounded-full transition-colors border-0 shadow-none">
      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </span>
  </div>
);

export const ListingCard = ({ listing }: ListingCardProps) => {
  const { user } = useAuth();
  const { id, title, rent, address, bedrooms, bathrooms, available_from, available_to, images, anonymous_lister, is_verified } = listing;

  // backend sends images as a comma-separated string — grab just the first for the thumbnail
  const thumbnail    = images ? images.split(',')[0] : null;
  const displayAddress = anonymous_lister && !user ? 'Sign in to view address' : address;

  return (
    <Link to={`/listings/${id}`} className="group block h-full focus:outline-none" aria-label={`View listing: ${title}`}>
      <article className="card h-full flex flex-col p-0 overflow-hidden hover:shadow-[var(--shadow-glass)] transition-all duration-300 hover:-translate-y-1">
        <ListingImage thumbnail={thumbnail} title={title} isVerified={is_verified} isAnonymous={anonymous_lister} />
        <div className="flex flex-col flex-1 p-4">
          <ListingHeader title={title} address={displayAddress} />
          <ListingDetails bedrooms={bedrooms} bathrooms={bathrooms} />
          <ListingFooter availableFrom={available_from} availableTo={available_to} rent={rent} />
        </div>
      </article>
    </Link>
  );
};