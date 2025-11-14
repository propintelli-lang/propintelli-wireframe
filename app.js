document.addEventListener('DOMContentLoaded', function () {
	console.log('DOM loaded, starting autocomplete setup...');
	
	const viewToggle = document.querySelector('[data-toggle-view]');
	if (viewToggle) {
		viewToggle.addEventListener('click', function () {
			const target = document.querySelector('#listingsPanel');
			if (!target) return;
			target.dataset.view = target.dataset.view === 'map' ? 'list' : 'map';
			viewToggle.textContent = target.dataset.view === 'map' ? 'Switch to List View' : 'Switch to Map View';
		});
	}

	// Chatbot
	const chatbot = document.querySelector('.chatbot');
	const toggle = document.querySelector('.chatbot-toggle');
	function openChat() { if (chatbot) chatbot.classList.add('open'); }
	function closeChat() { if (chatbot) chatbot.classList.remove('open'); }
	if (toggle) {
		toggle.addEventListener('click', function () {
			if (!chatbot) return;
			chatbot.classList.toggle('open');
		});
	}
	document.querySelectorAll('[data-open-chat]').forEach(function (el) {
		el.addEventListener('click', function (e) {
			e.preventDefault();
			openChat();
		});
	});

	// Compare selection (demo)
	const compareBar = document.querySelector('.sticky-compare');
	let selected = new Set();
	document.querySelectorAll('[data-compare-id]').forEach(function (chk) {
		chk.addEventListener('change', function () {
			if (chk.checked) selected.add(chk.dataset.compareId); else selected.delete(chk.dataset.compareId);
			if (compareBar) {
				compareBar.classList.toggle('show', selected.size >= 2);
				const countEl = compareBar.querySelector('[data-compare-count]');
				if (countEl) countEl.textContent = String(selected.size);
			}
		});
	});

	// Onboarding slider
	const sizeSlider = document.querySelector('#sizeSlider');
	const sizeValue = document.querySelector('#sizeValue');
	if (sizeSlider && sizeValue) {
		sizeSlider.addEventListener('input', function() {
			sizeValue.textContent = sizeSlider.value + ' m²';
		});
	}

	// Purpose selection
	document.querySelectorAll('.purpose-option').forEach(function(option) {
		option.addEventListener('click', function() {
			document.querySelectorAll('.purpose-option').forEach(o => o.classList.remove('selected'));
			this.classList.add('selected');
		});
	});

	// Price Popover functionality
	const priceTrigger = document.getElementById('priceTrigger');
	const pricePopover = document.getElementById('pricePopover');
	const minPriceInput = document.getElementById('minPrice');
	const maxPriceInput = document.getElementById('maxPrice');
	const priceError = document.getElementById('priceError');
	const priceApply = document.getElementById('priceApply');
	const priceClear = document.getElementById('priceClear');
	const priceCancel = document.getElementById('priceCancel');

	let priceState = { min_price: null, max_price: null };

	function formatPrice(price) {
		return new Intl.NumberFormat('en-US').format(price);
	}

	function updatePriceLabel() {
		const { min_price, max_price } = priceState;
		if (!min_price && !max_price) {
			priceTrigger.textContent = 'Price';
		} else if (min_price && !max_price) {
			priceTrigger.textContent = `From €${formatPrice(min_price)}`;
		} else if (!min_price && max_price) {
			priceTrigger.textContent = `Up to €${formatPrice(max_price)}`;
		} else {
			priceTrigger.textContent = `€${formatPrice(min_price)}–€${formatPrice(max_price)}`;
		}
	}

	function validatePrice() {
		const min = parseInt(minPriceInput.value) || null;
		const max = parseInt(maxPriceInput.value) || null;
		
		if (min && max && min > max) {
			priceError.style.display = 'block';
			priceApply.disabled = true;
			return false;
		} else {
			priceError.style.display = 'none';
			priceApply.disabled = false;
			return true;
		}
	}

	function openPopover() {
		pricePopover.style.display = 'block';
		priceTrigger.setAttribute('aria-expanded', 'true');
		minPriceInput.focus();
	}

	function closePopover() {
		pricePopover.style.display = 'none';
		priceTrigger.setAttribute('aria-expanded', 'false');
		priceTrigger.focus();
	}

	function applyPrice() {
		if (!validatePrice()) return;
		
		priceState.min_price = parseInt(minPriceInput.value) || null;
		priceState.max_price = parseInt(maxPriceInput.value) || null;
		
		updatePriceLabel();
		closePopover();
		
		// Trigger search with new price parameters
		triggerSearch();
	}

	function clearPrice() {
		priceState.min_price = null;
		priceState.max_price = null;
		minPriceInput.value = '';
		maxPriceInput.value = '';
		priceError.style.display = 'none';
		priceApply.disabled = false;
		updatePriceLabel();
		closePopover();
		
		// Trigger search without price parameters
		triggerSearch();
	}

	function cancelPrice() {
		// Reset inputs to current state
		minPriceInput.value = priceState.min_price || '';
		maxPriceInput.value = priceState.max_price || '';
		priceError.style.display = 'none';
		priceApply.disabled = false;
		closePopover();
	}

	function triggerSearch() {
		// This would integrate with your API search
		console.log('Search with price params:', priceState);
		// You can call your search function here with the price parameters
	}

	// Event listeners
	if (priceTrigger) {
		priceTrigger.addEventListener('click', openPopover);
	}

	if (minPriceInput && maxPriceInput) {
		minPriceInput.addEventListener('input', validatePrice);
		maxPriceInput.addEventListener('input', validatePrice);
	}

	if (priceApply) {
		priceApply.addEventListener('click', applyPrice);
	}

	if (priceClear) {
		priceClear.addEventListener('click', clearPrice);
	}

	if (priceCancel) {
		priceCancel.addEventListener('click', cancelPrice);
	}

	// Close popover on outside click
	document.addEventListener('click', function(e) {
		if (pricePopover && pricePopover.style.display === 'block') {
			if (!pricePopover.contains(e.target) && !priceTrigger.contains(e.target)) {
				cancelPrice();
			}
		}
	});

	// Close popover on Escape key
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape' && pricePopover && pricePopover.style.display === 'block') {
			cancelPrice();
		}
	});

	// Focus trap in popover
	pricePopover.addEventListener('keydown', function(e) {
		if (e.key === 'Tab') {
			const focusableElements = pricePopover.querySelectorAll('input, button');
			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (e.shiftKey) {
				if (document.activeElement === firstElement) {
					lastElement.focus();
					e.preventDefault();
				}
			} else {
				if (document.activeElement === lastElement) {
					firstElement.focus();
					e.preventDefault();
				}
			}
		}
	});

	// Size Popover functionality
	const sizeTrigger = document.getElementById('sizeTrigger');
	const sizePopover = document.getElementById('sizePopover');
	const minSizeInput = document.getElementById('minSize');
	const maxSizeInput = document.getElementById('maxSize');
	const sizeError = document.getElementById('sizeError');
	const sizeApply = document.getElementById('sizeApply');
	const sizeClear = document.getElementById('sizeClear');
	const sizeCancel = document.getElementById('sizeCancel');

	let sizeState = { min_size: null, max_size: null };

	function formatSize(size) {
		return new Intl.NumberFormat('en-US').format(size);
	}

	function updateSizeLabel() {
		const { min_size, max_size } = sizeState;
		if (!min_size && !max_size) {
			sizeTrigger.textContent = 'Size';
		} else if (min_size && !max_size) {
			sizeTrigger.textContent = `From ${formatSize(min_size)} m²`;
		} else if (!min_size && max_size) {
			sizeTrigger.textContent = `Up to ${formatSize(max_size)} m²`;
		} else {
			sizeTrigger.textContent = `${formatSize(min_size)}–${formatSize(max_size)} m²`;
		}
	}

	function validateSize() {
		const min = parseInt(minSizeInput.value) || null;
		const max = parseInt(maxSizeInput.value) || null;
		
		if (min && max && min > max) {
			sizeError.style.display = 'block';
			sizeApply.disabled = true;
			return false;
		} else {
			sizeError.style.display = 'none';
			sizeApply.disabled = false;
			return true;
		}
	}

	function openSizePopover() {
		sizePopover.style.display = 'block';
		sizeTrigger.setAttribute('aria-expanded', 'true');
		minSizeInput.focus();
	}

	function closeSizePopover() {
		sizePopover.style.display = 'none';
		sizeTrigger.setAttribute('aria-expanded', 'false');
		sizeTrigger.focus();
	}

	function applySize() {
		if (!validateSize()) return;
		
		sizeState.min_size = parseInt(minSizeInput.value) || null;
		sizeState.max_size = parseInt(maxSizeInput.value) || null;
		
		updateSizeLabel();
		closeSizePopover();
		
		// Trigger search with new size parameters
		triggerSizeSearch();
	}

	function clearSize() {
		sizeState.min_size = null;
		sizeState.max_size = null;
		minSizeInput.value = '';
		maxSizeInput.value = '';
		sizeError.style.display = 'none';
		sizeApply.disabled = false;
		updateSizeLabel();
		closeSizePopover();
		
		// Trigger search without size parameters
		triggerSizeSearch();
	}

	function cancelSize() {
		// Reset inputs to current state
		minSizeInput.value = sizeState.min_size || '';
		maxSizeInput.value = sizeState.max_size || '';
		sizeError.style.display = 'none';
		sizeApply.disabled = false;
		closeSizePopover();
	}

	function triggerSizeSearch() {
		// This would integrate with your API search
		console.log('Search with size params:', sizeState);
		// You can call your search function here with the size parameters
	}

	// Event listeners for size popover
	if (sizeTrigger) {
		sizeTrigger.addEventListener('click', openSizePopover);
	}

	if (minSizeInput && maxSizeInput) {
		minSizeInput.addEventListener('input', validateSize);
		maxSizeInput.addEventListener('input', validateSize);
	}

	if (sizeApply) {
		sizeApply.addEventListener('click', applySize);
	}

	if (sizeClear) {
		sizeClear.addEventListener('click', clearSize);
	}

	if (sizeCancel) {
		sizeCancel.addEventListener('click', cancelSize);
	}

	// Close size popover on outside click
	document.addEventListener('click', function(e) {
		if (sizePopover && sizePopover.style.display === 'block') {
			if (!sizePopover.contains(e.target) && !sizeTrigger.contains(e.target)) {
				cancelSize();
			}
		}
	});

	// Close size popover on Escape key
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape' && sizePopover && sizePopover.style.display === 'block') {
			cancelSize();
		}
	});

	// Focus trap in size popover
	sizePopover.addEventListener('keydown', function(e) {
		if (e.key === 'Tab') {
			const focusableElements = sizePopover.querySelectorAll('input, button');
			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (e.shiftKey) {
				if (document.activeElement === firstElement) {
					lastElement.focus();
					e.preventDefault();
				}
			} else {
				if (document.activeElement === lastElement) {
					firstElement.focus();
					e.preventDefault();
				}
			}
		}
	});

	// Location Autocomplete functionality - SIMPLIFIED VERSION
	const locationInput = document.getElementById('locationInput');
	const locationSuggestions = document.getElementById('locationSuggestions');
	const countrySelect = document.getElementById('countrySelect');
	
	console.log('=== AUTCOMPLETE DEBUG ===');
	console.log('locationInput:', locationInput);
	console.log('locationSuggestions:', locationSuggestions);
	console.log('countrySelect:', countrySelect);
	
	if (locationInput && locationSuggestions && countrySelect) {
		console.log('✅ All elements found! Setting up autocomplete...');
		
		// Simple location data
		const locations = {
			'DE': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
			'FR': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'],
			'AT': ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck']
		};
		
		// Simple input handler
		locationInput.addEventListener('input', function() {
			const query = this.value.toLowerCase();
			const country = countrySelect.value;
			
			console.log('Input:', query, 'Country:', country);
			
			if (query.length >= 2 && country && locations[country]) {
				const matches = locations[country].filter(city => 
					city.toLowerCase().includes(query)
				);
				
				console.log('Matches found:', matches);
				
				if (matches.length > 0) {
					locationSuggestions.innerHTML = matches.map(city => 
						`<div class="autocomplete-suggestion">${city}</div>`
					).join('');
					locationSuggestions.style.display = 'block';
				} else {
					locationSuggestions.style.display = 'none';
				}
			} else {
				locationSuggestions.style.display = 'none';
			}
		});
		
		// Click handler for suggestions
		locationSuggestions.addEventListener('click', function(e) {
			if (e.target.classList.contains('autocomplete-suggestion')) {
				locationInput.value = e.target.textContent;
				locationSuggestions.style.display = 'none';
			}
		});
		
		console.log('✅ Autocomplete setup complete!');
		
	} else {
		console.log('❌ Missing elements!');
	}
	
	let currentSuggestions = [];
	let selectedIndex = -1;
	let debounceTimer = null;

	// Sample location data by country
	const locationData = {
		'DE': [
			{ name: 'Berlin', type: 'City', region: 'Berlin', zip: '10115' },
			{ name: 'Munich', type: 'City', region: 'Bavaria', zip: '80331' },
			{ name: 'Hamburg', type: 'City', region: 'Hamburg', zip: '20095' },
			{ name: 'Frankfurt', type: 'City', region: 'Hesse', zip: '60311' },
			{ name: 'Cologne', type: 'City', region: 'North Rhine-Westphalia', zip: '50667' },
			{ name: 'Stuttgart', type: 'City', region: 'Baden-Württemberg', zip: '70173' },
			{ name: 'Düsseldorf', type: 'City', region: 'North Rhine-Westphalia', zip: '40213' },
			{ name: 'Dortmund', type: 'City', region: 'North Rhine-Westphalia', zip: '44135' },
			{ name: 'Essen', type: 'City', region: 'North Rhine-Westphalia', zip: '45127' },
			{ name: 'Leipzig', type: 'City', region: 'Saxony', zip: '04109' }
		],
		'AT': [
			{ name: 'Vienna', type: 'City', region: 'Vienna', zip: '1010' },
			{ name: 'Graz', type: 'City', region: 'Styria', zip: '8010' },
			{ name: 'Linz', type: 'City', region: 'Upper Austria', zip: '4020' },
			{ name: 'Salzburg', type: 'City', region: 'Salzburg', zip: '5020' },
			{ name: 'Innsbruck', type: 'City', region: 'Tyrol', zip: '6020' },
			{ name: 'Klagenfurt', type: 'City', region: 'Carinthia', zip: '9020' },
			{ name: 'Villach', type: 'City', region: 'Carinthia', zip: '9500' },
			{ name: 'Wels', type: 'City', region: 'Upper Austria', zip: '4600' },
			{ name: 'Sankt Pölten', type: 'City', region: 'Lower Austria', zip: '3100' },
			{ name: 'Dornbirn', type: 'City', region: 'Vorarlberg', zip: '6850' }
		],
		'CH': [
			{ name: 'Zurich', type: 'City', region: 'Zurich', zip: '8001' },
			{ name: 'Geneva', type: 'City', region: 'Geneva', zip: '1201' },
			{ name: 'Basel', type: 'City', region: 'Basel-City', zip: '4001' },
			{ name: 'Bern', type: 'City', region: 'Bern', zip: '3000' },
			{ name: 'Lausanne', type: 'City', region: 'Vaud', zip: '1000' },
			{ name: 'Winterthur', type: 'City', region: 'Zurich', zip: '8400' },
			{ name: 'Lucerne', type: 'City', region: 'Lucerne', zip: '6002' },
			{ name: 'St. Gallen', type: 'City', region: 'St. Gallen', zip: '9000' },
			{ name: 'Lugano', type: 'City', region: 'Ticino', zip: '6900' },
			{ name: 'Biel', type: 'City', region: 'Bern', zip: '2502' }
		],
		'FR': [
			{ name: 'Paris', type: 'City', region: 'Île-de-France', zip: '75001' },
			{ name: 'Marseille', type: 'City', region: 'Provence-Alpes-Côte d\'Azur', zip: '13001' },
			{ name: 'Lyon', type: 'City', region: 'Auvergne-Rhône-Alpes', zip: '69001' },
			{ name: 'Toulouse', type: 'City', region: 'Occitanie', zip: '31000' },
			{ name: 'Nice', type: 'City', region: 'Provence-Alpes-Côte d\'Azur', zip: '06000' },
			{ name: 'Nantes', type: 'City', region: 'Pays de la Loire', zip: '44000' },
			{ name: 'Strasbourg', type: 'City', region: 'Grand Est', zip: '67000' },
			{ name: 'Montpellier', type: 'City', region: 'Occitanie', zip: '34000' },
			{ name: 'Bordeaux', type: 'City', region: 'Nouvelle-Aquitaine', zip: '33000' },
			{ name: 'Lille', type: 'City', region: 'Hauts-de-France', zip: '59000' }
		],
		'ES': [
			{ name: 'Madrid', type: 'City', region: 'Madrid', zip: '28001' },
			{ name: 'Barcelona', type: 'City', region: 'Catalonia', zip: '08001' },
			{ name: 'Valencia', type: 'City', region: 'Valencia', zip: '46001' },
			{ name: 'Seville', type: 'City', region: 'Andalusia', zip: '41001' },
			{ name: 'Zaragoza', type: 'City', region: 'Aragon', zip: '50001' },
			{ name: 'Málaga', type: 'City', region: 'Andalusia', zip: '29001' },
			{ name: 'Murcia', type: 'City', region: 'Murcia', zip: '30001' },
			{ name: 'Palma', type: 'City', region: 'Balearic Islands', zip: '07001' },
			{ name: 'Las Palmas', type: 'City', region: 'Canary Islands', zip: '35001' },
			{ name: 'Bilbao', type: 'City', region: 'Basque Country', zip: '48001' }
		],
		'IT': [
			{ name: 'Rome', type: 'City', region: 'Lazio', zip: '00118' },
			{ name: 'Milan', type: 'City', region: 'Lombardy', zip: '20121' },
			{ name: 'Naples', type: 'City', region: 'Campania', zip: '80121' },
			{ name: 'Turin', type: 'City', region: 'Piedmont', zip: '10121' },
			{ name: 'Palermo', type: 'City', region: 'Sicily', zip: '90121' },
			{ name: 'Genoa', type: 'City', region: 'Liguria', zip: '16121' },
			{ name: 'Bologna', type: 'City', region: 'Emilia-Romagna', zip: '40121' },
			{ name: 'Florence', type: 'City', region: 'Tuscany', zip: '50121' },
			{ name: 'Bari', type: 'City', region: 'Apulia', zip: '70121' },
			{ name: 'Catania', type: 'City', region: 'Sicily', zip: '95121' }
		],
		'PT': [
			{ name: 'Lisbon', type: 'City', region: 'Lisbon', zip: '1100-001' },
			{ name: 'Porto', type: 'City', region: 'Porto', zip: '4000-001' },
			{ name: 'Vila Nova de Gaia', type: 'City', region: 'Porto', zip: '4400-001' },
			{ name: 'Amadora', type: 'City', region: 'Lisbon', zip: '2700-001' },
			{ name: 'Braga', type: 'City', region: 'Braga', zip: '4700-001' },
			{ name: 'Funchal', type: 'City', region: 'Madeira', zip: '9000-001' },
			{ name: 'Coimbra', type: 'City', region: 'Coimbra', zip: '3000-001' },
			{ name: 'Setúbal', type: 'City', region: 'Setúbal', zip: '2900-001' },
			{ name: 'Almada', type: 'City', region: 'Setúbal', zip: '2800-001' },
			{ name: 'Agualva-Cacém', type: 'City', region: 'Lisbon', zip: '2735-001' }
		],
		'NL': [
			{ name: 'Amsterdam', type: 'City', region: 'North Holland', zip: '1011' },
			{ name: 'Rotterdam', type: 'City', region: 'South Holland', zip: '3011' },
			{ name: 'The Hague', type: 'City', region: 'South Holland', zip: '2511' },
			{ name: 'Utrecht', type: 'City', region: 'Utrecht', zip: '3511' },
			{ name: 'Eindhoven', type: 'City', region: 'North Brabant', zip: '5611' },
			{ name: 'Tilburg', type: 'City', region: 'North Brabant', zip: '5011' },
			{ name: 'Groningen', type: 'City', region: 'Groningen', zip: '9711' },
			{ name: 'Almere', type: 'City', region: 'Flevoland', zip: '1301' },
			{ name: 'Breda', type: 'City', region: 'North Brabant', zip: '4811' },
			{ name: 'Nijmegen', type: 'City', region: 'Gelderland', zip: '6511' }
		],
		'PL': [
			{ name: 'Warsaw', type: 'City', region: 'Masovian', zip: '00-001' },
			{ name: 'Kraków', type: 'City', region: 'Lesser Poland', zip: '30-001' },
			{ name: 'Łódź', type: 'City', region: 'Łódź', zip: '90-001' },
			{ name: 'Wrocław', type: 'City', region: 'Lower Silesian', zip: '50-001' },
			{ name: 'Poznań', type: 'City', region: 'Greater Poland', zip: '60-001' },
			{ name: 'Gdańsk', type: 'City', region: 'Pomeranian', zip: '80-001' },
			{ name: 'Szczecin', type: 'City', region: 'West Pomeranian', zip: '70-001' },
			{ name: 'Bydgoszcz', type: 'City', region: 'Kuyavian-Pomeranian', zip: '85-001' },
			{ name: 'Lublin', type: 'City', region: 'Lublin', zip: '20-001' },
			{ name: 'Katowice', type: 'City', region: 'Silesian', zip: '40-001' }
		],
		'HU': [
			{ name: 'Budapest', type: 'City', region: 'Budapest', zip: '1011' },
			{ name: 'Debrecen', type: 'City', region: 'Hajdú-Bihar', zip: '4000' },
			{ name: 'Szeged', type: 'City', region: 'Csongrád-Csanád', zip: '6720' },
			{ name: 'Miskolc', type: 'City', region: 'Borsod-Abaúj-Zemplén', zip: '3500' },
			{ name: 'Pécs', type: 'City', region: 'Baranya', zip: '7621' },
			{ name: 'Győr', type: 'City', region: 'Győr-Moson-Sopron', zip: '9021' },
			{ name: 'Nyíregyháza', type: 'City', region: 'Szabolcs-Szatmár-Bereg', zip: '4400' },
			{ name: 'Kecskemét', type: 'City', region: 'Bács-Kiskun', zip: '6000' },
			{ name: 'Székesfehérvár', type: 'City', region: 'Fejér', zip: '8000' },
			{ name: 'Szombathely', type: 'City', region: 'Vas', zip: '9700' }
		],
		'CZ': [
			{ name: 'Prague', type: 'City', region: 'Prague', zip: '110 00' },
			{ name: 'Brno', type: 'City', region: 'South Moravian', zip: '602 00' },
			{ name: 'Ostrava', type: 'City', region: 'Moravian-Silesian', zip: '700 30' },
			{ name: 'Plzeň', type: 'City', region: 'Plzeň', zip: '301 00' },
			{ name: 'Liberec', type: 'City', region: 'Liberec', zip: '460 01' },
			{ name: 'Olomouc', type: 'City', region: 'Olomouc', zip: '779 00' },
			{ name: 'České Budějovice', type: 'City', region: 'South Bohemian', zip: '370 01' },
			{ name: 'Hradec Králové', type: 'City', region: 'Hradec Králové', zip: '500 02' },
			{ name: 'Ústí nad Labem', type: 'City', region: 'Ústí nad Labem', zip: '400 01' },
			{ name: 'Pardubice', type: 'City', region: 'Pardubice', zip: '530 02' }
		]
	};

	function getSuggestions(query, country) {
		console.log('getSuggestions called with:', { query, country });
		
		if (!query || query.length < 2 || !country || !locationData[country]) {
			console.log('Early return - conditions not met');
			return [];
		}

		const countryLocations = locationData[country];
		const lowerQuery = query.toLowerCase();
		
		const results = countryLocations.filter(location => 
			location.name.toLowerCase().includes(lowerQuery) ||
			location.region.toLowerCase().includes(lowerQuery) ||
			location.zip.includes(query)
		).slice(0, 8); // Limit to 8 suggestions
		
		console.log('Filtered results:', results);
		return results;
	}

	function renderSuggestions(suggestions) {
		console.log('renderSuggestions called with:', suggestions);
		
		if (suggestions.length === 0) {
			console.log('No suggestions, hiding dropdown');
			locationSuggestions.style.display = 'none';
			return;
		}

		locationSuggestions.innerHTML = suggestions.map((suggestion, index) => `
			<div class="autocomplete-suggestion" data-index="${index}">
				<div class="main-text">${suggestion.name}</div>
				<div class="sub-text">${suggestion.region} • ${suggestion.zip}</div>
				<span class="type-badge">${suggestion.type}</span>
			</div>
		`).join('');

		console.log('Showing dropdown with', suggestions.length, 'suggestions');
		locationSuggestions.style.display = 'block';
		selectedIndex = -1;
	}

	function selectSuggestion(index) {
		if (index >= 0 && index < currentSuggestions.length) {
			const suggestion = currentSuggestions[index];
			locationInput.value = `${suggestion.name}, ${suggestion.region}`;
			locationSuggestions.style.display = 'none';
			selectedIndex = -1;
		}
	}

	function highlightSuggestion(index) {
		const suggestions = locationSuggestions.querySelectorAll('.autocomplete-suggestion');
		suggestions.forEach((suggestion, i) => {
			suggestion.classList.toggle('active', i === index);
		});
	}

	// Event listeners
	if (locationInput) {
		locationInput.addEventListener('input', function() {
			const query = this.value;
			const country = countrySelect.value;
			
			console.log('Input event:', { query, country });
			
			// Simplified - no debounce for now
			currentSuggestions = getSuggestions(query, country);
			console.log('Suggestions found:', currentSuggestions);
			renderSuggestions(currentSuggestions);
		});

		locationInput.addEventListener('keydown', function(e) {
			if (locationSuggestions.style.display === 'none') return;

			switch(e.key) {
				case 'ArrowDown':
					e.preventDefault();
					selectedIndex = Math.min(selectedIndex + 1, currentSuggestions.length - 1);
					highlightSuggestion(selectedIndex);
					break;
				case 'ArrowUp':
					e.preventDefault();
					selectedIndex = Math.max(selectedIndex - 1, -1);
					highlightSuggestion(selectedIndex);
					break;
				case 'Enter':
					e.preventDefault();
					if (selectedIndex >= 0) {
						selectSuggestion(selectedIndex);
					}
					break;
				case 'Escape':
					locationSuggestions.style.display = 'none';
					selectedIndex = -1;
					break;
			}
		});

		locationInput.addEventListener('blur', function() {
			// Delay hiding to allow clicks on suggestions
			setTimeout(() => {
				locationSuggestions.style.display = 'none';
				selectedIndex = -1;
			}, 200);
		});
	}

	if (locationSuggestions) {
		locationSuggestions.addEventListener('click', function(e) {
			const suggestion = e.target.closest('.autocomplete-suggestion');
			if (suggestion) {
				const index = parseInt(suggestion.dataset.index);
				selectSuggestion(index);
			}
		});
	}

	if (countrySelect) {
		countrySelect.addEventListener('change', function() {
			// Clear suggestions when country changes
			locationSuggestions.style.display = 'none';
			selectedIndex = -1;
			
			// If there's text in the input, show new suggestions
			if (locationInput.value.length >= 2) {
				const query = locationInput.value;
				const country = this.value;
				currentSuggestions = getSuggestions(query, country);
				renderSuggestions(currentSuggestions);
			}
		});
	}
});
