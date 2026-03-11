// types and constants for the create-listing wizard — all in one place
// so adding or renaming a field only requires editing here

import { ChangeEvent } from 'react';
import { Listing } from './listing';

export interface ListingFormData {
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

export type ValidationErrors = Record<string, string>;

// step component prop shapes
export interface StepBasicsProps {
  formData: ListingFormData;
  errors: ValidationErrors;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAddressSelect: (address: string) => void;
}

export interface StepDetailsProps {
  formData: ListingFormData;
  errors: ValidationErrors;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAmenityToggle: (amenity: string) => void;
  onUploadImages: (files: FileList) => void;
  onRemoveImage: (index: number) => void;
  onAddDemoImage: () => void;
}

export interface StepPreferencesProps {
  formData: ListingFormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export interface StepReviewProps {
  formData: ListingFormData;
  previewListing: Listing;
}

export interface FormActionsProps {
  step: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export interface ProgressStepProps {
  stepNumber: number;
  label: string;
  currentStep: number;
  isLast?: boolean;
}

// blank form — used to initialize and reset the wizard
export const INITIAL_DATA: ListingFormData = {
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

export const AMENITIES_LIST = [
  'WiFi', 'Washer/Dryer', 'AC', 'Furnished', 'Elevator',
  'Gym', 'Dishwasher', 'Pets Allowed', 'Balcony', 'Parking',
];

export const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=800&auto=format&fit=crop',
];
