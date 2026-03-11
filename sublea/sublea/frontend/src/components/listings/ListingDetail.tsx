import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useListingDetail } from '../../hooks/useListingDetail';
import { ListingDetailData } from '../../types/listing';
import { formatLongDate } from '../../utils/formatDate';
import { GoogleMap } from '../common/GoogleMap';


interface ImageGalleryProps {
  images: string[];
  title: string;
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

const ImageGallery = ({ images, title, activeIndex, onIndexChange }: ImageGalleryProps) => (
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
          className={`relative flex-shrink-0 h-20 w-32 rounded-lg overflow-hidden border-2 transition-all ${
            activeIndex === idx
              ? 'border-[var(--primary)] ring-2 ring-[var(--ring)]'
              : 'border-transparent opacity-70 hover:opacity-100'
          }`}
        >
          <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-cover" />
        </button>
      ))}
    </div>
  </div>
);

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

const AmenitiesList = ({ amenities }: { amenities: string[] }) => (
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

// hides the address for anonymous listings if the viewer isn't signed in
const DescriptionCard = ({ listing }: { listing: ListingDetailData }) => {
  const { user } = useAuth();
  const displayAddress = listing.anonymous_lister && !user
    ? 'Address hidden (Sign in to view)'
    : listing.address;

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
            <span>{displayAddress}</span>
          </div>
        </div>
        {listing.is_verified && (
          <span className="hidden sm:inline-flex badge badge-primary bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20">
            Verified Listing
          </span>
        )}
      </div>

      <QuickStats bedrooms={listing.bedrooms} bathrooms={listing.bathrooms} roommatesCount={listing.roommates_count} />

      <div>
        <h3 className="text-lg font-bold mb-3">About this place</h3>
        <p className="text-[var(--text-muted)] leading-relaxed whitespace-pre-line">{listing.description}</p>
      </div>

      <AmenitiesList amenities={listing.amenities} />
    </div>
  );
};

interface RentActionCardProps {
  rent: number;
  availableFrom: string;
  availableTo: string;
  onMessageLister: () => void;
}

const RentActionCard = ({ rent, availableFrom, availableTo, onMessageLister }: RentActionCardProps) => (
  <div className="card border-t-4 border-t-[var(--primary)] animate-slide-up">
    <div className="mb-6">
      <div className="flex items-end gap-1 mb-1">
        <span className="text-3xl font-bold text-[var(--text-main)]">${rent.toLocaleString()}</span>
        <span className="text-[var(--text-muted)] mb-1">/ month</span>
      </div>
      <div className="text-sm font-medium text-[var(--text-muted)] bg-[var(--surface)] inline-block px-3 py-1 rounded-full border border-[var(--border)]">
        Available: {formatLongDate(availableFrom)} - {formatLongDate(availableTo)}
      </div>
    </div>

    <button onClick={onMessageLister} className="btn btn-primary w-full py-3 text-lg shadow-lg shadow-green-900/10 mb-3">
      Message Lister
    </button>
    <button className="btn btn-outline w-full py-2.5">Save for Later</button>

    <p className="text-xs text-center text-[var(--text-muted)] mt-4">
      Sublea connects you directly. All payments handled between parties.
    </p>
  </div>
);

interface OwnerProfileCardProps {
  owner: NonNullable<ListingDetailData['owner']>;
}

const OwnerProfileCard = ({ owner }: OwnerProfileCardProps) => {
  const initials = owner.name
    ? owner.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="card animate-slide-up delay-100">
      <h3 className="font-bold text-[var(--text-main)] mb-4">Meet the Lister</h3>
      <div className="flex items-center gap-4 mb-4">
        {owner.avatar ? (
          <img src={owner.avatar} alt={owner.name} className="w-16 h-16 rounded-full object-cover border-2 border-[var(--surface)] ring-2 ring-[var(--border)]" />
        ) : (
          <div className="w-16 h-16 rounded-full border-2 border-[var(--surface)] ring-2 ring-[var(--border)] flex items-center justify-center bg-[var(--surface)]">
            <span className="text-xl font-bold text-[var(--text-main)]">{initials}</span>
          </div>
        )}
        <div>
          <p className="font-bold text-lg">{owner.name}</p>
          <p className="text-xs text-[var(--text-muted)]">Verified Student</p>
        </div>
      </div>

      <p className="text-sm text-[var(--text-main)] italic mb-4">"{owner.bio}"</p>

      <div className="flex flex-wrap gap-2">
        {owner.tags.map((tag, idx) => (
          <span key={idx} className="badge bg-[var(--secondary)] text-[var(--secondary-foreground)] border-transparent">{tag}</span>
        ))}
      </div>
    </div>
  );
};

const SafetyTip = () => (
  <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-muted)] flex items-start gap-3">
    <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
    <p>Sublea connects you with listers. Always meet in person, view the property, and handle all payments directly with the lister.</p>
  </div>
);

const LoadingState = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <svg className="h-10 w-10 animate-spin text-[var(--primary)]" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <span className="text-[var(--text-muted)] animate-pulse">Loading listing details...</span>
    </div>
  </div>
);

//main 


export const ListingDetail = () => {
  const { id }                       = useParams<{ id: string }>();
  const navigate                     = useNavigate();
  const { user }                     = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { listing, loading }         = useListingDetail(id);

  if (loading) return <LoadingState />;

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">Listing not found</h2>
        <p className="text-[var(--text-muted)] mb-6">The listing you are looking for might have been removed or does not exist.</p>
        <button onClick={() => navigate('/browse')} className="btn btn-primary">Back to Browse</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Back Nav */}
      <button onClick={() => navigate(-1)} className="flex items-center text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors mb-4">
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images + Description (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          <ImageGallery
            images={listing.images}
            title={listing.title}
            activeIndex={activeImageIndex}
            onIndexChange={setActiveImageIndex}
          />

          <DescriptionCard listing={listing} />

          {/* Map */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Location</h3>
            <GoogleMap
              center={listing.coordinates}
              markers={[{ id: listing.id, lat: listing.coordinates.lat, lng: listing.coordinates.lng, title: listing.title }]}
              height="350px"
              zoom={15}
            />
            {listing.anonymous_lister && !user && (
              <p className="text-xs text-[var(--text-muted)] mt-2">Exact location hidden. Sign in to view full details.</p>
            )}
          </div>
        </div>

        {/* Right: Sticky Sidebar (1/3) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <RentActionCard
              rent={listing.rent}
              availableFrom={listing.available_from}
              availableTo={listing.available_to}
              onMessageLister={() =>
                navigate('/inbox', {
                  state: {
                    listingId:            listing.id,
                    targetId:             listing.owner?.id,
                    targetName:           listing.owner?.name,
                    targetAvatar:         listing.owner?.avatar,
                    listingTitle:         listing.title,
                    startNewConversation: true,
                  },
                })
              }
            />

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