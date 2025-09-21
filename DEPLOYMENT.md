# Deployment Configuration for Weather & City Info Hub

## Backend Deployment (Render)

### Environment Variables Required:
```
OPENWEATHER_API_KEY=your_openweather_api_key_here
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
GEODB_API_KEY=your_geodb_api_key_here
NODE_ENV=production
PORT=3001
CACHE_TTL=300
```

### Build Command:
```bash
npm install
```

### Start Command:
```bash
npm start
```

## Frontend Deployment (Netlify)

### Build Settings:
- **Build Command**: `echo "No build needed"`
- **Publish Directory**: `frontend`
- **Node Version**: `18.x`

### Environment Variables:
```
NODE_ENV=production
```

### Redirects (for SPA):
```
/*    /index.html   200
```

## Frontend Deployment (Vercel)

### vercel.json:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

## Docker Deployment

### Backend Dockerfile:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
EXPOSE 3001
CMD ["npm", "start"]
```

### Frontend Dockerfile:
```dockerfile
FROM nginx:alpine
COPY frontend/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Environment Setup Checklist

### Required API Keys:
- [ ] OpenWeatherMap API Key
- [ ] Unsplash Access Key  
- [ ] GeoDB Cities API Key

### Optional Configurations:
- [ ] Custom domain setup
- [ ] SSL certificate
- [ ] CDN configuration
- [ ] Monitoring setup
