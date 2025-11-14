/**
 * Shared Data Utility
 * 
 * Provides functions to access and manage data shared across pages.
 * This utility uses AppDataManager (sessionStorage) if available, with localStorage fallback.
 * 
 * NOTE: For new implementations, use AppDataManager directly for better session management.
 * This file is maintained for backward compatibility.
 */

/**
 * Get the last API response stored from search.html
 * Uses AppDataManager (sessionStorage) if available, falls back to localStorage
 * @returns {Object|null} The API response object or null if not found
 */
function getLastApiResponse() {
	// Try AppDataManager first (sessionStorage)
	if (typeof AppDataManager !== 'undefined') {
		return AppDataManager.getApiResponse();
	}
	
	// Fallback to localStorage
	try {
		const responseStr = localStorage.getItem('lastApiResponse');
		if (!responseStr) {
			console.log('No cached API response found');
			return null;
		}
		const parsed = JSON.parse(responseStr);
		// Handle both direct storage and wrapped format
		return parsed.response || parsed;
	} catch (error) {
		console.error('Error retrieving last API response:', error);
		return null;
	}
}

/**
 * Get the last search parameters stored from search.html
 * Uses AppDataManager (sessionStorage) if available, falls back to localStorage
 * @returns {Object|null} Search parameters object with city, radius, lat, lon, timestamp or null if not found
 */
function getLastSearchParams() {
	// Try AppDataManager first (sessionStorage)
	if (typeof AppDataManager !== 'undefined') {
		return AppDataManager.getSearchParams();
	}
	
	// Fallback to localStorage
	try {
		const paramsStr = localStorage.getItem('lastSearchParams');
		if (!paramsStr) {
			console.log('No cached search parameters found');
			return null;
		}
		return JSON.parse(paramsStr);
	} catch (error) {
		console.error('Error retrieving last search parameters:', error);
		return null;
	}
}

/**
 * Get selected properties for comparison (stored when comparing entities)
 * Uses AppDataManager (sessionStorage) if available, falls back to localStorage
 * @returns {Array|null} Array of selected properties or null if not found
 */
function getSelectedProperties() {
	// Try AppDataManager first (sessionStorage)
	if (typeof AppDataManager !== 'undefined') {
		return AppDataManager.getSelectedProperties();
	}
	
	// Fallback to localStorage
	try {
		const propertiesStr = localStorage.getItem('selectedProperties');
		if (!propertiesStr) {
			console.log('No selected properties found');
			return null;
		}
		return JSON.parse(propertiesStr);
	} catch (error) {
		console.error('Error retrieving selected properties:', error);
		return null;
	}
}

/**
 * Store API response in localStorage for cross-page access
 * @param {Object} apiResponse - The API response object to store
 */
function storeApiResponse(apiResponse) {
	try {
		localStorage.setItem('lastApiResponse', JSON.stringify(apiResponse));
		console.log('API response stored in localStorage for cross-page access');
	} catch (error) {
		console.error('Error storing API response:', error);
	}
}

/**
 * Store search parameters in localStorage for cross-page access
 * @param {Object} params - Search parameters object with city, radius, lat, lon, etc.
 */
function storeSearchParams(params) {
	try {
		const searchParams = {
			...params,
			timestamp: new Date().toISOString()
		};
		localStorage.setItem('lastSearchParams', JSON.stringify(searchParams));
		console.log('Search parameters stored in localStorage:', searchParams);
	} catch (error) {
		console.error('Error storing search parameters:', error);
	}
}

/**
 * Get specific data from the last API response
 * @param {string} dataPath - Path to the data (e.g., 'data.properties', 'data.secc_stats.rows')
 * @returns {*} The data at the specified path or null if not found
 */
function getApiData(dataPath) {
	try {
		const response = getLastApiResponse();
		if (!response) return null;
		
		const parts = dataPath.split('.');
		let data = response;
		
		for (const part of parts) {
			if (data && typeof data === 'object' && part in data) {
				data = data[part];
			} else {
				return null;
			}
		}
		
		return data;
	} catch (error) {
		console.error('Error getting API data:', error);
		return null;
	}
}

/**
 * Check if there is cached data available
 * @returns {boolean} True if cached data exists, false otherwise
 */
function hasCachedData() {
	const response = getLastApiResponse();
	const params = getLastSearchParams();
	return response !== null || params !== null;
}

/**
 * Clear all cached shared data
 */
function clearSharedData() {
	try {
		localStorage.removeItem('lastApiResponse');
		localStorage.removeItem('lastSearchParams');
		localStorage.removeItem('selectedProperties');
		console.log('Shared data cleared from localStorage');
	} catch (error) {
		console.error('Error clearing shared data:', error);
	}
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		getLastApiResponse,
		getLastSearchParams,
		getSelectedProperties,
		storeApiResponse,
		storeSearchParams,
		getApiData,
		hasCachedData,
		clearSharedData
	};
}
