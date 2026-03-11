import { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';
import { ListingDetailData } from '../types/listing';

// fetches and normalizes a single listing by id.
// all the backend → frontend field mapping lives here so the component stays clean.
export const useListingDetail = (id: string | undefined) => {
  const [listing, setListing] = useState<ListingDetailData | null>(null);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      if (!id) return;

      try {
        const raw = await apiFetch(`/api/listings/${id}`);

        // normalize the raw API response into what the UI expects
        const normalized: ListingDetailData = {
          id:              raw.id.toString(),
          title:           raw.title,
          rent:            raw.rent,
          address:         raw.address,
          bedrooms:        raw.bedrooms,
          bathrooms:       raw.bathrooms,
          roommates_count: raw.roommate_count,
          available_from:  raw.available_from,
          available_to:    raw.available_to,
          anonymous_lister: raw.anonymous_lister,

          // backend sends is_verified — fall back to true for now so the badge shows while we wire it up
          is_verified: raw.is_verified ?? true,

          // backend stores images as a comma-separated string, we want an array here
          images: raw.images
            ? raw.images.split(',')
            : [],

          description: raw.description || 'No description provided.',

          amenities: raw.amenities ? raw.amenities.split(',') : [],

          coordinates: {
            lat: raw.latitude  ?? 44.0448,
            lng: raw.longitude ?? -123.0726,
          },

          owner: raw.user_id
            ? {
                id:     raw.user_id.toString(),
                name:   raw.lister_first_name
                  ? `${raw.lister_first_name} ${raw.lister_last_name}`
                  : 'Unknown Lister',
                avatar: raw.lister_profile_picture ?? undefined,
                bio:    'Sublea User',
                tags:   ['Verified'],
              }
            : undefined,
        };

        setListing(normalized);
      } catch (error) {
        console.error('Failed to fetch listing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  return { listing, loading };
};
