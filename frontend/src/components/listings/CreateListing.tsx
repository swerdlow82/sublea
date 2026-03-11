import React, { useEffect } from 'react';
import { useCreateListing } from '../../hooks/useCreateListing';
import {
  ProgressStep,
  StepBasics,
  StepDetails,
  StepPreferences,
  StepReview,
  FormActions,
} from './create';

// orchestrator — all state and logic lives in useCreateListing
export const CreateListing = () => {
  const {
    step,
    formData,
    errors,
    isSubmitting,
    previewListing,
    handleChange,
    handleAddressSelect,
    handleAmenityToggle,
    handleUploadImages,
    handleRemoveImage,
    handleAddDemoImage,
    handleNext,
    handleBack,
    handleCancel,
    handleSubmit,
    AMENITIES_LIST,
  } = useCreateListing();

  // scroll to top whenever the user moves between wizard steps
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header & Progress */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--text-main)] mb-6">List Your Place</h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 w-full">
          <ProgressStep stepNumber={1} label="Basics"      currentStep={step} />
          <ProgressStep stepNumber={2} label="Details"     currentStep={step} />
          <ProgressStep stepNumber={3} label="Preferences" currentStep={step} />
          <ProgressStep stepNumber={4} label="Review"      currentStep={step} isLast />
        </div>
      </div>

      <div className="card animate-fade-in">
        {step === 1 && (
          <StepBasics
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onAddressSelect={handleAddressSelect}
          />
        )}

        {step === 2 && (
          <StepDetails
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onAmenityToggle={handleAmenityToggle}
            onUploadImages={handleUploadImages}
            onRemoveImage={handleRemoveImage}
            onAddDemoImage={handleAddDemoImage}
            AMENITIES_LIST={AMENITIES_LIST}
          />
        )}

        {step === 3 && (
          <StepPreferences formData={formData} onChange={handleChange} />
        )}

        {step === 4 && (
          <StepReview formData={formData} previewListing={previewListing} />
        )}

        <FormActions
          step={step}
          isSubmitting={isSubmitting}
          onBack={handleBack}
          onNext={handleNext}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};