/**
 * PropIntelli Application State Manager
 * Centralized state management for cross-page data persistence
 * Works like a real website - data persists across all page navigations
 */

(function() {
	'use strict';
	
	// Application State
	const AppState = {
		// Storage key prefix
		STORAGE_KEY: 'propintelli_app_state',
		
		// Current state in memory
		state: {
			apiResponse: null,
			searchParams: null,
			selectedProperties: [],
			searchCenter: null,
			lastUpdated: null
		},
		
		// Initialize - load state from storage
		init: function() {
			this.loadFromStorage();
			this.setupStorageListener();
			console.log('[AppState] ✅ Initialized', this.getStateSummary());
		},
		
		// Load state from localStorage
		loadFromStorage: function() {
			try {
				const stored = localStorage.getItem(this.STORAGE_KEY);
				if (stored) {
					const parsed = JSON.parse(stored);
					this.state = { ...this.state, ...parsed };
					console.log('[AppState] 📦 Loaded state from storage:', this.getStateSummary());
					return true;
				}
			} catch (error) {
				console.error('[AppState] ❌ Error loading from storage:', error);
			}
			return false;
		},
		
		// Save state to localStorage
		saveToStorage: function() {
			try {
				this.state.lastUpdated = new Date().toISOString();
				const stateString = JSON.stringify(this.state);
				localStorage.setItem(this.STORAGE_KEY, stateString);
				console.log('[AppState] 💾 State saved to storage');
				return true;
			} catch (error) {
				console.error('[AppState] ❌ Error saving to storage:', error);
				if (error.name === 'QuotaExceededError') {
					console.error('[AppState] ⚠️ Storage quota exceeded, attempting to clear old data...');
					this.clearOldData();
					// Try once more
					try {
						localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
						return true;
					} catch (retryError) {
						console.error('[AppState] ❌ Retry also failed:', retryError);
					}
				}
				return false;
			}
		},
		
		// Clear old data if storage is full
		clearOldData: function() {
			try {
				// Keep only essential keys
				const keysToKeep = [this.STORAGE_KEY];
				const allKeys = Object.keys(localStorage);
				allKeys.forEach(key => {
					if (key.startsWith('propintelli_') && !keysToKeep.includes(key)) {
						localStorage.removeItem(key);
					}
				});
				console.log('[AppState] 🗑️ Cleared old data');
			} catch (error) {
				console.error('[AppState] ❌ Error clearing old data:', error);
			}
		},
		
		// Set API response
		setApiResponse: function(response) {
			this.state.apiResponse = response;
			this.saveToStorage();
			console.log('[AppState] ✅ API response saved');
			this.notifyListeners('apiResponse', response);
		},
		
		// Get API response
		getApiResponse: function() {
			return this.state.apiResponse;
		},
		
		// Set search parameters
		setSearchParams: function(params) {
			this.state.searchParams = params;
			if (params.lat && params.lon) {
				this.state.searchCenter = { lat: params.lat, lon: params.lon };
			}
			this.saveToStorage();
			console.log('[AppState] ✅ Search parameters saved:', params);
		},
		
		// Get search parameters
		getSearchParams: function() {
			return this.state.searchParams;
		},
		
		// Set selected properties
		setSelectedProperties: function(properties) {
			this.state.selectedProperties = properties;
			this.saveToStorage();
			console.log('[AppState] ✅ Selected properties saved:', properties.length);
		},
		
		// Get selected properties
		getSelectedProperties: function() {
			return this.state.selectedProperties || [];
		},
		
		// Get search center
		getSearchCenter: function() {
			return this.state.searchCenter || this.state.searchParams;
		},
		
		// Get state summary for debugging
		getStateSummary: function() {
			return {
				hasApiResponse: !!this.state.apiResponse,
				hasSearchParams: !!this.state.searchParams,
				selectedPropertiesCount: this.state.selectedProperties?.length || 0,
				lastUpdated: this.state.lastUpdated
			};
		},
		
		// Clear all state
		clear: function() {
			this.state = {
				apiResponse: null,
				searchParams: null,
				selectedProperties: [],
				searchCenter: null,
				lastUpdated: null
			};
			localStorage.removeItem(this.STORAGE_KEY);
			console.log('[AppState] 🗑️ State cleared');
		},
		
		// Listeners for state changes
		listeners: [],
		
		// Setup storage event listener (for cross-tab communication)
		setupStorageListener: function() {
			window.addEventListener('storage', (e) => {
				if (e.key === this.STORAGE_KEY && e.newValue) {
					try {
						const newState = JSON.parse(e.newValue);
						this.state = { ...this.state, ...newState };
						console.log('[AppState] 📡 State updated from another tab');
						this.notifyListeners('storage', newState);
					} catch (error) {
						console.error('[AppState] ❌ Error processing storage event:', error);
					}
				}
			});
		},
		
		// Add listener for state changes
		onStateChange: function(callback) {
			this.listeners.push(callback);
		},
		
		// Notify listeners
		notifyListeners: function(event, data) {
			this.listeners.forEach(listener => {
				try {
					listener(event, data, this.state);
				} catch (error) {
					console.error('[AppState] ❌ Listener error:', error);
				}
			});
		}
	};
	
	// Initialize on load
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => AppState.init());
	} else {
		AppState.init();
	}
	
	// Make it globally available
	window.AppState = AppState;
	
	// Also expose convenience methods globally
	window.getAppState = function() {
		return AppState.getStateSummary();
	};
	
	window.clearAppState = function() {
		if (confirm('Are you sure you want to clear all stored application data?')) {
			AppState.clear();
		}
	};
	
	console.log('[AppState] 🚀 PropIntelli Application State Manager loaded');
})();

