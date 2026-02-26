'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/utils/api';

export default function AccountDetailsPage() {
  const { user, token, updateUser, logout } = useAuth();
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedToken = localStorage.getItem('token');
    if (!token && !storedToken) {
      router.push('/login');
      return;
    }

    setAuthReady(true);
  }, [token, router]);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [authReady, user]);

  if (!authReady) {
    return (
      <main className="min-h-screen bg-white px-4 py-12 text-black">
        <div className="mx-auto max-w-4xl text-sm text-gray-700">Loading account details...</div>
      </main>
    );
  }

  const handleUpdateProfile = async () => {
    if (!token) {
      setProfileMessage('Please login again.');
      return;
    }

    setIsUpdatingProfile(true);
    setProfileMessage('');

    try {
      const response = await authAPI.updateProfile(token, { name, email });

      if (response?.user) {
        updateUser(response.user);
        setProfileMessage(response?.message || 'Profile updated successfully.');
      } else {
        setProfileMessage(response?.message || 'Unable to update profile.');
      }
    } catch {
      setProfileMessage('Unable to update profile. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!token) {
      setPasswordMessage('Please login again.');
      return;
    }

    if (!currentPassword || !newPassword) {
      setPasswordMessage('Please fill both password fields.');
      return;
    }

    setIsChangingPassword(true);
    setPasswordMessage('');

    try {
      const response = await authAPI.changePassword(token, { currentPassword, newPassword });
      setPasswordMessage(response?.message || 'Password updated.');

      if (response?.message === 'Password changed successfully.') {
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch {
      setPasswordMessage('Unable to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!token) {
      setDeleteMessage('Please login again.');
      return;
    }

    const isConfirmed = window.confirm('Are you sure you want to delete your account? This cannot be undone.');
    if (!isConfirmed) {
      return;
    }

    setIsDeletingAccount(true);
    setDeleteMessage('');

    try {
      const response = await authAPI.deleteAccount(token);

      if (response?.message === 'Account deleted successfully.') {
        logout();
        router.push('/');
        return;
      }

      setDeleteMessage(response?.message || 'Unable to delete account.');
    } catch {
      setDeleteMessage('Unable to delete account. Please try again.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="border-b border-gray-200 px-4 py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-light uppercase md:text-5xl">Account Details</h1>
          <p className="mt-3 text-sm font-light text-gray-700 md:text-base">
            Update your name, email, password, or permanently delete your account.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 md:py-12">
        <div className="mx-auto grid max-w-4xl gap-6">
          <div className="rounded-lg border border-gray-200 p-5 md:p-6">
            <h2 className="text-xl font-medium">Update Name & Email</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Name"
                className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>
            <button
              type="button"
              onClick={handleUpdateProfile}
              disabled={isUpdatingProfile}
              className="mt-4 border border-black px-5 py-2 text-sm font-light uppercase transition hover:bg-black hover:text-white"
            >
              {isUpdatingProfile ? 'Updating...' : 'Save Profile'}
            </button>
            {profileMessage ? <p className="mt-3 text-sm text-gray-700">{profileMessage}</p> : null}
          </div>

          <div className="rounded-lg border border-gray-200 p-5 md:p-6">
            <h2 className="text-xl font-medium">Change Password</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Current Password"
                className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="New Password"
                className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={isChangingPassword}
              className="mt-4 border border-black px-5 py-2 text-sm font-light uppercase transition hover:bg-black hover:text-white"
            >
              {isChangingPassword ? 'Updating...' : 'Change Password'}
            </button>
            {passwordMessage ? <p className="mt-3 text-sm text-gray-700">{passwordMessage}</p> : null}
          </div>

          <div className="rounded-lg border border-red-200 p-5 md:p-6">
            <h2 className="text-xl font-medium text-red-700">Delete Account</h2>
            <p className="mt-2 text-sm text-gray-700">
              This action is permanent and removes your account data.
            </p>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
              className="mt-4 border border-red-600 px-5 py-2 text-sm font-light uppercase text-red-700 transition hover:bg-red-600 hover:text-white"
            >
              {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
            </button>
            {deleteMessage ? <p className="mt-3 text-sm text-gray-700">{deleteMessage}</p> : null}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
