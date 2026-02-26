import React, { useState, useEffect, useRef, useCallback, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListingCard, Listing } from '../../components/listings/ListingCard';
import { apiFetch, ApiError } from "../../api/client"
import { toast } from 'react-hot-toast';

// TYPE DEFINITIONS

interface ListingFormData {
  title: string; 
  address: string;
  rent: string;
  availableFrom: string;
  availableTo: string;
  bedrooms: string;
  bathrooms: string;
  roommates: string;
  description: string;
  images: string[];
  anonymous: boolean;
  amenities: string[];
  prefGender: string;
  prefAgeMin: string;
  prefAgeMax: string;
  habitCleaning: string;
  habitSmoking: string;
  habitPets: string;
  habitDrinking: string;
  habitNoise: string;
  bedTime: string;
  wakeTime: string;
}

type ValidationErrors = Record<string, string>;

interface ProgressStepProps {
  stepNumber: number;
  label: string;
  currentStep: number;
  isLast?: boolean;
}

// ADDRESS AUTOCOMPLETE

interface AddressSuggestion {
  place_id: number;
  display_name: string;
}

interface AddressAutocompleteProps {
  value: string;
  onSelect: (address: string) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  hasError: boolean;
}

const AddressAutocomplete = ({ value, onSelect, onChange, hasError }: AddressAutocompleteProps) => {
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
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
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
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          name="address"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`input ${hasError ? 'border-red-500' : ''}`}
          placeholder="Start typing an address…"
          autoComplete="off"
        />
        {isLoading && (
          <div style={{
            position: 'absolute', right: '12px', top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none'
          }}>
            <svg className="animate-spin h-4 w-4 text-[var(--primary)]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          listStyle: 'none',
          margin: 0,
          padding: '4px 0',
          overflow: 'hidden',
        }}>
          {suggestions.map((s, idx) => (
            <li
              key={s.place_id}
              onMouseDown={() => handleSelect(s)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: 'var(--text-main)',
                background: idx === activeIndex ? 'var(--primary-light, rgba(99,102,241,0.1))' : 'transparent',
                transition: 'background 0.15s',
              }}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              <svg style={{ flexShrink: 0, width: '14px', height: '14px', color: 'var(--primary)', opacity: 0.8 }}
                fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {s.display_name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface StepBasicsProps {
  formData: ListingFormData;
  errors: ValidationErrors;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAddressSelect: (address: string) => void;
}

interface StepDetailsProps {
  formData: ListingFormData;
  errors: ValidationErrors;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAmenityToggle: (amenity: string) => void;
  onUploadImages: (files: FileList) => void;
  onRemoveImage: (index: number) => void;
  onAddDemoImage: () => void;
}

 interface StepPreferencesProps {
  formData: ListingFormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

interface StepReviewProps {
  formData: ListingFormData;
  previewListing: Listing;
}

interface FormActionsProps {
  step: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

// CONSTANTS

const INITIAL_DATA: ListingFormData = {
  title: '',
  address: '',
  rent: '',
  availableFrom: '',
  availableTo: '',
  bedrooms: '1',
  bathrooms: '1',
  roommates: '0',
  description: '',
  images: [],
  anonymous: false,
  amenities: [],
  prefGender: 'Any',
  prefAgeMin: '',
  prefAgeMax: '',
  habitCleaning: '',
  habitSmoking: '',
  habitPets: '',
  habitDrinking: '',
  habitNoise: '',
  bedTime: '',
  wakeTime: '',
};

const AMENITIES_LIST = [
  'WiFi', 'Washer/Dryer', 'AC', 'Furnished', 'Elevator', 
  'Gym', 'Dishwasher', 'Pets Allowed', 'Balcony', 'Parking'
];

const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=800&auto=format&fit=crop'
];

// SUB-COMPONENTS

const ProgressStep = ({ stepNumber, label, currentStep, isLast = false }: ProgressStepProps) => {
  const isActive = currentStep >= stepNumber;
  const isComplete = currentStep > stepNumber;
  
  return (
    <>
      <div className={`flex items-center gap-2 ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
          isActive ? 'border-[var(--primary)] bg-[var(--primary)] text-white' : 'border-[var(--border)]'
        }`}>
          {stepNumber}
        </div>
        <span className="hidden sm:inline font-medium">{label}</span>
      </div>
      {!isLast && (
        <div className={`w-12 h-0.5 ${isComplete ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}></div>
      )}
    </>
  );
};

const StepBasics = ({ formData, errors, onChange, onAddressSelect }: StepBasicsProps) => {
  return (
    <div className="space-y-6 animate-slide-up">
      <h2 className="text-xl font-bold mb-4">Essential Information</h2>
      
      <div className="input-group">
        <label className="label">Listing Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={onChange}
          className={`input ${errors.title ? 'border-red-500' : ''}`}
          placeholder="e.g., Sunny Studio near Campus"
          maxLength={100}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      <div className="input-group">
        <label className="label">Address</label>
        <AddressAutocomplete
          value={formData.address}
          onChange={onChange}
          onSelect={onAddressSelect}
          hasError={!!errors.address}
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="input-group">
          <label className="label">Monthly Rent ($)</label>
          <input
            name="rent"
            type="number"
            value={formData.rent}
            onChange={onChange}
            className={`input ${errors.rent ? 'border-red-500' : ''}`}
            placeholder="1200"
            min="0"
          />
          {errors.rent && <p className="text-red-500 text-xs mt-1">{errors.rent}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="input-group">
          <label className="label">Available From</label>
          <input
            name="availableFrom"
            type="date"
            value={formData.availableFrom}
            onChange={onChange}
            className={`input ${errors.availableFrom ? 'border-red-500' : ''}`}
          />
          {errors.availableFrom && <p className="text-red-500 text-xs mt-1">{errors.availableFrom}</p>}
        </div>
        <div className="input-group">
          <label className="label">Available To (Optional)</label>
          <input
            name="availableTo"
            type="date"
            value={formData.availableTo}
            onChange={onChange}
            className={`input ${errors.availableTo ? 'border-red-500' : ''}`}
          />
          {errors.availableTo && <p className="text-red-500 text-xs mt-1">{errors.availableTo}</p>}
        </div>
      </div>
    </div>
  );
};

const StepDetails = ({ 
  formData, 
  errors, 
  onChange, 
  onAmenityToggle, 
  onUploadImages, 
  onRemoveImage, 
  onAddDemoImage 
}: StepDetailsProps) => {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Rooms Configuration */}
      <div>
        <h2 className="text-xl font-bold mb-4">Property Details</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="input-group">
            <label className="label">Bedrooms</label>
            <input
              name="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={onChange}
              className="input"
              min="0"
            />
          </div>
          <div className="input-group">
            <label className="label">Bathrooms</label>
            <input
              name="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={onChange}
              className="input"
              min="0"
              step="0.5"
            />
          </div>
          <div className="input-group">
            <label className="label">Roommates</label>
            <input
              name="roommates"
              type="number"
              value={formData.roommates}
              onChange={onChange}
              className="input"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="input-group">
        <label className="label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          className={`input min-h-[150px] resize-y ${errors.description ? 'border-red-500' : ''}`}
          placeholder="Tell potential subletters about your place, roommates, and the neighborhood..."
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Amenities */}
      <div>
        <label className="label mb-3 block">Amenities</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {AMENITIES_LIST.map(amenity => (
            <label key={amenity} className={`cursor-pointer rounded-lg border p-3 text-sm font-medium transition-all text-center flex items-center justify-center
              ${formData.amenities.includes(amenity) 
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md' 
                : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary)]'
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={formData.amenities.includes(amenity)}
                onChange={() => onAmenityToggle(amenity)}
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="label mb-2 block">Photos</label>
        
        <div className="flex flex-wrap gap-4 mb-4">
          {formData.images.map((img, idx) => (
            <div key={idx} className="relative w-32 h-24 rounded-lg overflow-hidden border border-[var(--border)] group">
              <img src={img} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemoveImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}

          {/* Upload drop-zone shown when no images yet */}
          {formData.images.length === 0 && (
            <label
              htmlFor="photo-upload"
              className="w-full h-32 border-2 border-dashed border-[var(--border)] rounded-lg flex flex-col items-center justify-center text-[var(--text-muted)] bg-[var(--surface)] cursor-pointer hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
              <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Click to upload photos</span>
              <span className="text-xs mt-1 opacity-70">JPG, PNG, WEBP — multiple allowed</span>
            </label>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Hidden file input */}
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && onUploadImages(e.target.files)}
          />
          <label
            htmlFor="photo-upload"
            className="btn btn-secondary cursor-pointer whitespace-nowrap"
          >
            <svg className="w-4 h-4 inline-block mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Photos
          </label>
          <button type="button" onClick={onAddDemoImage} className="text-xs text-[var(--primary)] hover:underline">
            + Add random demo image
          </button>
        </div>
        {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
      </div>

       {/* Anonymous Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
        <div>
          <h3 className="font-semibold text-[var(--text-main)]">Post Anonymously</h3>
          <p className="text-sm text-[var(--text-muted)]">Hide your profile from public view. Only verified students can message you.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            name="anonymous"
            checked={formData.anonymous} 
            onChange={onChange}
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
        </label>
      </div>
    </div>
  );
};

const StepPreferences = ({ formData, onChange }: StepPreferencesProps) => {
  return (
    <div className="space-y-8 animate-slide-up">
      <div className="border-b border-[var(--border)] pb-4">
        <h3 className="font-bold text-lg">Roommate Compatibility</h3>
        <p className="text-sm text-[var(--text-muted)]">Describe your current roommates (if applicable) so potential sublessees can see if they'd be a good fit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demographics */}
        <div className="space-y-6">
          <h4 className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wide">Demographics</h4>
          <div className="input-group">
            <label className="label">Preferred Gender</label>
            <select name="prefGender" value={formData.prefGender} onChange={onChange} className="input">
              <option value="Any">Any</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
            </select>
          </div>
          
          <div>
            <label className="label mb-2 block">Age Range</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="prefAgeMin"
                value={formData.prefAgeMin}
                onChange={onChange}
                className="input w-24 text-center"
                min="16"
              />
              <span className="text-[var(--text-muted)]">to</span>
              <input
                type="number"
                name="prefAgeMax"
                value={formData.prefAgeMax}
                onChange={onChange}
                className="input w-24 text-center"
                max="100"
              />
            </div>
          </div>
        </div>

        {/* Habits */}
        <div className="space-y-6">
          <h4 className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wide">Lifestyle Habits</h4>
          
          <div className="input-group">
            <label className="label">Cleanliness</label>
            <select name="habitCleaning" value={formData.habitCleaning} onChange={onChange} className="input">
              <option value="Very Tidy">Very Tidy</option>
              <option value="Tidy">Tidy</option>
              <option value="Relaxed">Relaxed</option>
              <option value="Messy">Messy</option>
            </select>
          </div>

          <div className="input-group">
            <label className="label">Smoking</label>
            <select name="habitSmoking" value={formData.habitSmoking} onChange={onChange} className="input">
              <option value="Non-smoker">Non-smoker</option>
              <option value="Outside only">Outside only</option>
              <option value="Okay with it">Okay with it</option>
            </select>
          </div>

          <div className="input-group">
            <label className="label">Pets</label>
            <select name="habitPets" value={formData.habitPets} onChange={onChange} className="input">
              <option value="No pets">No pets</option>
              <option value="Has pets">Has pets</option>
              <option value="Pet-friendly">Pet-friendly (doesn't own)</option>
            </select>
          </div>

          <div className="input-group">
            <label className="label">Drinking</label>
            <select name="habitDrinking" value={formData.habitDrinking} onChange={onChange} className="input">
              <option value="Non-drinker">Non-drinker</option>
              <option value="Socially">Socially</option>
              <option value="Frequently">Frequently</option>
            </select>
          </div>

          <div className="input-group">
            <label className="label">Noise Tolerance</label>
            <select name="habitNoise" value={formData.habitNoise} onChange={onChange} className="input">
              <option value="">Select</option>
              <option value="Quiet">Quiet (Study focused)</option>
              <option value="Moderate">Moderate</option>
              <option value="Social">Social / Loud</option>
            </select>
          </div>

          <div className="input-group">
            <label className="label">Bed Time</label>
            <select name="bedTime" value={formData.bedTime} onChange={onChange} className="input">
              <option value="">Select</option>
              <option value="Early (Before 10 PM)">Early (Before 10 PM)</option>
              <option value="Average (10 PM - 12 AM)">Average (10 PM - 12 AM)</option>
              <option value="Night Owl (After 12 AM)">Night Owl (After 12 AM)</option>
            </select>
          </div>

          <div className="input-group">
            <label className="label">Wake Time</label>
            <select name="wakeTime" value={formData.wakeTime} onChange={onChange} className="input">
              <option value="">Select</option>
              <option value="Early Bird (Before 7 AM)">Early Bird (Before 7 AM)</option>
              <option value="Average (7 AM - 9 AM)">Average (7 AM - 9 AM)</option>
              <option value="Late Riser (After 9 AM)">Late Riser (After 9 AM)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const StepReview = ({ formData, previewListing }: StepReviewProps) => {
  return (
    <div className="space-y-8 animate-slide-up">
      <h2 className="text-xl font-bold mb-4">Preview Your Listing</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview Card */}
        <div className="max-w-sm mx-auto w-full">
          <div className="relative pointer-events-none transform scale-95 origin-top">
            <ListingCard listing={previewListing} />
          </div>
          <p className="text-center text-xs text-[var(--text-muted)] mt-2">
            This is how your listing will appear in search results.
          </p>
        </div>

        {/* Summary Details */}
        <div className="space-y-4">
          <div className="glass-panel p-6">
            <h3 className="font-bold text-lg mb-4 text-[var(--text-main)]">Details Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-[var(--border)] pb-2">
                <span className="text-[var(--text-muted)]">Monthly Rent</span>
                <span className="font-semibold">${formData.rent}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-2">
                <span className="text-[var(--text-muted)]">Dates</span>
                <span className="font-medium">{formData.availableFrom} to {formData.availableTo || 'Indefinite'}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-2">
                <span className="text-[var(--text-muted)]">Configuration</span>
                <span className="font-medium">{formData.bedrooms} Bed, {formData.bathrooms} Bath</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-2">
                <span className="text-[var(--text-muted)]">Visibility</span>
                <span className="font-medium">{formData.anonymous ? 'Anonymous' : 'Public Profile'}</span>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-sm mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.length > 0 ? (
                  formData.amenities.map(a => (
                    <span key={a} className="badge badge-neutral text-xs">{a}</span>
                  ))
                ) : (
                  <span className="text-[var(--text-muted)] text-xs italic">None selected</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormActions = ({ step, isSubmitting, onBack, onNext, onCancel, onSubmit }: FormActionsProps) => {
  return (
    <div className="mt-8 pt-6 border-t border-[var(--border)] flex justify-between items-center">
      {step > 1 ? (
        <button 
          onClick={onBack}
          className="btn btn-outline"
          disabled={isSubmitting}
        >
          Back
        </button>
      ) : (
         <button 
          onClick={onCancel}
          className="btn btn-ghost text-[var(--text-muted)]"
        >
          Cancel
        </button>
      )}

       {step < 4 ? (
        <button 
           onClick={onNext}
          className="btn btn-primary"
        >
          Next Step
        </button>
      ) : (
        <button 
          onClick={onSubmit}
          disabled={isSubmitting}
          className="btn btn-primary px-8"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Publishing...
            </span>
          ) : (
            'Publish Listing'
          )}
        </button>
      )}
    </div>
  );
};

// ============================================================================
// VALIDATION LOGIC
// ============================================================================

const validateStep = (step: number, formData: ListingFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (step === 1) {
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      errors.title = 'Title must be under 100 characters';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!formData.rent) {
      errors.rent = 'Rent amount is required';
    } else if (parseInt(formData.rent) <= 0) {
      errors.rent = 'Rent must be greater than 0';
    }

    if (!formData.availableFrom) {
      errors.availableFrom = 'Start date is required';
    }
    
    if (formData.availableFrom && formData.availableTo) {
      if (new Date(formData.availableFrom) > new Date(formData.availableTo)) {
        errors.availableTo = 'End date cannot be before start date';
      }
    }
  }

  if (step === 2) {
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      errors.description = 'Please provide at least 50 characters describing your place';
    }
    
    if (formData.images.length === 0) {
      errors.images = 'Please add at least one image';
    }
  }

  return errors;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const CreateListing = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ListingFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Check Profile Completion on Mount
  useEffect(() => {
    const verifyProfile = async () => {
      // Temporarily disabled for testing purposes
      /*
      try {
        const data = await apiFetch('/api/users/me');
        const requiredFields = [
          data.first_name, data.last_name, data.age, data.bio, data.gender,
          data.cleaning_habit, data.smoking_habit, data.pet_preference,
          data.drinking_habit, data.noise_tolerance, data.bed_time, data.wake_time,
          data.age_preference_min, data.age_preference_max
        ];
        
        if (requiredFields.some(field => field === null || field === undefined || String(field).trim() === '')) {
          alert('Please complete your profile set up to post a listing.');
          navigate('/settings');
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
      */
    };
    verifyProfile();
  }, [navigate]);

  // Handle Input Change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
  };

  const handleUploadImages = (files: FileList) => {
    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((dataUrls) => {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...dataUrls] }));
      if (errors.images) {
        const newErrors = { ...errors };
        delete newErrors.images;
        setErrors(newErrors);
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddDemoImage = () => {
    const randomImage = DEMO_IMAGES[Math.floor(Math.random() * DEMO_IMAGES.length)];
    setFormData(prev => ({ ...prev, images: [...prev.images, randomImage] }));
    
    if (errors.images) {
      const newErrors = { ...errors };
      delete newErrors.images;
      setErrors(newErrors);
    }
  };

  const handleNext = () => {
    const validationErrors = validateStep(step, formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleCancel = () => {
    navigate('/browse');
  };

  const handleSubmit = async () => {
    const validationErrors = validateStep(step, formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);

    try {
      const payload = {
        user_id: 0, // backend uses current_user from token now
        title: formData.title,
        description: formData.description,
        rent: parseFloat(formData.rent),
        address: formData.address,
        zip_code: "97401",
        city: "Eugene",
        state: "OR",
        country: "USA",
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        roommate_count: parseInt(formData.roommates) || 0,
        available_from: formData.availableFrom + "T00:00:00",
        available_to: formData.availableTo ? formData.availableTo + "T00:00:00" : null,
        images: formData.images.join(","),
        anonymous_lister: formData.anonymous,
        gender_preference: formData.prefGender,
        age_preference_min: formData.prefAgeMin ? parseInt(formData.prefAgeMin) : null,
        age_preference_max: formData.prefAgeMax ? parseInt(formData.prefAgeMax) : null,
        cleaning_habit: formData.habitCleaning,
        smoking_habit: formData.habitSmoking,
        pet_preference: formData.habitPets,
        drinking_habit: formData.habitDrinking,
        noise_tolerance: formData.habitNoise,
        bed_time: formData.bedTime,
        wake_time: formData.wakeTime,
        amenities: formData.amenities.join(",")
      };
      console.log("Sending this payload to FastAPI:", payload);

      const data = await apiFetch("/api/listings/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log('Successfully created listing in database:', data);
      setIsSubmitting(false);
      navigate('/browse');
    } catch (error) {
      console.error('Error creating listing:', error);
      setIsSubmitting(false);
      
      if (error instanceof ApiError) {
        toast.error(`Failed to create listing: ${error.message}`);
      } else {
        toast.error('Failed to create listing. Please try again.');
      }
    }

  };

  // Create preview object compatible with ListingCard
  const previewListing: Listing = {
    id: 'preview',
    title: formData.title || 'Untitled Listing',
    rent: parseInt(formData.rent) || 0,
    address: formData.address || 'No address provided',
    bedrooms: parseInt(formData.bedrooms) || 0,
    bathrooms: parseInt(formData.bathrooms) || 0,
    available_from: formData.availableFrom,
    available_to: formData.availableTo,
    images: formData.images.length > 0 ? formData.images.join(",") : "",
    anonymous_lister: formData.anonymous,
    is_verified: true // Preview as verified for visual check
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      
      {/* Header & Progress */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--text-main)] mb-6">List Your Place</h1>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 w-full">
          <ProgressStep stepNumber={1} label="Basics" currentStep={step} />
          <ProgressStep stepNumber={2} label="Details" currentStep={step} />
          <ProgressStep stepNumber={3} label="Preferences" currentStep={step} />
          <ProgressStep stepNumber={4} label="Review" currentStep={step} isLast />
        </div>
      </div>

      <div className="card animate-fade-in">
        {/* Step 1: Basics */}
        {step === 1 && (
          <StepBasics 
            formData={formData} 
            errors={errors} 
            onChange={handleChange}
            onAddressSelect={(address) => {
              setFormData(prev => ({ ...prev, address }));
              if (errors.address) setErrors(prev => { const e = {...prev}; delete e.address; return e; });
            }}
          />
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <StepDetails 
            formData={formData} 
            errors={errors} 
            onChange={handleChange}
            onAmenityToggle={handleAmenityToggle}
            onUploadImages={handleUploadImages}
            onRemoveImage={handleRemoveImage}
            onAddDemoImage={handleAddDemoImage}
          />
        )}

         {/* Step 3: Preferences */}
        {step === 3 && (
          <StepPreferences 
             formData={formData} 
             onChange={handleChange} 
          />
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <StepReview 
            formData={formData} 
            previewListing={previewListing} 
          />
        )}

        {/* Footer Actions */}
        <FormActions 
          step={step}
          isSubmitting={isSubmitting}
          onBack={handleBack}
          onNext={handleNext}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};