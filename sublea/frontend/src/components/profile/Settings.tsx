import { useState, useRef, useEffect, FormEvent, ChangeEvent, ReactNode, RefObject } from 'react';
import { apiFetch } from '../../api/client';

// --- Types ---
type Tab = 'basic' | 'preferences' | 'account';

interface Notification {
  type: 'success' | 'error';
  message: string;
}

interface UserProfile {
  // Basic
  firstName: string;
  lastName: string;
  avatar: string;
  bio: string;
  gender: string;
  age: number | '';
  
  // Account
  email: string;
  isVerified: boolean;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

interface AvatarSectionProps {
  avatar: string;
  onAvatarClick: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface BasicInfoTabProps {
  formData: UserProfile;
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAvatarClick: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface AccountTabProps {
  formData: UserProfile;
  onDeleteClick: () => void;
}

interface NotificationToastProps {
  notification: Notification;
}

interface DeleteModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

interface SaveButtonProps {
  isSaving: boolean;
}

const INITIAL_PROFILE: UserProfile = {
  firstName: '',
  lastName: '',
  avatar: '',
  bio: '',
  gender: '',
  age: '',
  
  email: '',
  isVerified: false
};

// --- Sub-Components ---

const TabButton = ({ active, onClick, children }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
        ${active 
          ? 'bg-[var(--primary)] text-white shadow-md' 
          : 'text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-main)]'
        }`}
    >
      {children}
    </button>
  );
};

const AvatarSection = ({ avatar, onAvatarClick, fileInputRef, onFileChange }: AvatarSectionProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-[var(--border)]">
      <div className="relative group">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-[var(--surface)] shadow-lg">
          <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <button
          type="button"
          onClick={onAvatarClick}
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
        >
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={onFileChange}
        />
      </div>
      <div className="text-center sm:text-left">
        <h3 className="text-lg font-bold">Profile Picture</h3>
        <p className="text-sm text-[var(--text-muted)] max-w-xs mb-3">
          Upload a clear photo of yourself. This helps build trust with potential roommates.
        </p>
        <button type="button" onClick={onAvatarClick} className="btn btn-outline text-xs py-1.5">
          Change Photo
        </button>
      </div>
    </div>
  );
};

const BasicInfoTab = ({ formData, onInputChange, onAvatarClick, fileInputRef, onFileChange }: BasicInfoTabProps) => {
  return (
    <div className="space-y-8 animate-slide-up">
      <AvatarSection 
        avatar={formData.avatar}
        onAvatarClick={onAvatarClick}
        fileInputRef={fileInputRef}
        onFileChange={onFileChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="input-group">
          <label className="label">First Name</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            className="input"
          />
        </div>
        <div className="input-group">
          <label className="label">Last Name</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
            className="input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="input-group">
          <label className="label">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={onInputChange}
            className="input"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
        <div className="input-group">
          <label className="label">Age</label>
          <input
            name="age"
            type="number"
            value={formData.age}
            onChange={onInputChange}
            className="input"
            min="16"
            max="100"
          />
        </div>
      </div>

      <div className="input-group">
        <label className="label">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={onInputChange}
          className="input min-h-[120px] resize-y"
          placeholder="Tell us about yourself..."
          maxLength={500}
        />
        <div className="text-right text-xs text-[var(--text-muted)] mt-1">
          {formData.bio.length}/500
        </div>
      </div>
    </div>
  );
};



const AccountTab = ({ formData, onDeleteClick }: AccountTabProps) => {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Email Section */}
      <div>
        <h3 className="font-bold text-lg mb-4">Account Information</h3>
        <div className="input-group">
          <label className="label">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={formData.email}
              readOnly
              className="input bg-[var(--surface)] text-[var(--text-muted)] cursor-not-allowed pr-24"
            />
            {formData.isVerified && (
              <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1 text-green-600 text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </div>
            )}
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">To change your email, please contact support.</p>
        </div>
      </div>

      <div className="border-t border-[var(--border)] pt-6">
        <h3 className="font-bold text-lg mb-4">Security</h3>
        <button type="button" className="btn btn-outline w-full sm:w-auto">
          Change Password
        </button>
      </div>

      <div className="border-t border-[var(--border)] pt-6">
        <h3 className="font-bold text-lg mb-2 text-red-600">Danger Zone</h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button 
          type="button" 
          onClick={onDeleteClick}
          className="btn bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 w-full sm:w-auto"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

const SaveButton = ({ isSaving }: SaveButtonProps) => {
  return (
    <div className="sticky bottom-0 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 bg-[var(--surface-glass)] backdrop-blur-md border-t border-[var(--border)] flex justify-end rounded-b-[var(--radius-card)] mt-8 z-10">
      <button
        type="submit"
        disabled={isSaving}
        className="btn btn-primary min-w-[120px]"
      >
        {isSaving ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        ) : 'Save Changes'}
      </button>
    </div>
  );
};

const NotificationToast = ({ notification }: NotificationToastProps) => {
  return (
    <div className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg border backdrop-blur-md animate-fade-in flex items-center gap-3 z-50
      ${notification.type === 'success' 
        ? 'bg-green-50/90 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-100' 
        : 'bg-red-50/90 border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-800 dark:text-red-100'
      }`}
    >
      {notification.type === 'success' ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <span className="text-sm font-medium">{notification.message}</span>
    </div>
  );
};

const DeleteModal = ({ onCancel, onConfirm }: DeleteModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-card)] max-w-md w-full p-6 shadow-2xl animate-scale-in">
        <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Delete Account?</h3>
        <p className="text-[var(--text-muted)] mb-6">
          Are you sure you want to delete your account? All of your data, including listings and messages, will be permanently removed.
        </p>
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onCancel}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="btn btn-primary bg-red-600 hover:bg-red-700 border-red-600 text-white shadow-none"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<Tab>('basic');
  const [formData, setFormData] = useState<UserProfile>(INITIAL_PROFILE);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch('/api/users/me');
        setFormData({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          avatar: data.profile_picture || '',
          bio: data.bio || '',
          gender: data.gender || '',
          age: data.age || '',
          email: data.email || '',
          isVerified: !!data.is_verified,
        });
      } catch (error) {
        setNotification({ type: 'error', message: 'Failed to load profile.' });
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? Number(value) : value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, avatar: imageUrl }));
  };

  const validateBasicInfo = (): boolean => {
    if (!formData.firstName || !formData.lastName) {
      setNotification({ type: 'error', message: 'Name fields are required.' });
      return false;
    }
    if (formData.age && (formData.age < 16 || formData.age > 100)) {
      setNotification({ type: 'error', message: 'Please enter a valid age.' });
      return false;
    }
    return true;
  };



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (activeTab === 'basic' && !validateBasicInfo()) {
      setIsSaving(false);
      return;
    }



    try {
      await apiFetch('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          age: formData.age || null,
          bio: formData.bio || null,
          gender: formData.gender || null,
          profile_picture: formData.avatar || null
        })
      });
      setNotification({ type: 'success', message: 'Changes saved successfully.' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to save changes.' });
    } finally {
      setIsSaving(false);
    }
  };

  const calculateCompletion = () => {
    const requiredFields = [
      formData.firstName, formData.lastName, formData.age, formData.bio, formData.gender
    ];
    const filled = requiredFields.filter(f => f !== '' && f !== null && f !== undefined && String(f).trim() !== '').length;
    return Math.round((filled / requiredFields.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  const handleDeleteAccount = () => {
    console.log('Deleting account...');
    setShowDeleteModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 relative">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-main)]">Profile Settings</h1>
          <p className="text-[var(--text-muted)] mt-1">Manage your public profile and roommate preferences.</p>
        </div>
        <div className="flex flex-col sm:items-end">
          <span className="text-sm font-medium mb-1 truncate w-full sm:max-w-[200px]">Profile Completion Status</span>
          <div className="flex items-center gap-3 w-48">
            <div className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full h-2">
              <div className="bg-[var(--primary)] h-full rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
            </div>
            <span className="text-sm font-bold text-[var(--primary)]">{completionPercentage}%</span>
          </div>
          {completionPercentage < 100 && (
            <span className="text-[10px] text-[var(--text-muted)] mt-1">100% required to post listings</span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <nav className="glass-panel p-2 flex md:flex-col gap-1 sticky top-24 overflow-x-auto md:overflow-visible scrollbar-hide">
            <TabButton active={activeTab === 'basic'} onClick={() => setActiveTab('basic')}>
              Basic Info
            </TabButton>
            <TabButton active={activeTab === 'account'} onClick={() => setActiveTab('account')}>
              Account
            </TabButton>
          </nav>
        </div>

        {/* Form Area */}
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 animate-fade-in relative min-h-[500px]">
            {activeTab === 'basic' && (
              <BasicInfoTab 
                formData={formData}
                onInputChange={handleInputChange}
                onAvatarClick={handleAvatarClick}
                fileInputRef={fileInputRef}
                onFileChange={handleFileChange}
              />
            )}



            {activeTab === 'account' && (
              <AccountTab 
                formData={formData}
                onDeleteClick={() => setShowDeleteModal(true)}
              />
            )}
            
            {activeTab !== 'account' && <SaveButton isSaving={isSaving} />}
          </form>
        </div>
      </div>

      {notification && <NotificationToast notification={notification} />}
      {showDeleteModal && (
        <DeleteModal 
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </div>
  );
};