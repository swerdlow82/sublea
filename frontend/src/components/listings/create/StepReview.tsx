import { StepReviewProps } from '../../../types/createListing';
import { ListingCard } from '../ListingCard';

// step 4 -- final preview so listers can see what buyers will see before publishing
export const StepReview = ({ formData, previewListing }: StepReviewProps) => (
  <div className="space-y-8 animate-slide-up">
    <h2 className="text-xl font-bold mb-4">Preview Your Listing</h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Preview Card */}
      <div className="max-w-sm mx-auto w-full">
        {/* pointer-events-none so the card isn't clickable mid-flow */}
        <div className="relative pointer-events-none transform scale-95 origin-top">
          <ListingCard listing={previewListing} />
        </div>
        <p className="text-center text-xs text-[var(--text-muted)] mt-2">
          This is how your listing will appear in search results.
        </p>
      </div>

      {/* Summary Details */}
      <div className="space-y-4">
        <div className="glass-panel p-6">
          <h3 className="font-bold text-lg mb-4 text-[var(--text-main)]">Details Summary</h3>

          <div className="space-y-3 text-sm">
            {[
              ['Monthly Rent',  `$${formData.rent}`],
              ['Dates',         `${formData.availableFrom} to ${formData.availableTo || 'Indefinite'}`],
              ['Configuration', `${formData.bedrooms} Bed, ${formData.bathrooms} Bath`],
              ['Visibility',    formData.anonymous ? 'Anonymous' : 'Public Profile'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-[var(--border)] pb-2">
                <span className="text-[var(--text-muted)]">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-sm mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.length > 0 ? (
                formData.amenities.map(a => (
                  <span key={a} className="badge badge-neutral text-xs">{a}</span>
                ))
              ) : (
                <span className="text-[var(--text-muted)] text-xs italic">None selected</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
