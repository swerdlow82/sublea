import { ProgressStepProps } from '../../../types/createListing';

// shows a numbered circle and label; fills in green when the step is reached
export const ProgressStep = ({ stepNumber, label, currentStep, isLast = false }: ProgressStepProps) => {
  const isActive   = currentStep >= stepNumber;
  const isComplete = currentStep > stepNumber;

  return (
    <>
      <div className={`flex items-center gap-2 ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
            isActive
              ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
              : 'border-[var(--border)]'
          }`}
        >
          {stepNumber}
        </div>
        <span className="hidden sm:inline font-medium">{label}</span>
      </div>
      {!isLast && (
        <div className={`w-12 h-0.5 ${isComplete ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`} />
      )}
    </>
  );
};
