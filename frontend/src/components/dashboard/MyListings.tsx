import { useState } from 'react';
import { Link } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useMyListings, MyListing } from '../../hooks/useMyListings';
import { formatDate } from '../../utils/formatDate';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';
import { DeleteModal } from '../ui/DeleteModal';

// icons
// kept local since they're only used here — would move to ui/ if reused elsewhere

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

// ── Sub-components ─────────────────────────────────────────────────────────────

interface ActionButtonProps {
  onClick?: () => void;
  to?: string;
  title: string;
  hoverColor: 'green' | 'blue' | 'red';
  children: ReactNode;
}

const ActionButton = ({ onClick, to, title, hoverColor, children }: ActionButtonProps) => {
  const hoverClasses = {
    green: 'hover:text-[var(--primary)] hover:bg-green-50',
    blue:  'hover:text-blue-600 hover:bg-blue-50',
    red:   'hover:text-red-600 hover:bg-red-50',
  };
  const className = `p-2 text-[var(--text-muted)] ${hoverClasses[hoverColor]} rounded-lg transition-colors`;
  return to
    ? <Link to={to} className={className} title={title}>{children}</Link>
    : <button onClick={onClick} className={className} title={title}>{children}</button>;
};

const ListingRow = ({ listing, onDelete }: { listing: MyListing; onDelete: (id: string) => void }) => (
  <tr className="group hover:bg-[var(--surface)]/50 transition-colors">
    {/* Listing Info */}
    <td className="p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-lg overflow-hidden border border-[var(--border)] bg-gray-100 dark:bg-gray-800">
          <img src={listing.image} alt={listing.title} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 max-w-xs">
          <div className="font-bold text-[var(--text-main)] truncate mb-0.5">{listing.title}</div>
          <div className="text-sm text-[var(--text-muted)] truncate mb-1">{listing.address}</div>
          <div className="font-semibold text-[var(--primary)]">
            ${listing.rent}<span className="text-xs text-[var(--text-muted)] font-normal">/mo</span>
          </div>
          <div className="md:hidden mt-2">
            <Badge variant={listing.status}>{listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}</Badge>
          </div>
        </div>
      </div>
    </td>

    {/* Status (Desktop) */}
    <td className="p-4 sm:p-6 hidden md:table-cell align-middle">
      <Badge variant={listing.status}>{listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}</Badge>
    </td>

    {/* Stats (Tablet+) */}
    <td className="p-4 sm:p-6 hidden sm:table-cell align-middle">
      <div className="flex flex-col gap-1 text-sm text-[var(--text-muted)]">
        <div className="flex items-center gap-2"><EyeIcon />{listing.views} Views</div>
        <div className="flex items-center gap-2"><MessageIcon />{listing.inquiries} Inquiries</div>
      </div>
    </td>

    {/* Date (Desktop) */}
    <td className="p-4 sm:p-6 hidden lg:table-cell align-middle text-sm text-[var(--text-muted)]">
      {formatDate(listing.createdAt)}
    </td>

    {/* Actions */}
    <td className="p-4 sm:p-6 text-right align-middle">
      <div className="flex items-center justify-end gap-2">
        <ActionButton to={`/listings/${listing.id}`} title="View Listing" hoverColor="green"><ExternalLinkIcon /></ActionButton>
        <ActionButton title="Edit Listing" hoverColor="blue"><EditIcon /></ActionButton>
        <ActionButton onClick={() => onDelete(listing.id)} title="Delete Listing" hoverColor="red"><TrashIcon /></ActionButton>
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

const LoadingSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-24 bg-[var(--surface)] rounded-xl border border-[var(--border)]" />
    ))}
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

// main Component 


export const MyListings = () => {
  const { listings, isLoading, deleteListing } = useMyListings();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete    = () => { if (deleteId) { deleteListing(deleteId); setDeleteId(null); } };
  const handleCancelDel = () => setDeleteId(null);

  return (
    <div className="space-y-8 pb-12">
      <PageHeader />

      <div className="min-h-[400px]">
        {isLoading ? (
          <LoadingSkeleton />
        ) : listings.length > 0 ? (
          <div className="glass-panel overflow-hidden animate-slide-up">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <TableHeader />
                <tbody className="divide-y divide-[var(--border)]">
                  {listings.map(listing => (
                    <ListingRow key={listing.id} listing={listing} onDelete={setDeleteId} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            glassPanel
            icon={
              <svg className="w-10 h-10 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
            title="No listings yet"
            description="You haven't posted any sublets yet. Create your first listing to start reaching potential roommates."
            action={<Link to="/listings/create" className="btn btn-primary px-8 py-3">Create My First Listing</Link>}
          />
        )}
      </div>

      <DeleteModal
        isOpen={!!deleteId}
        title="Delete Listing?"
        description="Are you sure you want to delete this listing? This action cannot be undone and you will lose all view data."
        confirmLabel="Delete Listing"
        onConfirm={handleDelete}
        onCancel={handleCancelDel}
      />
    </div>
  );
};