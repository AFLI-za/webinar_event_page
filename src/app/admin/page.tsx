'use client';

import { useState } from 'react';
import { Registration } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setRegistrations(data.registrations);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="event-container">
        <div className="event-card">
          <div className="event-header">
            <div className="event-header-accent"></div>
            <div className="event-logo-container">
              <Image
                src="/afli-logo.svg"
                alt="AFLI Logo"
                width={180}
                height={60}
                className="mb-4"
              />
            </div>
            <h1 className="text-5xl font-bold mb-2">DIALOGUE FOR ACTION:</h1>
            <h1 className="text-5xl font-bold">REFLECTIONS ON THE AFRICA JOBS SCENARIOS REPORT</h1>
            <div className="text-8xl font-bold tracking-wider opacity-80 mt-4">2024</div>
            <div className="text-xl font-medium mt-2">MAY 20</div>
            <div className="event-logo">
              African Leadership Institute
            </div>
          </div>
        </div>

        <div className="form-container">
          <h2 className="form-title">Admin Login</h2>

          {error && (
            <div className="form-error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="form-submit"
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-[var(--brand-primary)] hover:underline"
            >
              Back to Home
            </Link>
          </div>
        </div>

        <footer className="mt-8 text-center">
          <div className="mt-4 text-sm text-[var(--neutral-mid)]">
            © 2025 AFLI. All rights reserved.
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="event-container">
      <div className="event-card">
        <div className="event-header">
          <div className="event-header-accent"></div>
          <div className="event-logo-container">
            <Image
              src="/afli-logo.svg"
              alt="AFLI Logo"
              width={180}
              height={60}
              className="mb-4"
            />
          </div>
          <h1 className="text-5xl font-bold mb-2">Admin Panel</h1>
          <h1 className="text-5xl font-bold">REFLECTIONS ON THE AFRICA JOBS SCENARIOS REPORT</h1>
          <div className="text-8xl font-bold tracking-wider opacity-80 mt-4">2024</div>
          <div className="text-xl font-medium mt-2">MAY 20</div>
        </div>
      </div>

      <div className="form-container">
        <div className="flex justify-between items-center mb-6">
          <h2 className="form-title mb-0">Registrations</h2>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-[var(--neutral-gray)] hover:bg-[var(--brand-light)] rounded-md transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="event-stats mb-4">
          Total Registrations: {registrations.length}
        </div>

        {registrations.length === 0 ? (
          <div className="text-center p-8 bg-[var(--neutral-gray)] rounded-lg">
            <p>No registrations found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-[var(--neutral-light)] shadow-md rounded-lg overflow-hidden">
              <thead className="bg-[var(--brand-accent)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-primary)] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-primary)] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-primary)] uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-primary)] uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-primary)] uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--brand-primary)] uppercase tracking-wider">
                    Registration Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--neutral-gray)]">
                {registrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-[var(--neutral-gray)] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {registration.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {registration.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {registration.organization}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {registration.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {registration.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(registration.created_at || '').toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-[var(--brand-primary)] hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>

      <footer className="mt-8 text-center">
        <div className="mt-4 text-sm text-[var(--neutral-mid)]">
          © 2024 African Leadership Institute. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
