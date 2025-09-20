# Environment Configuration Guide

This Angular application supports multiple environment configurations to point to different backend services.

## Environment Files

### 1. **Development Environment** (`src/environments/environment.ts`)
- **API URL**: `http://localhost:8000`
- **Purpose**: Default development with backend server
- **Usage**: `ng serve` or `npm start`

### 2. **Local Environment** (`src/environments/environment.local.ts`)
- **API URL**: `http://localhost:3000`
- **Purpose**: Local development with different backend port
- **Usage**: `ng serve --configuration=local` or `npm run start:local`

### 3. **Production Environment** (`src/environments/environment.prod.ts`)
- **API URL**: `https://your-production-api.com`
- **Purpose**: Production deployment
- **Usage**: `ng serve --configuration=production` or `npm run start:prod`

## Available Commands

### Development Server
```bash
# Default development (port 8000)
npm start
# or
ng serve

# Local development (port 3000)
npm run start:local
# or
ng serve --configuration=local

# Development configuration explicitly
npm run start:dev
# or
ng serve --configuration=development

# Production configuration
npm run start:prod
# or
ng serve --configuration=production
```

### Building
```bash
# Default build
npm run build

# Local build (port 3000)
npm run build:local

# Development build (port 8000)
npm run build:dev

# Production build
npm run build:prod
```

## Configuration Details

### Environment Variables
Each environment file contains:
- `production`: Boolean indicating if this is a production build
- `apiUrl`: The base URL for your backend API
- `environmentName`: Human-readable name for debugging

### Service Integration
All services automatically use the environment configuration:
- `DocumentUploadService`
- `QueryService`
- `TranscriptService`

## Customizing API URLs

To change the API URLs for different environments, edit the respective environment files:

1. **For local development on port 3000**: Edit `src/environments/environment.local.ts`
2. **For development on port 8000**: Edit `src/environments/environment.ts`
3. **For production**: Edit `src/environments/environment.prod.ts`

## Example Usage Scenarios

### Scenario 1: Backend on Port 8000
```bash
npm start
# Frontend: http://localhost:4200
# Backend: http://localhost:8000
```

### Scenario 2: Backend on Port 3000
```bash
npm run start:local
# Frontend: http://localhost:4200
# Backend: http://localhost:3000
```

### Scenario 3: Testing Production Build Locally
```bash
npm run start:prod
# Frontend: http://localhost:4200
# Backend: https://your-production-api.com
```

## Notes

- The default configuration is `development` (port 8000)
- Environment files are automatically replaced during build/serve based on configuration
- All API calls will automatically use the correct base URL for the selected environment
- You can verify which environment is active by checking the browser console or network tab
