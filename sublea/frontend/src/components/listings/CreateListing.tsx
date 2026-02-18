import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListingCard, Listing } from '../../components/listings/ListingCard';

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
}

type ValidationErrors = Record<string, string>;

interface ProgressStepProps {
  stepNumber: number;
  label: string;
  currentStep: number;
  isLast?: boolean;
}

interface StepBasicsProps {
  formData: ListingFormData;
  errors: ValidationErrors;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

interface StepDetailsProps {
  formData: ListingFormData;
  errors: ValidationErrors;
  imageUrlInput: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onImageUrlChange: (value: string) => void;
  onAmenityToggle: (amenity: string) => void;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  onAddDemoImage: () => void;
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
  amenities: []
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

const StepBasics = ({ formData, errors, onChange }: StepBasicsProps) => {
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
        <input
          name="address"
          value={formData.address}
          onChange={onChange}
          className={`input ${errors.address ? 'border-red-500' : ''}`}
          placeholder="Street Address, City, State"
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
  imageUrlInput,
  onChange, 
  onImageUrlChange,
  onAmenityToggle, 
  onAddImage, 
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
                onClick={() => onRemoveImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          
          {formData.images.length === 0 && (
             <div className="w-full h-32 border-2 border-dashed border-[var(--border)] rounded-lg flex flex-col items-center justify-center text-[var(--text-muted)] bg-[var(--surface)]">
               <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
               <span>No photos added yet</span>
             </div>
          )}
        </div>

        <div className="flex gap-2 mb-2">
          <input 
            type="text" 
            className="input flex-1"
            placeholder="Paste image URL here..." 
            value={imageUrlInput}
            onChange={(e) => onImageUrlChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAddImage()}
          />
          <button type="button" onClick={onAddImage} className="btn btn-secondary whitespace-nowrap">Add URL</button>
        </div>
        <button type="button" onClick={onAddDemoImage} className="text-xs text-[var(--primary)] hover:underline">
          + Add random demo image
        </button>
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

      {step < 3 ? (
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

const isValidUrl = (url: string): boolean => {
  return /^https?:\/\/.+/.test(url);
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
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

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

  const handleAddImage = () => {
    if (!imageUrlInput) return;
    
    if (!isValidUrl(imageUrlInput)) {
      setErrors(prev => ({ ...prev, images: 'Please enter a valid URL starting with http:// or https://' }));
      return;
    }
    
    setFormData(prev => ({ ...prev, images: [...prev.images, imageUrlInput] }));
    setImageUrlInput('');
    
    if (errors.images) {
      const newErrors = { ...errors };
      delete newErrors.images;
      setErrors(newErrors);
    }
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
    // Simulate API call
    // TODO: Implement API call to POST /listings
    // Payload needs conversion:
    // - rent: string -> float
    // - bedrooms/bathrooms: string -> int
    // - images: string[] -> string (comma-separated, OR handled by backend schema)
    // - user_id: retrieve from running auth context
    // CRITICAL ISSUE: 'amenities' field is missing in Backend Listing Model!
    setTimeout(() => {
      console.log('Form Submitted:', formData);
      setIsSubmitting(false);
      navigate('/browse'); // Redirect to browse after success
    }, 2000);
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
    images: formData.images.length > 0 ? formData.images : [],
    anonymous_lister: formData.anonymous,
    is_verified: true // Preview as verified for visual check
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      
      {/* Header & Progress */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--text-main)] mb-6">List Your Place</h1>
        <div className="flex items-center justify-center gap-4">
          <ProgressStep stepNumber={1} label="The Basics" currentStep={step} />
          <ProgressStep stepNumber={2} label="Details & Media" currentStep={step} />
          <ProgressStep stepNumber={3} label="Review" currentStep={step} isLast />
        </div>
      </div>

      <div className="card animate-fade-in">
        {/* Step 1: Basics */}
        {step === 1 && (
          <StepBasics 
            formData={formData} 
            errors={errors} 
            onChange={handleChange} 
          />
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <StepDetails 
            formData={formData} 
            errors={errors} 
            imageUrlInput={imageUrlInput}
            onChange={handleChange}
            onImageUrlChange={setImageUrlInput}
            onAmenityToggle={handleAmenityToggle}
            onAddImage={handleAddImage}
            onRemoveImage={handleRemoveImage}
            onAddDemoImage={handleAddDemoImage}
          />
        )}

        {/* Step 3: Review */}
        {step === 3 && (
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