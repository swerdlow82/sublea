import { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';

type ListingStatus = 'active' | 'expired' | 'draft';

export interface MyListing {
  id: string;
  title: string;
  address: string;
  rent: number;
  image: string;
  status: ListingStatus;
  views: number;
  inquiries: number;
  createdAt: string;
  expiresAt: string;
}

// derive status from available_to instead of hardcoding 'active' for everything
const deriveStatus = (availableTo: string | null): ListingStatus => {
  if (!availableTo) return 'active';
  return new Date(availableTo) < new Date() ? 'expired' : 'active';
};

// fetches the current user's own listings and exposes a delete handler
export const useMyListings = () => {
  const [listings, setListings]   = useState<MyListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await apiFetch('/api/users/me/listings');
        const mapped: MyListing[] = data.map((l: any) => ({
          id:          l.id.toString(),
          title:       l.title,
          address:     l.address,
          rent:        l.rent,
          image:       l.images
            ? l.images.split(',')[0]
            : '',
          status:      deriveStatus(l.available_to),
          views:       l.views    ?? 0,
          inquiries:   l.inquiries ?? 0,
          createdAt:   l.created_at,
          expiresAt:   l.available_to || l.created_at,
        }));
        setListings(mapped);
      } catch (error) {
        console.error('Failed to fetch listings', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  const deleteListing = async (id: string) => {
    try {
      await apiFetch(`/api/listings/${id}`, { method: 'DELETE' });
      setListings(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      console.error('Failed to delete listing', error);
      alert('Could not delete listing. Please try again.');
    }
  };

  return { listings, isLoading, deleteListing };
};
