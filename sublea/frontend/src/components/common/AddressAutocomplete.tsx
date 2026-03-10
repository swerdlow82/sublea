import React, { useState, useEffect, useRef, useCallback, ChangeEvent } from 'react';

export interface AddressSuggestion {
  place_id: number;
  display_name: string;
}

export interface AddressAutocompleteProps {
  value: string;
  onSelect: (address: string) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean;
  className?: string; // Additional classes for the input
  placeholder?: string;
}

export const AddressAutocomplete = ({ 
  value, 
  onSelect, 
  onChange, 
  hasError, 
  className = "input", 
  placeholder = "Start typing an address…" 
}: AddressAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: '6',
        countrycodes: 'us',
      });
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: { 'Accept-Language': 'en' },
      });
      const data: AddressSuggestion[] = await res.json();
      setSuggestions(data);
      setIsOpen(data.length > 0);
      setActiveIndex(-1);
    } catch {
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    const q = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(q), 350);
  };

  const handleSelect = (suggestion: AddressSuggestion) => {
    onSelect(suggestion.display_name);
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'Enter') {
         // Allow standard enter behavior on input if not picking a suggestion
         return;
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if(activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full text-left" style={{ position: 'relative' }}>
      <div className="relative w-full h-full flex items-center">
        <input
          name="address"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`${className} ${hasError ? 'border-red-500' : ''}`}
          placeholder={placeholder}
          autoComplete="off"
        />
        {isLoading && (
          <div style={{
            position: 'absolute', right: '12px', top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none'
          }}>
            <svg className="animate-spin h-5 w-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 z-50 bg-[var(--surface)] dark:bg-gray-800 border border-[var(--border)] dark:border-gray-700 shadow-xl rounded-xl mt-1 py-1 max-h-60 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <li
              key={s.place_id}
              onMouseDown={() => handleSelect(s)}
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer text-sm transition-colors ${
                idx === activeIndex 
                  ? 'bg-blue-50 dark:bg-gray-700/50 text-[var(--primary)]' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
              }`}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              <svg className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="line-clamp-2">
                {s.display_name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
