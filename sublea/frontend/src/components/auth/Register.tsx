import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

interface PasswordToggleButtonProps {
  showPassword: boolean;
  onClick: () => void;
}

interface PasswordStrengthIndicatorProps {
  strength: number;
}

interface EmailWarningProps {
  email: string;
  hasError: boolean;
}

const EMAIL_REGEX = /\S+@\S+\.\S+/;
const MIN_PASSWORD_LENGTH = 8;

const PasswordToggleButton = ({ showPassword, onClick }: PasswordToggleButtonProps) => (
  <button
    type="button"
    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--text-muted)] hover:text-[var(--text-main)]"
    onClick={onClick}
  >
    {showPassword ? (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ) : (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )}
  </button>
);

const getStrengthColor = (strength: number): string => {
  if (strength <= 1) return 'bg-red-500';
  if (strength <= 3) return 'bg-yellow-500';
  return 'bg-green-500';
};

const PasswordStrengthIndicator = ({ strength }: PasswordStrengthIndicatorProps) => (
  <div className="mt-2 flex gap-1 h-1 w-full rounded-full overflow-hidden bg-gray-200">
    <div 
      className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`} 
      style={{ width: `${(strength / 5) * 100}%` }}
    />
  </div>
);

const EmailWarning = ({ email, hasError }: EmailWarningProps) => {
  if (hasError || !email || email.endsWith('.edu')) {
    return null;
  }

  return (
    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      We recommend using a .edu email for faster verification
    </p>
  );
};

const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return strength;
};

const validateForm = (formData: RegisterFormData): FormErrors => {
  const errors: FormErrors = {};
  
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(formData.email)) {
    errors.email = "Invalid email format";
  } else if (!formData.email.toLowerCase().endsWith('.edu')) {
    errors.email = "Please use a valid .edu student email address";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = "Password must be at least 8 characters";
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!formData.agreedToTerms) {
    errors.terms = "You must agree to the terms";
  }

  return errors;
};

export const Register = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const strength = calculatePasswordStrength(formData.password);
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Simulate API call
      // TODO: Implement API call to POST /auth/register
      // Payload: { email: formData.email, password: formData.password }
      // Response: { id: number, email: string, is_verified: boolean, ... }
      // Action: Redirect to login or auto-login
      setTimeout(() => {
        console.log('Register attempt:', formData);
        setIsLoading(false);
        // Handle success
      }, 1500);
    } else {
      setIsLoading(false);
    }
  };

  const updateFormField = <K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="card w-full max-w-md space-y-8 animate-scale-in">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Join the community of verified student renters
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label htmlFor="email" className="label">Student Email (.edu)</label>
            <input
              id="email"
              type="email"
              className={`input ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="name@university.edu"
              value={formData.email}
              onChange={(e) => updateFormField('email', e.target.value)}
            />
            {errors.email ? (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            ) : (
              <EmailWarning email={formData.email} hasError={!!errors.email} />
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password" className="label">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => updateFormField('password', e.target.value)}
              />
              <PasswordToggleButton 
                showPassword={showPassword} 
                onClick={() => setShowPassword(!showPassword)} 
              />
            </div>
            {formData.password && <PasswordStrengthIndicator strength={passwordStrength} />}
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword" className="label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className={`input ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => updateFormField('confirmPassword', e.target.value)}
            />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--border)] text-primary focus:ring-[var(--ring)]"
                checked={formData.agreedToTerms}
                onChange={(e) => updateFormField('agreedToTerms', e.target.checked)}
              />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="terms" className="text-[var(--text-main)]">
                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </label>
              {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-primary w-full py-2.5 text-sm font-semibold shadow-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-center text-sm text-[var(--text-muted)]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-[var(--primary-hover)] transition-colors">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};