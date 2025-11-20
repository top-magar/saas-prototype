'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function NewTenantPage() {
  const router = useRouter();
  useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [isCheckingSubdomain, setIsCheckingSubdomain] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);

  const checkSubdomainAvailability = useCallback(async (subdomainValue: string) => {
    if (!subdomainValue || subdomainValue.length < 3) {
      setSubdomainAvailable(null);
      return;
    }

    setIsCheckingSubdomain(true);
    try {
      const response = await fetch(`/api/tenants/check-subdomain?subdomain=${encodeURIComponent(subdomainValue)}`);
      const data = await response.json();
      setSubdomainAvailable(data.available);
    } catch (error) {
      console.error('Error checking subdomain:', error);
      setSubdomainAvailable(null);
    } finally {
      setIsCheckingSubdomain(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkSubdomainAvailability(subdomain);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [subdomain, checkSubdomainAvailability]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      subdomain: formData.get('subdomain'),
      primaryColor: formData.get('primaryColor') || '#3B82F6',
    };

    try {
      const response = await fetch('/api/tenants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create tenant');
      }

      const result = await response.json();
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Create your workspace
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Set up your organization&apos;s dedicated workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Organization name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">
                Subdomain
              </label>
              <div className="mt-1">
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="subdomain"
                    id="subdomain"
                    required
                    pattern="[a-z0-9-]+"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                    className={`block w-full min-w-0 flex-1 rounded-none rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 sm:text-sm ${
                      subdomainAvailable === false
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : subdomainAvailable === true
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    placeholder="your-company"
                  />
                  <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    .saas.dev
                  </span>
                </div>
              </div>
              <div className="mt-2 text-sm">
                {isCheckingSubdomain && (
                  <p className="text-gray-500">Checking availability...</p>
                )}
                {!isCheckingSubdomain && subdomainAvailable === true && (
                  <p className="text-green-600">✓ Subdomain is available</p>
                )}
                {!isCheckingSubdomain && subdomainAvailable === false && (
                  <p className="text-red-600">✗ This subdomain is already taken</p>
                )}
                {subdomainAvailable === null && (
                  <p className="text-gray-500">
                    Only lowercase letters, numbers, and hyphens are allowed
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                Brand color
              </label>
              <div className="mt-1">
                <input
                  type="color"
                  name="primaryColor"
                  id="primaryColor"
                  defaultValue="#3B82F6"
                  className="h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading || subdomainAvailable === false || isCheckingSubdomain}
                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create workspace'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}