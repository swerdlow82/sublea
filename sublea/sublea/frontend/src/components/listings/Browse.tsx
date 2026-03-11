import React, { useState, useCallback, useMemo } from 'react';
import { ListingCard } from '../../components/listings/ListingCard';
import type { Listing } from '../../types/listing';
import { GoogleMap } from '../../components/common/GoogleMap';
import { AddressAutocomplete } from '../common/AddressAutocomplete';
import { EmptyState } from '../ui/EmptyState';
import { useListingsBrowse, FilterState } from '../../hooks/useListingsBrowse';


//sub components 

const BrowseHeader = ({ visibleCount, totalCount }: { visibleCount: number; totalCount: number }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 py-5">
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-main)]">Browse Listings</h1>
      <p className="text-[var(--text-muted)] mt-1">Find your perfect student sublet for the upcoming semester.</p>
    </div>
    <div className="text-sm font-medium text-[var(--text-muted)] whitespace-nowrap">
      Showing {Math.min(visibleCount, totalCount)} of {totalCount} results
    </div>
  </div>
);

const SearchIcon = () => (
  <svg className="h-5 w-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onApply?: () => void;
}

const TopSearchBar = ({ filters, onFilterChange, onApply }: FilterBarProps) => {
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onApply?.();
  };
  return (
    <div className="sticky top-[3.5rem] z-40 py-3 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Location (4 cols) */}
        <div className="md:col-span-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 z-10 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <AddressAutocomplete
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            onSelect={(address) => { onFilterChange('location', address); onApply?.(); }}
            placeholder="Search city, university..."
            className="input pl-10 py-2.5 w-full"
          />
        </div>

        {/* Price (3 cols) */}
        <div className="md:col-span-3 flex items-center gap-2">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-muted)] text-sm">$</span>
            <input type="number" placeholder="Min" className="input pl-6 py-2.5"
              value={filters.minPrice} onChange={(e) => onFilterChange('minPrice', e.target.value)} onKeyDown={handleKey} />
          </div>
          <span className="text-[var(--text-muted)]">-</span>
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-muted)] text-sm">$</span>
            <input type="number" placeholder="Max" className="input pl-6 py-2.5"
              value={filters.maxPrice} onChange={(e) => onFilterChange('maxPrice', e.target.value)} onKeyDown={handleKey} />
          </div>
        </div>

        {/* Beds (2 cols) — instant apply via onApply after change */}
        <div className="md:col-span-2">
          <select className="input py-2.5 cursor-pointer" value={filters.bedrooms}
            onChange={(e) => { onFilterChange('bedrooms', e.target.value); onApply?.(); }}>
            <option value="any">Any Beds</option>
            <option value="0">Studio</option>
            <option value="1">1+ Bed</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
          </select>
        </div>

        {/* Date (2 cols) */}
        <div className="md:col-span-2">
          <input type="date" className="input py-2.5 text-[var(--text-muted)]"
            value={filters.moveInDate}
            onChange={(e) => { onFilterChange('moveInDate', e.target.value); onApply?.(); }}
            aria-label="Move-in Date" />
        </div>

        {/* Update (1 col) */}
        <div className="md:col-span-1">
          <button className="btn btn-primary w-full h-full py-2.5" onClick={() => onApply?.()}>Update</button>
        </div>
      </div>
    </div>
  );
};

/** Left-panel only: roommate preference dropdowns + sort-by */
const RoommateBar = ({ filters, onFilterChange }: FilterBarProps) => (
  <div className="pt-4 pb-4 border-b border-[var(--border)]">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
      <p className="text-sm font-semibold text-[var(--text-main)] m-0">Roommate Preferences</p>
      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        <span className="text-sm text-[var(--text-muted)]">Sort by:</span>
        <select className="input py-1 px-2 cursor-pointer text-sm w-auto"
          value={filters.sortOrder} onChange={(e) => onFilterChange('sortOrder', e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
      {[
        { name: 'prefGender',    opts: ['Any Gender', 'Male', 'Female', 'Non-binary'],              anyVal: 'Any' },
        { name: 'habitCleaning', opts: ['Any Cleanliness', 'Very Tidy', 'Tidy', 'Relaxed', 'Messy'], anyVal: 'Any' },
        { name: 'habitSmoking',  opts: ['Any Smoking', 'Non-smoker', 'Outside only', 'Okay with it'], anyVal: 'Any' },
        { name: 'habitPets',     opts: ['Any Pet Pref', 'No pets', 'Has pets', 'Pet-friendly'],       anyVal: 'Any' },
        { name: 'habitDrinking', opts: ['Any Drinking', 'Non-drinker', 'Socially', 'Frequently'],     anyVal: 'Any' },
        { name: 'habitNoise',    opts: ['Any Noise Tol', 'Quiet', 'Moderate', 'Social / Loud'],       anyVal: 'Any' },
      ].map(({ name, opts, anyVal }) => (
        <select
          key={name}
          className="input py-2 cursor-pointer text-sm"
          value={(filters as any)[name]}
          onChange={(e) => onFilterChange(name as keyof FilterState, e.target.value)}
        >
          {opts.map((opt, i) => (
            <option key={opt} value={i === 0 ? anyVal : opt}>{opt}</option>
          ))}
        </select>
      ))}
    </div>
  </div>
);

const LoadingSkeleton = ({ count }: { count: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="card p-0 h-full overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-800" />
        <div className="p-4 space-y-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          <div className="flex gap-4 pt-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ListingsGrid = ({
  listings,
  visibleCount,
  isLoading,
  onLoadMore,
  highlightedIds,
}: {
  listings: Listing[];
  visibleCount: number;
  isLoading: boolean;
  onLoadMore: () => void;
  highlightedIds?: Set<string>;
}) => {
  const hasMore = visibleCount < listings.length;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fade-in">
        {listings.slice(0, visibleCount).map(listing => (
          <div
            key={listing.id}
            id={`listing-card-${listing.id}`}
            className={`rounded-[var(--radius-card)] transition-all duration-500 ${
              highlightedIds?.has(listing.id)
                ? 'ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--background)] shadow-lg shadow-[var(--primary)]/20'
                : ''
            }`}
          >
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button onClick={onLoadMore} disabled={isLoading} className="btn btn-outline px-8 py-3">
            {isLoading ? 'Loading...' : 'Load More Listings'}
          </button>
        </div>
      )}
    </div>
  );
};

// main browse page 


export const Browse = () => {
  const {
    draft,
    listings,
    isLoading,
    visibleCount,
    handleDraftChange,
    applyTextFilters,
    handleDropdownChange,
    handleClearFilters,
    handleLoadMore,
  } = useListingsBrowse();

  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());

  const showLoadingSkeleton = isLoading && listings.length === 0;
  const showListings        = listings.length > 0;
  const showNoResults       = !isLoading && listings.length === 0;

  // Only show markers for listings that have real geocoded coordinates.
  // Listings sharing the exact same lat/lng are collapsed into one marker
  // so that clicking it highlights and scrolls to all of them.
  const mapMarkers = useMemo(() => {
    const PRECISION = 5; // 5 decimal places ≈ 1 m precision
    const round = (n: number) => Math.round(n * 10 ** PRECISION) / 10 ** PRECISION;

    const geocoded = listings
      .slice(0, visibleCount)
      .filter(l => typeof l.latitude === 'number' && typeof l.longitude === 'number');

    // Group by exact coordinate key
    const groups = new Map<string, Listing[]>();
    for (const l of geocoded) {
      const key = `${round(l.latitude!)},${round(l.longitude!)}`;
      const group = groups.get(key) ?? [];
      group.push(l);
      groups.set(key, group);
    }

    return Array.from(groups.values()).map(group => {
      const first = group[0];
      return {
        id: first.id,
        lat: first.latitude!,
        lng: first.longitude!,
        title: group.length > 1 ? `${group.length} listings at this address` : first.title,
        rent: first.rent,
        address: first.address,
        bedrooms: group.length === 1 ? first.bedrooms : undefined,
        bathrooms: group.length === 1 ? first.bathrooms : undefined,
        imageUrl: group.length === 1 && first.images ? first.images.split(',')[0] : undefined,
        count: group.length,
        listingIds: group.map(l => l.id),
      };
    });
  }, [listings, visibleCount]);

  // When a map marker is clicked, highlight matching listing cards and scroll to the first one.
  const handleMarkerClick = useCallback((markerId: string) => {
    const marker = mapMarkers.find(m => m.id === markerId);
    const ids = marker?.listingIds ?? [markerId];
    setHighlightedIds(new Set(ids));
    requestAnimationFrame(() => {
      document.getElementById(`listing-card-${ids[0]}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }, [mapMarkers]);

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      {/* Full-width header */}
      <div className="px-4 sm:px-5 lg:px-6">
        <BrowseHeader visibleCount={visibleCount} totalCount={listings.length} />
      </div>

      {/* Full-width sticky search bar */}
      <div className="px-4 sm:px-5 lg:px-6">
        <TopSearchBar filters={draft} onFilterChange={handleDraftChange} onApply={applyTextFilters} />
      </div>

      {/* Two-column body */}
      <div className="flex flex-col lg:flex-row">
        {/* Left — roommate prefs + listings */}
        <div className="w-full lg:w-[58%] px-4 sm:px-5 lg:px-6 pb-10">
          <RoommateBar filters={draft} onFilterChange={handleDropdownChange} />
          <div className="mt-5">
            {showLoadingSkeleton && <LoadingSkeleton count={4} />}
            {showListings && (
              <ListingsGrid
                listings={listings}
                visibleCount={visibleCount}
                isLoading={isLoading}
                onLoadMore={handleLoadMore}
                highlightedIds={highlightedIds}
              />
            )}
            {showNoResults && (
              <EmptyState
                icon={
                  <svg className="h-10 w-10 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                title="No listings found"
                description="Try adjusting your filters or search for a different location."
                action={
                  <button onClick={handleClearFilters} className="btn btn-secondary">Clear All Filters</button>
                }
              />
            )}
          </div>
        </div>

        {/* Right — sticky map */}
        <div className="hidden lg:block lg:w-[42%] pr-4 sm:pr-5 lg:pr-6 pt-5 pb-10">
          <div className="sticky top-[3.5rem] h-[calc(100vh-4.5rem)] rounded-[var(--radius-card)] overflow-hidden">
            <GoogleMap markers={mapMarkers} height="100%" onMarkerClick={handleMarkerClick} />
          </div>
        </div>
      </div>
    </div>
  );
};