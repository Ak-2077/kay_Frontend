'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleWindow = Window & {
  google?: {
    accounts?: {
      id?: {
        initialize: (config: Record<string, unknown>) => void;
        renderButton: (container: HTMLElement, options: Record<string, unknown>) => void;
      };
    };
  };
};

export function AuthModal({ onClose }: AuthModalProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<'initial' | 'login' | 'register'>('initial');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (step !== 'initial') {
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !googleButtonRef.current) {
      return;
    }

    const google = (window as GoogleWindow).google;
    if (!google?.accounts?.id) {
      return;
    }

    google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: GoogleCredentialResponse) => {
        try {
          setLoading(true);
          setError('');

          if (!response?.credential) {
            setError('Google login failed. Please try again.');
            return;
          }

          const res = await authAPI.googleLogin({ credential: response.credential });

          if (res?.token) {
            login(res.token, res.user);
            onClose();
            router.push('/profile');
            return;
          }

          setError(res?.message || 'Google login failed.');
        } catch (err: any) {
          setError(err?.message || 'Google login failed.');
        } finally {
          setLoading(false);
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    googleButtonRef.current.innerHTML = '';
    google.accounts.id.renderButton(googleButtonRef.current, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      width: 320,
    });
  }, [step, login, onClose, router]);

  const handleContinue = () => {
    if (!email.trim()) {
      setError('Please enter your email or username');
      return;
    }
    setError('');
    setStep('login'); // For now, go to login. You can add logic to check if user exists
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const res = await authAPI.login({ email, password });

      if (res.token) {
        login(res.token, res.user);
        onClose();
        router.push('/profile');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const res = await authAPI.register({ name, email, password });

      if (res.token) {
        login(res.token, res.user);
        onClose();
        router.push('/profile');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-gray-300 bg-white p-5 shadow-xl md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-2xl text-gray-600 transition hover:text-black"
          aria-label="Close"
        >
          ✕
        </button>

        {step === 'initial' && (
          <>
            <h1 className="mb-4 text-2xl font-medium text-black">Login or Register</h1>

            {error && (
              <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="mb-2 block text-sm font-light text-black">
                Email or Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or username here"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
              />
            </div>

            <button
              onClick={handleContinue}
              className="mb-4 w-full rounded-full bg-black py-2.5 text-sm font-normal uppercase tracking-wide text-white transition hover:bg-gray-800"
            >
              Continue
            </button>

            <div className="relative mb-4 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm font-medium text-gray-600">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="flex w-full justify-center">
              <div ref={googleButtonRef} />
            </div>
          </>
        )}

        {step === 'login' && (
          <>
            <h1 className="mb-4 text-2xl font-medium text-black">Login</h1>

            {error && (
              <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-light text-black">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-light text-black">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mb-3 w-full rounded-full bg-black py-2.5 text-sm font-normal uppercase tracking-wide text-white transition hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Login'}
              </button>

              <button
                type="button"
                onClick={() => setStep('register')}
                className="w-full text-center text-sm text-gray-600 hover:text-black"
              >
                Don't have an account? Register
              </button>
            </form>
          </>
        )}

        {step === 'register' && (
          <>
            <h1 className="mb-4 text-2xl font-medium text-black">Register</h1>

            {error && (
              <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-light text-black">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-light text-black">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-light text-black">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mb-3 w-full rounded-full bg-black py-2.5 text-sm font-normal uppercase tracking-wide text-white transition hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Register'}
              </button>

              <button
                type="button"
                onClick={() => setStep('login')}
                className="w-full text-center text-sm text-gray-600 hover:text-black"
              >
                Already have an account? Login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
