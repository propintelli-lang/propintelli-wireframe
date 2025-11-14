'use client';

interface Property {
  id: string;
  title?: string;
  price?: string | number;
  area?: string;
  rooms?: string | number;
  size_sqm?: string | number;
  links?: {
    primary_listing?: string;
  };
  [key: string]: any;
}

interface ResultsProps {
  data: Property[];
  pagination: any;
  loading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
}

export default function Results({ data, pagination, loading, error, onPageChange }: ResultsProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading properties...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 font-semibold mb-2">Error loading properties</div>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <div className="text-gray-600 text-lg mb-2">No properties found</div>
        <div className="text-gray-500">Try adjusting your search criteria</div>
      </div>
    );
  }

  const formatPrice = (price: string | number | undefined) => {
    if (!price) return '—';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatSize = (size: string | number | undefined) => {
    if (!size) return '—';
    return `${size} m²`;
  };

  return (
    <div>
      {/* Results Grid */}
      <div className="grid gap-4 mb-6">
        {data.map((property) => (
          <div key={property.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {property.title || 'Property Listing'}
              </h3>
              {property.links?.primary_listing && (
                <a
                  href={property.links.primary_listing}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                >
                  View Original
                </a>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Price:</span>
                <div className="font-semibold text-green-600">
                  {formatPrice(property.price)}
                </div>
              </div>
              
              <div>
                <span className="text-gray-500">Area:</span>
                <div className="font-medium">{property.area || '—'}</div>
              </div>
              
              <div>
                <span className="text-gray-500">Rooms:</span>
                <div className="font-medium">{property.rooms || '—'}</div>
              </div>
              
              <div>
                <span className="text-gray-500">Size:</span>
                <div className="font-medium">{formatSize(property.size_sqm)}</div>
              </div>
            </div>
            
            {/* Additional details if available */}
            {(property.description || property.features) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                {property.description && (
                  <div className="text-sm text-gray-600 mb-2">
                    {property.description}
                  </div>
                )}
                {property.features && (
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(property.features) ? property.features.map((feature, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {feature}
                      </span>
                    )) : (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {property.features}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.total > pagination.per_page && (
        <div className="flex justify-center items-center gap-4">
          <button
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-gray-600">
            Page {pagination.page || 1} of {Math.ceil(pagination.total / (pagination.per_page || 20))}
          </span>
          
          <button
            disabled={(pagination.page || 1) >= Math.ceil(pagination.total / (pagination.per_page || 20))}
            onClick={() => onPageChange((pagination.page || 1) + 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
      
      {pagination && (
        <div className="text-center text-gray-500 text-sm mt-4">
          Showing {data.length} of {pagination.total} properties
        </div>
      )}
    </div>
  );
}



