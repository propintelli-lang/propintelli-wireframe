/**
 * AppDataManager - Centralized Data Management Service
 * 
 * Manages temporary data storage across pages using sessionStorage.
 * Data persists during the browsing session and is cleared when the browser closes.
 * Perfect for API responses, search parameters, and user selections.
 * 
 * Usage:
 *   AppDataManager.storeApiResponse(data);
 *   const response = AppDataManager.getApiResponse();
 *   const params = AppDataManager.getSearchParams();
 */

class AppDataManager {
	// Storage keys - using a prefix to avoid conflicts
	static STORAGE_PREFIX = 'propintelli_';
	static KEYS = {
		API_RESPONSE: 'api_response',
		SEARCH_PARAMS: 'search_params',
		SELECTED_PROPERTIES: 'selected_properties',
		SEARCH_CENTER: 'search_center',
		LAST_UPDATED: 'last_updated'
	};
	
	// Use both sessionStorage AND localStorage for maximum compatibility
	// sessionStorage = temporary (cleared on browser close)
	// localStorage = persists across sessions
	static USE_DUAL_STORAGE = true;

	/**
	 * Get the full storage key
	 * @private
	 */
	static _getKey(key) {
		return `${this.STORAGE_PREFIX}${key}`;
	}

	/**
	 * Store API response data
	 * @param {Object} response - The API response object
	 * @param {string} source - Source of the data (e.g., 'search', 'neighborhood-insights')
	 */
	static storeApiResponse(response, source = 'unknown') {
		try {
			const data = {
				response: response,
				source: source,
				timestamp: new Date().toISOString()
			};
			
			const dataString = JSON.stringify(data);
			const storageKey = this._getKey(this.KEYS.API_RESPONSE);
			
			// Store in BOTH sessionStorage and localStorage for maximum compatibility
			let stored = false;
			
			// Try sessionStorage first
			try {
				sessionStorage.setItem(storageKey, dataString);
				stored = true;
				console.log('[AppDataManager] Stored in sessionStorage');
			} catch (sessionError) {
				console.warn('[AppDataManager] sessionStorage failed, trying localStorage:', sessionError);
			}
			
			// Also store in localStorage as backup (this persists across sessions)
			try {
				localStorage.setItem(storageKey, dataString);
				console.log('[AppDataManager] Stored in localStorage (backup)');
			} catch (localError) {
				console.error('[AppDataManager] localStorage also failed:', localError);
				if (!stored) {
					// Both failed - try to clear and retry
					if (localError.name === 'QuotaExceededError') {
						console.warn('[AppDataManager] Storage quota exceeded, clearing old data');
						this.clearAll();
						try {
							localStorage.setItem(storageKey, dataString);
							sessionStorage.setItem(storageKey, dataString);
							stored = true;
						} catch (retryError) {
							console.error('[AppDataManager] Failed to store after clearing:', retryError);
							return false;
						}
					}
				}
			}
			
			this._updateLastUpdated();
			
			console.log(`[AppDataManager] API response stored from ${source}`, {
				hasData: !!response,
				timestamp: data.timestamp,
				stored: stored
			});
			
			// Verify it was stored
			const verify = this.getApiResponse();
			if (!verify) {
				console.error('[AppDataManager] WARNING: Data was stored but cannot be retrieved!');
			}
			
			return stored;
		} catch (error) {
			console.error('[AppDataManager] Error storing API response:', error);
			return false;
		}
	}

	/**
	 * Get the stored API response
	 * @param {boolean} fullData - If true, returns the full object with metadata; if false, returns just the response
	 * @returns {Object|null} The API response or null if not found
	 */
	static getApiResponse(fullData = false) {
		try {
			const storageKey = this._getKey(this.KEYS.API_RESPONSE);
			let stored = null;
			
			// Try sessionStorage first
			try {
				stored = sessionStorage.getItem(storageKey);
			} catch (sessionError) {
				console.warn('[AppDataManager] sessionStorage read failed:', sessionError);
			}
			
			// Fallback to localStorage if sessionStorage doesn't have it
			if (!stored) {
				try {
					stored = localStorage.getItem(storageKey);
					if (stored) {
						console.log('[AppDataManager] Retrieved from localStorage (sessionStorage was empty)');
					}
				} catch (localError) {
					console.error('[AppDataManager] localStorage read failed:', localError);
				}
			} else {
				console.log('[AppDataManager] Retrieved from sessionStorage');
			}
			
			if (!stored) {
				console.log('[AppDataManager] No cached API response found');
				return null;
			}
			
			const data = JSON.parse(stored);
			const result = fullData ? data : data.response;
			
			console.log('[AppDataManager] Retrieved API response:', {
				hasData: !!result,
				source: data.source,
				timestamp: data.timestamp
			});
			
			return result;
		} catch (error) {
			console.error('[AppDataManager] Error retrieving API response:', error);
			return null;
		}
	}

	/**
	 * Get specific data from the API response using a path
	 * @param {string} path - Dot-separated path (e.g., 'data.properties', 'data.secc_stats.rows')
	 * @returns {*} The data at the specified path or null
	 */
	static getApiData(path) {
		try {
			const response = this.getApiResponse();
			if (!response) return null;
			
			const parts = path.split('.');
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
			console.error('[AppDataManager] Error getting API data:', error);
			return null;
		}
	}

	/**
	 * Store search parameters
	 * @param {Object} params - Search parameters object
	 */
	static storeSearchParams(params) {
		try {
			const data = {
				...params,
				timestamp: new Date().toISOString()
			};
			
			const dataString = JSON.stringify(data);
			const storageKey = this._getKey(this.KEYS.SEARCH_PARAMS);
			
			// Store in BOTH sessionStorage and localStorage
			try {
				sessionStorage.setItem(storageKey, dataString);
				console.log('[AppDataManager] Search params stored in sessionStorage');
			} catch (sessionError) {
				console.warn('[AppDataManager] sessionStorage failed for search params:', sessionError);
			}
			
			try {
				localStorage.setItem(storageKey, dataString);
				console.log('[AppDataManager] Search params stored in localStorage');
			} catch (localError) {
				console.error('[AppDataManager] localStorage failed for search params:', localError);
			}
			
			this._updateLastUpdated();
			
			console.log('[AppDataManager] Search parameters stored', data);
			return true;
		} catch (error) {
			console.error('[AppDataManager] Error storing search parameters:', error);
			return false;
		}
	}

	/**
	 * Get stored search parameters
	 * @returns {Object|null} Search parameters or null if not found
	 */
	static getSearchParams() {
		try {
			const storageKey = this._getKey(this.KEYS.SEARCH_PARAMS);
			let stored = null;
			
			// Try sessionStorage first
			try {
				stored = sessionStorage.getItem(storageKey);
			} catch (sessionError) {
				console.warn('[AppDataManager] sessionStorage read failed for search params:', sessionError);
			}
			
			// Fallback to localStorage
			if (!stored) {
				try {
					stored = localStorage.getItem(storageKey);
				} catch (localError) {
					console.error('[AppDataManager] localStorage read failed for search params:', localError);
				}
			}
			
			return stored ? JSON.parse(stored) : null;
		} catch (error) {
			console.error('[AppDataManager] Error retrieving search parameters:', error);
			return null;
		}
	}

	/**
	 * Store selected properties for comparison
	 * @param {Array} properties - Array of selected property objects
	 */
	static storeSelectedProperties(properties) {
		try {
			const data = {
				properties: properties,
				count: properties.length,
				timestamp: new Date().toISOString()
			};
			
			const dataString = JSON.stringify(data);
			const storageKey = this._getKey(this.KEYS.SELECTED_PROPERTIES);
			
			// Store in BOTH sessionStorage and localStorage
			try {
				sessionStorage.setItem(storageKey, dataString);
			} catch (sessionError) {
				console.warn('[AppDataManager] sessionStorage failed for selected properties:', sessionError);
			}
			
			try {
				localStorage.setItem(storageKey, dataString);
			} catch (localError) {
				console.error('[AppDataManager] localStorage failed for selected properties:', localError);
			}
			
			this._updateLastUpdated();
			
			console.log(`[AppDataManager] ${properties.length} properties stored for comparison`);
			return true;
		} catch (error) {
			console.error('[AppDataManager] Error storing selected properties:', error);
			return false;
		}
	}

	/**
	 * Get selected properties
	 * @returns {Array|null} Array of selected properties or null if not found
	 */
	static getSelectedProperties() {
		try {
			const storageKey = this._getKey(this.KEYS.SELECTED_PROPERTIES);
			let stored = null;
			
			// Try sessionStorage first
			try {
				stored = sessionStorage.getItem(storageKey);
			} catch (sessionError) {
				console.warn('[AppDataManager] sessionStorage read failed for selected properties:', sessionError);
			}
			
			// Fallback to localStorage
			if (!stored) {
				try {
					stored = localStorage.getItem(storageKey);
				} catch (localError) {
					console.error('[AppDataManager] localStorage read failed for selected properties:', localError);
				}
			}
			
			if (!stored) return null;
			
			const data = JSON.parse(stored);
			return data.properties || null;
		} catch (error) {
			console.error('[AppDataManager] Error retrieving selected properties:', error);
			return null;
		}
	}

	/**
	 * Store search center coordinates
	 * @param {Object} center - Object with lat and lon properties
	 */
	static storeSearchCenter(center) {
		try {
			sessionStorage.setItem(this._getKey(this.KEYS.SEARCH_CENTER), JSON.stringify(center));
			return true;
		} catch (error) {
			console.error('[AppDataManager] Error storing search center:', error);
			return false;
		}
	}

	/**
	 * Get stored search center
	 * @returns {Object|null} Search center with lat and lon or null
	 */
	static getSearchCenter() {
		try {
			const stored = sessionStorage.getItem(this._getKey(this.KEYS.SEARCH_CENTER));
			return stored ? JSON.parse(stored) : null;
		} catch (error) {
			console.error('[AppDataManager] Error retrieving search center:', error);
			return null;
		}
	}

	/**
	 * Check if cached data exists
	 * @returns {boolean} True if any cached data exists
	 */
	static hasCachedData() {
		return !!(
			this.getApiResponse() ||
			this.getSearchParams() ||
			this.getSelectedProperties()
		);
	}

	/**
	 * Get data age (time since last update)
	 * @returns {number|null} Age in milliseconds or null if no data
	 */
	static getDataAge() {
		try {
			const lastUpdated = sessionStorage.getItem(this._getKey(this.KEYS.LAST_UPDATED));
			if (!lastUpdated) return null;
			
			const timestamp = new Date(lastUpdated);
			return Date.now() - timestamp.getTime();
		} catch (error) {
			return null;
		}
	}

	/**
	 * Clear all stored data
	 */
	static clearAll() {
		try {
			Object.values(this.KEYS).forEach(key => {
				sessionStorage.removeItem(this._getKey(key));
			});
			console.log('[AppDataManager] All data cleared');
			return true;
		} catch (error) {
			console.error('[AppDataManager] Error clearing data:', error);
			return false;
		}
	}

	/**
	 * Clear only API response data
	 */
	static clearApiResponse() {
		try {
			sessionStorage.removeItem(this._getKey(this.KEYS.API_RESPONSE));
			console.log('[AppDataManager] API response cleared');
			return true;
		} catch (error) {
			console.error('[AppDataManager] Error clearing API response:', error);
			return false;
		}
	}

	/**
	 * Get summary of all stored data (for debugging)
	 * @returns {Object} Summary object
	 */
	static getDataSummary() {
		return {
			hasApiResponse: !!this.getApiResponse(),
			hasSearchParams: !!this.getSearchParams(),
			hasSelectedProperties: !!this.getSelectedProperties(),
			hasSearchCenter: !!this.getSearchCenter(),
			dataAge: this.getDataAge(),
			dataAgeFormatted: this.getDataAge() ? `${Math.round(this.getDataAge() / 1000)}s ago` : null
		};
	}

	/**
	 * Update last updated timestamp
	 * @private
	 */
	static _updateLastUpdated() {
		try {
			sessionStorage.setItem(this._getKey(this.KEYS.LAST_UPDATED), new Date().toISOString());
		} catch (error) {
			// Silently fail - not critical
		}
	}

	/**
	 * Initialize - can be called on page load to set up event listeners, etc.
	 */
	static init() {
		console.log('[AppDataManager] Initialized', this.getDataSummary());
		
		// Optional: Clear old data on page unload if needed
		// window.addEventListener('beforeunload', () => {
		//   // Could clear data here if you want to reset on navigation
		// });
	}
}

// Initialize on load
if (typeof document !== 'undefined') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => AppDataManager.init());
	} else {
		AppDataManager.init();
	}
}

// Make it available globally
if (typeof window !== 'undefined') {
	window.AppDataManager = AppDataManager;
}
