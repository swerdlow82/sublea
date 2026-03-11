/**
 * Integration Tests — useListingsBrowse hook

 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { useListingsBrowse, INITIAL_FILTERS } from '../../hooks/useListingsBrowse';
import { mockListing } from '../fixtures';

//  mock apiFetch 
vi.mock('../../api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../api/client')>();
  return { ...actual, apiFetch: vi.fn() };
});

import { apiFetch } from '../../api/client';
const mockApiFetch = vi.mocked(apiFetch);

//  wrapper (hook uses useSearchParams → needs Router) 
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

//  setup 

beforeEach(() => {
  vi.clearAllMocks();
  mockApiFetch.mockResolvedValue([mockListing]);
});

afterEach(() => vi.restoreAllMocks());

//  tests 

describe('useListingsBrowse — initial load', () => {
  it('fetches listings on mount', async () => {
    // Arrange & Act
    const { result } = renderHook(() => useListingsBrowse(), { wrapper });

    // Assert — wait for isLoading to finish
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.listings).toHaveLength(1);
    expect(result.current.listings[0].title).toBe('Cozy Studio Near Campus');
  });

  it('calls apiFetch exactly once on mount', async () => {
    const { result } = renderHook(() => useListingsBrowse(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockApiFetch).toHaveBeenCalledTimes(1);
  });

  it('includes sortOrder=newest in the first request', async () => {
    const { result } = renderHook(() => useListingsBrowse(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const [url] = mockApiFetch.mock.calls[0];
    expect(url).toContain('sortOrder=newest');
  });
});

describe('useListingsBrowse — draft vs committed filters', () => {
  it('handleDraftChange updates draft without triggering a new API call', async () => {
    // Arrange
    const { result } = renderHook(() => useListingsBrowse(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const callsBefore = mockApiFetch.mock.calls.length;

    // Act
    act(() => {
      result.current.handleDraftChange('location', 'Eugene');
    });

    // Assert — draft updated, no extra fetch
    expect(result.current.draft.location).toBe('Eugene');
    expect(result.current.filters.location).toBe(''); // NOT committed yet
    expect(mockApiFetch.mock.calls.length).toBe(callsBefore); // no new call
  });

  it('applyTextFilters commits draft text fields and re-fetches', async () => {
    // Arrange
    const { result } = renderHook(() => useListingsBrowse(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleDraftChange('location', 'Eugene');
      result.current.handleDraftChange('maxPrice', '1200');
    });

    // Act
    act(() => {
      result.current.applyTextFilters();
    });

    // Assert — filters now match the draft
    await waitFor(() => expect(result.current.filters.location).toBe('Eugene'));
    expect(result.current.filters.maxPrice).toBe('1200');
    // A second API call should have been made
    expect(mockApiFetch.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});

describe('useListingsBrowse — dropdown instant update', () => {
  it('handleDropdownChange commits immediately to both draft and filters', async () => {
    // Arrange
    const { result } = renderHook(() => useListingsBrowse(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Act
    act(() => {
      result.current.handleDropdownChange('prefGender', 'Female');
    });

    // Assert — both draft and filters updated immediately
    expect(result.current.draft.prefGender).toBe('Female');
    expect(result.current.filters.prefGender).toBe('Female');
  });

  it('dropdown change triggers a new fetch with the filter param', async () => {
    const { result } = renderHook(() => useListingsBrowse(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleDropdownChange('habitPets', 'Yes');
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const lastCall = mockApiFetch.mock.calls[mockApiFetch.mock.calls.length - 1][0] as string;
    expect(lastCall).toContain('habitPets=Yes');
  });
});

describe('useListingsBrowse — clear filters', () => {
  it('resets draft and filters to INITIAL_FILTERS', async () => {
    // Arrange
    const { result } = renderHook(() => useListingsBrowse(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.handleDropdownChange('prefGender', 'Male');
    });

    // Act
    act(() => {
      result.current.handleClearFilters();
    });

    // Assert
    expect(result.current.filters.prefGender).toBe(INITIAL_FILTERS.prefGender);
    expect(result.current.draft.prefGender).toBe(INITIAL_FILTERS.prefGender);
  });
});

describe('useListingsBrowse — error handling', () => {
  it('sets listings to [] when the API call fails', async () => {
    // Arrange
    mockApiFetch.mockRejectedValue(new Error('Network error'));

    // Act
    const { result } = renderHook(() => useListingsBrowse(), { wrapper });

    // Assert
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.listings).toEqual([]);
  });
});
