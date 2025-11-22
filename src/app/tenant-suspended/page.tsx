import Link from 'next/link';

export default function TenantSuspended() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center p-8">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Suspended</h1>
        <p className="text-gray-600 mb-6">
          This account has been temporarily suspended. Please contact support for assistance.
        </p>
        <Link 
          href="mailto:support@yourcompany.com"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
