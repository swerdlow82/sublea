import { StepPreferencesProps } from '../../../types/createListing';

// step 3 — describe your current roommates so visitors can self-select
export const StepPreferences = ({ formData, onChange }: StepPreferencesProps) => (
  <div className="space-y-8 animate-slide-up">
    <div className="border-b border-[var(--border)] pb-4">
      <h3 className="font-bold text-lg">Roommate Compatibility</h3>
      <p className="text-sm text-[var(--text-muted)]">
        Describe your current roommates (if applicable) so potential sublessees can see if they'd be a good fit.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Demographics */}
      <div className="space-y-6">
        <h4 className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wide">Demographics</h4>

        <div className="input-group">
          <label className="label">Preferred Gender</label>
          <select name="prefGender" value={formData.prefGender} onChange={onChange} className="input">
            <option value="Any">Any</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
          </select>
        </div>

        <div>
          <label className="label mb-2 block">Age Range</label>
          <div className="flex items-center gap-2">
            <input type="number" name="prefAgeMin" value={formData.prefAgeMin} onChange={onChange} className="input w-24 text-center" min="16" placeholder="Min" />
            <span className="text-[var(--text-muted)]">to</span>
            <input type="number" name="prefAgeMax" value={formData.prefAgeMax} onChange={onChange} className="input w-24 text-center" max="100" placeholder="Max" />
          </div>
        </div>
      </div>

      {/* Lifestyle Habits */}
      <div className="space-y-6">
        <h4 className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wide">Lifestyle Habits</h4>

        <div className="input-group">
          <label className="label">Cleanliness</label>
          <select name="habitCleaning" value={formData.habitCleaning} onChange={onChange} className="input">
            <option value="Very Tidy">Very Tidy</option>
            <option value="Tidy">Tidy</option>
            <option value="Relaxed">Relaxed</option>
            <option value="Messy">Messy</option>
          </select>
        </div>

        <div className="input-group">
          <label className="label">Smoking</label>
          <select name="habitSmoking" value={formData.habitSmoking} onChange={onChange} className="input">
            <option value="Non-smoker">Non-smoker</option>
            <option value="Outside only">Outside only</option>
            <option value="Okay with it">Okay with it</option>
          </select>
        </div>

        <div className="input-group">
          <label className="label">Pets</label>
          <select name="habitPets" value={formData.habitPets} onChange={onChange} className="input">
            <option value="No pets">No pets</option>
            <option value="Has pets">Has pets</option>
            <option value="Pet-friendly">Pet-friendly (doesn't own)</option>
          </select>
        </div>

        <div className="input-group">
          <label className="label">Drinking</label>
          <select name="habitDrinking" value={formData.habitDrinking} onChange={onChange} className="input">
            <option value="Non-drinker">Non-drinker</option>
            <option value="Socially">Socially</option>
            <option value="Frequently">Frequently</option>
          </select>
        </div>

        <div className="input-group">
          <label className="label">Noise Tolerance</label>
          <select name="habitNoise" value={formData.habitNoise} onChange={onChange} className="input">
            <option value="">Select</option>
            <option value="Quiet">Quiet (Study focused)</option>
            <option value="Moderate">Moderate</option>
            <option value="Social">Social / Loud</option>
          </select>
        </div>

        <div className="input-group">
          <label className="label">Bed Time</label>
          <select name="bedTime" value={formData.bedTime} onChange={onChange} className="input">
            <option value="">Select</option>
            <option value="Early (Before 10 PM)">Early (Before 10 PM)</option>
            <option value="Average (10 PM - 12 AM)">Average (10 PM – 12 AM)</option>
            <option value="Night Owl (After 12 AM)">Night Owl (After 12 AM)</option>
          </select>
        </div>

        <div className="input-group">
          <label className="label">Wake Time</label>
          <select name="wakeTime" value={formData.wakeTime} onChange={onChange} className="input">
            <option value="">Select</option>
            <option value="Early Bird (Before 7 AM)">Early Bird (Before 7 AM)</option>
            <option value="Average (7 AM - 9 AM)">Average (7 AM – 9 AM)</option>
            <option value="Late Riser (After 9 AM)">Late Riser (After 9 AM)</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);
