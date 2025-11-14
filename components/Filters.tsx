'use client';

import { useState } from 'react';

interface FiltersProps {
  onSearch: (filters: any) => void;
  loading: boolean;
}

export default function Filters({ onSearch, loading }: FiltersProps) {
  const [filters, setFilters] = useState({
    country: '',
    area: '',
    min_price: '',
    max_price: '',
    min_rooms: '',
    max_rooms: '',
    min_size: '',
    max_size: '',
    sort: 'score_desc',
    page: 1,
    per_page: 20
  });

  const handleInputChange = (key: string, value: string) => {
    // Validate numeric inputs
    if (['min_price', 'max_price', 'min_rooms', 'max_rooms', 'min_size', 'max_size'].includes(key)) {
      if (value !== '' && !/^\d+$/.test(value)) {
        return; // Only allow numbers
      }
    }
    
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Search Properties</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Country"
          value={filters.country}
          onChange={(e) => handleInputChange('country', e.target.value)}
          onKeyPress={handleKeyPress}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <input
          type="text"
          placeholder="Area"
          value={filters.area}
          onChange={(e) => handleInputChange('area', e.target.value)}
          onKeyPress={handleKeyPress}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <input
          type="text"
          placeholder="Min Price"
          value={filters.min_price}
          onChange={(e) => handleInputChange('min_price', e.target.value)}
          onKeyPress={handleKeyPress}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <input
          type="text"
          placeholder="Max Price"
          value={filters.max_price}
          onChange={(e) => handleInputChange('max_price', e.target.value)}
          onKeyPress={handleKeyPress}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <input
          type="text"
          placeholder="Min Rooms"
          value={filters.min_rooms}
          onChange={(e) => handleInputChange('min_rooms', e.target.value)}
          onKeyPress={handleKeyPress}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <input
          type="text"
          placeholder="Max Rooms"
          value={filters.max_rooms}
          onChange={(e) => handleInputChange('max_rooms', e.target.value)}
          onKeyPress={handleKeyPress}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <input
          type="text"
          placeholder="Min Size (m²)"
          value={filters.min_size}
          onChange={(e) => handleInputChange('min_size', e.target.value)}
          onKeyPress={handleKeyPress}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <input
          type="text"
          placeholder="Max Size (m²)"
          value={filters.max_size}
          onChange={(e) => handleInputChange('max_size', e.target.value)}
          onKeyPress={handleKeyPress}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex gap-4 items-center">
        <select
          value={filters.sort}
          onChange={(e) => handleInputChange('sort', e.target.value)}
          className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="score_desc">Best Match</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="size_asc">Size ↑</option>
          <option value="size_desc">Size ↓</option>
        </select>
        
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </div>
  );
}



