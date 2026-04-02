# Stripe Products Setup Instructions

## Step 1: Run the Setup Script

This will create all products and prices in your Stripe account.

```bash
# Make sure your .env.local has STRIPE_SECRET_KEY set
# Then run this command:
curl -X POST http://localhost:3000/api/stripe/setup-products
```

Or visit in your browser (after starting dev server):
```
http://localhost:3000/api/stripe/setup-products
```

## Step 2: Add Price IDs to Environment Variables

After running the setup, you'll get a JSON response with all the price IDs. Add these to:

### Local Development (.env.local):
```env
# Stripe Secret Key (already set)
STRIPE_SECRET_KEY=sk_test_...

# Subscription Plans
NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID=price_1THMg9BhIRngoSRXuAF4cOig
NEXT_PUBLIC_STRIPE_STARTER_YEARLY_PRICE_ID=price_1THMg9BhIRngoSRXHPAOCeLp
NEXT_PUBLIC_STRIPE_ESSENTIAL_MONTHLY_PRICE_ID=price_1THMhjBhIRngoSRXvbQyNKcE
NEXT_PUBLIC_STRIPE_ESSENTIAL_YEARLY_PRICE_ID=price_1THMhjBhIRngoSRXNhX1dcad
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_1THMj0BhIRngoSRXUxFgCUdS
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_1THMj0BhIRngoSRXLxEVsAmJ

# Credit Packs
NEXT_PUBLIC_STRIPE_CREDITS_20_PRICE_ID=price_1THMl6BhIRngoSRXMBbRuS2m
NEXT_PUBLIC_STRIPE_CREDITS_100_PRICE_ID=price_1THMl6BhIRngoSRXEH2UHrYP
NEXT_PUBLIC_STRIPE_CREDITS_300_PRICE_ID=price_1THMl6BhIRngoSRXrR48BBwX

# Base URL for redirects
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Vercel Production:
Add these environment variables in your Vercel project settings:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:
```
NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID=price_1THMg9BhIRngoSRXuAF4cOig
NEXT_PUBLIC_STRIPE_STARTER_YEARLY_PRICE_ID=price_1THMg9BhIRngoSRXHPAOCeLp
NEXT_PUBLIC_STRIPE_ESSENTIAL_MONTHLY_PRICE_ID=price_1THMhjBhIRngoSRXvbQyNKcE
NEXT_PUBLIC_STRIPE_ESSENTIAL_YEARLY_PRICE_ID=price_1THMhjBhIRngoSRXNhX1dcad
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_1THMj0BhIRngoSRXUxFgCUdS
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_1THMj0BhIRngoSRXLxEVsAmJ
NEXT_PUBLIC_STRIPE_CREDITS_20_PRICE_ID=price_1THMl6BhIRngoSRXMBbRuS2m
NEXT_PUBLIC_STRIPE_CREDITS_100_PRICE_ID=price_1THMl6BhIRngoSRXEH2UHrYP
NEXT_PUBLIC_STRIPE_CREDITS_300_PRICE_ID=price_1THMl6BhIRngoSRXrR48BBwX
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```
3. Make sure `STRIPE_SECRET_KEY` is already set
4. Redeploy

## Step 3: Test the Pricing Page

1. Start your dev server: `npm run dev`
2. Visit: `http://localhost:3000/pricing`
3. Click on any plan to test Stripe Checkout
4. Use Stripe test card: `4242 4242 4242 4242`

## Products Created

### Subscriptions:
- **Starter**: €4.99/month or €39.99/year (save 33%)
- **Essential**: €9.99/month or €79.99/year (save 33%)
- **Pro**: €19.99/month or €149.99/year (save 33%)

### Credit Packs (One-time):
- **20 Credits**: €2.99 (€0.15/credit)
- **100 Credits**: €9.99 (€0.10/credit)
- **300 Credits**: €24.99 (€0.08/credit)

## Notes

- All prices are in EUR
- Subscriptions are recurring (monthly or yearly)
- Credit packs are one-time payments
- Credits metadata is stored for webhook processing
- Checkout sessions redirect to `/pricing?success=true` or `/pricing?canceled=true`
