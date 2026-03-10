import { StepDetailsProps } from '../../../types/createListing';

// step 2 — rooms config, description, amenity toggles, photo upload, anonymous toggle
export const StepDetails = ({
  formData,
  errors,
  onChange,
  onAmenityToggle,
  onUploadImages,
  onRemoveImage,
  onAddDemoImage,
  AMENITIES_LIST,
}: StepDetailsProps & { AMENITIES_LIST: string[] }) => (
  <div className="space-y-8 animate-slide-up">

    {/* Room Configuration */}
    <div>
      <h2 className="text-xl font-bold mb-4">Property Details</h2>
      <div className="grid grid-cols-3 gap-4">
        {(['bedrooms', 'bathrooms', 'roommates'] as const).map(field => (
          <div key={field} className="input-group">
            <label className="label capitalize">{field}</label>
            <input
              name={field}
              type="number"
              value={formData[field]}
              onChange={onChange}
              className="input"
              min="0"
              step={field === 'bathrooms' ? '0.5' : '1'}
            />
          </div>
        ))}
      </div>
    </div>

    {/* Description */}
    <div className="input-group">
      <label className="label">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={onChange}
        className={`input min-h-[150px] resize-y ${errors.description ? 'border-red-500' : ''}`}
        placeholder="Tell potential subletters about your place, roommates, and the neighborhood..."
      />
      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
    </div>

    {/* Amenities */}
    <div>
      <label className="label mb-3 block">Amenities</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {AMENITIES_LIST.map(amenity => (
          <label
            key={amenity}
            className={`cursor-pointer rounded-lg border p-3 text-sm font-medium transition-all text-center flex items-center justify-center ${
              formData.amenities.includes(amenity)
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md'
                : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--primary)]'
            }`}
          >
            <input
              type="checkbox"
              className="hidden"
              checked={formData.amenities.includes(amenity)}
              onChange={() => onAmenityToggle(amenity)}
            />
            {amenity}
          </label>
        ))}
      </div>
    </div>

    {/* Photos */}
    <div>
      <label className="label mb-2 block">Photos</label>
      <div className="flex flex-wrap gap-4 mb-4">
        {formData.images.map((img, idx) => (
          <div key={idx} className="relative w-32 h-24 rounded-lg overflow-hidden border border-[var(--border)] group">
            <img src={img} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onRemoveImage(idx)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {/* Upload drop-zone shown when no images yet */}
        {formData.images.length === 0 && (
          <label
            htmlFor="photo-upload"
            className="w-full h-32 border-2 border-dashed border-[var(--border)] rounded-lg flex flex-col items-center justify-center text-[var(--text-muted)] bg-[var(--surface)] cursor-pointer hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
          >
            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">Click to upload photos</span>
            <span className="text-xs mt-1 opacity-70">JPG, PNG, WEBP — multiple allowed</span>
          </label>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => e.target.files && onUploadImages(e.target.files)}
        />
        <label htmlFor="photo-upload" className="btn btn-secondary cursor-pointer whitespace-nowrap">
          <svg className="w-4 h-4 inline-block mr-1.5 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload Photos
        </label>
        <button type="button" onClick={onAddDemoImage} className="text-xs text-[var(--primary)] hover:underline">
          + Add random demo image
        </button>
      </div>
      {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
    </div>

    {/* Anonymous Toggle */}
    <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
      <div>
        <h3 className="font-semibold text-[var(--text-main)]">Post Anonymously</h3>
        <p className="text-sm text-[var(--text-muted)]">
          Hide your personal details and exact address from unverified users. Only logged-in, verified students can message you or see these details.
        </p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="anonymous"
          checked={formData.anonymous}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]" />
      </label>
    </div>
  </div>
);
