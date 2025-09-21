# 🚀 WeatherVibe - Vercel Deployment Guide

## 📋 Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free)

## 🎯 Deployment Steps

### Step 1: Deploy Backend to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select your `weather-web-application-v2` repository
5. Choose the `backend` folder
6. Add environment variables:
   - `OPENWEATHER_API_KEY=your_api_key_here`
   - `PORT=3001`
   - `NODE_ENV=production`
7. Wait for deployment
8. Copy your backend URL (e.g., `https://your-backend.railway.app`)

### Step 2: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Import Project"
4. Select your `weather-web-application-v2` repository
5. Choose the `frontend` folder
6. Add environment variable:
   - `REACT_APP_API_URL=https://your-backend.railway.app/api`
7. Deploy!

### Step 3: Update API URL
After backend deployment, update the frontend environment variable:
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Update `REACT_APP_API_URL` with your Railway backend URL

## 🔧 Configuration Files Added

- `vercel.json` - Vercel configuration
- `frontend/package.json` - Updated with Vercel scripts
- `backend/vercel.json` - Backend Vercel config
- `.vercelignore` - Files to ignore during deployment

## 🌐 Your Live URLs
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`

## ✅ Features Included
- 🌡️ Temperature conversion (°C/°F)
- 📍 Auto location detection
- ❤️ Favorites system
- 🎨 Glassmorphism UI
- 📱 Mobile responsive
- 🔄 Auto deployments from GitHub

## 🆘 Troubleshooting
- If API calls fail, check the `REACT_APP_API_URL` environment variable
- Make sure CORS is enabled in your backend
- Check Railway logs for backend issues
- Check Vercel function logs for frontend issues

---
**Built with ❤️ by Vineeth**
