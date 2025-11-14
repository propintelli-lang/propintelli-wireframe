document.addEventListener('DOMContentLoaded', function () {
	console.log('DOM loaded, starting autocomplete setup...');
	
	// Location Autocomplete functionality - SIMPLIFIED VERSION
	const locationInput = document.getElementById('locationInput');
	const locationSuggestions = document.getElementById('locationSuggestions');
	const countrySelect = document.getElementById('countrySelect');
	
	console.log('=== AUTCOMPLETE DEBUG ===');
	console.log('locationInput:', locationInput);
	console.log('locationSuggestions:', locationSuggestions);
	console.log('countrySelect:', countrySelect);
	
	// Load Spanish zip codes data from JSON file
	let spanishZipCodes = null;
	let isLoadingZipCodes = false;
	
	function loadSpanishZipCodes() {
		if (isLoadingZipCodes || spanishZipCodes) {
			return Promise.resolve(spanishZipCodes);
		}
		
		isLoadingZipCodes = true;
		console.log('🔄 Loading zipcodes.json (this may take a few seconds for 5MB file)...');
		
		return fetch('zipcodes.json?v=' + Date.now())
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}
				console.log('📥 Parsing JSON (5MB file, please wait)...');
				return response.json();
			})
			.then(data => {
				spanishZipCodes = data;
				isLoadingZipCodes = false;
				console.log('✅ zipcodes.json LOADED!', {
					zips: Object.keys(data.zipToCities || {}).length,
					cities: data.cities?.length || 0
				});
				return data;
			})
			.catch(error => {
				console.error('❌ ERROR loading zipcodes.json:', error);
				console.error('❌ Error message:', error.message);
				console.error('❌ Error stack:', error.stack);
				console.error('❌ Current URL:', window.location.href);
				console.error('❌ Protocol:', window.location.protocol);
				isLoadingZipCodes = false;
				spanishZipCodes = null;
				return null;
			});
	}
	
	if (locationInput && locationSuggestions && countrySelect) {
		console.log('✅ All elements found! Setting up autocomplete...');
		
		// Preload zip codes when Spain is selected
		countrySelect.addEventListener('change', function() {
			if (this.value === 'ES') {
				console.log('🇪🇸 Spain selected in dropdown, loading zipcodes.json...');
				loadSpanishZipCodes();
			}
		});
		
		// Also preload on page load if Spain is already selected
		if (countrySelect.value === 'ES') {
			console.log('🇪🇸 Spain already selected on page load, loading zipcodes.json...');
			loadSpanishZipCodes();
		}
		
		// Comprehensive location data (fallback for other countries)
		const locations = {
			'ES': [
				// Major Cities
				{ name: 'Madrid', region: 'Madrid', zip: '28001', type: 'Capital' },
				{ name: 'Barcelona', region: 'Catalonia', zip: '08001', type: 'City' },
				{ name: 'Valencia', region: 'Valencia', zip: '46001', type: 'City' },
				{ name: 'Seville', region: 'Andalusia', zip: '41001', type: 'City' },
				{ name: 'Zaragoza', region: 'Aragon', zip: '50001', type: 'City' },
				{ name: 'Málaga', region: 'Andalusia', zip: '29001', type: 'City' },
				{ name: 'Murcia', region: 'Murcia', zip: '30001', type: 'City' },
				{ name: 'Palma', region: 'Balearic Islands', zip: '07001', type: 'City' },
				{ name: 'Las Palmas', region: 'Canary Islands', zip: '35001', type: 'City' },
				{ name: 'Bilbao', type: 'City', region: 'Basque Country', zip: '48001' },
				
				// Andalusia
				{ name: 'Córdoba', region: 'Andalusia', zip: '14001', type: 'City' },
				{ name: 'Granada', region: 'Andalusia', zip: '18001', type: 'City' },
				{ name: 'Cádiz', region: 'Andalusia', zip: '11001', type: 'City' },
				{ name: 'Huelva', region: 'Andalusia', zip: '21001', type: 'City' },
				{ name: 'Jaén', region: 'Andalusia', zip: '23001', type: 'City' },
				{ name: 'Almería', region: 'Andalusia', zip: '04001', type: 'City' },
				{ name: 'Marbella', region: 'Andalusia', zip: '29600', type: 'Town' },
				{ name: 'Jerez de la Frontera', region: 'Andalusia', zip: '11401', type: 'City' },
				{ name: 'Algeciras', region: 'Andalusia', zip: '11201', type: 'City' },
				{ name: 'Dos Hermanas', region: 'Andalusia', zip: '41700', type: 'Town' },
				
				// Catalonia
				{ name: 'L\'Hospitalet de Llobregat', region: 'Catalonia', zip: '08901', type: 'City' },
				{ name: 'Badalona', region: 'Catalonia', zip: '08911', type: 'City' },
				{ name: 'Sabadell', region: 'Catalonia', zip: '08201', type: 'City' },
				{ name: 'Terrassa', region: 'Catalonia', zip: '08221', type: 'City' },
				{ name: 'Lleida', region: 'Catalonia', zip: '25001', type: 'City' },
				{ name: 'Tarragona', region: 'Catalonia', zip: '43001', type: 'City' },
				{ name: 'Girona', region: 'Catalonia', zip: '17001', type: 'City' },
				{ name: 'Mataró', region: 'Catalonia', zip: '08301', type: 'City' },
				{ name: 'Santa Coloma de Gramenet', region: 'Catalonia', zip: '08920', type: 'City' },
				{ name: 'Reus', region: 'Catalonia', zip: '43201', type: 'City' },
				
				// Madrid Region
				{ name: 'Móstoles', region: 'Madrid', zip: '28931', type: 'City' },
				{ name: 'Alcalá de Henares', region: 'Madrid', zip: '28801', type: 'City' },
				{ name: 'Fuenlabrada', region: 'Madrid', zip: '28941', type: 'City' },
				{ name: 'Leganés', region: 'Madrid', zip: '28911', type: 'City' },
				{ name: 'Getafe', region: 'Madrid', zip: '28901', type: 'City' },
				{ name: 'Alcorcón', region: 'Madrid', zip: '28921', type: 'City' },
				{ name: 'Torrejón de Ardoz', region: 'Madrid', zip: '28850', type: 'City' },
				{ name: 'Parla', region: 'Madrid', zip: '28980', type: 'City' },
				{ name: 'Alcobendas', region: 'Madrid', zip: '28100', type: 'City' },
				{ name: 'Las Rozas de Madrid', region: 'Madrid', zip: '28230', type: 'City' },
				
				// Valencia Region
				{ name: 'Alicante', region: 'Valencia', zip: '03001', type: 'City' },
				{ name: 'Elche', region: 'Valencia', zip: '03201', type: 'City' },
				{ name: 'Castellón de la Plana', region: 'Valencia', zip: '12001', type: 'City' },
				{ name: 'Torrevieja', region: 'Valencia', zip: '03181', type: 'City' },
				{ name: 'Orihuela', region: 'Valencia', zip: '03300', type: 'City' },
				{ name: 'Gandía', region: 'Valencia', zip: '46700', type: 'City' },
				{ name: 'Benidorm', region: 'Valencia', zip: '03501', type: 'City' },
				{ name: 'Alcoy', region: 'Valencia', zip: '03801', type: 'City' },
				{ name: 'Elda', region: 'Valencia', zip: '03600', type: 'City' },
				{ name: 'Sagunto', region: 'Valencia', zip: '46520', type: 'City' },
				
				// Basque Country
				{ name: 'Vitoria-Gasteiz', region: 'Basque Country', zip: '01001', type: 'City' },
				{ name: 'San Sebastián', region: 'Basque Country', zip: '20001', type: 'City' },
				{ name: 'Barakaldo', region: 'Basque Country', zip: '48901', type: 'City' },
				{ name: 'Getxo', region: 'Basque Country', zip: '48990', type: 'City' },
				{ name: 'Irun', region: 'Basque Country', zip: '20301', type: 'City' },
				{ name: 'Portugalete', region: 'Basque Country', zip: '48920', type: 'City' },
				{ name: 'Santurtzi', region: 'Basque Country', zip: '48980', type: 'City' },
				{ name: 'Basauri', region: 'Basque Country', zip: '48970', type: 'City' },
				{ name: 'Errenteria', region: 'Basque Country', zip: '20100', type: 'City' },
				{ name: 'Leioa', region: 'Basque Country', zip: '48940', type: 'City' },
				
				// Galicia
				{ name: 'A Coruña', region: 'Galicia', zip: '15001', type: 'City' },
				{ name: 'Vigo', region: 'Galicia', zip: '36201', type: 'City' },
				{ name: 'Ourense', region: 'Galicia', zip: '32001', type: 'City' },
				{ name: 'Lugo', region: 'Galicia', zip: '27001', type: 'City' },
				{ name: 'Santiago de Compostela', region: 'Galicia', zip: '15705', type: 'City' },
				{ name: 'Pontevedra', region: 'Galicia', zip: '36001', type: 'City' },
				{ name: 'Ferrol', region: 'Galicia', zip: '15401', type: 'City' },
				{ name: 'Narón', region: 'Galicia', zip: '15570', type: 'City' },
				{ name: 'Vilagarcía de Arousa', region: 'Galicia', zip: '36600', type: 'City' },
				{ name: 'Culleredo', region: 'Galicia', zip: '15189', type: 'City' },
				
				// Castile and León
				{ name: 'Valladolid', region: 'Castile and León', zip: '47001', type: 'City' },
				{ name: 'Burgos', region: 'Castile and León', zip: '09001', type: 'City' },
				{ name: 'León', region: 'Castile and León', zip: '24001', type: 'City' },
				{ name: 'Salamanca', region: 'Castile and León', zip: '37001', type: 'City' },
				{ name: 'Zamora', region: 'Castile and León', zip: '49001', type: 'City' },
				{ name: 'Palencia', region: 'Castile and León', zip: '34001', type: 'City' },
				{ name: 'Ávila', region: 'Castile and León', zip: '05001', type: 'City' },
				{ name: 'Segovia', region: 'Castile and León', zip: '40001', type: 'City' },
				{ name: 'Soria', region: 'Castile and León', zip: '42001', type: 'City' },
				{ name: 'Ponferrada', region: 'Castile and León', zip: '24400', type: 'City' },
				
				// Canary Islands
				{ name: 'Santa Cruz de Tenerife', region: 'Canary Islands', zip: '38001', type: 'City' },
				{ name: 'San Cristóbal de La Laguna', region: 'Canary Islands', zip: '38200', type: 'City' },
				{ name: 'Telde', region: 'Canary Islands', zip: '35200', type: 'City' },
				{ name: 'Arona', region: 'Canary Islands', zip: '38640', type: 'City' },
				{ name: 'Santa Lucía de Tirajana', region: 'Canary Islands', zip: '35110', type: 'City' },
				{ name: 'San Bartolomé de Tirajana', region: 'Canary Islands', zip: '35290', type: 'City' },
				{ name: 'La Orotava', region: 'Canary Islands', zip: '38300', type: 'City' },
				{ name: 'Puerto del Rosario', region: 'Canary Islands', zip: '35600', type: 'City' },
				{ name: 'Arrecife', region: 'Canary Islands', zip: '35500', type: 'City' },
				{ name: 'Valverde', region: 'Canary Islands', zip: '38900', type: 'City' },
				
				// Balearic Islands
				{ name: 'Ibiza', region: 'Balearic Islands', zip: '07800', type: 'City' },
				{ name: 'Manacor', region: 'Balearic Islands', zip: '07500', type: 'City' },
				{ name: 'Mahón', region: 'Balearic Islands', zip: '07701', type: 'City' },
				{ name: 'Ciutadella de Menorca', region: 'Balearic Islands', zip: '07760', type: 'City' },
				{ name: 'Inca', region: 'Balearic Islands', zip: '07300', type: 'City' },
				{ name: 'Alcúdia', region: 'Balearic Islands', zip: '07400', type: 'City' },
				{ name: 'Felanitx', region: 'Balearic Islands', zip: '07200', type: 'City' },
				{ name: 'Pollença', region: 'Balearic Islands', zip: '07460', type: 'City' },
				{ name: 'Sóller', region: 'Balearic Islands', zip: '07100', type: 'City' },
				{ name: 'Santanyí', region: 'Balearic Islands', zip: '07650', type: 'City' },
				
				// Other Important Cities
				{ name: 'Badajoz', region: 'Extremadura', zip: '06001', type: 'City' },
				{ name: 'Cáceres', region: 'Extremadura', zip: '10001', type: 'City' },
				{ name: 'Logroño', region: 'La Rioja', zip: '26001', type: 'City' },
				{ name: 'Pamplona', region: 'Navarre', zip: '31001', type: 'City' },
				{ name: 'Santander', region: 'Cantabria', zip: '39001', type: 'City' },
				{ name: 'Oviedo', region: 'Asturias', zip: '33001', type: 'City' },
				{ name: 'Gijón', region: 'Asturias', zip: '33201', type: 'City' },
				{ name: 'Albacete', region: 'Castile-La Mancha', zip: '02001', type: 'City' },
				{ name: 'Toledo', region: 'Castile-La Mancha', zip: '45001', type: 'City' },
				{ name: 'Ciudad Real', region: 'Castile-La Mancha', zip: '13001', type: 'City' },
				{ name: 'Cuenca', region: 'Castile-La Mancha', zip: '16001', type: 'City' },
				{ name: 'Guadalajara', region: 'Castile-La Mancha', zip: '19001', type: 'City' }
			],
			'DE': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
			'FR': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'],
			'AT': ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck']
		};
		
		// Debounce function to limit searches
		let debounceTimer;
		
		// Function to search Spanish zip codes from JSON
		function searchSpanishZipCodes(query) {
			if (!spanishZipCodes) {
				console.log('❌ spanishZipCodes is null/undefined');
				return [];
			}
			
			const queryLower = query.toLowerCase().trim();
			const results = [];
			const seen = new Set();
			
			console.log('🔍 Searching for:', queryLower);
			console.log('📊 Data available:', {
				hasZipToCities: !!spanishZipCodes.zipToCities,
				hasCityToZips: !!spanishZipCodes.cityToZips,
				hasCities: !!spanishZipCodes.cities,
				zipCount: Object.keys(spanishZipCodes.zipToCities || {}).length,
				cityCount: (spanishZipCodes.cities || []).length
			});
			
			// Check if query is a zip code (5 digits)
			const isZipCode = /^\d{5}$/.test(queryLower);
			
			if (isZipCode) {
				console.log('🔢 Searching by zip code:', queryLower);
				// Search by zip code
				const cities = spanishZipCodes.zipToCities[queryLower];
				console.log('📦 Cities for zip', queryLower, ':', cities);
				if (cities) {
					cities.forEach(city => {
						const key = `${city}|${queryLower}`;
						if (!seen.has(key)) {
							seen.add(key);
							results.push({ name: city, zip: queryLower, region: '', type: 'City' });
						}
					});
				}
			} else {
				console.log('🏙️ Searching by city name:', queryLower);
				// Search by city name - try exact match first
				const exactMatch = spanishZipCodes.cityToZips[queryLower];
				console.log('🎯 Exact match in cityToZips:', !!exactMatch, exactMatch);
				
				if (exactMatch) {
					console.log('✅ Exact match found! Zip codes:', exactMatch);
					// Get ALL zip codes for this city - simplified logic
					exactMatch.forEach(zip => {
						const cities = spanishZipCodes.zipToCities[zip];
						if (cities && cities.length > 0) {
							// Use the first city name from the zip (they should all be the same city)
							const cityName = cities[0];
							const key = `${cityName}|${zip}`;
							if (!seen.has(key)) {
								seen.add(key);
								results.push({ name: cityName, zip: zip, region: '', type: 'City' });
							}
						}
					});
					console.log('✅ Found', results.length, 'results from exact match');
				}
				
				// If no exact match, try partial matches
				if (results.length === 0) {
					console.log('🔍 Trying partial match...');
					let checked = 0;
					for (const city of spanishZipCodes.cities) {
						checked++;
						const cityLower = city.toLowerCase();
						if (cityLower.includes(queryLower)) {
							console.log('✅ Found partial match:', city);
							const zips = spanishZipCodes.cityToZips[cityLower];
							console.log('📦 Zip codes for', city, ':', zips);
							if (zips) {
								zips.forEach(zip => {
									const key = `${city}|${zip}`;
									if (!seen.has(key)) {
										seen.add(key);
										results.push({ name: city, zip: zip, region: '', type: 'City' });
									}
								});
							}
							break; // Found match, show all its zip codes
						}
						if (checked > 5000) {
							console.log('⚠️ Checked 5000 cities, stopping...');
							break;
						}
					}
					console.log('✅ Found', results.length, 'results from partial match');
				}
			}
			
			results.sort((a, b) => a.zip.localeCompare(b.zip));
			console.log('📊 Final results:', results.length, results);
			return results.slice(0, 15);
		}
		
		// Function to search static list (fallback for other countries)
		function searchStaticList(query, country) {
			if (!country || !locations[country]) {
				return [];
			}
			
				const countryLocations = locations[country];
				const matches = countryLocations.filter(location => 
					location.name.toLowerCase().includes(query) ||
					location.region.toLowerCase().includes(query) ||
					location.zip.includes(query)
			).slice(0, 8);
			
			return matches;
		}
		
		// Enhanced input handler with API integration
		locationInput.addEventListener('input', function() {
			const query = this.value.trim();
			const country = countrySelect.value;
			
			// Clear previous debounce timer
			clearTimeout(debounceTimer);
			
			// Hide suggestions if query is too short
			if (query.length < 2) {
				locationSuggestions.style.display = 'none';
				return;
			}
			
			// Show loading state
			locationSuggestions.innerHTML = '<div style="padding: 12px; text-align: center; color: #6b7280;">Searching...</div>';
			locationSuggestions.style.display = 'block';
			
			// Debounce searches (wait 200ms after user stops typing)
			debounceTimer = setTimeout(async () => {
				try {
					const queryLower = query.toLowerCase();
					
					// For Spain, ONLY use zipcodes.json - NO FALLBACK
					if (country === 'ES' && query.length >= 2) {
						// Load zip codes
						await loadSpanishZipCodes();
						
						// ONLY use JSON data - no fallback to static list
						if (spanishZipCodes) {
							const results = searchSpanishZipCodes(query);
							
							if (results.length > 0) {
								locationSuggestions.innerHTML = results.map(location => `
									<div class="autocomplete-suggestion" style="color: #1f2937 !important; background: #fff !important;">
										<div class="main-text">${location.name}</div>
										<div class="sub-text">${location.zip}</div>
										<span class="type-badge">${location.type}</span>
									</div>
								`).join('');
								locationSuggestions.style.display = 'block';
							} else {
								locationSuggestions.innerHTML = '<div style="padding: 12px; text-align: center; color: #6b7280;">No results found</div>';
								locationSuggestions.style.display = 'block';
							}
						} else {
							// JSON failed to load - show error with details
							console.error('❌ spanishZipCodes is null - file did not load');
							const errorMsg = window.location.protocol === 'file:' 
								? 'Error: Must use http://localhost:8000/index.html (not file://)'
								: 'Error: Could not load zipcodes.json. Check browser console (F12) for details.';
							locationSuggestions.innerHTML = `<div style="padding: 12px; text-align: center; color: #dc2626; font-size: 12px;">${errorMsg}</div>`;
							locationSuggestions.style.display = 'block';
						}
					} else if (country && query.length >= 2) {
						console.log('🌍 Other country selected, using static list');
						// For other countries, use static list
						const staticMatches = searchStaticList(queryLower, country);
						if (staticMatches.length > 0) {
							locationSuggestions.innerHTML = staticMatches.map(location => `
								<div class="autocomplete-suggestion" style="color: #1f2937 !important; background: #fff !important;">
									<div class="main-text">${location.name}</div>
									<div class="sub-text">${location.region} • ${location.zip}</div>
									<span class="type-badge">${location.type}</span>
								</div>
							`).join('');
							locationSuggestions.style.display = 'block';
						} else {
							locationSuggestions.style.display = 'none';
						}
					} else {
						locationSuggestions.style.display = 'none';
					}
				} catch (error) {
					console.error('❌ Error in search:', error);
					locationSuggestions.innerHTML = `<div style="padding: 12px; text-align: center; color: #dc2626;">Error: ${error.message}</div>`;
					locationSuggestions.style.display = 'block';
				}
			}, 200); // 200ms debounce delay (faster since it's local data)
		});
		
		// Store selected location data for passing to search page
		let selectedLocationData = null;
		
		// Click handler for suggestions
		locationSuggestions.addEventListener('click', function(e) {
			const suggestion = e.target.closest('.autocomplete-suggestion');
			if (suggestion) {
				const mainText = suggestion.querySelector('.main-text');
				const subText = suggestion.querySelector('.sub-text');
				
				if (mainText) {
					const cityName = mainText.textContent;
					
					// Extract zip code and region from sub-text if available
					let zipCode = '';
					let region = '';
					if (subText) {
						const subTextParts = subText.textContent.split('•');
						if (subTextParts.length >= 2) {
							region = subTextParts[0].trim();
							zipCode = subTextParts[1].trim();
						}
					}
					
					// Store location data
					selectedLocationData = {
						name: cityName,
						region: region,
						zip: zipCode
					};
					
					// Display city name with zip code in input
					if (zipCode) {
						locationInput.value = `${cityName} (${zipCode})`;
					} else {
						locationInput.value = cityName;
					}
					
					locationSuggestions.style.display = 'none';
				}
			}
		});
		
		console.log('✅ Autocomplete setup complete!');
		
		// Handle search button click to pass location data
		const searchButton = document.getElementById('searchButton');
		if (searchButton) {
			searchButton.addEventListener('click', function(e) {
				e.preventDefault(); // Prevent default link behavior
				
				const selectedLocation = locationInput.value;
				const selectedCountry = countrySelect.value;
				const purpose = document.querySelector('select:nth-of-type(2)').value;
				
				// Build URL with parameters
				let searchUrl = 'search.html';
				const params = new URLSearchParams();
				
				// Use stored location data if available, otherwise use input value
				if (selectedLocationData) {
					params.append('location', selectedLocationData.name);
					if (selectedLocationData.zip) {
						params.append('zip', selectedLocationData.zip);
					}
					if (selectedLocationData.region) {
						params.append('region', selectedLocationData.region);
					}
				} else if (selectedLocation) {
					params.append('location', selectedLocation);
				}
				
				if (selectedCountry) {
					params.append('country', selectedCountry);
				}
				if (purpose) {
					params.append('purpose', purpose);
				}
				
				if (params.toString()) {
					searchUrl += '?' + params.toString();
				}
				
				console.log('Navigating to:', searchUrl);
				window.location.href = searchUrl;
			});
		}

		// Handle insights navigation link to pass location data
		const insightsLink = document.querySelector('a[href="insights.html"]');
		if (insightsLink) {
			insightsLink.addEventListener('click', function(e) {
				e.preventDefault(); // Prevent default link behavior
				
				const selectedLocation = locationInput.value;
				const selectedCountry = countrySelect.value;
				const purpose = document.querySelector('select:nth-of-type(2)').value;
				
				// Build URL with parameters
				let insightsUrl = 'insights.html';
				const params = new URLSearchParams();
				
				// Use stored location data if available, otherwise use input value
				if (selectedLocationData) {
					params.append('location', selectedLocationData.name);
					if (selectedLocationData.zip) {
						params.append('zip', selectedLocationData.zip);
					}
					if (selectedLocationData.region) {
						params.append('region', selectedLocationData.region);
					}
				} else if (selectedLocation) {
					params.append('location', selectedLocation);
				}
				
				if (selectedCountry) {
					params.append('country', selectedCountry);
				}
				if (purpose) {
					params.append('purpose', purpose);
				}
				
				if (params.toString()) {
					insightsUrl += '?' + params.toString();
				}
				
				console.log('Navigating to insights:', insightsUrl);
				window.location.href = insightsUrl;
			});
		}
		
	} else {
		console.log('❌ Missing elements!');
	}
});
