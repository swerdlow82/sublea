// Shared factory helpers so every test file gets consistent, typed mock data
// without duplicating raw objects.

import type { User } from '../../context/AuthContext';
import type { Listing, ListingDetailData } from '../../types/listing';
import type { ListingFormData } from '../../types/createListing';

//users

export const mockUser: User = {
  id: 42,
  email: 'jane@uoregon.edu',
  is_verified: true,
  age: 21,
  gender: 'Female',
  gender_preference: 'Any',
  first_name: 'Jane',
  last_name: 'Doe',
  created_at: '2025-01-01T00:00:00Z',
  profile_picture: undefined,
  bio: 'Test bio',
};

export const mockUnverifiedUser: User = {
  ...mockUser,
  id: 99,
  email: 'new@uoregon.edu',
  is_verified: false,
};

//listings 

export const mockListing: Listing = {
  id: '1',
  title: 'Cozy Studio Near Campus',
  rent: 850,
  address: '123 University Ave, Eugene, OR',
  bedrooms: 1,
  bathrooms: 1,
  available_from: '2025-09-01T00:00:00',
  available_to: '2026-06-01T00:00:00',
  images: 'https://images.unsplash.com/photo-1502672260266?w=800',
  anonymous_lister: false,
  is_verified: true,
};

export const mockAnonymousListing: Listing = {
  ...mockListing,
  id: '2',
  title: 'Anonymous Listing',
  anonymous_lister: true,
};

export const mockListingDetail: ListingDetailData = {
  ...mockListing,
  images: [
    'https://images.unsplash.com/photo-1502672260266?w=800',
    'https://images.unsplash.com/photo-1522708323590?w=800',
  ],
  description: 'A great place to live close to campus with all utilities included.',
  amenities: ['WiFi', 'Washer/Dryer', 'AC'],
  coordinates: { lat: 44.0448, lng: -123.0726 },
  roommates_count: 1,
  owner: {
    id: '42',
    name: 'Jane Doe',
    avatar: undefined,
    bio: 'Sublea User',
    tags: ['Verified'],
  },
};


export const mockValidStep1Data: Partial<ListingFormData> = {
  title: 'Test Apartment',
  address: '100 Main St, Eugene, OR',
  rent: '900',
  availableFrom: '2025-09-01',
  availableTo: '2026-06-01',
};

export const mockApiToken = 'mock-jwt-token-abc123';
