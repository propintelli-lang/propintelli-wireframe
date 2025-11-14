'use client';

import Link from 'next/link';

export default function HomePage() {
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
              <Link href="/home" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">Home</Link>
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Properties</Link>
              <Link href="/insights" className="text-gray-700 hover:text-blue-600 font-medium">Neighborhood Insights</Link>
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Analyze neighborhoods before you buy
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Make smarter decisions with data-driven insights.
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Province, City or Zip Code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                  <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900">
                    <option value="">Location</option>
                    <option value="DE">Germany</option>
                    <option value="AT">Austria</option>
                    <option value="CH">Switzerland</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="IT">Italy</option>
                    <option value="PT">Portugal</option>
                    <option value="NL">Netherlands</option>
                  </select>
                  <Link
                    href="/"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
                  >
                    Search Properties
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why PropIntelli?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get comprehensive property insights to make informed decisions
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Neighborhood Insights</h3>
              <p className="text-gray-600">Analyze crime rates, demographics, and infrastructure</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics Tools</h3>
              <p className="text-gray-600">Price trends, ROI estimates, and market analysis</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Property Search</h3>
              <p className="text-gray-600">Find properties with advanced filtering options</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

