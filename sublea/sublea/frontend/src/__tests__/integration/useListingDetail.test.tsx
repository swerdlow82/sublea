/**
 * Integration Tests — useListingDetail hook

 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useListingDetail } from '../../hooks/useListingDetail';

// ── mock apiFetch ─────────────────────────────────────────────────────────────
vi.mock('../../api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../api/client')>();
  return { ...actual, apiFetch: vi.fn() };
});

import { apiFetch } from '../../api/client';
const mockApiFetch = vi.mocked(apiFetch);

// ── mock API shape (raw, before normalization) ────────────────────────────────
const rawApiListing = {
  id: 5,
  title: 'Campus Studio',
  rent: 750,
  address: '789 Elm St, Eugene, OR',
  bedrooms: 1,
  bathrooms: 1,
  roommate_count: 0,
  available_from: '2025-09-01T00:00:00',
  available_to: '2026-06-01T00:00:00',
  anonymous_lister: false,
  is_verified: true,
  images: 'https://example.com/a.jpg,https://example.com/b.jpg',
  description: 'Great place near campus.',
  amenities: 'WiFi,Parking',
  latitude: 44.0448,
  longitude: -123.0726,
  user_id: 42,
  lister_first_name: 'Jane',
  lister_last_name: 'Doe',
  lister_profile_picture: null,
};

// ── setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  mockApiFetch.mockResolvedValue(rawApiListing);
});

afterEach(() => vi.restoreAllMocks());

// ── tests 

describe('useListingDetail — happy path', () => {
  it('starts in loading state', () => {
    const { result } = renderHook(() => useListingDetail('5'));
    expect(result.current.loading).toBe(true);
  });

  it('normalizes the API response into ListingDetailData', async () => {
    const { result } = renderHook(() => useListingDetail('5'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    const { listing } = result.current;
    expect(listing).not.toBeNull();
    expect(listing!.id).toBe('5');          // number → string
    expect(listing!.title).toBe('Campus Studio');
    expect(listing!.rent).toBe(750);
  });

  it('splits the comma-separated images string into an array', async () => {
    const { result } = renderHook(() => useListingDetail('5'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(Array.isArray(result.current.listing!.images)).toBe(true);
    expect(result.current.listing!.images).toHaveLength(2);
    expect(result.current.listing!.images[0]).toContain('example.com/a.jpg');
  });

  it('splits amenities correctly', async () => {
    const { result } = renderHook(() => useListingDetail('5'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.listing!.amenities).toContain('WiFi');
    expect(result.current.listing!.amenities).toContain('Parking');
  });

  it('maps owner from lister fields on raw response', async () => {
    const { result } = renderHook(() => useListingDetail('5'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.listing!.owner?.name).toBe('Jane Doe');
    expect(result.current.listing!.owner?.id).toBe('42');
  });

  it('maps coordinates correctly', async () => {
    const { result } = renderHook(() => useListingDetail('5'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.listing!.coordinates.lat).toBe(44.0448);
    expect(result.current.listing!.coordinates.lng).toBe(-123.0726);
  });
});

describe('useListingDetail — edge cases', () => {
  it('returns empty array when images field is empty', async () => {
    mockApiFetch.mockResolvedValue({ ...rawApiListing, images: '' });
    const { result } = renderHook(() => useListingDetail('5'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.listing!.images).toEqual([]);
  });

  it('sets listing to null and does NOT throw when API fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useListingDetail('5'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.listing).toBeNull();
  });

  it('does NOT call apiFetch when id is undefined', () => {
    renderHook(() => useListingDetail(undefined));
    expect(mockApiFetch).not.toHaveBeenCalled();
  });

  it('handles anonymous_lister=true flag on the normalized object', async () => {
    mockApiFetch.mockResolvedValue({ ...rawApiListing, anonymous_lister: true });
    const { result } = renderHook(() => useListingDetail('5'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.listing!.anonymous_lister).toBe(true);
  });
});
