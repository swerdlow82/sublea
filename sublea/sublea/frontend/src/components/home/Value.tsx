import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AddressAutocomplete } from '../common/AddressAutocomplete';

// Type Definitions

interface SearchFormProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

// Sub-Components

const LaunchBadge = () => (
  <div className="inline-block mb-6">
    <span className="px-4 py-2 bg-white/20 dark:bg-black/30 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30 dark:border-white/10">
      📍 Launching at University of Oregon
    </span>
  </div>
);

const HeroHeading = () => (
  <>
    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg text-white">
      Find Your Home Near UO
    </h1>
    <p className="text-xl md:text-2xl mb-8 text-white/90 drop-shadow-md">
      Student-Exclusive Subletting in Eugene
    </p>
  </>
);

const SearchForm = ({ searchQuery, onSearchQueryChange, onSubmit }: SearchFormProps) => (
  <form onSubmit={onSubmit} className="max-w-2xl mx-auto mb-6">
    <div className="flex flex-col sm:flex-row gap-3">
      <AddressAutocomplete
        value={searchQuery}
        onChange={(e) => onSearchQueryChange(e.target.value)}
        onSelect={(address) => onSearchQueryChange(address)}
        placeholder="Search by address or neighborhood..."
        className="flex-1 w-full px-6 py-4 rounded-xl text-gray-900 dark:text-gray-100 dark:bg-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-green-500/50 shadow-lg"
      />
      <button
        type="submit"
        className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg whitespace-nowrap"
      >
        Search
      </button>
    </div>
  </form>
);

const CTAButtons = () => (
  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
    <Link
      to="/browse"
      className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors shadow-md"
    >
      Browse Listings
    </Link>
    <Link
      to="/listings/create"
      className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors shadow-md"
    >
      Post Listing
    </Link>
  </div>
);

const TrustBadge = () => (
  <div className="mt-8 flex justify-center">
    <p className="text-sm text-white/90 bg-black/30 backdrop-blur-sm rounded-full px-4 py-1">
      Verified .edu students only • Safe, simple, and transparent
    </p>
  </div>
);

// Main Component

export const Value = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();



  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?location=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/browse');
    }
  };

  return (
    <section className="relative rounded-3xl overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center justify-center">
      {/* Hero background – campus neighborhood scene */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/value.webp)' }}
      />

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 text-center text-white">
        <LaunchBadge />
        <HeroHeading />
        <SearchForm
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSubmit={handleSearch}
        />
        <CTAButtons />
        <TrustBadge />
      </div>
    </section>
  );
};
