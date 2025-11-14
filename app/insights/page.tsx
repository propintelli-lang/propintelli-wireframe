'use client';

import Link from 'next/link';

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/home">
                <img src="/Logo.png" alt="PropIntelli" className="h-12 w-auto" />
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/home" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Properties</Link>
              <Link href="/insights" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">Neighborhood Insights</Link>
              <Link href="/analytics" className="text-gray-700 hover:text-blue-600 font-medium">Analytics</Link>
              <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium">About Us</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/onboarding" className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">Get Started</Link>
              <Link href="/auth" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Login / Register</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Neighborhood Insights
          </h2>
          <p className="text-gray-600">
            Analyze crime rates, demographics, infrastructure, and more for any neighborhood.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Location
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="City, Neighborhood, or Zip Code"
                className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Analyze
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Safety Score</h3>
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-green-600 mb-2">8.5</div>
              <p className="text-gray-600">Out of 10</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Demographics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Population:</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Age:</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Education Level:</span>
                <span className="font-medium">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

