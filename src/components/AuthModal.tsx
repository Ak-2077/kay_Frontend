'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

type GoogleCredentialResponse = {
  credential?: string;
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

  const handleGoogleLogin = async () => {
    if (loading) return;

    setError('');

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google login is not configured. Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID.');
      return;
    }

    const google = (window as Window & { google?: any }).google;
    if (!google?.accounts?.id) {
      setError('Google login SDK not loaded yet. Please try again.');
      return;
    }

    setLoading(true);

    google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: GoogleCredentialResponse) => {
        try {
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

    google.accounts.id.prompt((notification: any) => {
      if (notification?.isNotDisplayed?.() || notification?.isSkippedMoment?.()) {
        setLoading(false);
        setError('Google popup was not opened. Please allow popups and try again.');
      }
    });
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

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 py-2.5 text-sm font-normal text-black transition hover:bg-gray-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? 'Loading...' : 'Login with Google'}
            </button>
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
