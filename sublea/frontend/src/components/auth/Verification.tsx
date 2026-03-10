import { useState, useEffect, useRef, ClipboardEvent, KeyboardEvent, MutableRefObject } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

type VerificationStatus = 'idle' | 'loading' | 'success' | 'error';

interface VerificationCodeInputProps {
  code: string[];
  status: VerificationStatus;
  inputRefs: MutableRefObject<(HTMLInputElement | null)[]>;
  onCodeChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: ClipboardEvent<HTMLInputElement>) => void;
}

interface SuccessOverlayProps {
  show: boolean;
}

interface ResendButtonProps {
  timer: number;
  status: VerificationStatus;
  onClick: () => void;
}

interface VerifyButtonProps {
  code: string[];
  status: VerificationStatus;
  onClick: () => void;
}

const CODE_LENGTH = 6;
const INITIAL_TIMER = 60;

const SuccessOverlay = ({ show }: SuccessOverlayProps) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 z-20 flex flex-col items-center justify-center animate-fade-in backdrop-blur-sm">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-green-600 animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-[var(--text-main)]">Verified!</h3>
      <p className="text-[var(--text-muted)]">Redirecting you to dashboard...</p>
    </div>
  );
};

const VerificationCodeInput = ({ 
  code, 
  status, 
  inputRefs, 
  onCodeChange, 
  onKeyDown, 
  onPaste 
}: VerificationCodeInputProps) => (
  <div className="flex justify-center gap-2 sm:gap-3">
    {code.map((digit, index) => (
      <input
        key={index}
        ref={(el) => { inputRefs.current[index] = el; }}
        type="text"
        maxLength={1}
        value={digit}
        autoComplete="one-time-code"
        className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-lg border 
          ${status === 'error' ? 'border-red-500 bg-red-50 text-red-900' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-main)]'}
          focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all`}
        onChange={(e) => onCodeChange(index, e.target.value)}
        onKeyDown={(e) => onKeyDown(index, e)}
        onPaste={onPaste}
        disabled={status === 'loading' || status === 'success'}
      />
    ))}
  </div>
);

const ResendButton = ({ timer, status, onClick }: ResendButtonProps) => (
  <button
    onClick={onClick}
    disabled={timer > 0 || status === 'loading' || status === 'success'}
    className={`text-sm font-medium transition-colors ${
      timer > 0 
        ? 'text-[var(--text-muted)] cursor-not-allowed' 
        : 'text-[var(--primary)] hover:text-[var(--primary-hover)] cursor-pointer'
    }`}
  >
    {timer > 0 ? `Resend code in ${timer}s` : "Resend code"}
  </button>
);

const VerifyButton = ({ code, status, onClick }: VerifyButtonProps) => {
  const isDisabled = code.some(d => !d) || status === 'loading' || status === 'success';

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className="btn btn-primary w-full py-3 text-sm font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {status === 'loading' ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verifying...
        </span>
      ) : (
        'Verify Email'
      )}
    </button>
  );
};

const useCountdownTimer = (initialValue: number) => {
  const [timer, setTimer] = useState(initialValue);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = window.setInterval(() => {
      setTimer(t => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  return [timer, setTimer] as const;
};

export const Verification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const email = location.state?.email || 'student@university.edu';
  
  const [code, setCode] = useState<string[]>(new Array(CODE_LENGTH).fill(''));
  const [timer, setTimer] = useCountdownTimer(INITIAL_TIMER);
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const verifyCode = async (verificationCode: string) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      await apiFetch('/api/verify', {
        method: 'POST',
        body: JSON.stringify({ email, code: verificationCode })
      });
      // Hydrate AuthContext so protected routes immediately see the verified user
      await fetchUser();
      setStatus('success');
      navigate('/dashboard');
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Incorrect verification code. Please try again.'
      );
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);
    
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }

    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newCode.join('');
    if (fullCode.length === CODE_LENGTH && newCode.every(digit => digit !== '')) {
      verifyCode(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH).split('');
    
    if (pastedData.length === 0) return;

    const newCode = [...code];
    pastedData.forEach((digit, i) => {
      newCode[i] = digit;
    });
    setCode(newCode);
    
    const nextIndex = Math.min(pastedData.length, CODE_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();

    if (newCode.join('').length === CODE_LENGTH) {
      verifyCode(newCode.join(''));
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    setTimer(INITIAL_TIMER);
    setStatus('idle');
    setErrorMessage('');
    setCode(new Array(CODE_LENGTH).fill(''));
    inputRefs.current[0]?.focus();

    try {
      await apiFetch('/api/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to resend code. Please try again.'
      );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>

      <div className={`card w-full max-w-md space-y-8 animate-scale-in relative overflow-hidden ${status === 'error' ? 'animate-shake' : ''}`}>
        
        <SuccessOverlay show={status === 'success'} />

        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-[var(--surface)] mb-4 border border-[var(--border)]">
            <svg className="h-6 w-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            We sent a verification code to <span className="font-semibold text-[var(--text-main)]">{email}</span>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <VerificationCodeInput
            code={code}
            status={status}
            inputRefs={inputRefs}
            onCodeChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />

          {errorMessage && (
            <p className="text-center text-sm text-red-600 font-medium animate-fade-in">
              {errorMessage}
            </p>
          )}

          <div className="text-center">
            <ResendButton timer={timer} status={status} onClick={handleResend} />
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Code expires in 10 minutes
            </p>
          </div>

          <VerifyButton 
            code={code} 
            status={status} 
            onClick={() => verifyCode(code.join(''))} 
          />
          
          <div className="text-center">
            <Link to="/login" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)]">
              &larr; Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};