'use client';

import Link from 'next/link';

export default function AnalyticsPage() {
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
              <Link href="/insights" className="text-gray-700 hover:text-blue-600 font-medium">Neighborhood Insights</Link>
              <Link href="/analytics" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">Analytics</Link>
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
            Analytics Tools
          </h2>
          <p className="text-gray-600">
            Price trends, ROI estimates, and comprehensive market analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Price per m²</h3>
            <p className="text-gray-600 text-sm mb-4">Average property prices</p>
            <div className="text-2xl font-bold text-blue-600">-</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Historical Trends</h3>
            <p className="text-gray-600 text-sm mb-4">Price changes over time</p>
            <div className="text-2xl font-bold text-blue-600">-</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">ROI Estimator</h3>
            <p className="text-gray-600 text-sm mb-4">Return on investment</p>
            <div className="text-2xl font-bold text-blue-600">-</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Market Analysis</h3>
          <p className="text-gray-600">
            Select a location to view detailed analytics and market trends.
          </p>
        </div>
      </div>
    </main>
  );
}

