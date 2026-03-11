import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { Listing } from '../types/listing';

export interface FilterState {
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

export const INITIAL_FILTERS: FilterState = {
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

// how many cards to show per "page" before the load-more button appears
const ITEMS_PER_PAGE = 6;
// small fake delay on load-more so the button doesn't feel instant / broken
const LOAD_MORE_DELAY = 500;

// encapsulates all filter state and the listings data fetch for the Browse page.
// Browse.tsx ends up being pure layout — all the logic lives here.
export const useListingsBrowse = () => {
  const [searchParams] = useSearchParams();

  // pick up any location pre-fill from the home page search bar
  const initialFilters: FilterState = {
    ...INITIAL_FILTERS,
    location: searchParams.get('location') || searchParams.get('query') || '',
  };

  // `filters` is what actually drives fetching — updated on user intent (button click or dropdown change)
  // `draft` is the live text input state — only committed to `filters` when the user clicks "Update"
  const [filters, setFilters]       = useState<FilterState>(initialFilters);
  const [draft, setDraft]           = useState<FilterState>(initialFilters);
  const [listings, setListings]     = useState<Listing[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      try {
        const q = new URLSearchParams();

        if (filters.location.trim())                                           q.append('location',       filters.location.trim());
        if (filters.minPrice !== '' && !isNaN(Number(filters.minPrice)))       q.append('minPrice',       filters.minPrice);
        if (filters.maxPrice !== '' && !isNaN(Number(filters.maxPrice)))       q.append('maxPrice',       filters.maxPrice);
        if (filters.bedrooms && filters.bedrooms !== 'any')                    q.append('bedrooms',       filters.bedrooms);
        if (filters.moveInDate)                                                q.append('moveInDate',     filters.moveInDate);
        if (filters.prefGender && filters.prefGender !== 'Any')                q.append('prefGender',     filters.prefGender);
        if (filters.habitCleaning && filters.habitCleaning !== 'Any')          q.append('habitCleaning',  filters.habitCleaning);
        if (filters.habitSmoking && filters.habitSmoking !== 'Any')            q.append('habitSmoking',   filters.habitSmoking);
        if (filters.habitPets && filters.habitPets !== 'Any')                  q.append('habitPets',      filters.habitPets);
        if (filters.habitDrinking && filters.habitDrinking !== 'Any')          q.append('habitDrinking',  filters.habitDrinking);
        if (filters.habitNoise && filters.habitNoise !== 'Any')                q.append('habitNoise',     filters.habitNoise);
        q.append('sortOrder', filters.sortOrder || 'newest');

        console.log('🔍 Fetching listings with params:', q.toString());
        const data = await apiFetch(`/api/listings?${q.toString()}`);
        setListings(data);
      } catch (error) {
        console.error('Failed to load listings:', error);
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadListings();
  }, [filters]);

  // text inputs (location, price, date) only update draft — committed on "Update" click
  const handleDraftChange = (key: keyof FilterState, value: string) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  // commit draft text fields → filters, which re-triggers the api fetch
  const applyTextFilters = () => {
    setFilters(prev => ({
      ...prev,
      location:  draft.location,
      minPrice:  draft.minPrice,
      maxPrice:  draft.maxPrice,
      moveInDate: draft.moveInDate,
    }));
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // dropdowns write to both draft and filters instantly — no need to click "Update"
  const handleDropdownChange = (key: keyof FilterState, value: string) => {
    setDraft(prev => ({ ...prev, [key]: value }));
    setFilters(prev => ({ ...prev, [key]: value }));
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
    setDraft(INITIAL_FILTERS);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      setIsLoading(false);
    }, LOAD_MORE_DELAY);
  };

  return {
    filters,
    draft,
    listings,
    isLoading,
    visibleCount,
    handleDraftChange,
    applyTextFilters,
    handleDropdownChange,
    handleClearFilters,
    handleLoadMore,
  };
};
