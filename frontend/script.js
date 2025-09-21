/**
 * WeatherVibe - Premium Weather Experience
 * 
 * Enhanced Features:
 * - Dynamic weather backgrounds with particle effects
 * - Glassmorphism UI with smooth animations
 * - Interactive temperature unit toggle (°C/°F)
 * - Favorites system with quick-switch functionality
 * - Pull-to-refresh functionality
 * - Toast notifications system
 * - Advanced weather data visualizations
 * - Location services integration
 * - Weather alerts and notifications
 * - Enhanced accessibility support
 */

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// DOM Elements - will be populated in init()
let elements = {};

// Application State
const state = {
    currentCity: null,
    currentCountry: null,
    currentWeatherData: null,
    isLoading: false,
    hasError: false,
    theme: localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    temperatureUnit: localStorage.getItem('temperatureUnit') || 'celsius',
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    lastSearchTime: null,
    pullToRefreshTriggered: false,
    autocompleteTimeout: null
};

// Weather condition mappings
const weatherConditions = {
    clear: ['clear', 'sunny'],
    cloudy: ['clouds', 'overcast', 'partly'],
    rainy: ['rain', 'drizzle', 'shower'],
    snowy: ['snow', 'sleet', 'blizzard'],
    stormy: ['thunderstorm', 'storm'],
    misty: ['mist', 'fog', 'haze']
};

// Weather icons mapping
const weatherIcons = {
    clear: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️',
    stormy: '⛈️',
    misty: '🌫️',
    night: '🌙'
};

/**
 * Initialize the application
 */
function init() {
    console.log('🌤️ WeatherVibe initialized - Premium Weather Experience');
    
    // Initialize DOM elements
    elements = {
        // Search elements
        searchForm: document.getElementById('searchForm'),
        cityInput: document.getElementById('cityInput'),
        countryInput: document.getElementById('countryInput'),
        searchBtn: document.getElementById('searchBtn'),
        searchSuggestions: document.getElementById('searchSuggestions'),
        btnLoading: document.getElementById('btnLoading'),
        autocompleteContainer: document.getElementById('autocompleteContainer'),
        autocompleteList: document.getElementById('autocompleteList'),
        
        // State containers
        loadingContainer: document.getElementById('loadingContainer'),
        errorContainer: document.getElementById('errorContainer'),
        resultsContainer: document.getElementById('resultsContainer'),
        loadingStatus: document.getElementById('loadingStatus'),
        progressFill: document.getElementById('progressFill'),
        
        // Error elements
        errorMessage: document.getElementById('errorMessage'),
        retryBtn: document.getElementById('retryBtn'),
        helpBtn: document.getElementById('helpBtn'),
        
        // Theme and controls
        themeToggle: document.getElementById('themeToggle'),
        themeIcon: document.querySelector('.theme-icon'),
        locationBtn: document.getElementById('locationBtn'),
        favoritesBtn: document.getElementById('favoritesBtn'),
        
        // Unit toggle
        unitToggle: document.querySelectorAll('.unit-btn'),
        
        // Weather background
        weatherBackground: document.getElementById('weatherBackground'),
        weatherParticles: document.getElementById('weatherParticles'),
        
        // Hero section
        heroSection: document.getElementById('heroSection'),
        heroImage: document.getElementById('heroImage'),
        heroTitle: document.getElementById('heroTitle'),
        heroSubtitle: document.getElementById('heroSubtitle'),
        heroTemp: document.getElementById('heroTemp'),
        heroDesc: document.getElementById('heroDesc'),
        heroParticles: document.getElementById('heroParticles'),
        addToFavorites: document.getElementById('addToFavorites'),
        shareWeather: document.getElementById('shareWeather'),
        
        // Weather card
        weatherCard: document.getElementById('weatherCard'),
        weatherIcon: document.getElementById('weatherIcon'),
        currentTemp: document.getElementById('currentTemp'),
        weatherDesc: document.getElementById('weatherDesc'),
        feelsLike: document.getElementById('feelsLike'),
        humidity: document.getElementById('humidity'),
        windSpeed: document.getElementById('windSpeed'),
        pressure: document.getElementById('pressure'),
        lastUpdated: document.getElementById('lastUpdated'),
        
        // Floating action button
        fabButton: document.getElementById('fabButton'),
        
        // Air quality card
        airQualityCard: document.getElementById('airQualityCard'),
        airQualityIndex: document.getElementById('airQualityIndex'),
        airQualityLevel: document.getElementById('airQualityLevel'),
        pm25: document.getElementById('pm25'),
        pm10: document.getElementById('pm10'),
        o3: document.getElementById('o3'),
        
        // City info card
        cityInfoCard: document.getElementById('cityInfoCard'),
        population: document.getElementById('population'),
        timezone: document.getElementById('timezone'),
        elevation: document.getElementById('elevation'),
        coordinates: document.getElementById('coordinates'),
        
        // Forecast card
        forecastCard: document.getElementById('forecastCard'),
        forecastList: document.getElementById('forecastList'),
        
        // Toast and modal elements
        toastContainer: document.getElementById('toastContainer'),
        favoritesModal: document.getElementById('favoritesModal'),
        favoritesList: document.getElementById('favoritesList'),
        closeFavoritesModal: document.getElementById('closeFavoritesModal'),
        
        // Pull to refresh
        pullToRefresh: document.getElementById('pullToRefresh'),
        
        // Weather alerts
        weatherAlerts: document.getElementById('weatherAlerts')
    };
    
    // Debug: Check if buttons are found
    console.log('🔍 Debugging button elements:');
    console.log('Unit toggle buttons:', elements.unitToggle);
    console.log('Location button:', elements.locationBtn);
    console.log('Favorites button:', elements.favoritesBtn);
    console.log('Theme toggle:', elements.themeToggle);
    
    // Set initial theme with system detection
    detectSystemTheme();
    setTheme(state.theme);
    
    // Set initial temperature unit
    setTemperatureUnit(state.temperatureUnit);
    
    // Set active unit button
    elements.unitToggle.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.unit === state.temperatureUnit) {
            btn.classList.add('active');
        }
    });
    
    // Add event listeners
    addEventListeners();
    
    // Initialize favorites
    updateFavoritesList();
    
    // Setup pull-to-refresh
    setupPullToRefresh();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Check for geolocation support
    checkGeolocationSupport();
    
    // Load saved search if available
    const savedSearch = localStorage.getItem('lastSearch');
    if (savedSearch) {
        const { city, country } = JSON.parse(savedSearch);
        elements.cityInput.value = city;
        elements.countryInput.value = country;
    }
}

/**
 * Add all event listeners
 */
function addEventListeners() {
    // Search form submission
    elements.searchForm.addEventListener('submit', handleSearch);
    
    // Search input autocomplete
    elements.cityInput.addEventListener('input', handleAutocomplete);
    elements.cityInput.addEventListener('blur', () => {
        setTimeout(() => hideAutocomplete(), 200);
    });
    
    // Search suggestions
    elements.searchSuggestions.addEventListener('click', handleSuggestionClick);
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Unit toggle
    console.log('Setting up unit toggle listeners for', elements.unitToggle.length, 'buttons');
    elements.unitToggle.forEach(btn => {
        btn.addEventListener('click', handleUnitToggle);
    });
    
    // Location button
    console.log('Setting up location button listener:', elements.locationBtn);
    elements.locationBtn?.addEventListener('click', getCurrentLocation);
    
    // Favorites button
    console.log('Setting up favorites button listener:', elements.favoritesBtn);
    elements.favoritesBtn?.addEventListener('click', showFavoritesModal);
    elements.closeFavoritesModal?.addEventListener('click', hideFavoritesModal);
    
    // Hero actions
    elements.addToFavorites?.addEventListener('click', handleAddToFavorites);
    elements.shareWeather?.addEventListener('click', handleShareWeather);
    
    // Retry and help buttons
    elements.retryBtn.addEventListener('click', retrySearch);
    elements.helpBtn?.addEventListener('click', showHelpToast);
    
    // Floating action button
    elements.fabButton.addEventListener('click', scrollToSearch);
    
    // Input validation
    elements.cityInput.addEventListener('input', validateInput);
    elements.countryInput.addEventListener('input', validateInput);
    
    // Modal backdrop click
    elements.favoritesModal?.addEventListener('click', (e) => {
        if (e.target === elements.favoritesModal) {
            hideFavoritesModal();
        }
    });
    
    // System theme change detection
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectSystemTheme);
    
    // Window events
    window.addEventListener('online', () => showToast('✅', 'Connection restored', 'You\'re back online!'));
    window.addEventListener('offline', () => showToast('⚠️', 'Connection lost', 'Please check your internet connection'));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

/**
 * Handle search form submission
 */
async function handleSearch(event) {
    event.preventDefault();
    
    const city = elements.cityInput.value.trim();
    const country = elements.countryInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    // Save search to localStorage
    localStorage.setItem('lastSearch', JSON.stringify({ city, country }));
    
    // Update state
    state.currentCity = city;
    state.currentCountry = country;
    
    // Perform search
    await searchCity(city, country);
}

/**
 * Handle suggestion tag clicks
 */
function handleSuggestionClick(event) {
    if (event.target.classList.contains('suggestion-tag')) {
        const city = event.target.dataset.city;
        const country = event.target.dataset.country;
        
        elements.cityInput.value = city;
        elements.countryInput.value = country;
        
        // Trigger search
        searchCity(city, country);
    }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

/**
 * Set the application theme
 */
function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme icon
    elements.themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    
    console.log(`🎨 Theme changed to: ${theme}`);
}

/**
 * Retry the last search
 */
function retrySearch() {
    if (state.currentCity) {
        searchCity(state.currentCity, state.currentCountry);
    }
}

/**
 * Scroll to search section
 */
function scrollToSearch() {
    elements.searchForm.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
    elements.cityInput.focus();
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success', duration = 3000) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, duration);
}

/**
 * Validate input fields
 */
function validateInput() {
    const city = elements.cityInput.value.trim();
    const country = elements.countryInput.value.trim();
    
    // Enable/disable search button
    elements.searchBtn.disabled = !city;
    
    // Validate country code format (2 letters)
    if (country && country.length !== 2) {
        elements.countryInput.style.borderColor = 'var(--error-color, #ef4444)';
    } else {
        elements.countryInput.style.borderColor = 'var(--border-color)';
    }
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + K to focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        elements.cityInput.focus();
    }
    
    // Escape to clear search
    if (event.key === 'Escape') {
        elements.cityInput.value = '';
        elements.countryInput.value = '';
        hideResults();
    }
}

/**
 * Main search function
 */
async function searchCity(city, country) {
    try {
        showLoading();
        hideError();
        hideResults();
        
        console.log(`🔍 Searching for: ${city}${country ? `, ${country}` : ''}`);
        
        // Make parallel API calls
        const [weatherData, cityData, imageData] = await Promise.allSettled([
            fetchWeatherData(city, country),
            fetchCityData(city, country),
            fetchImageData(city, country)
        ]);
        
        // Process results
        const results = {
            weather: weatherData.status === 'fulfilled' ? weatherData.value : null,
            city: cityData.status === 'fulfilled' ? cityData.value : null,
            image: imageData.status === 'fulfilled' ? imageData.value : null
        };
        
        // Check if we have at least weather data
        if (!results.weather) {
            throw new Error('Unable to fetch weather data. Please check the city name and try again.');
        }
        
        // Display results
        displayResults(results);
        
        // Show success toast
        showToast(`Weather data loaded for ${city}!`, 'success');
        
        console.log('✅ Search completed successfully');
        
    } catch (error) {
        console.error('❌ Search failed:', error);
        showError(error.message || 'An unexpected error occurred. Please try again.');
        showToast(error.message || 'Failed to load weather data', 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Fetch weather data from API
 */
async function fetchWeatherData(city, country) {
    const url = `${API_BASE_URL}/weather?city=${encodeURIComponent(city)}${country ? `&country=${encodeURIComponent(country)}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch weather data');
    }
    
    return await response.json();
}

/**
 * Fetch city data from API
 */
async function fetchCityData(city, country) {
    const url = `${API_BASE_URL}/city?city=${encodeURIComponent(city)}${country ? `&country=${encodeURIComponent(country)}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch city data');
    }
    
    return await response.json();
}

/**
 * Fetch image data from API
 */
async function fetchImageData(city, country) {
    const url = `${API_BASE_URL}/image?city=${encodeURIComponent(city)}${country ? `&country=${encodeURIComponent(country)}` : ''}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch image data');
    }
    
    return await response.json();
}

/**
 * Display search results
 */
function displayResults(results) {
    const { weather, city, image } = results;
    
    // Update hero section
    updateHeroSection(weather, city, image);
    
    // Update weather card
    updateWeatherCard(weather);
    
    // Update air quality card
    updateAirQualityCard(weather);
    
    // Update city info card
    updateCityInfoCard(city);
    
    // Update forecast card
    updateForecastCard(weather);
    
    // Show results
    showResults();
}

/**
 * Update hero section with city image and info
 */
function updateHeroSection(weather, city, image) {
    // Set background image
    if (image && image.urls) {
        elements.heroImage.style.backgroundImage = `url(${image.urls.regular})`;
    } else {
        // Fallback gradient
        elements.heroImage.style.backgroundImage = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
    }
    
    // Update title and subtitle
    elements.heroTitle.textContent = weather.current.name || state.currentCity;
    elements.heroSubtitle.textContent = weather.current.sys.country || state.currentCountry || '';
    
    // Update hero temperature
    elements.heroTemp.textContent = `${convertTemperature(weather.current.main.temp)}${getTemperatureUnit()}`;
    elements.heroDesc.textContent = weather.current.weather[0].description;
}

/**
 * Get weather icon based on weather condition
 */
function getWeatherIcon(weatherCode, description) {
    const iconMap = {
        // Clear sky
        '01d': '☀️', '01n': '🌙',
        // Few clouds
        '02d': '⛅', '02n': '☁️',
        // Scattered clouds
        '03d': '☁️', '03n': '☁️',
        // Broken clouds
        '04d': '☁️', '04n': '☁️',
        // Shower rain
        '09d': '🌦️', '09n': '🌧️',
        // Rain
        '10d': '🌦️', '10n': '🌧️',
        // Thunderstorm
        '11d': '⛈️', '11n': '⛈️',
        // Snow
        '13d': '❄️', '13n': '❄️',
        // Mist
        '50d': '🌫️', '50n': '🌫️'
    };
    
    return iconMap[weatherCode] || '🌤️';
}

/**
 * Update weather card with current weather data
 */
function updateWeatherCard(weather) {
    const current = weather.current;
    
    // Store current weather data for unit conversion
    state.currentWeatherData = weather;
    
    // Update weather icon
    const weatherIcon = getWeatherIcon(current.weather[0].icon, current.weather[0].description);
    elements.weatherIcon.textContent = weatherIcon;
    
    // Main weather info with proper unit conversion
    elements.currentTemp.textContent = `${convertTemperature(current.main.temp)}${getTemperatureUnit()}`;
    elements.weatherDesc.textContent = current.weather[0].description;
    
    // Weather details with proper unit conversion
    elements.feelsLike.textContent = `${convertTemperature(current.main.feels_like)}${getTemperatureUnit()}`;
    elements.humidity.textContent = `${current.main.humidity}%`;
    elements.windSpeed.textContent = `${current.wind.speed} m/s`;
    elements.pressure.textContent = `${current.main.pressure} hPa`;
    
    // Update last updated time
    const now = new Date();
    elements.lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()}`;
}

/**
 * Update air quality card
 */
function updateAirQualityCard(weather) {
    const airQuality = weather.airQuality;
    
    if (!airQuality || !airQuality.list || airQuality.list.length === 0) {
        // Hide air quality card if no data
        elements.airQualityCard.style.display = 'none';
        return;
    }
    
    elements.airQualityCard.style.display = 'block';
    
    const aqi = airQuality.list[0].main.aqi;
    const components = airQuality.list[0].components;
    
    // AQI level mapping
    const aqiLevels = {
        1: { level: 'Good', class: 'good' },
        2: { level: 'Fair', class: 'moderate' },
        3: { level: 'Moderate', class: 'unhealthy-sensitive' },
        4: { level: 'Poor', class: 'unhealthy' },
        5: { level: 'Very Poor', class: 'very-unhealthy' }
    };
    
    const aqiInfo = aqiLevels[aqi] || { level: 'Unknown', class: 'moderate' };
    
    // Update AQI display
    elements.airQualityIndex.textContent = aqi;
    elements.airQualityIndex.className = `air-quality-index ${aqiInfo.class}`;
    
    elements.airQualityLevel.textContent = aqiInfo.level;
    elements.airQualityLevel.className = `air-quality-level ${aqiInfo.class}`;
    
    // Update pollutant values
    elements.pm25.textContent = `${Math.round(components.pm2_5)} μg/m³`;
    elements.pm10.textContent = `${Math.round(components.pm10)} μg/m³`;
    elements.o3.textContent = `${Math.round(components.o3)} μg/m³`;
}

/**
 * Update city information card
 */
function updateCityInfoCard(city) {
    if (!city) {
        // Hide city info card if no data
        elements.cityInfoCard.style.display = 'none';
        return;
    }
    
    elements.cityInfoCard.style.display = 'block';
    
    // Update city details
    elements.population.textContent = city.population ? formatNumber(city.population) : 'N/A';
    elements.timezone.textContent = city.timezone || 'N/A';
    elements.elevation.textContent = city.elevationMeters ? `${city.elevationMeters} m` : 'N/A';
    elements.coordinates.textContent = city.latitude && city.longitude 
        ? `${city.latitude.toFixed(2)}, ${city.longitude.toFixed(2)}`
        : 'N/A';
}

/**
 * Update forecast card
 */
function updateForecastCard(weather) {
    if (!weather.forecast || !weather.forecast.list) {
        // Hide forecast card if no data
        elements.forecastCard.style.display = 'none';
        return;
    }
    
    elements.forecastCard.style.display = 'block';
    
    // Clear existing forecast items
    elements.forecastList.innerHTML = '';
    
    // Get daily forecasts (every 8th item for daily data)
    const dailyForecasts = weather.forecast.list.filter((_, index) => index % 8 === 0).slice(0, 5);
    
    dailyForecasts.forEach(forecast => {
        const forecastItem = createForecastItem(forecast);
        elements.forecastList.appendChild(forecastItem);
    });
}

/**
 * Create a forecast item element
 */
function createForecastItem(forecast) {
    const item = document.createElement('div');
    item.className = 'forecast-item';
    
    const date = new Date(forecast.dt * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const temp = Math.round(forecast.main.temp);
    const description = forecast.weather[0].description;
    
    item.innerHTML = `
        <div class="forecast-day">${dayName}</div>
        <div class="forecast-temp">${temp}°C</div>
        <div class="forecast-desc">${description}</div>
    `;
    
    return item;
}

/**
 * Show loading state
 */
function showLoading() {
    state.isLoading = true;
    elements.loadingContainer.classList.add('show');
    elements.searchBtn.disabled = true;
    elements.searchBtn.innerHTML = '<span class="btn-text">Searching...</span><span class="btn-icon">⏳</span>';
}

/**
 * Hide loading state
 */
function hideLoading() {
    state.isLoading = false;
    elements.loadingContainer.classList.remove('show');
    elements.searchBtn.disabled = false;
    elements.searchBtn.innerHTML = '<span class="btn-text">Search</span><span class="btn-icon">🔍</span>';
}

/**
 * Show error state
 */
function showError(message) {
    state.hasError = true;
    elements.errorMessage.textContent = message;
    elements.errorContainer.classList.add('show');
}

/**
 * Hide error state
 */
function hideError() {
    state.hasError = false;
    elements.errorContainer.classList.remove('show');
}

/**
 * Show results
 */
function showResults() {
    elements.resultsContainer.classList.add('show');
}

/**
 * Hide results
 */
function hideResults() {
    elements.resultsContainer.classList.remove('show');
}

/**
 * Format large numbers with commas
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Utility function to debounce API calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================
// ENHANCED FEATURES
// ========================

/**
 * Detect system theme preference
 */
function detectSystemTheme() {
    if (!localStorage.getItem('theme')) {
        state.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}

/**
 * Handle temperature unit toggle
 */
function handleUnitToggle(event) {
    const unit = event.target.dataset.unit;
    if (!unit) return;
    
    setTemperatureUnit(unit);
    
    // Update active button
    elements.unitToggle.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Re-render temperatures if data exists
    if (state.currentWeatherData) {
        updateTemperatureDisplays(state.currentWeatherData);
    }
    
    showToast('🌡️', 'Unit changed', `Now showing temperatures in °${unit === 'celsius' ? 'C' : 'F'}`);
}

/**
 * Set temperature unit
 */
function setTemperatureUnit(unit) {
    state.temperatureUnit = unit;
    localStorage.setItem('temperatureUnit', unit);
}

/**
 * Convert temperature based on current unit
 */
function convertTemperature(celsius) {
    if (state.temperatureUnit === 'fahrenheit') {
        return Math.round((celsius * 9/5) + 32);
    }
    return Math.round(celsius);
}

/**
 * Get temperature unit symbol
 */
function getTemperatureUnit() {
    return state.temperatureUnit === 'celsius' ? '°C' : '°F';
}

/**
 * Update all temperature displays
 */
function updateTemperatureDisplays(data) {
    if (elements.currentTemp) {
        elements.currentTemp.textContent = `${convertTemperature(data.current.main.temp)}${getTemperatureUnit()}`;
    }
    if (elements.heroTemp) {
        elements.heroTemp.textContent = `${convertTemperature(data.current.main.temp)}${getTemperatureUnit()}`;
    }
    if (elements.feelsLike) {
        elements.feelsLike.textContent = `${convertTemperature(data.current.main.feels_like)}${getTemperatureUnit()}`;
    }
    
    // Update forecast temperatures
    updateForecastTemperatures(data.forecast);
}

/**
 * Update forecast temperatures
 */
function updateForecastTemperatures(forecast) {
    const forecastItems = elements.forecastList.querySelectorAll('.forecast-item');
    const dailyForecasts = getDailyForecasts(forecast.list);
    
    forecastItems.forEach((item, index) => {
        if (dailyForecasts[index]) {
            const tempElement = item.querySelector('.forecast-temp');
            if (tempElement) {
                const temp = convertTemperature(dailyForecasts[index].main.temp);
                tempElement.textContent = `${temp}${getTemperatureUnit()}`;
            }
        }
    });
}

/**
 * Handle autocomplete for city search
 */
function handleAutocomplete(event) {
    const query = event.target.value.trim();
    
    if (state.autocompleteTimeout) {
        clearTimeout(state.autocompleteTimeout);
    }
    
    if (query.length < 2) {
        hideAutocomplete();
        return;
    }
    
    state.autocompleteTimeout = setTimeout(() => {
        showAutocomplete(getAutocompleteSuggestions(query));
    }, 300);
}

/**
 * Get autocomplete suggestions
 */
function getAutocompleteSuggestions(query) {
    const popularCities = [
        { name: 'London', country: 'GB', full: 'London, United Kingdom' },
        { name: 'New York', country: 'US', full: 'New York, United States' },
        { name: 'Tokyo', country: 'JP', full: 'Tokyo, Japan' },
        { name: 'Paris', country: 'FR', full: 'Paris, France' },
        { name: 'Sydney', country: 'AU', full: 'Sydney, Australia' },
        { name: 'Berlin', country: 'DE', full: 'Berlin, Germany' },
        { name: 'Mumbai', country: 'IN', full: 'Mumbai, India' },
        { name: 'São Paulo', country: 'BR', full: 'São Paulo, Brazil' }
    ];
    
    return popularCities.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
}

/**
 * Show autocomplete suggestions
 */
function showAutocomplete(suggestions) {
    if (!suggestions.length) {
        hideAutocomplete();
        return;
    }
    
    elements.autocompleteList.innerHTML = suggestions.map(suggestion => `
        <div class="autocomplete-item" data-city="${suggestion.name}" data-country="${suggestion.country}">
            ${suggestion.full}
        </div>
    `).join('');
    
    elements.autocompleteContainer.style.display = 'block';
    
    // Add click handlers
    elements.autocompleteList.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
            elements.cityInput.value = item.dataset.city;
            elements.countryInput.value = item.dataset.country;
            hideAutocomplete();
            elements.searchForm.dispatchEvent(new Event('submit'));
        });
    });
}

/**
 * Hide autocomplete suggestions
 */
function hideAutocomplete() {
    elements.autocompleteContainer.style.display = 'none';
}

/**
 * Get current location using geolocation API
 */
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showToast('❌', 'Location not supported', 'Geolocation is not supported by this browser');
        return;
    }
    
    showToast('📍', 'Getting location...', 'Please allow location access');
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
                // Use reverse geocoding to get city name
                const reverseGeocodeUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
                
                const response = await fetch(reverseGeocodeUrl);
                const data = await response.json();
                
                if (data.city && data.countryCode) {
                    elements.cityInput.value = data.city;
                    elements.countryInput.value = data.countryCode;
                    
                    showToast('✅', 'Location found', `Found ${data.city}, ${data.countryName}`);
                    elements.searchForm.dispatchEvent(new Event('submit'));
                } else {
                    // Fallback to coordinates
                    elements.cityInput.value = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
                    elements.countryInput.value = '';
                    
                    showToast('✅', 'Location found', 'Searching weather for your location...');
                    elements.searchForm.dispatchEvent(new Event('submit'));
                }
            } catch (error) {
                console.error('Reverse geocoding failed:', error);
                // Fallback to coordinates
                elements.cityInput.value = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
                elements.countryInput.value = '';
                
                showToast('✅', 'Location found', 'Searching weather for your location...');
                elements.searchForm.dispatchEvent(new Event('submit'));
            }
        },
        (error) => {
            let message = 'Location access denied';
            if (error.code === error.TIMEOUT) {
                message = 'Location request timed out';
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                message = 'Location information unavailable';
            }
            showToast('❌', 'Location error', message);
        },
        { timeout: 10000, enableHighAccuracy: true }
    );
}

/**
 * Check geolocation support
 */
function checkGeolocationSupport() {
    if (elements.locationBtn) {
        if (!navigator.geolocation) {
            elements.locationBtn.style.display = 'none';
        }
    }
}

/**
 * Show favorites modal
 */
function showFavoritesModal() {
    updateFavoritesList();
    elements.favoritesModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Hide favorites modal
 */
function hideFavoritesModal() {
    elements.favoritesModal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Update favorites list
 */
function updateFavoritesList() {
    if (!elements.favoritesList) return;
    
    if (state.favorites.length === 0) {
        elements.favoritesList.innerHTML = `
            <div class="no-favorites">
                <p>No favorite locations yet</p>
                <small>Search for a city and add it to favorites</small>
            </div>
        `;
        return;
    }
    
    elements.favoritesList.innerHTML = state.favorites.map(favorite => `
        <div class="favorite-item" data-city="${favorite.city}" data-country="${favorite.country}">
            <div class="favorite-info">
                <h4>${favorite.city}</h4>
                <p>${favorite.country}</p>
            </div>
            <div class="favorite-actions">
                <button class="load-favorite" title="Load weather">🔄</button>
                <button class="remove-favorite" title="Remove from favorites">❌</button>
            </div>
        </div>
    `).join('');
    
    // Add event handlers
    elements.favoritesList.querySelectorAll('.load-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.favorite-item');
            loadFavoriteWeather(item.dataset.city, item.dataset.country);
        });
    });
    
    elements.favoritesList.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.favorite-item');
            removeFavorite(item.dataset.city, item.dataset.country);
        });
    });
}

/**
 * Load weather for favorite location
 */
function loadFavoriteWeather(city, country) {
    elements.cityInput.value = city;
    elements.countryInput.value = country;
    hideFavoritesModal();
    elements.searchForm.dispatchEvent(new Event('submit'));
}

/**
 * Add current location to favorites
 */
function handleAddToFavorites() {
    if (!state.currentCity) {
        showToast('❌', 'No location', 'Please search for a location first');
        return;
    }
    
    const favorite = {
        city: state.currentCity,
        country: state.currentCountry || '',
        addedAt: new Date().toISOString()
    };
    
    // Check if already in favorites
    const exists = state.favorites.some(f => f.city === favorite.city && f.country === favorite.country);
    
    if (exists) {
        showToast('ℹ️', 'Already favorited', 'This location is already in your favorites');
        return;
    }
    
    state.favorites.push(favorite);
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
    
    // Update button appearance
    elements.addToFavorites.innerHTML = '<span class="favorite-icon">❤️</span>';
    elements.addToFavorites.classList.add('favorited');
    
    showToast('❤️', 'Added to favorites', `${favorite.city} saved to your favorites`);
}

/**
 * Remove from favorites
 */
function removeFavorite(city, country) {
    state.favorites = state.favorites.filter(f => !(f.city === city && f.country === country));
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
    updateFavoritesList();
    showToast('🗑️', 'Removed', 'Location removed from favorites');
}

/**
 * Handle share weather
 */
function handleShareWeather() {
    if (!state.currentWeatherData) {
        showToast('❌', 'No data', 'Please search for weather data first');
        return;
    }
    
    const data = state.currentWeatherData;
    const temp = convertTemperature(data.current.main.temp);
    const text = `Weather in ${state.currentCity}: ${temp}${getTemperatureUnit()}, ${data.current.weather[0].description}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'WeatherVibe',
            text: text,
            url: window.location.href
        }).then(() => {
            showToast('✅', 'Shared', 'Weather data shared successfully');
        }).catch(() => {
            fallbackShare(text);
        });
    } else {
        fallbackShare(text);
    }
}

/**
 * Fallback share function
 */
function fallbackShare(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('📋', 'Copied', 'Weather data copied to clipboard');
    }).catch(() => {
        showToast('❌', 'Share failed', 'Could not share weather data');
    });
}

/**
 * Show toast notification
 */
function showToast(icon, title, message, duration = 5000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">×</button>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Add close handler
    toast.querySelector('.toast-close').addEventListener('click', () => {
        removeToast(toast);
    });
    
    // Auto remove
    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

/**
 * Remove toast notification
 */
function removeToast(toast) {
    if (toast && toast.parentNode) {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

/**
 * Show help toast
 */
function showHelpToast() {
    showToast('❓', 'Help', 'Try searching for a city name, or use your current location');
}

/**
 * Setup pull-to-refresh functionality
 */
function setupPullToRefresh() {
    let startY = 0;
    let currentY = 0;
    let pullDistance = 0;
    const threshold = 100;
    
    document.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
        }
    });
    
    document.addEventListener('touchmove', (e) => {
        if (window.scrollY === 0 && startY) {
            currentY = e.touches[0].clientY;
            pullDistance = currentY - startY;
            
            if (pullDistance > 0) {
                e.preventDefault();
                
                if (pullDistance > threshold) {
                    elements.pullToRefresh.classList.add('active');
                } else {
                    elements.pullToRefresh.classList.remove('active');
                }
            }
        }
    });
    
    document.addEventListener('touchend', () => {
        if (pullDistance > threshold && !state.pullToRefreshTriggered) {
            state.pullToRefreshTriggered = true;
            refreshWeatherData();
        }
        
        elements.pullToRefresh.classList.remove('active');
        startY = 0;
        currentY = 0;
        pullDistance = 0;
    });
}

/**
 * Refresh weather data
 */
function refreshWeatherData() {
    if (state.currentCity && state.currentCountry) {
        showToast('🔄', 'Refreshing...', 'Updating weather data');
        elements.searchForm.dispatchEvent(new Event('submit'));
    }
    
    setTimeout(() => {
        state.pullToRefreshTriggered = false;
    }, 2000);
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    // Already handled in handleKeyboardShortcuts
}

/**
 * Enhanced keyboard shortcuts handler
 */
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + K: Focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        elements.cityInput.focus();
    }
    
    // Ctrl/Cmd + D: Toggle theme
    if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        event.preventDefault();
        toggleTheme();
    }
    
    // Ctrl/Cmd + L: Get current location
    if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
        event.preventDefault();
        getCurrentLocation();
    }
    
    // Ctrl/Cmd + F: Show favorites
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        showFavoritesModal();
    }
    
    // Escape: Close modals
    if (event.key === 'Escape') {
        hideFavoritesModal();
        hideAutocomplete();
    }
}

/**
 * Update weather background based on conditions
 */
function updateWeatherBackground(weatherData) {
    const condition = weatherData.current.weather[0].main.toLowerCase();
    const isNight = isNightTime(weatherData.current.dt, weatherData.current.sys.sunrise, weatherData.current.sys.sunset);
    
    // Remove existing classes
    elements.weatherBackground.className = 'weather-background';
    
    // Determine background class
    let backgroundClass = 'sunny';
    
    for (const [key, conditions] of Object.entries(weatherConditions)) {
        if (conditions.some(c => condition.includes(c))) {
            backgroundClass = key;
            break;
        }
    }
    
    if (isNight) {
        backgroundClass = 'night';
    }
    
    elements.weatherBackground.classList.add(backgroundClass);
    
    // Add weather particles
    createWeatherParticles(backgroundClass);
}

/**
 * Check if it's night time
 */
function isNightTime(currentTime, sunrise, sunset) {
    return currentTime < sunrise || currentTime > sunset;
}

/**
 * Create weather particles animation
 */
function createWeatherParticles(condition) {
    if (!elements.weatherParticles) return;
    
    elements.weatherParticles.innerHTML = '';
    
    if (condition === 'rainy') {
        createRainParticles();
    } else if (condition === 'snowy') {
        createSnowParticles();
    }
}

/**
 * Create rain particles
 */
function createRainParticles() {
    for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDelay = Math.random() * 2 + 's';
        drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
        elements.weatherParticles.appendChild(drop);
    }
}

/**
 * Create snow particles
 */
function createSnowParticles() {
    for (let i = 0; i < 30; i++) {
        const flake = document.createElement('div');
        flake.className = 'snow-flake';
        flake.style.left = Math.random() * 100 + '%';
        flake.style.animationDelay = Math.random() * 3 + 's';
        flake.style.animationDuration = (Math.random() * 2 + 3) + 's';
        flake.textContent = '❄';
        elements.weatherParticles.appendChild(flake);
    }
}

/**
 * Enhanced weather icon selection
 */
function getAdvancedWeatherIcon(weatherData) {
    const condition = weatherData.current.weather[0].main.toLowerCase();
    const isNight = isNightTime(weatherData.current.dt, weatherData.current.sys?.sunrise, weatherData.current.sys?.sunset);
    
    if (isNight && condition === 'clear') {
        return weatherIcons.night;
    }
    
    for (const [key, conditions] of Object.entries(weatherConditions)) {
        if (conditions.some(c => condition.includes(c))) {
            return weatherIcons[key];
        }
    }
    
    return weatherIcons.clear;
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init,
        searchCity,
        setTheme,
        formatNumber
    };
}
