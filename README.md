# 🌤️ Weather & City Info Hub

A comprehensive, portfolio-ready weather and city information application that showcases modern full-stack development skills. Built with Node.js, Express.js, and vanilla JavaScript, featuring beautiful UI, dark mode, and multiple API integrations.

![Weather Hub Demo](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Weather+%26+City+Info+Hub)

## ✨ Features

### 🌡️ Weather Information
- **Current Weather**: Temperature, humidity, wind speed, pressure
- **5-Day Forecast**: Detailed weather predictions
- **Air Quality**: PM2.5, PM10, O₃ levels with AQI ratings
- **Real-time Data**: Powered by OpenWeatherMap API

### 🏙️ City Information
- **Population Data**: Current city population
- **Geographic Details**: Coordinates, elevation, timezone
- **Country Information**: Country codes and names
- **Data Source**: GeoDB Cities API

### 🖼️ Visual Experience
- **City Images**: Beautiful, high-quality photos from Unsplash
- **Responsive Design**: Works perfectly on all devices
- **Dark/Light Mode**: Toggle between themes
- **Smooth Animations**: Engaging user interactions

### 🚀 Technical Features
- **Caching System**: Improved performance with Node.js caching
- **Error Handling**: Comprehensive error management
- **Loading States**: User-friendly loading indicators
- **API Security**: Environment variable protection
- **RESTful API**: Clean, well-documented endpoints

## 🏗️ Architecture

```
Weather & City Info Hub/
├── backend/                 # Node.js + Express API
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   └── env.example         # Environment variables template
├── frontend/               # Vanilla JavaScript frontend
│   ├── index.html          # Main HTML file
│   ├── styles.css          # CSS with dark mode
│   └── script.js           # JavaScript functionality
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- API keys for:
  - [OpenWeatherMap](https://openweathermap.org/api)
  - [Unsplash](https://unsplash.com/developers)
  - [GeoDB Cities](https://rapidapi.com/wirefreethought/api/geodb-cities)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd weather-city-hub
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your API keys
nano .env
```

**Required Environment Variables:**
```env
# OpenWeatherMap API
OPENWEATHER_API_KEY=your_openweather_api_key_here
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5

# Unsplash API
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
UNSPLASH_BASE_URL=https://api.unsplash.com

# GeoDB Cities API
GEODB_API_KEY=your_geodb_api_key_here
GEODB_BASE_URL=https://wft-geo-db.p.rapidapi.com/v1

# Server Configuration
PORT=3001
NODE_ENV=development
CACHE_TTL=300
```

### 4. Start the Backend Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The backend will be available at `http://localhost:3001`

### 5. Frontend Setup
```bash
cd ../frontend
# Open index.html in your browser or serve with a local server
```

**For local development server:**
```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

The frontend will be available at `http://localhost:8000`

## 🔧 API Endpoints

### Weather Data
```http
GET /api/weather?city=London&country=GB
```
Returns current weather, 5-day forecast, and air quality data.

**Response:**
```json
{
  "current": {
    "main": { "temp": 15, "humidity": 65 },
    "weather": [{ "description": "clear sky" }],
    "wind": { "speed": 3.5 }
  },
  "forecast": { "list": [...] },
  "airQuality": { "list": [...] }
}
```

### City Information
```http
GET /api/city?city=London&country=GB
```
Returns city demographics and geographic information.

**Response:**
```json
{
  "name": "London",
  "country": "United Kingdom",
  "population": 8982000,
  "latitude": 51.5074,
  "longitude": -0.1278,
  "timezone": "Europe/London"
}
```

### City Images
```http
GET /api/image?city=London&country=GB
```
Returns beautiful city images from Unsplash.

**Response:**
```json
{
  "id": "123456",
  "description": "London cityscape",
  "urls": {
    "small": "https://...",
    "regular": "https://...",
    "full": "https://..."
  },
  "photographer": {
    "name": "John Doe",
    "username": "johndoe"
  }
}
```

### Health Check
```http
GET /api/health
```
Returns server status and cache statistics.

### Cache Management
```http
DELETE /api/cache          # Clear all cache
DELETE /api/cache/:key     # Clear specific cache key
```

## 🎨 UI/UX Features

### Dark Mode Toggle
- Click the moon/sun icon in the header
- Theme preference is saved in localStorage
- Smooth transitions between themes

### Responsive Design
- **Mobile**: Single column layout, touch-friendly
- **Tablet**: Two-column grid, optimized spacing
- **Desktop**: Four-column grid, full feature set

### Loading States
- Spinner animation during API calls
- Disabled buttons to prevent multiple requests
- Clear visual feedback for all states

### Error Handling
- User-friendly error messages
- Retry functionality
- Graceful degradation when APIs fail

## 🔑 API Keys Setup

### 1. OpenWeatherMap API
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Add to `.env` as `OPENWEATHER_API_KEY`

### 2. Unsplash API
1. Visit [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Get your Access Key
4. Add to `.env` as `UNSPLASH_ACCESS_KEY`

### 3. GeoDB Cities API
1. Visit [GeoDB Cities on RapidAPI](https://rapidapi.com/wirefreethought/api/geodb-cities)
2. Subscribe to the free plan
3. Get your API key
4. Add to `.env` as `GEODB_API_KEY`

## 🚀 Deployment

### Backend Deployment (Render/Heroku)

#### Using Render:
1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy automatically on push

#### Using Heroku:
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-weather-hub-api

# Set environment variables
heroku config:set OPENWEATHER_API_KEY=your_key
heroku config:set UNSPLASH_ACCESS_KEY=your_key
heroku config:set GEODB_API_KEY=your_key

# Deploy
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)

#### Using Netlify:
1. Connect your GitHub repository
2. Set build command: `echo "No build needed"`
3. Set publish directory: `frontend`
4. Deploy automatically

#### Using Vercel:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

### Environment Variables for Production
Update the `API_BASE_URL` in `frontend/script.js`:
```javascript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Search functionality works
- [ ] Dark mode toggle functions
- [ ] Responsive design on all devices
- [ ] Error handling displays properly
- [ ] Loading states show correctly
- [ ] All API endpoints return data
- [ ] Caching improves performance

### API Testing with curl
```bash
# Test weather endpoint
curl "http://localhost:3001/api/weather?city=London&country=GB"

# Test city endpoint
curl "http://localhost:3001/api/city?city=London&country=GB"

# Test image endpoint
curl "http://localhost:3001/api/image?city=London&country=GB"

# Test health endpoint
curl "http://localhost:3001/api/health"
```

## 🔧 Customization

### Adding New Features
1. **New API Endpoint**: Add route in `server.js`
2. **New UI Component**: Add HTML, CSS, and JavaScript
3. **New Theme**: Update CSS custom properties
4. **New Animation**: Add CSS animations and transitions

### Styling Customization
- Modify CSS custom properties in `styles.css`
- Update color schemes in `:root` and `[data-theme="dark"]`
- Adjust spacing, fonts, and animations

### API Customization
- Add new API integrations in `server.js`
- Implement additional caching strategies
- Add request validation and sanitization

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [Unsplash](https://unsplash.com/) for beautiful images
- [GeoDB Cities](https://rapidapi.com/wirefreethought/api/geodb-cities) for city information
- [Inter Font](https://rsms.me/inter/) for typography
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) for theming

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/weather-city-hub/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

**Built with ❤️ for the developer community**

*This project demonstrates modern full-stack development practices, API integration, responsive design, and user experience best practices.*
