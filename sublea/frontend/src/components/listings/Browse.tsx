import { useState, useEffect } from 'react';
import { ListingCard, Listing } from '../../components/listings/ListingCard';
import { apiFetch } from "../../api/client"


interface FilterState {
  location: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  moveInDate: string;
  prefGender: string;
  habitCleaning: string;
  habitSmoking: string;
  habitPets: string;
  habitDrinking: string;
  habitNoise: string;
  sortOrder: string;
}

interface BrowseHeaderProps {
  visibleCount: number;
  totalCount: number;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
}

interface LoadingSkeletonProps {
  count: number;
}

interface NoResultsProps {
  onClearFilters: () => void;
}

const INITIAL_FILTERS: FilterState = {
  location: '',
  minPrice: '',
  maxPrice: '',
  bedrooms: 'any',
  bathrooms: 'any',
  moveInDate: '',
  prefGender: 'Any',
  habitCleaning: 'Any',
  habitSmoking: 'Any',
  habitPets: 'Any',
  habitDrinking: 'Any',
  habitNoise: 'Any',
  sortOrder: 'newest',
};

const ITEMS_PER_PAGE = 6;
const LOADING_DELAY = 800;
const LOAD_MORE_DELAY = 500;

// TODO: Replace this mock function with actual API call
// Example: const response = await fetch('/api/listings?location=...&min_price=...&max_price=...');
// Example: return await response.json();





// const fetchListings = async (filters: FilterState): Promise<Listing[]> => {
//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, LOADING_DELAY));
  
//   // MOCK DATA - Replace with actual API response
//   return [
//     {
//       id: '1',
//       title: 'Sunlit Loft near UO Campus',
//       rent: 1450,
//       address: '1450 Alder St, Eugene, OR',
//       bedrooms: 1,
//       bathrooms: 1,
//       available_from: '2024-06-01',
//       available_to: '2024-08-31',
//       images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop'],
//       anonymous_lister: false,
//       is_verified: true
//     },
//     {
//       id: '2',
//       title: 'Cozy Room - 5 min walk to Library',
//       rent: 900,
//       address: '890 Kincaid St, Eugene, OR',
//       bedrooms: 1,
//       bathrooms: 1,
//       available_from: '2024-05-15',
//       available_to: '2024-08-20',
//       images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop'],
//       anonymous_lister: false,
//       is_verified: true
//     },
//     {
//       id: '3',
//       title: 'Modern 2 Bed Apt - Downtown Eugene',
//       rent: 1800,
//       address: '500 E 13th Ave, Eugene, OR',
//       bedrooms: 2,
//       bathrooms: 2,
//       available_from: '2024-06-01',
//       available_to: '2024-12-31',
//       images: ['https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=800&auto=format&fit=crop'],
//       anonymous_lister: false,
//       is_verified: false
//     }
//   ];
// };

const BrowseHeader = ({ visibleCount, totalCount }: BrowseHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-main)]">Browse Listings</h1>
        <p className="text-[var(--text-muted)] mt-1">Find your perfect student sublet for the upcoming semester.</p>
      </div>
      <div className="text-sm font-medium text-[var(--text-muted)]">
        Showing {Math.min(visibleCount, totalCount)} of {totalCount} results
      </div>
    </div>
  );
};

const SearchIcon = () => (
  <svg className="h-5 w-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  return (
    <div className="sticky top-20 z-40 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4 bg-[var(--background)]/80 backdrop-blur-md border-y border-[var(--border)] transition-all">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 max-w-7xl mx-auto">
        
        {/* Location Search (3 cols) */}
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search city, university..."
            className="input pl-10 py-2.5"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
          />
        </div>

        {/* Price Range (3 cols) */}
        <div className="md:col-span-3 flex items-center gap-2">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-muted)] text-sm">$</span>
            <input
              type="number"
              placeholder="Min"
              className="input pl-6 py-2.5"
              value={filters.minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
            />
          </div>
          <span className="text-[var(--text-muted)]">-</span>
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[var(--text-muted)] text-sm">$</span>
            <input
              type="number"
              placeholder="Max"
              className="input pl-6 py-2.5"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            />
          </div>
        </div>

        {/* Bedrooms (2 cols) */}
        <div className="md:col-span-2">
          <select
            className="input py-2.5 cursor-pointer"
            value={filters.bedrooms}
            onChange={(e) => onFilterChange('bedrooms', e.target.value)}
          >
            <option value="any">Any Beds</option>
            <option value="0">Studio</option>
            <option value="1">1+ Bed</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
          </select>
        </div>

        {/* Move In Date (2 cols) */}
        <div className="md:col-span-2">
          <input
            type="date"
            className="input py-2.5 text-[var(--text-muted)]"
            value={filters.moveInDate}
            onChange={(e) => onFilterChange('moveInDate', e.target.value)}
            aria-label="Move-in Date"
          />
        </div>

        {/* Apply Button (2 cols) */}
        <div className="md:col-span-2">
          <button 
            className="btn btn-primary w-full h-full py-2.5"
            onClick={() => {/* Trigger fetch manually if needed, currently auto-fetches via effect */}}
          >
            Update
          </button>
        </div>

        {/* Roommate Preferences & Sort */}
        <div className="md:col-span-12 border-t border-[var(--border)] pt-4 mt-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
            <p className="text-sm font-semibold text-[var(--text-main)] m-0">Roommate Preferences</p>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <span className="text-sm text-[var(--text-muted)]">Sort by:</span>
              <select
                className="input py-1 px-2 cursor-pointer text-sm w-auto"
                value={filters.sortOrder}
                onChange={(e) => onFilterChange('sortOrder', e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <select
              className="input py-2 cursor-pointer text-sm"
              value={filters.prefGender}
              onChange={(e) => onFilterChange('prefGender', e.target.value)}
            >
              <option value="Any">Any Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
            </select>
            <select
              className="input py-2 cursor-pointer text-sm"
              value={filters.habitCleaning}
              onChange={(e) => onFilterChange('habitCleaning', e.target.value)}
            >
              <option value="Any">Any Cleanliness</option>
              <option value="Very Tidy">Very Tidy</option>
              <option value="Tidy">Tidy</option>
              <option value="Relaxed">Relaxed</option>
              <option value="Messy">Messy</option>
            </select>
            <select
              className="input py-2 cursor-pointer text-sm"
              value={filters.habitSmoking}
              onChange={(e) => onFilterChange('habitSmoking', e.target.value)}
            >
              <option value="Any">Any Smoking</option>
              <option value="Non-smoker">Non-smoker</option>
              <option value="Outside only">Outside only</option>
              <option value="Okay with it">Okay with it</option>
            </select>
            <select
              className="input py-2 cursor-pointer text-sm"
              value={filters.habitPets}
              onChange={(e) => onFilterChange('habitPets', e.target.value)}
            >
              <option value="Any">Any Pet Pref</option>
              <option value="No pets">No pets</option>
              <option value="Has pets">Has pets</option>
              <option value="Pet-friendly">Pet-friendly</option>
            </select>
            <select
              className="input py-2 cursor-pointer text-sm"
              value={filters.habitDrinking}
              onChange={(e) => onFilterChange('habitDrinking', e.target.value)}
            >
              <option value="Any">Any Drinking</option>
              <option value="Non-drinker">Non-drinker</option>
              <option value="Socially">Socially</option>
              <option value="Frequently">Frequently</option>
            </select>
            <select
              className="input py-2 cursor-pointer text-sm"
              value={filters.habitNoise}
              onChange={(e) => onFilterChange('habitNoise', e.target.value)}
            >
              <option value="Any">Any Noise Tol</option>
              <option value="Quiet">Quiet</option>
              <option value="Moderate">Moderate</option>
              <option value="Social">Social / Loud</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = ({ count }: LoadingSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card p-0 h-full overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200 dark:bg-gray-800"></div>
          <div className="p-4 space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
            <div className="flex gap-4 pt-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const NoResults = ({ onClearFilters }: NoResultsProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="h-20 w-20 bg-[var(--surface)] rounded-full flex items-center justify-center mb-4">
        <svg className="h-10 w-10 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">No listings found</h3>
      <p className="text-[var(--text-muted)] max-w-sm mb-6">
        Try adjusting your filters or search for a different location to find what you're looking for.
      </p>
      <button 
        onClick={onClearFilters}
        className="btn btn-secondary"
      >
        Clear All Filters
      </button>
    </div>
  );
};

interface ListingsGridProps {
  listings: Listing[];
  visibleCount: number;
  isLoading: boolean;
  onLoadMore: () => void;
}

const ListingsGrid = ({ listings, visibleCount, isLoading, onLoadMore }: ListingsGridProps) => {
  const hasMore = visibleCount < listings.length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {listings.slice(0, visibleCount).map((listing) => (
          <ListingCard key={listing.id} listing={listing} /> //TBD fix key = 
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center pt-8">
          <button 
            onClick={onLoadMore}
            disabled={isLoading}
            className="btn btn-outline px-8 py-3"
          >
            {isLoading ? 'Loading...' : 'Load More Listings'}
          </button>
        </div>
      )}
    </div>
  );
};

export const Browse = () => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);

      try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== 'any' && value !== 'Any' && value !== 'newest') {
            queryParams.append(key, value as string);
          } else if (key === 'sortOrder' && value === 'newest') {
            queryParams.append(key, value as string);
          }
        });

        const data = await apiFetch(`/api/listings?${queryParams.toString()}`);

        console.log("Real listings from DB: ", data);
        setListings(data);
      } catch (error) {
        console.error("Failed to load listings:", error);
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadListings();
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      setIsLoading(false);
    }, LOAD_MORE_DELAY);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const showLoadingSkeleton = isLoading && listings.length === 0;
  const showListings = listings.length > 0;
  const showNoResults = !isLoading && listings.length === 0;

  return (
    <div className="space-y-6">
      <BrowseHeader visibleCount={visibleCount} totalCount={listings.length} />
      
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      <div className="min-h-[500px]">
        {showLoadingSkeleton && <LoadingSkeleton count={6} />}
        
        {showListings && (
          <ListingsGrid 
            listings={listings}
            visibleCount={visibleCount}
            isLoading={isLoading}
            onLoadMore={handleLoadMore}
          />
        )}
        
        {showNoResults && <NoResults onClearFilters={handleClearFilters} />}
      </div>
    </div>
  );
};