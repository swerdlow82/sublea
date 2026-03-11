// core listing types shared across browse, detail, dashboard, and the create wizard

export interface Listing {
  id: string;
  title: string;
  rent: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  available_from: string;
  available_to: string;
  images: string; // comma-separated URLs — backend sends as a single string
  anonymous_lister: boolean;
  is_verified?: boolean;
  latitude?: number;
  longitude?: number;
}

// extended shape used on the listing detail page — includes fields not shown on the card
export interface ListingDetailData extends Omit<Listing, 'images'> {
  images: string[]; // split by the time it reaches the hook
  description: string;
  amenities: string[];
  coordinates: { lat: number; lng: number };
  roommates_count: number;
  owner?: {
    id: string;
    name: string;
    avatar?: string;
    bio: string;
    tags: string[];
  };
}
