interface DeleteModalProps {
  isOpen: boolean;
  // customizable so we can reuse on other destructive actions later
  title?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// confirmation dialog for destructive actions — currently wired to listing deletion in MyListings
export const DeleteModal = ({
  isOpen,
  title = 'Delete this item?',
  description = 'This action cannot be undone and all related data will be lost.',
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-card)] max-w-sm w-full p-6 shadow-2xl animate-scale-in">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[var(--text-main)]">{title}</h3>
        </div>

        <p className="text-[var(--text-muted)] mb-6 text-sm">{description}</p>

        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn btn-outline text-sm">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-primary bg-red-600 hover:bg-red-700 border-red-600 text-white shadow-none text-sm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
