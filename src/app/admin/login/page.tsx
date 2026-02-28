'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/utils/api';

const ADMIN_TOKEN_KEY = 'admin_token';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await adminAPI.login({ username, password });

      if (response?.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, response.token);
        router.push('/admin');
        return;
      }

      setError(response?.message || 'Admin login failed.');
    } catch {
      setError('Unable to login right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <h1 className="text-2xl font-medium text-black md:text-3xl">Admin Login</h1>
        <p className="mt-2 text-sm text-black/70">Use your admin username and password to continue.</p>

        {error && <p className="mt-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Admin username"
            className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm outline-none"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Admin password"
            className="w-full rounded-lg border border-black/20 px-3 py-2.5 text-sm outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-5 py-3 text-sm font-medium uppercase text-white transition hover:bg-black/85 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}
