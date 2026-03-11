import { FormActionsProps } from '../../../types/createListing';
import { LoadingSpinner } from '../../ui/LoadingSpinner';

// navigation footer at the bottom of each wizard step
export const FormActions = ({
  step,
  isSubmitting,
  onBack,
  onNext,
  onCancel,
  onSubmit,
}: FormActionsProps) => (
  <div className="mt-8 pt-6 border-t border-[var(--border)] flex justify-between items-center">
    {step > 1 ? (
      <button onClick={onBack} className="btn btn-outline" disabled={isSubmitting}>
        Back
      </button>
    ) : (
      <button onClick={onCancel} className="btn btn-ghost text-[var(--text-muted)]">
        Cancel
      </button>
    )}

    {step < 4 ? (
      <button onClick={onNext} className="btn btn-primary">
        Next Step
      </button>
    ) : (
      <button onClick={onSubmit} disabled={isSubmitting} className="btn btn-primary px-8">
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner />
            Publishing...
          </span>
        ) : (
          'Publish Listing'
        )}
      </button>
    )}
  </div>
);
