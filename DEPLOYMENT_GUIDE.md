# WeatherVibe - Deployment Guide 🚀

This guide will help you deploy WeatherVibe to various hosting platforms.

## 📋 Pre-Deployment Checklist

- [ ] All API keys are configured in `backend/.env`
- [ ] Backend dependencies are installed (`npm install` in backend folder)
- [ ] Frontend dependencies are installed (`npm install` in frontend folder)
- [ ] Application runs locally without errors
- [ ] All features are working correctly

## 🌐 Deployment Options

### 1. Heroku Deployment

#### Backend Deployment
1. **Create Heroku App:**
   ```bash
   cd backend
   heroku create your-weather-app-backend
   ```

2. **Set Environment Variables:**
   ```bash
   heroku config:set OPENWEATHER_API_KEY=your_key_here
   heroku config:set UNSPLASH_ACCESS_KEY=your_key_here
   heroku config:set GEODB_API_KEY=your_key_here
   heroku config:set NODE_ENV=production
   ```

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy WeatherVibe backend"
   git push heroku main
   ```

#### Frontend Deployment
1. **Update API URL in script.js:**
   ```javascript
   const API_BASE_URL = 'https://your-weather-app-backend.herokuapp.com/api';
   ```

2. **Deploy to Netlify/Vercel:**
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set publish directory: `frontend`

### 2. Vercel Deployment

#### Full-Stack Deployment
1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Backend:**
   ```bash
   cd backend
   vercel --prod
   ```

3. **Deploy Frontend:**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Set Environment Variables:**
   - Go to Vercel dashboard
   - Add environment variables for each deployment

### 3. Netlify Deployment

#### Frontend Only
1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build  # if you have a build script
   ```

2. **Deploy:**
   - Drag and drop the frontend folder to Netlify
   - Or connect via GitHub

#### Backend (Separate)
- Deploy backend to Heroku, Railway, or Render
- Update frontend API URL

### 4. Railway Deployment

1. **Connect GitHub Repository**
2. **Set Environment Variables:**
   - `OPENWEATHER_API_KEY`
   - `UNSPLASH_ACCESS_KEY`
   - `GEODB_API_KEY`
   - `NODE_ENV=production`

3. **Deploy:**
   - Railway will automatically detect Node.js
   - Deploy both backend and frontend as separate services

## 🔧 Environment Variables

### Required Variables
```env
OPENWEATHER_API_KEY=your_openweather_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_api_key
GEODB_API_KEY=your_geodb_api_key
NODE_ENV=production
PORT=3001
CACHE_TTL=300
```

### Optional Variables
```env
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
UNSPLASH_BASE_URL=https://api.unsplash.com
GEODB_BASE_URL=https://wft-geo-db.p.rapidapi.com/v1
```

## 📁 File Structure for Deployment

```
weather-final/
├── backend/                 # Backend deployment
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── node_modules/
├── frontend/               # Frontend deployment
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── package.json
│   └── node_modules/
└── README_FINAL.md
```

## 🚀 Quick Deployment Commands

### Local Testing
```bash
# Start both servers
./quick_start.sh

# Or manually
cd backend && node server.js &
cd frontend && python3 -m http.server 8000 &
```

### Production Build
```bash
# Install dependencies
cd backend && npm install --production
cd frontend && npm install --production

# Start production server
cd backend && NODE_ENV=production node server.js
```

## 🔒 Security Considerations

1. **API Keys:**
   - Never commit `.env` files to version control
   - Use environment variables in production
   - Rotate keys regularly

2. **CORS Configuration:**
   - Update CORS settings for production domains
   - Remove development-only CORS settings

3. **Rate Limiting:**
   - Implement rate limiting for API endpoints
   - Add request throttling

## 📊 Performance Optimization

1. **Caching:**
   - Enable Redis for production caching
   - Implement CDN for static assets

2. **Compression:**
   - Enable gzip compression
   - Minify CSS and JavaScript

3. **Monitoring:**
   - Add health check endpoints
   - Implement logging and monitoring

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Update CORS origin in server.js
   - Check API URL in frontend

2. **API Key Errors:**
   - Verify environment variables are set
   - Check API key validity

3. **Build Errors:**
   - Ensure all dependencies are installed
   - Check Node.js version compatibility

### Debug Commands

```bash
# Check if servers are running
curl http://localhost:3001/api/health
curl http://localhost:8000

# Check environment variables
echo $OPENWEATHER_API_KEY

# Check logs
heroku logs --tail  # for Heroku
vercel logs         # for Vercel
```

## 📈 Monitoring & Analytics

1. **Health Checks:**
   - `/api/health` endpoint
   - Uptime monitoring

2. **Error Tracking:**
   - Sentry integration
   - Error logging

3. **Performance:**
   - Response time monitoring
   - API usage tracking

## 🎯 Post-Deployment

1. **Test all features:**
   - Weather search
   - Temperature toggle
   - Favorites system
   - Mobile responsiveness

2. **Update documentation:**
   - Update API URLs
   - Update deployment instructions

3. **Set up monitoring:**
   - Health checks
   - Error tracking
   - Performance monitoring

## 📞 Support

For deployment issues:
1. Check the logs for errors
2. Verify environment variables
3. Test locally first
4. Check platform-specific documentation

---

**Happy Deploying! 🚀**
