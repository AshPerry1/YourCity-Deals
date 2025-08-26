'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface QuickSignupProps {
  identifier: string;
  verificationType: 'phone' | 'email';
  code: string;
  loading: boolean;
  error: string | null;
  onSendCode: () => void;
  onCodeChange: (code: string) => void;
  onIdentifierChange: (identifier: string) => void;
  onTypeChange: (type: 'phone' | 'email') => void;
}

export default function QuickSignup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('return') || '/student/dashboard';
  const referralCode = searchParams.get('ref');
  const bookId = searchParams.get('book');

  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [identifier, setIdentifier] = useState('');
  const [verificationType, setVerificationType] = useState<'phone' | 'email'>('phone');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    if (!identifier) {
      setError('Please enter your phone number or email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [verificationType]: identifier,
          verificationType,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(data.message);
        setStep('verify');
        setCountdown(60); // 60 second cooldown
      }
    } catch (err) {
      setError('Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          code,
          verificationType,
          referralCode,
          returnUrl,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Store session token
        localStorage.setItem('sessionToken', data.sessionToken);
        localStorage.setItem('userId', data.userId);

        // Redirect based on context
        if (bookId) {
          router.push(`/purchase?book=${bookId}&ref=${referralCode || ''}`);
        } else {
          router.push(returnUrl);
        }
      }
    } catch (err) {
      setError('Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    if (countdown === 0) {
      handleSendCode();
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handleIdentifierChange = (value: string) => {
    if (verificationType === 'phone') {
      setIdentifier(formatPhoneNumber(value));
    } else {
      setIdentifier(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quick Signup</h1>
          <p className="text-gray-600">
            {step === 'input' 
              ? 'Enter your phone or email to get started'
              : 'Enter the verification code we sent you'
            }
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          {step === 'input' ? (
            <>
              {/* Verification Type Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setVerificationType('phone')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    verificationType === 'phone'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📱 Phone
                </button>
                <button
                  onClick={() => setVerificationType('email')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    verificationType === 'email'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ✉️ Email
                </button>
              </div>

              {/* Identifier Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {verificationType === 'phone' ? 'Phone Number' : 'Email Address'}
                </label>
                <input
                  type={verificationType === 'phone' ? 'tel' : 'email'}
                  value={identifier}
                  onChange={(e) => handleIdentifierChange(e.target.value)}
                  placeholder={verificationType === 'phone' ? '(555) 123-4567' : 'you@example.com'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  maxLength={verificationType === 'phone' ? 14 : 50}
                />
              </div>

              {/* Send Code Button */}
              <button
                onClick={handleSendCode}
                disabled={loading || !identifier}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </>
          ) : (
            <>
              {/* Verification Code Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="text-center">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-48 text-center text-2xl font-mono px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent tracking-widest"
                    maxLength={6}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  We sent a 6-digit code to {identifier}
                </p>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyCode}
                disabled={loading || code.length !== 6}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </button>

              {/* Resend Code */}
              <div className="text-center">
                <button
                  onClick={handleResendCode}
                  disabled={countdown > 0}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {countdown > 0 
                    ? `Resend code in ${countdown}s` 
                    : 'Resend verification code'
                  }
                </button>
              </div>

              {/* Back Button */}
              <button
                onClick={() => {
                  setStep('input');
                  setCode('');
                  setError(null);
                  setSuccess(null);
                }}
                className="w-full mt-4 text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                ← Back to phone/email input
              </button>
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Development Notice */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-sm">
              <strong>Development Mode:</strong> Check the console for verification codes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
