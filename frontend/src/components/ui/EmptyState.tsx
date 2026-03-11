import { ReactNode } from 'react';

interface EmptyStateProps {
  // pass any icon svg as a node — keeps this component layout-only
  icon: ReactNode;
  title: string;
  description: string;
  // optional CTA button or link — render it from the parent so this stays generic
  action?: ReactNode;
  // wrap in glass-panel by default, skip for Browse's inline empty state
  glassPanel?: boolean;
}

// generics component — reuse wherever a list might be empty
export const EmptyState = ({
  icon,
  title,
  description,
  action,
  glassPanel = false,
}: EmptyStateProps) => {
  const wrapperClass = glassPanel
    ? 'glass-panel flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in'
    : 'flex flex-col items-center justify-center py-20 text-center animate-fade-in';

  return (
    <div className={wrapperClass}>
      <div className="h-20 w-20 bg-[var(--surface)] rounded-full flex items-center justify-center mb-4 border border-[var(--border)]">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">{title}</h3>
      <p className="text-[var(--text-muted)] max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
};
