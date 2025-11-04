# POS System - Deployment Guide

A complete Point of Sale system with Vue.js 3 + TypeScript frontend and Ruby on Rails + GraphQL backend.

## Environment Variables

The application uses environment variables for configuration. Copy `.env.example` to create your environment file:

```bash
cp .env.example .env.development  # For development
cp .env.example .env.production   # For production
```

### Required Environment Variables

- `VITE_GRAPHQL_URL` - The GraphQL API endpoint URL
- `VITE_APP_NAME` - Application name displayed in the UI
- `NODE_ENV` - Environment mode (development/production)

## Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.development
# Edit .env.development with your local settings
```

3. Start the development server:
```bash
npm run dev
```

## Production Build

1. Set up production environment variables:
```bash
cp .env.example .env.production
# Edit .env.production with your production settings
```

2. Build for production:
```bash
npm run build
```

Note: The build process currently skips TypeScript type checking for faster deployment builds. For development with full type checking, use `npm run build-with-types`.

3. Preview the production build locally:
```bash
npm run preview
```

## Deployment

### Environment Variables for Deployment

Make sure to set these environment variables in your deployment platform:

- `VITE_GRAPHQL_URL` - Your production GraphQL API URL (e.g., `https://api.yourapp.com/graphql`)
- `VITE_APP_NAME` - Your app name
- `NODE_ENV=production`

### Build Command
```bash
npm run build
```

### Output Directory
The built files will be in the `dist` directory.

## Features

- Order Management (Create, View, Update Status)
- Product Management 
- Customer Management
- Payment Processing (Cash & GCash with proof upload)
- Authentication & Authorization
- Responsive Design with Dark Theme

## Tech Stack

### Frontend
- Vue.js 3 with Composition API
- TypeScript
- Apollo Client (GraphQL)
- Tailwind CSS
- Vite (Build tool)

### Backend  
- Ruby on Rails 8.1
- GraphQL (Ruby)
- PostgreSQL
- Active Storage (file uploads)
- Action Mailer (emails)

## Backend Deployment

### Environment Variables for Backend

Copy the example environment file:
```bash
cp .env.production.example .env.production
```

Required backend environment variables:

- `BACKEND_URL` - Your backend API domain (e.g., `https://api.yourapp.com`)
- `FRONTEND_URL` - Your frontend domain (e.g., `https://yourapp.com`)  
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY_BASE` - Rails secret key (generate with `rails secret`)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD` - Email configuration
- `ALLOWED_ORIGINS` - CORS allowed origins

### Backend Build Commands

```bash
# Install dependencies
bundle install --without development test

# Precompile assets (if any)
rails assets:precompile

# Run database migrations
rails db:migrate

# Seed the database (optional)
rails db:seed
```

### Backend Runtime

Start the Rails server:
```bash
rails server -e production -p 3000
```

Or using a process manager like Puma:
```bash
bundle exec puma -C config/puma.rb
```