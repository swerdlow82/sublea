interface LoadingSpinnerProps {
  className?: string;
  // color variant — defaults to white (for use inside colored buttons)
  // pass 'text-[var(--primary)]' for standalone spinners on a light background
  colorClass?: string;
}

// the SVG spinner we use everywhere — one definition, no more inline copies
export const LoadingSpinner = ({
  className = 'h-4 w-4',
  colorClass = 'text-white',
}: LoadingSpinnerProps) => (
  <svg className={`animate-spin ${className} ${colorClass}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
