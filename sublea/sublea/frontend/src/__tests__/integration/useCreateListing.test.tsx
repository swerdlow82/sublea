/**
 * Integration Tests — useCreateListing hook

 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { useCreateListing } from '../../hooks/useCreateListing';
import { ApiError } from '../../api/client';
import { mockValidStep1Data } from '../fixtures';
import { INITIAL_DATA } from '../../types/createListing';

//  mocks 
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../api/client')>();
  return { ...actual, apiFetch: vi.fn() };
});

import { apiFetch } from '../../api/client';
const mockApiFetch = vi.mocked(apiFetch);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

//  helpers 

/** Fill the hook's formData with valid step-1 data via handleChange events */
function fillStep1(result: ReturnType<typeof useCreateListing>) {
  Object.entries(mockValidStep1Data).forEach(([name, value]) => {
    act(() => {
      result.handleChange({
        target: { name, value, type: 'text' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
  });
}

//  setup 

beforeEach(() => {
  vi.clearAllMocks();
  mockApiFetch.mockResolvedValue({ id: 101, title: 'Test Apt' });
});

afterEach(() => vi.restoreAllMocks());

//  tests 

describe('useCreateListing — formData mutations', () => {
  it('starts with INITIAL_DATA', () => {
    const { result } = renderHook(() => useCreateListing(), { wrapper });
    expect(result.current.formData).toEqual(INITIAL_DATA);
  });

  it('handleChange updates a text field', () => {
    const { result } = renderHook(() => useCreateListing(), { wrapper });

    act(() => {
      result.current.handleChange({
        target: { name: 'title', value: 'Nice Apt', type: 'text' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.title).toBe('Nice Apt');
  });

  it('handleChange updates a checkbox field', () => {
    const { result } = renderHook(() => useCreateListing(), { wrapper });

    act(() => {
      result.current.handleChange({
        target: { name: 'anonymous', type: 'checkbox', checked: true },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.anonymous).toBe(true);
  });

  it('handleAddressSelect sets the address and clears any address error', async () => {
    const { result } = renderHook(() => useCreateListing(), { wrapper });

    // Create an address error first
    act(() => result.current.handleNext()); // step 1 - missing address -> error
    expect(result.current.errors.address).toBeDefined();

    // Resolve it via address select
    act(() => result.current.handleAddressSelect('456 Oak Ave, Eugene, OR'));
    expect(result.current.formData.address).toBe('456 Oak Ave, Eugene, OR');
    expect(result.current.errors.address).toBeUndefined();
  });

  it('handleAmenityToggle adds an amenity when not present', () => {
    const { result } = renderHook(() => useCreateListing(), { wrapper });

    act(() => result.current.handleAmenityToggle('WiFi'));
    expect(result.current.formData.amenities).toContain('WiFi');
  });

  it('handleAmenityToggle removes an amenity when already present', () => {
    const { result } = renderHook(() => useCreateListing(), { wrapper });

    act(() => result.current.handleAmenityToggle('WiFi'));
    act(() => result.current.handleAmenityToggle('WiFi')); // toggle off
    expect(result.current.formData.amenities).not.toContain('WiFi');
  });
});

describe('useCreateListing — step navigation', () => {
  it('stays on step 1 and sets errors when required fields are empty', () => {
    const { result } = renderHook(() => useCreateListing(), { wrapper });

    // Act - try to advance without filling anything
    act(() => result.current.handleNext());

    // Assert
    expect(result.current.step).toBe(1);
    expect(result.current.errors.title).toBeDefined();
    expect(result.current.errors.rent).toBeDefined();
  });

  it('advances to step 2 when all step-1 fields are valid', async () => {
    const { result } = renderHook(() => useCreateListing(), { wrapper });
    fillStep1(result.current);

    act(() => result.current.handleNext());
    expect(result.current.step).toBe(2);
  });

  it('handleBack decrements the step', () => {
    const { result } = renderHook(() => useCreateListing(), { wrapper });
    fillStep1(result.current);
    act(() => result.current.handleNext()); // go to step 2

    act(() => result.current.handleBack());
    expect(result.current.step).toBe(1);
  });

  it('handleCancel navigates to /browse', () => {
    const { result } = renderHook(() => useCreateListing(), { wrapper });
    act(() => result.current.handleCancel());
    expect(mockNavigate).toHaveBeenCalledWith('/browse');
  });
});

describe('useCreateListing — submission', () => {
  it('calls POST /api/listings/create and navigates to /browse on success', async () => {
    const { result } = renderHook(() => useCreateListing(), { wrapper });
    fillStep1(result.current);
    act(() => result.current.handleNext()); // step 2

    // Fill step-2 fields
    act(() => {
      result.current.handleChange({
        target: { name: 'description', value: 'A'.repeat(60), type: 'text' },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    });
    act(() => result.current.handleAddDemoImage());

    act(() => result.current.handleNext()); // step 3 (preferences — no required fields)
    act(() => result.current.handleNext()); // step 4 (review)

    // Act — submit
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Assert
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/listings/create',
      expect.objectContaining({ method: 'POST' })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/browse');
  });

  it('does NOT navigate when the API throws, and isSubmitting returns to false', async () => {
    // Arrange
    mockApiFetch.mockRejectedValue(new ApiError('Server error', 500));
    const { result } = renderHook(() => useCreateListing(), { wrapper });
    fillStep1(result.current);
    act(() => result.current.handleNext());
    act(() => {
      result.current.handleChange({
        target: { name: 'description', value: 'A'.repeat(60), type: 'text' },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    });
    act(() => result.current.handleAddDemoImage());
    act(() => result.current.handleNext());
    act(() => result.current.handleNext());

    // Act
    await act(async () => {
      await result.current.handleSubmit();
    });

    // Assert
    expect(mockNavigate).not.toHaveBeenCalledWith('/browse');
    expect(result.current.isSubmitting).toBe(false);
  });
});

describe('useCreateListing — previewListing', () => {
  it('reflects the current formData title and rent', () => {
    const { result } = renderHook(() => useCreateListing(), { wrapper });

    act(() => {
      result.current.handleChange({
        target: { name: 'title', value: 'My Preview', type: 'text' },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleChange({
        target: { name: 'rent', value: '1200', type: 'text' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.previewListing.title).toBe('My Preview');
    expect(result.current.previewListing.rent).toBe(1200);
  });
});
