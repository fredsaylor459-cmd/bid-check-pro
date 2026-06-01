# Bid Check Pro 💰

## Setup in 5 minutes

1. Run: `npm install`
2. Copy `.env.local.template` → rename to `.env.local`
3. Fill in your Stripe secret key
4. Run: `npm run dev`
5. Open: http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Go to vercel.com > Add New Project > Import repo
3. Add environment variables from .env.local
4. Deploy

## Stripe Setup

1. Go to stripe.com > Developers > API Keys
2. Copy your sk_live_ key into .env.local
3. Make sure Stripe account is activated for live payments
