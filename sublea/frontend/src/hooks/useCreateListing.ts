import { useState, useCallback, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, ApiError } from '../api/client';
import { toast } from 'react-hot-toast';
import {
  ListingFormData,
  ValidationErrors,
  INITIAL_DATA,
  AMENITIES_LIST,
  DEMO_IMAGES,
} from '../types/createListing';
import { Listing } from '../types/listing';

// all state and handlers for the 4-step create-listing wizard.
// the CreateListing component just wires this hook to the step components.
export const useCreateListing = () => {
  const navigate = useNavigate();
  const [step, setStep]                 = useState(1);
  const [formData, setFormData]         = useState<ListingFormData>(INITIAL_DATA);
  const [errors, setErrors]             = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // clear a single field error as the user corrects it
  const clearFieldError = (name: string) => {
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    clearFieldError(name);
  };

  const handleAddressSelect = (address: string) => {
    setFormData(prev => ({ ...prev, address }));
    clearFieldError('address');
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => {
      const next = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: next };
    });
  };

  // convert uploaded files to base64 data URLs so they're preview-able before submit
  const handleUploadImages = useCallback((files: FileList) => {
    const readers = Array.from(files).map(
      file =>
        new Promise<string>(resolve => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then(dataUrls => {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...dataUrls] }));
      clearFieldError('images');
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleAddDemoImage = () => {
    const randomImage = DEMO_IMAGES[Math.floor(Math.random() * DEMO_IMAGES.length)];
    setFormData(prev => ({ ...prev, images: [...prev.images, randomImage] }));
    clearFieldError('images');
  };

  const handleNext = () => {
    const validationErrors = validateStep(step, formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack   = () => setStep(prev => prev - 1);
  const handleCancel = () => navigate('/browse');

  const handleSubmit = async () => {
    const validationErrors = validateStep(step, formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        user_id:            0, // backend uses current_user from the bearer token
        title:              formData.title,
        description:        formData.description,
        rent:               parseFloat(formData.rent),
        address:            formData.address,
        zip_code:           '97401',
        city:               'Eugene',
        state:              'OR',
        country:            'USA',
        bedrooms:           parseInt(formData.bedrooms) || 0,
        bathrooms:          parseInt(formData.bathrooms) || 0,
        roommate_count:     parseInt(formData.roommates) || 0,
        available_from:     formData.availableFrom + 'T00:00:00',
        available_to:       formData.availableTo ? formData.availableTo + 'T00:00:00' : null,
        images:             formData.images.join(','),
        anonymous_lister:   formData.anonymous,
        gender_preference:  formData.prefGender,
        age_preference_min: formData.prefAgeMin ? parseInt(formData.prefAgeMin) : null,
        age_preference_max: formData.prefAgeMax ? parseInt(formData.prefAgeMax) : null,
        cleaning_habit:     formData.habitCleaning,
        smoking_habit:      formData.habitSmoking,
        pet_preference:     formData.habitPets,
        drinking_habit:     formData.habitDrinking,
        noise_tolerance:    formData.habitNoise,
        bed_time:           formData.bedTime,
        wake_time:          formData.wakeTime,
        amenities:          formData.amenities.join(','),
      };

      console.log('Sending this payload to FastAPI:', payload);
      const data = await apiFetch('/api/listings/create', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      console.log('Successfully created listing:', data);
      navigate('/browse');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error(
        error instanceof ApiError
          ? `Failed to create listing: ${error.message}`
          : 'Failed to create listing. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // build a Listing-compatible preview object that ListingCard can render
  const previewListing: Listing = {
    id:               'preview',
    title:            formData.title     || 'Untitled Listing',
    rent:             parseInt(formData.rent)     || 0,
    address:          formData.address   || 'No address provided',
    bedrooms:         parseInt(formData.bedrooms) || 0,
    bathrooms:        parseInt(formData.bathrooms) || 0,
    available_from:   formData.availableFrom,
    available_to:     formData.availableTo,
    images:           formData.images.length > 0 ? formData.images.join(',') : '',
    anonymous_lister: formData.anonymous,
    is_verified:      true, // show the badge in preview
  };

  return {
    step,
    formData,
    errors,
    isSubmitting,
    previewListing,
    handleChange,
    handleAddressSelect,
    handleAmenityToggle,
    handleUploadImages,
    handleRemoveImage,
    handleAddDemoImage,
    handleNext,
    handleBack,
    handleCancel,
    handleSubmit,
    AMENITIES_LIST,
  };
};

// ── validation ─────────────────────────────────────────────────────────────────
// lives here rather than in the types file so it stays close to the hook that calls it

const validateStep = (step: number, formData: ListingFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (step === 1) {
    if (!formData.title.trim())              errors.title        = 'Title is required';
    else if (formData.title.length > 100)    errors.title        = 'Title must be under 100 characters';
    if (!formData.address.trim())            errors.address      = 'Address is required';
    if (!formData.rent)                      errors.rent         = 'Rent amount is required';
    else if (parseInt(formData.rent) <= 0)   errors.rent         = 'Rent must be greater than 0';
    if (!formData.availableFrom)             errors.availableFrom = 'Start date is required';
    if (formData.availableFrom && formData.availableTo) {
      if (new Date(formData.availableFrom) > new Date(formData.availableTo)) {
        errors.availableTo = 'End date cannot be before start date';
      }
    }
  }

  if (step === 2) {
    if (!formData.description.trim())        errors.description = 'Description is required';
    else if (formData.description.length < 50) errors.description = 'Please provide at least 50 characters';
    if (formData.images.length === 0)        errors.images      = 'Please add at least one image';
  }

  return errors;
};
