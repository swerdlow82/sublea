import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Listing } from '../../components/listings/ListingCard';

// Extended interface for detailed view
interface ListingDetailData extends Listing {
  description: string;
  amenities: string[];
  coordinates: { lat: number; lng: number };
  roommates_count: number;
  owner?: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    tags: string[];
  };
}

interface ImageGalleryProps {
  images: string[];
  title: string;
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

const ImageGallery = ({ images, title, activeIndex, onIndexChange }: ImageGalleryProps) => {
  return (
    <div className="space-y-4">
      <div className="aspect-video w-full overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface)] shadow-lg relative group">
        <img 
          src={images[activeIndex]} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
      
      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => onIndexChange(idx)}
            className={`relative flex-shrink-0 h-20 w-32 rounded-lg overflow-hidden border-2 transition-all ${activeIndex === idx ? 'border-[var(--primary)] ring-2 ring-[var(--ring)]' : 'border-transparent opacity-70 hover:opacity-100'}`}
          >
            <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

interface QuickStatsProps {
  bedrooms: number;
  bathrooms: number;
  roommatesCount: number;
}

const QuickStats = ({ bedrooms, bathrooms, roommatesCount }: QuickStatsProps) => {
  const stats = [
    {
      icon: (
        <svg className="w-6 h-6 text-[var(--primary)] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: `${bedrooms} Bed`,
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[var(--primary)] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      label: `${bathrooms} Bath`,
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[var(--primary)] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      label: `${roommatesCount} Roommates`,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 py-2">
      {stats.map((stat, idx) => (
        <div key={idx} className="flex flex-col items-center p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
          {stat.icon}
          <span className="font-semibold">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

interface AmenitiesListProps {
  amenities: string[];
}

const AmenitiesList = ({ amenities }: AmenitiesListProps) => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-3">Amenities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {amenities.map((amenity, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {amenity}
          </div>
        ))}
      </div>
    </div>
  );
};

const MapPlaceholder = () => {
  return (
    <div className="card h-64 flex items-center justify-center bg-[var(--surface)] relative overflow-hidden group cursor-pointer">
      <div className="absolute inset-0 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Map_placeholder.png')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
      <div className="z-10 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
        <svg className="w-5 h-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 01-.806-.984A1 1 0 0021 7.618l-5.447 2.724A1 1 0 0115 11.382V20" />
        </svg>
        <span className="font-medium">View on Map</span>
      </div>
    </div>
  );
};

interface DescriptionCardProps {
  listing: ListingDetailData;
}

const DescriptionCard = ({ listing }: DescriptionCardProps) => {
  return (
    <div className="card space-y-6">
      <div className="flex justify-between items-start border-b border-[var(--border)] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] mb-2">{listing.title}</h1>
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{listing.address}</span>
          </div>
        </div>
        {listing.is_verified && (
          <span className="hidden sm:inline-flex badge badge-primary bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20">
            Verified Listing
          </span>
        )}
      </div>

      <QuickStats 
        bedrooms={listing.bedrooms} 
        bathrooms={listing.bathrooms} 
        roommatesCount={listing.roommates_count} 
      />

      <div>
        <h3 className="text-lg font-bold mb-3">About this place</h3>
        <p className="text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
          {listing.description}
        </p>
      </div>

      <AmenitiesList amenities={listing.amenities} />
    </div>
  );
};

interface RentActionCardProps {
  rent: number;
  availableFrom: string;
  availableTo: string;
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const RentActionCard = ({ rent, availableFrom, availableTo }: RentActionCardProps) => {
  return (
    <div className="card border-t-4 border-t-[var(--primary)] animate-slide-up">
      <div className="mb-6">
        <div className="flex items-end gap-1 mb-1">
          <span className="text-3xl font-bold text-[var(--text-main)]">${rent.toLocaleString()}</span>
          <span className="text-[var(--text-muted)] mb-1">/ month</span>
        </div>
        <div className="text-sm font-medium text-[var(--text-muted)] bg-[var(--surface)] inline-block px-3 py-1 rounded-full border border-[var(--border)]">
          Available: {formatDate(availableFrom)} - {formatDate(availableTo)}
        </div>
      </div>

      <button className="btn btn-primary w-full py-3 text-lg shadow-lg shadow-green-900/10 mb-3">
        Message Lister
      </button>
      <button className="btn btn-outline w-full py-2.5">
        Save for Later
      </button>
      
      <p className="text-xs text-center text-[var(--text-muted)] mt-4">
        Sublea connects you directly. All payments handled between parties.
      </p>
    </div>
  );
};

interface OwnerProfileCardProps {
  owner: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    tags: string[];
  };
}

const OwnerProfileCard = ({ owner }: OwnerProfileCardProps) => {
  return (
    <div className="card animate-slide-up delay-100">
      <h3 className="font-bold text-[var(--text-main)] mb-4">Meet the Lister</h3>
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={owner.avatar} 
          alt={owner.name} 
          className="w-16 h-16 rounded-full object-cover border-2 border-[var(--surface)] ring-2 ring-[var(--border)]"
        />
        <div>
          <p className="font-bold text-lg">{owner.name}</p>
          <p className="text-xs text-[var(--text-muted)]">Verified Student</p>
        </div>
      </div>
      
      <p className="text-sm text-[var(--text-main)] italic mb-4">"{owner.bio}"</p>
      
      <div className="flex flex-wrap gap-2">
        {owner.tags.map((tag, idx) => (
          <span key={idx} className="badge bg-[var(--secondary)] text-[var(--secondary-foreground)] border-transparent">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const SafetyTip = () => {
  return (
    <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-muted)] flex items-start gap-3">
      <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p>Sublea connects you with listers. Always meet in person, view the property, and handle all payments directly with the lister.</p>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="h-10 w-10 animate-spin text-[var(--primary)]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-[var(--text-muted)] animate-pulse">Loading listing details...</span>
      </div>
    </div>
  );
};

interface NotFoundStateProps {
  onNavigate: () => void;
}

const NotFoundState = ({ onNavigate }: NotFoundStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">Listing not found</h2>
      <p className="text-[var(--text-muted)] mb-6">The listing you are looking for might have been removed or does not exist.</p>
      <button onClick={onNavigate} className="btn btn-primary">Back to Browse</button>
    </div>
  );
};

const useFetchListing = (id: string | undefined) => {
  const [listing, setListing] = useState<ListingDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      // Simulate API delay
      // TODO: Implement API call to GET /listings/{id}
      // Response needs rich mapping: 
      // - amenities: MISSING in backend
      // - coordinates: { lat: listing.latitude, lng: listing.longitude }
      // - owner: map User fields (profile_picture -> avatar, etc.)
      const timer = setTimeout(() => {
        // Mock Response based on ID (In a real app, this would be a fetch call)
        const mockListing: ListingDetailData = {
          id: id || '1',
          title: 'Sunlit Loft near UO Campus',
          rent: 1450,
          address: '1450 Alder St, Eugene, OR 97401',
          bedrooms: 1,
          bathrooms: 1,
          roommates_count: 2,
          available_from: '2024-06-01',
          available_to: '2024-08-31',
          images: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2560&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2560&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=2560&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2560&auto=format&fit=crop'
          ],
          anonymous_lister: false,
          is_verified: true,
          description: `Looking for a subletter for the summer semester! This is a spacious, fully furnished loft apartment located right next to the UO Campus. 

The apartment features high ceilings, exposed brick walls, and huge windows that let in tons of natural light. You'll have your own private bedroom and bathroom, sharing the kitchen and living area with two quiet, respectful grad students from UO.

Rent includes all utilities and high-speed internet. Laundry is in the unit. Steps away from the Knight Library, grocery stores, and tons of cafes on 13th Ave.`,
          amenities: ['In-unit Washer/Dryer', 'High-speed WiFi', 'Central AC', 'Dishwasher', 'Elevator', 'Gym in Building', 'Rooftop Access'],
          coordinates: { lat: 44.0448, lng: -123.0726 }, 
          owner: {
             id: 'mock-owner-id',
             name: 'Mock Owner',
             avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
             bio: 'Temporary mock bio - replace with real data from API',
             tags: ['Mock Tag 1', 'Mock Tag 2', 'Mock Tag 3']
          }
        };

        setListing(mockListing);
        setLoading(false);
      }, 800);
    };

    fetchListing();
  }, [id]);

  return { listing, loading };
};

export const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { listing, loading } = useFetchListing(id);

  if (loading) {
    return <LoadingState />;
  }

  if (!listing) {
    return <NotFoundState onNavigate={() => navigate('/browse')} />;
  }

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Navigation Breadcrumb */}
      <button onClick={() => navigate(-1)} className="flex items-center text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors mb-4">
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to listings
      </button>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Images & Description (Takes 2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          <ImageGallery 
            images={listing.images}
            title={listing.title}
            activeIndex={activeImageIndex}
            onIndexChange={setActiveImageIndex}
          />

          <DescriptionCard listing={listing} />

          <MapPlaceholder />
        </div>

        {/* Right Column: Sticky Sidebar (Takes 1/3 width) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            
            <RentActionCard 
              rent={listing.rent}
              availableFrom={listing.available_from}
              availableTo={listing.available_to}
            />

            {/* Owner Profile Card */}
            {!listing.anonymous_lister && listing.owner && (
              <OwnerProfileCard owner={listing.owner} />
            )}
            
            <SafetyTip />

          </div>
        </div>

      </div>
    </div>
  );
};