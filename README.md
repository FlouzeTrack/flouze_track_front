# FlouzeTrack - Frontend

A React cryptocurrency tracking application built with Vite, connecting to Adonis.js microservices.

## Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Modern web browser (Chrome, Firefox, Safari)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/flouzetrack-frontend.git
cd flouzetrack-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment:

```env
VITE_API_AUTH_URL=http://localhost:4010/api/v1
VITE_API_BASE_URL=http://localhost:5010/api/v1
```

4. Start development server:

```bash
npm run dev
```

## API Integration

Example API calls using curl:

```bash
# Get wallet balance
curl -X GET "http://localhost:3000/api/v1/wallet/wallet_id/balances/?startDate=2023-10-23&endDate=2025-01-14" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get transactions
curl -X GET "http://localhost:3000/api/v1/wallet_id" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Using Postman:

1. Import the Postman collection from `docs/postman/flouzetrack-api.json`
2. Set up environment variables for `API_URL` and `AUTH_TOKEN`
3. Use the pre-configured requests

## Features

- 🔐 Authentication system
- 💰 Cryptocurrency wallet tracking
- 📊 Real-time price charts
- 🌍 Internationalization (EN/FR)
- 🌓 Light/Dark theme
- 📱 Responsive design

## Tech Stack

- React + TypeScript
- Vite
- Shadcn UI
- i18next
- React Query
