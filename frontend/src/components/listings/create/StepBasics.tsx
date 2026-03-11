import { StepBasicsProps } from '../../../types/createListing';
import { AddressAutocomplete } from '../../common/AddressAutocomplete';

// step 1 of the wizard — the must-haves: title, address, rent, dates
export const StepBasics = ({ formData, errors, onChange, onAddressSelect }: StepBasicsProps) => (
  <div className="space-y-6 animate-slide-up">
    <h2 className="text-xl font-bold mb-4">Essential Information</h2>

    <div className="input-group">
      <label className="label">Listing Title</label>
      <input
        name="title"
        value={formData.title}
        onChange={onChange}
        className={`input ${errors.title ? 'border-red-500' : ''}`}
        placeholder="e.g., Sunny Studio near Campus"
        maxLength={100}
      />
      {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
    </div>

    <div className="input-group">
      <label className="label">Address</label>
      <AddressAutocomplete
        value={formData.address}
        onChange={onChange}
        onSelect={onAddressSelect}
        hasError={!!errors.address}
      />
      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="input-group">
        <label className="label">Monthly Rent ($)</label>
        <input
          name="rent"
          type="number"
          value={formData.rent}
          onChange={onChange}
          className={`input ${errors.rent ? 'border-red-500' : ''}`}
          placeholder="1200"
          min="0"
        />
        {errors.rent && <p className="text-red-500 text-xs mt-1">{errors.rent}</p>}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="input-group">
        <label className="label">Available From</label>
        <input
          name="availableFrom"
          type="date"
          value={formData.availableFrom}
          onChange={onChange}
          className={`input ${errors.availableFrom ? 'border-red-500' : ''}`}
        />
        {errors.availableFrom && <p className="text-red-500 text-xs mt-1">{errors.availableFrom}</p>}
      </div>
      <div className="input-group">
        <label className="label">Available To (Optional)</label>
        <input
          name="availableTo"
          type="date"
          value={formData.availableTo}
          onChange={onChange}
          className={`input ${errors.availableTo ? 'border-red-500' : ''}`}
        />
        {errors.availableTo && <p className="text-red-500 text-xs mt-1">{errors.availableTo}</p>}
      </div>
    </div>
  </div>
);
