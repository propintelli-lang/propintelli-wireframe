'use client';

import { useState } from 'react';
import { fetchProperties } from '../lib/api';

const COUNTRY_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Germany", value: "DE" },
  { label: "Austria", value: "AT" },
  { label: "Switzerland", value: "CH" },
  { label: "France", value: "FR" },
  { label: "Spain", value: "ES" },
  { label: "Italy", value: "IT" },
  { label: "Portugal", value: "PT" },
  { label: "Netherlands", value: "NL" },
];

const PRICE_OPTIONS = [
  { label: "Any", min: "", max: "" },
  { label: "≤ €250k", min: "", max: 250000 },
  { label: "€250k–€500k", min: 250000, max: 500000 },
  { label: "€500k–€1M", min: 500000, max: 1000000 },
  { label: "≥ €1M", min: 1000000, max: "" },
];

const TYPE_OPTIONS = [
  { label: "Any", value: "" },
  { label: "For Sale", value: "sale" },
  { label: "For Rent", value: "rent" },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
];

export default function Home() {
  const [area, setArea] = useState("");
  const [country, setCountry] = useState("");
  const [priceIdx, setPriceIdx] = useState(0);
  const [type, setType] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const per_page = 20;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doSearch = async (nextPage?: number) => {
    setLoading(true); 
    setError(null);
    try {
      const price = PRICE_OPTIONS[priceIdx];
      const resp = await fetchProperties({
        country,
        area,
        type: type || undefined,
        min_price: price.min || undefined,
        max_price: price.max || undefined,
        page: nextPage ?? page,
        per_page,
        sort: "score_desc",
      });
      setResults(resp.data || []);
      setPagination(resp.pagination || null);
      setPage(nextPage ?? page);
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const canPrev = page > 1;
  const totalPages = pagination ? Math.ceil((pagination.total || 0) / (pagination.per_page || per_page)) : 0;
  const canNext = pagination ? page < totalPages : false;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/Logo.png" alt="PropIntelli" className="h-12 w-auto" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">PropIntelli</h1>
            </div>
            <div className="text-sm text-gray-500">
              Connected to: {process.env.NEXT_PUBLIC_API_BASE_URL || 'API not configured'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Property
          </h2>
          <p className="text-gray-600">
            Search through our comprehensive property database with advanced filtering options.
          </p>
        </div>

        {/* Search Form - Using your existing UI elements */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid gap-4 md:grid-cols-4 mb-4">
            {/* 1) Where do you want to live? (area) */}
            <input
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Where do you want to live?"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />

            {/* 2) Location (country dropdown) */}
            <select
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {COUNTRY_OPTIONS.map(o => (
                <option key={o.label} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* 3) Price (dropdown mapped to min/max) */}
            <select
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={priceIdx}
              onChange={(e) => setPriceIdx(Number(e.target.value))}
            >
              {PRICE_OPTIONS.map((o, i) => (
                <option key={o.label} value={i}>{o.label}</option>
              ))}
            </select>

            {/* 4) Type (dropdown) */}
            <select
              className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {TYPE_OPTIONS.map(o => (
                <option key={o.label} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            onClick={() => doSearch(1)}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Start Your Search'}
          </button>
        </div>

        {/* States */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading properties...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 font-semibold mb-2">Error loading properties</div>
            <div className="text-red-500 text-sm">{error}</div>
          </div>
        )}
        
        {!loading && !error && results.length === 0 && pagination && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <div className="text-gray-600 text-lg mb-2">No properties found</div>
            <div className="text-gray-500">Try adjusting your search criteria</div>
          </div>
        )}

        {/* Results */}
        <div className="grid gap-4 mb-6">
          {results.map((r: any) => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {r.title ?? "Property Listing"}
                </h3>
                {r?.links?.primary_listing && (
                  <a
                    href={r.links.primary_listing}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                  >
                    View listing
                  </a>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Price:</span>
                  <div className="font-semibold text-green-600">
                    {r.price ? new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(r.price) : '—'}
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-500">Area:</span>
                  <div className="font-medium">{r.area ?? "—"}</div>
                </div>
                
                <div>
                  <span className="text-gray-500">Rooms:</span>
                  <div className="font-medium">{r.rooms ?? "—"}</div>
                </div>
                
                <div>
                  <span className="text-gray-500">Size:</span>
                  <div className="font-medium">{r.size_sqm ? `${r.size_sqm} m²` : "—"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex justify-center items-center gap-4">
            <button
              disabled={!canPrev}
              onClick={() => doSearch(page - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-gray-600">
              Page {page} {totalPages ? `of ${totalPages}` : ""}
            </span>
            
            <button
              disabled={!canNext}
              onClick={() => doSearch(page + 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
        
        {pagination && (
          <div className="text-center text-gray-500 text-sm mt-4">
            Showing {results.length} of {pagination.total} properties
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>© 2025 PropIntelli - Property Intelligence Platform</p>
            <p className="text-sm mt-2">
              API Base URL: {process.env.NEXT_PUBLIC_API_BASE_URL || 'Not configured'}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
