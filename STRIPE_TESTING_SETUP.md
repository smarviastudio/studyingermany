# Stripe Testing Setup Guide

## 🎯 Quick Setup for Vercel

To enable Stripe test mode on ALL environments (including preview deployments), add these environment variables to Vercel:

### Required Environment Variables

Go to: https://vercel.com/smarviastudios-projects/studyingermany/settings/environment-variables

Add the following variables for **ALL environments** (Production, Preview, Development):

```bash
# Force test mode everywhere
STRIPE_USE_TEST_MODE=true

# Test API Keys (get from Stripe Dashboard → Developers → API keys in TEST mode)
STRIPE_TEST_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY=pk_test_YOUR_TEST_PUBLISHABLE_KEY_HERE

# Test Webhook Secret (create test webhook endpoint in Stripe)
STRIPE_TEST_WEBHOOK_SECRET=whsec_test_YOUR_WEBHOOK_SECRET_HERE
```

### Test Price IDs (Already configured in code)
```bash
# Pro Plan
pro_monthly: price_1THMhjBhIRngoSRXvbQyNKcE (€9.99/month)
pro_yearly: price_1THMhjBhIRngoSRXNhX1dcad (€79.99/year)

# Credits
credits_20: price_1THNNCBhIRngoSRXEd8VpVkv (€2.99)
credits_100: price_1THNNCBhIRngoSRXR97jnrrf (€9.99)
credits_300: price_1THNNCBhIRngoSRXROohsxsl (€24.99)
```

## 🧪 Testing Flow

### 1. Test on Preview Deployment
1. Push code to GitHub
2. Vercel creates preview deployment
3. Visit preview URL (e.g., `studyingermany2-as810c7su.vercel.app`)
4. See yellow "TEST MODE" banner
5. Sign in with test account
6. Click any pricing plan
7. Use test card: `4242 4242 4242 4242`

### 2. Test Cards
```
✅ Success: 4242 4242 4242 4242
❌ Declined: 4000 0000 0000 0002
⚠️ Insufficient funds: 4000 0000 0000 9995
🔐 3D Secure: 4000 0025 0000 3155

Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

### 3. Verify Test Payment
1. Go to Stripe Dashboard (TEST mode)
2. Payments → All payments
3. See your test payment
4. Check customer created
5. Verify subscription active

## 🔄 Switch Back to Live Mode

When ready for production:

1. Go to Vercel environment variables
2. Change `STRIPE_USE_TEST_MODE=false` (or delete it)
3. Redeploy

The app will automatically use live mode in production and test mode in development/preview.

## 🐛 Troubleshooting

### Error: "Invalid price ID"
- **Cause:** Using test price ID in live mode (or vice versa)
- **Fix:** Check `STRIPE_USE_TEST_MODE` is set correctly in Vercel

### Error: "No such price"
- **Cause:** Price doesn't exist in current mode
- **Fix:** Verify price IDs exist in Stripe Dashboard (check TEST/LIVE toggle)

### Preview redirects to production login
- **Cause:** NextAuth URL configuration
- **Fix:** Already handled - AUTH_TRUST_HOST=true allows dynamic URLs

### Webhook signature mismatch
- **Cause:** Using wrong webhook secret
- **Fix:** Create separate webhook endpoint for test mode in Stripe

## 📝 Notes

- Test mode is now **enabled by default** in `.env.local`
- Yellow banner appears when in test mode
- Price IDs automatically switch based on mode
- No code changes needed to switch modes
- Safe to test - no real charges will be made
