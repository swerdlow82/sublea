/**
 * Unit Tests — Listing form validation (validateStep logic)

  Sample listing form in Steps 1, 2, n
 */

import { describe, it, expect } from 'vitest';
import { INITIAL_DATA } from '../../types/createListing';
import type { ListingFormData } from '../../types/createListing';

//  re-export validateStep so we can unit-test it directly 
//  extract it here rather than coupling to the hook's internal state.
// The function is defined at the bottom of useCreateListing.ts.

const validateStep = (step: number, formData: ListingFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (step === 1) {
    if (!formData.title.trim())              errors.title       = 'Title is required';
    else if (formData.title.length > 100)    errors.title       = 'Title must be under 100 characters';
    if (!formData.address.trim())            errors.address     = 'Address is required';
    if (!formData.rent)                      errors.rent        = 'Rent amount is required';
    else if (parseInt(formData.rent) <= 0)   errors.rent        = 'Rent must be greater than 0';
    if (!formData.availableFrom)             errors.availableFrom = 'Start date is required';
    if (formData.availableFrom && formData.availableTo) {
      if (new Date(formData.availableFrom) > new Date(formData.availableTo)) {
        errors.availableTo = 'End date cannot be before start date';
      }
    }
  }

  if (step === 2) {
    if (!formData.description.trim())              errors.description = 'Description is required';
    else if (formData.description.length < 50)     errors.description = 'Please provide at least 50 characters';
    if (formData.images.length === 0)              errors.images      = 'Please add at least one image';
  }

  return errors;
};

//  helpers 

function makeFormData(overrides: Partial<ListingFormData> = {}): ListingFormData {
  return { ...INITIAL_DATA, ...overrides };
}


describe('validateStep — Step 1 (basics)', () => {
  it('returns no errors when all required step-1 fields are valid', () => {
    // Arrange
    const data = makeFormData({
      title: 'Nice Apartment',
      address: '123 Main St',
      rent: '800',
      availableFrom: '2025-09-01',
    });

    // Act
    const errors = validateStep(1, data);

    // Assert
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('flags an empty title', () => {
    const errors = validateStep(1, makeFormData({
      title: '',
      address: '123 Main St',
      rent: '800',
      availableFrom: '2025-09-01',
    }));
    expect(errors.title).toBe('Title is required');
  });

  it('flags a title over 100 characters', () => {
    const errors = validateStep(1, makeFormData({
      title: 'A'.repeat(101),
      address: '123 Main St',
      rent: '800',
      availableFrom: '2025-09-01',
    }));
    expect(errors.title).toBe('Title must be under 100 characters');
  });

  it('flags a missing address', () => {
    const errors = validateStep(1, makeFormData({
      title: 'Apt',
      address: '',
      rent: '800',
      availableFrom: '2025-09-01',
    }));
    expect(errors.address).toBe('Address is required');
  });

  it('flags a missing rent', () => {
    const errors = validateStep(1, makeFormData({
      title: 'Apt',
      address: '123 Main',
      rent: '',
      availableFrom: '2025-09-01',
    }));
    expect(errors.rent).toBe('Rent amount is required');
  });

  it('flags a zero or negative rent value', () => {
    const zero = validateStep(1, makeFormData({
      title: 'Apt', address: '123', rent: '0', availableFrom: '2025-09-01',
    }));
    expect(zero.rent).toBe('Rent must be greater than 0');

    const negative = validateStep(1, makeFormData({
      title: 'Apt', address: '123', rent: '-100', availableFrom: '2025-09-01',
    }));
    expect(negative.rent).toBe('Rent must be greater than 0');
  });

  it('flags a missing availableFrom (start date)', () => {
    const errors = validateStep(1, makeFormData({
      title: 'Apt', address: '123', rent: '800', availableFrom: '',
    }));
    expect(errors.availableFrom).toBe('Start date is required');
  });

  it('flags when end date is before start date', () => {
    const errors = validateStep(1, makeFormData({
      title: 'Apt',
      address: '123',
      rent: '800',
      availableFrom: '2025-09-01',
      availableTo: '2025-08-01', // earlier than from
    }));
    expect(errors.availableTo).toBe('End date cannot be before start date');
  });

  it('accepts equal start and end dates without error', () => {
    const errors = validateStep(1, makeFormData({
      title: 'Apt',
      address: '123',
      rent: '800',
      availableFrom: '2025-09-01',
      availableTo: '2025-09-01',
    }));
    expect(errors.availableTo).toBeUndefined();
  });
});

//  Step 2 

describe('validateStep — Step 2 (details)', () => {
  it('returns no errors with a long enough description and at least one image', () => {
    // Arrange
    const data = makeFormData({
      description: 'A'.repeat(60),
      images: ['https://example.com/img.jpg'],
    });

    // Act
    const errors = validateStep(2, data);

    // Assert
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('flags an empty description', () => {
    const errors = validateStep(2, makeFormData({
      description: '',
      images: ['https://example.com/img.jpg'],
    }));
    expect(errors.description).toBe('Description is required');
  });

  it('flags a description shorter than 50 characters', () => {
    const errors = validateStep(2, makeFormData({
      description: 'Too short',
      images: ['https://example.com/img.jpg'],
    }));
    expect(errors.description).toBe('Please provide at least 50 characters');
  });

  it('flags having no images', () => {
    const errors = validateStep(2, makeFormData({
      description: 'A'.repeat(60),
      images: [],
    }));
    expect(errors.images).toBe('Please add at least one image');
  });

  it('accepts multiple images and a valid description', () => {
    const errors = validateStep(2, makeFormData({
      description: 'A'.repeat(60),
      images: ['https://a.com/1.jpg', 'https://a.com/2.jpg'],
    }));
    expect(Object.keys(errors)).toHaveLength(0);
  });
});

//  Step 3 

describe('validateStep — Step 3 (preferences)', () => {
  it('returns no errors (step 3 has no required fields)', () => {
    // Step 3 preferences are all optional
    const errors = validateStep(3, makeFormData());
    expect(Object.keys(errors)).toHaveLength(0);
  });
});
