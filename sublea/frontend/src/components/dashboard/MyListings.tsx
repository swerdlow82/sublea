import { useState, useEffect, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api/client';

// --- Types ---
type ListingStatus = 'active' | 'expired' | 'draft';

interface MyListing {
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

interface StatusBadgeProps {
  status: ListingStatus;
}

interface ListingRowProps {
  key?: string;
  listing: MyListing;
  onDelete: (id: string) => void;
}

interface DeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

interface ActionButtonProps {
  onClick?: () => void;
  to?: string;
  title: string;
  hoverColor: 'green' | 'blue' | 'red';
  children: ReactNode;
}

interface StatItemProps {
  icon: ReactNode;
  value: number;
  label: string;
}

// --- Mock Data ---
const MOCK_USER_LISTINGS: MyListing[] = [
  {
    id: '1',
    title: 'Sunlit Loft in Cambridge',
    address: '450 Massachusetts Ave, Cambridge, MA',
    rent: 1450,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=200&auto=format&fit=crop',
    status: 'active',
    views: 124,
    inquiries: 8,
    createdAt: '2024-03-15',
    expiresAt: '2024-08-31'
  },
  {
    id: '2',
    title: 'Cozy Room near Harvard Square',
    address: '12 Holyoke St, Cambridge, MA',
    rent: 1200,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=200&auto=format&fit=crop',
    status: 'draft',
    views: 0,
    inquiries: 0,
    createdAt: '2024-04-10',
    expiresAt: '2024-08-31'
  },
  {
    id: '3',
    title: 'Summer Sublet - Fenway',
    address: '100 Jersey St, Boston, MA',
    rent: 1100,
    image: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=200&auto=format&fit=crop',
    status: 'expired',
    views: 45,
    inquiries: 2,
    createdAt: '2023-05-01',
    expiresAt: '2023-08-31'
  }
];

// --- Utility Functions ---
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

// --- Icon Components ---
const PlusIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const MessageIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const TrashIconLarge = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-10 h-10 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

// --- Sub-Components ---
const StatusBadge = ({ status }: StatusBadgeProps) => {
  const badgeClasses = {
    active: 'badge bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    draft: 'badge bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
    expired: 'badge bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
  };

  const labels = {
    active: 'Active',
    draft: 'Draft',
    expired: 'Expired'
  };

  return <span className={badgeClasses[status]}>{labels[status]}</span>;
};

const StatItem = ({ icon, value, label }: StatItemProps) => (
  <div className="flex items-center gap-2">
    {icon}
    {value} {label}
  </div>
);

const ListingStats = ({ views, inquiries }: { views: number; inquiries: number }) => (
  <div className="flex flex-col gap-1 text-sm text-[var(--text-muted)]">
    <StatItem icon={<EyeIcon />} value={views} label="Views" />
    <StatItem icon={<MessageIcon />} value={inquiries} label="Inquiries" />
  </div>
);

const ActionButton = ({ onClick, to, title, hoverColor, children }: ActionButtonProps) => {
  const hoverClasses = {
    green: 'hover:text-[var(--primary)] hover:bg-green-50',
    blue: 'hover:text-blue-600 hover:bg-blue-50',
    red: 'hover:text-red-600 hover:bg-red-50'
  };

  const baseClasses = `p-2 text-[var(--text-muted)] ${hoverClasses[hoverColor]} rounded-lg transition-colors`;

  if (to) {
    return (
      <Link to={to} className={baseClasses} title={title}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses} title={title}>
      {children}
    </button>
  );
};

const ListingImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-lg overflow-hidden border border-[var(--border)] bg-gray-100">
    <img src={src} alt={alt} className="h-full w-full object-cover" />
  </div>
);

const ListingInfo = ({ listing }: { listing: MyListing }) => (
  <div className="min-w-0 max-w-xs">
    <div className="font-bold text-[var(--text-main)] truncate mb-0.5">{listing.title}</div>
    <div className="text-sm text-[var(--text-muted)] truncate mb-1">{listing.address}</div>
    <div className="font-semibold text-[var(--primary)]">
      ${listing.rent}
      <span className="text-xs text-[var(--text-muted)] font-normal">/mo</span>
    </div>
    <div className="md:hidden mt-2">
      <StatusBadge status={listing.status} />
    </div>
  </div>
);

const ListingRow = ({ listing, onDelete }: ListingRowProps) => (
  <tr className="group hover:bg-[var(--surface)]/50 transition-colors">
    {/* Listing Info */}
    <td className="p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <ListingImage src={listing.image} alt={listing.title} />
        <ListingInfo listing={listing} />
      </div>
    </td>

    {/* Status (Desktop) */}
    <td className="p-4 sm:p-6 hidden md:table-cell align-middle">
      <StatusBadge status={listing.status} />
    </td>

    {/* Stats (Tablet+) */}
    <td className="p-4 sm:p-6 hidden sm:table-cell align-middle">
      <ListingStats views={listing.views} inquiries={listing.inquiries} />
    </td>

    {/* Date (Desktop) */}
    <td className="p-4 sm:p-6 hidden lg:table-cell align-middle text-sm text-[var(--text-muted)]">
      {formatDate(listing.createdAt)}
    </td>

    {/* Actions */}
    <td className="p-4 sm:p-6 text-right align-middle">
      <div className="flex items-center justify-end gap-2">
        <ActionButton to={`/listings/${listing.id}`} title="View Listing" hoverColor="green">
          <ExternalLinkIcon />
        </ActionButton>
        <ActionButton title="Edit Listing" hoverColor="blue">
          <EditIcon />
        </ActionButton>
        <ActionButton onClick={() => onDelete(listing.id)} title="Delete Listing" hoverColor="red">
          <TrashIcon />
        </ActionButton>
      </div>
    </td>
  </tr>
);

const TableHeader = () => (
  <thead className="bg-[var(--surface)] text-[var(--text-muted)] text-xs uppercase tracking-wider font-semibold border-b border-[var(--border)]">
    <tr>
      <th className="p-4 sm:p-6">Listing</th>
      <th className="p-4 sm:p-6 hidden md:table-cell">Status</th>
      <th className="p-4 sm:p-6 hidden sm:table-cell">Stats</th>
      <th className="p-4 sm:p-6 hidden lg:table-cell">Posted</th>
      <th className="p-4 sm:p-6 text-right">Actions</th>
    </tr>
  </thead>
);

const ListingsTable = ({ listings, onDelete }: { listings: MyListing[]; onDelete: (id: string) => void }) => (
  <div className="glass-panel overflow-hidden animate-slide-up">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <TableHeader />
        <tbody className="divide-y divide-[var(--border)]">
          {listings.map((listing) => (
            <ListingRow key={listing.id} listing={listing} onDelete={onDelete} /> //fix the key= issue in the future 
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-24 bg-[var(--surface)] rounded-xl border border-[var(--border)]"></div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="glass-panel flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
    <div className="w-20 h-20 bg-[var(--surface)] rounded-full flex items-center justify-center mb-6 border border-[var(--border)]">
      <HomeIcon />
    </div>
    <h2 className="text-xl font-bold text-[var(--text-main)] mb-2">No listings yet</h2>
    <p className="text-[var(--text-muted)] max-w-sm mb-8">
      You haven't posted any sublets yet. Create your first listing to start reaching potential roommates.
    </p>
    <Link to="/listings/create" className="btn btn-primary px-8 py-3">
      Create My First Listing
    </Link>
  </div>
);

const PageHeader = () => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-main)]">My Listings</h1>
      <p className="text-[var(--text-muted)] mt-1">Manage your active sublets and drafts.</p>
    </div>
    <Link to="/listings/create" className="btn btn-primary shadow-lg shadow-green-900/10">
      <PlusIcon />
      Create New Listing
    </Link>
  </div>
);

const DeleteModal = ({ isOpen, onConfirm, onCancel }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-card)] max-w-sm w-full p-6 shadow-2xl animate-scale-in">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <TrashIconLarge />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-main)]">Delete Listing?</h3>
        </div>
        <p className="text-[var(--text-muted)] mb-6 text-sm">
          Are you sure you want to delete this listing? This action cannot be undone and you will lose all view data.
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn btn-outline text-sm">
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="btn btn-primary bg-red-600 hover:bg-red-700 border-red-600 text-white shadow-none text-sm"
          >
            Delete Listing
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Custom Hook ---
const useListings = () => {
  const [listings, setListings] = useState<MyListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await apiFetch('/api/users/me/listings');
        const mappedListings = data.map((listing: any) => ({
          id: listing.id.toString(),
          title: listing.title,
          address: listing.address,
          rent: listing.rent,
          image: listing.images ? listing.images.split(',')[0] : 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=200&auto=format&fit=crop',
          status: 'active', // Assuming active for now
          views: 0,
          inquiries: 0,
          createdAt: listing.created_at,
          expiresAt: listing.available_to || listing.created_at
        }));
        setListings(mappedListings);
      } catch (error) {
        console.error("Failed to fetch listings", error);
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
      console.error("Failed to delete listing", error);
      alert("Could not delete listing. Please try again.");
    }
  };

  return { listings, isLoading, deleteListing };
};

// --- Main Component ---
export const MyListings = () => {
  const navigate = useNavigate();
  const { listings, isLoading, deleteListing } = useListings();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      deleteListing(deleteId);
      setDeleteId(null);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteId(id);
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader />

      <div className="min-h-[400px]">
        {isLoading ? (
          <LoadingSkeleton />
        ) : listings.length > 0 ? (
          <ListingsTable listings={listings} onDelete={handleDeleteRequest} />
        ) : (
          <EmptyState />
        )}
      </div>

      <DeleteModal 
        isOpen={!!deleteId} 
        onConfirm={handleDelete} 
        onCancel={handleCancelDelete} 
      />
    </div>
  );
};