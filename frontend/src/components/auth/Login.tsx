import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface PasswordToggleButtonProps {
  showPassword: boolean;
  onClick: () => void;
}

const EMAIL_REGEX = /\S+@\S+\.\S+/;

const PasswordToggleButton = ({ showPassword, onClick }: PasswordToggleButtonProps) => (
  <button
    type="button"
    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--text-muted)] hover:text-[var(--text-main)]"
    onClick={onClick}
    aria-label={showPassword ? "Hide password" : "Show password"}
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

const validateLoginForm = (formData: LoginFormData): string | null => {
  if (!formData.email || !formData.password) {
    return 'Please fill in all fields.';
  }

  if (!EMAIL_REGEX.test(formData.email)) {
    return 'Please enter a valid email address.';
  }

  return null;
};

export const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const validationError = validateLoginForm(formData);
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    // TODO: Implement API call to POST /auth/login
    // Payload: { username: formData.email, password: formData.password } - Note: OAuth2PasswordRequestForm expects 'username', not 'email'
    // Response: { access_token: string, token_type: string }
    // Action: Store token in localStorage/cookie and redirect
    try {
      const data = await apiFetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      // Persist token to the correct storage bucket based on "Remember me"
      const storage = formData.rememberMe ? localStorage : sessionStorage;


      // Hydrate AuthContext with the full user object returned by the API
      auth.login(data.access_token, data.user, formData.rememberMe);

      if (data.user?.is_verified) {
        navigate('/dashboard');
      } else {
        // Pass email so Verification page can display it and call resend correctly
        navigate('/verify', { state: { email: formData.email } });
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const updateFormField = <K extends keyof LoginFormData>(
    field: K,
    value: LoginFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="card w-full max-w-md space-y-8 animate-scale-in">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Sign in to access your dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200 animate-fade-in" role="alert">
                {error}
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email" className="label">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input"
                placeholder="name@university.edu"
                value={formData.email}
                onChange={(e) => updateFormField('email', e.target.value)}
              />
            </div>

            <div className="input-group relative">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="label">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:text-[var(--primary-hover)]">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="input pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateFormField('password', e.target.value)}
                />
                <PasswordToggleButton 
                  showPassword={showPassword} 
                  onClick={() => setShowPassword(!showPassword)} 
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--border)] text-primary focus:ring-[var(--ring)]"
                checked={formData.rememberMe}
                onChange={(e) => updateFormField('rememberMe', e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--text-main)]">
                Remember me
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-primary w-full py-2.5 text-sm font-semibold shadow-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>

          <p className="text-center text-sm text-[var(--text-muted)]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-[var(--primary-hover)] transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};