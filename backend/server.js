/**
 * Weather & City Info Hub - Backend Server
 * 
 * This Express.js server acts as a wrapper API that fetches data from:
 * - OpenWeatherMap API (weather & air quality)
 * - Unsplash API (city images)
 * - GeoDB Cities API (city information)
 * 
 * Features:
 * - Simple caching for better performance
 * - Error handling and validation
 * - CORS enabled for frontend integration
 * - Environment variable configuration
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Initialize cache with TTL from environment (default 5 minutes)
const cache = new NodeCache({ 
    stdTTL: process.env.CACHE_TTL || 300 
});

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON bodies

// API Configuration
const API_CONFIG = {
    openweather: {
        key: process.env.OPENWEATHER_API_KEY,
        baseUrl: process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5'
    },
    unsplash: {
        key: process.env.UNSPLASH_ACCESS_KEY,
        baseUrl: process.env.UNSPLASH_BASE_URL || 'https://api.unsplash.com'
    },
    geodb: {
        key: process.env.GEODB_API_KEY,
        baseUrl: process.env.GEODB_BASE_URL || 'https://wft-geo-db.p.rapidapi.com/v1'
    }
};

/**
 * Helper function to validate API keys
 */
function validateApiKeys() {
    const missingKeys = [];
    
    if (!API_CONFIG.openweather.key) missingKeys.push('OPENWEATHER_API_KEY');
    if (!API_CONFIG.unsplash.key) missingKeys.push('UNSPLASH_ACCESS_KEY');
    if (!API_CONFIG.geodb.key) missingKeys.push('GEODB_API_KEY');
    
    if (missingKeys.length > 0) {
        console.warn(`⚠️  Missing API keys: ${missingKeys.join(', ')}`);
        console.warn('Some features may not work properly. Please check your .env file.');
    }
}

/**
 * Helper function to make cached API requests
 * @param {string} cacheKey - Unique key for caching
 * @param {Function} apiCall - Function that makes the actual API call
 * @returns {Promise} - Cached or fresh API response
 */
async function getCachedData(cacheKey, apiCall) {
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log(`📦 Cache hit for: ${cacheKey}`);
        return cachedData;
    }
    
    try {
        console.log(`🌐 API call for: ${cacheKey}`);
        const data = await apiCall();
        cache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error(`❌ API error for ${cacheKey}:`, error.message);
        throw error;
    }
}

/**
 * Weather endpoint - Get current weather and forecast
 * GET /api/weather?city=London&country=GB
 */
app.get('/api/weather', async (req, res) => {
    try {
        const { city, country } = req.query;
        
        if (!city) {
            return res.status(400).json({
                error: 'City parameter is required',
                example: '/api/weather?city=London&country=GB'
            });
        }
        
        const cacheKey = `weather_${city}_${country || 'default'}`;
        
        const weatherData = await getCachedData(cacheKey, async () => {
            // Get coordinates first
            const geoResponse = await axios.get(`${API_CONFIG.openweather.baseUrl}/weather`, {
                params: {
                    q: country ? `${city},${country}` : city,
                    appid: API_CONFIG.openweather.key,
                    units: 'metric'
                }
            });
            
            const { lat, lon } = geoResponse.data.coord;
            
            // Get current weather
            const currentWeather = geoResponse.data;
            
            // Get 5-day forecast
            const forecastResponse = await axios.get(`${API_CONFIG.openweather.baseUrl}/forecast`, {
                params: {
                    lat,
                    lon,
                    appid: API_CONFIG.openweather.key,
                    units: 'metric'
                }
            });
            
            // Get air quality
            let airQuality = null;
            try {
                const airQualityResponse = await axios.get(`${API_CONFIG.openweather.baseUrl}/air_pollution`, {
                    params: {
                        lat,
                        lon,
                        appid: API_CONFIG.openweather.key
                    }
                });
                airQuality = airQualityResponse.data;
            } catch (airError) {
                console.warn('Air quality data not available:', airError.message);
            }
            
            return {
                current: currentWeather,
                forecast: forecastResponse.data,
                airQuality,
                coordinates: { lat, lon }
            };
        });
        
        res.json(weatherData);
        
    } catch (error) {
        console.error('Weather API error:', error.message);
        
        if (error.response?.status === 404) {
            return res.status(404).json({
                error: 'City not found',
                message: 'Please check the city name and try again'
            });
        }
        
        res.status(500).json({
            error: 'Failed to fetch weather data',
            message: error.message
        });
    }
});

/**
 * City information endpoint - Get city facts and details
 * GET /api/city?city=London&country=GB
 */
app.get('/api/city', async (req, res) => {
    try {
        const { city, country } = req.query;
        
        if (!city) {
            return res.status(400).json({
                error: 'City parameter is required',
                example: '/api/city?city=London&country=GB'
            });
        }
        
        const cacheKey = `city_${city}_${country || 'default'}`;
        
        const cityData = await getCachedData(cacheKey, async () => {
            const response = await axios.get(`${API_CONFIG.geodb.baseUrl}/geo/cities`, {
                params: {
                    namePrefix: city,
                    countryIds: country,
                    limit: 1,
                    sort: 'population'
                },
                headers: {
                    'X-RapidAPI-Key': API_CONFIG.geodb.key,
                    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
                }
            });
            
            if (!response.data.data || response.data.data.length === 0) {
                throw new Error('City not found');
            }
            
            const cityInfo = response.data.data[0];
            
            return {
                name: cityInfo.name,
                country: cityInfo.country,
                countryCode: cityInfo.countryCode,
                population: cityInfo.population,
                latitude: cityInfo.latitude,
                longitude: cityInfo.longitude,
                timezone: cityInfo.timezone,
                elevationMeters: cityInfo.elevationMeters,
                wikiDataId: cityInfo.wikiDataId
            };
        });
        
        res.json(cityData);
        
    } catch (error) {
        console.error('City API error:', error.message);
        
        if (error.message === 'City not found') {
            return res.status(404).json({
                error: 'City not found',
                message: 'Please check the city name and try again'
            });
        }
        
        res.status(500).json({
            error: 'Failed to fetch city data',
            message: error.message
        });
    }
});

/**
 * City image endpoint - Get beautiful city images
 * GET /api/image?city=London&country=GB
 */
app.get('/api/image', async (req, res) => {
    try {
        const { city, country } = req.query;
        
        if (!city) {
            return res.status(400).json({
                error: 'City parameter is required',
                example: '/api/image?city=London&country=GB'
            });
        }
        
        const cacheKey = `image_${city}_${country || 'default'}`;
        
        const imageData = await getCachedData(cacheKey, async () => {
            const searchQuery = country ? `${city}, ${country}` : city;
            
            const response = await axios.get(`${API_CONFIG.unsplash.baseUrl}/search/photos`, {
                params: {
                    query: searchQuery,
                    per_page: 5,
                    orientation: 'landscape'
                },
                headers: {
                    'Authorization': `Client-ID ${API_CONFIG.unsplash.key}`
                }
            });
            
            if (!response.data.results || response.data.results.length === 0) {
                throw new Error('No images found for this city');
            }
            
            // Return the first image with different sizes
            const image = response.data.results[0];
            
            return {
                id: image.id,
                description: image.description || image.alt_description || `${city} cityscape`,
                urls: {
                    small: image.urls.small,
                    regular: image.urls.regular,
                    full: image.urls.full
                },
                photographer: {
                    name: image.user.name,
                    username: image.user.username,
                    profileUrl: image.user.links.html
                },
                downloadUrl: image.links.download_location
            };
        });
        
        res.json(imageData);
        
    } catch (error) {
        console.error('Image API error:', error.message);
        
        if (error.message === 'No images found for this city') {
            return res.status(404).json({
                error: 'No images found',
                message: 'No images available for this city'
            });
        }
        
        res.status(500).json({
            error: 'Failed to fetch city image',
            message: error.message
        });
    }
});

/**
 * Health check endpoint
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        cache: {
            keys: cache.keys().length,
            stats: cache.getStats()
        }
    });
});

/**
 * Cache management endpoint
 * DELETE /api/cache - Clear all cache
 * DELETE /api/cache/:key - Clear specific cache key
 */
app.delete('/api/cache/:key?', (req, res) => {
    const { key } = req.params;
    
    if (key) {
        const deleted = cache.del(key);
        res.json({
            message: deleted ? `Cache key '${key}' cleared` : `Cache key '${key}' not found`,
            deleted: !!deleted
        });
    } else {
        cache.flushAll();
        res.json({
            message: 'All cache cleared',
            keysCleared: cache.keys().length
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.ENVIRONMENT === 'development' ? error.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        availableEndpoints: [
            'GET /api/weather?city=London&country=GB',
            'GET /api/city?city=London&country=GB', 
            'GET /api/image?city=London&country=GB',
            'GET /api/health',
            'DELETE /api/cache',
            'DELETE /api/cache/:key'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Weather & City Info Hub Backend running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.ENVIRONMENT || 'development'}`);
    console.log(`💾 Cache TTL: ${process.env.CACHE_TTL || 300} seconds`);
    
    // Validate API keys on startup
    validateApiKeys();
    
    console.log(`\n📋 Available endpoints:`);
    console.log(`   GET  /api/weather?city=London&country=GB`);
    console.log(`   GET  /api/city?city=London&country=GB`);
    console.log(`   GET  /api/image?city=London&country=GB`);
    console.log(`   GET  /api/health`);
    console.log(`   DELETE /api/cache\n`);
});

module.exports = app;
