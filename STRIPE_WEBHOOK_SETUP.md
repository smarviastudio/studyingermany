# Stripe Webhook Setup & Testing Guide

## 🚨 CRITICAL: Configure Webhook First

The webhook is **REQUIRED** for subscriptions to work. Without it, purchases won't be saved to your database.

### Step 1: Create Webhook in Stripe Dashboard

1. **Go to Stripe Dashboard:**
   - Test mode: https://dashboard.stripe.com/test/webhooks
   - Live mode: https://dashboard.stripe.com/webhooks

2. **Click "Add endpoint"**

3. **Enter endpoint URL:**
   ```
   https://www.germanpath.com/api/stripe/webhook
   ```

4. **Select events to listen to:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`

5. **Click "Add endpoint"**

6. **Reveal signing secret:**
   - Click on the webhook you just created
   - Click "Reveal" next to "Signing secret"
   - Copy the secret (starts with `whsec_...`)

### Step 2: Add Webhook Secret to Vercel

1. **Go to Vercel Dashboard:**
   - Your Project → Settings → Environment Variables

2. **Add new variable:**
   ```
   Name: STRIPE_WEBHOOK_SECRET
   Value: whsec_... (paste the secret from Step 1)
   Environment: Production, Preview, Development
   ```

3. **Click "Save"**

4. **Redeploy your application**

---

## 🧪 Testing the Complete Flow

### Test 1: Buy Starter Plan

1. **Visit pricing page:**
   ```
   https://www.germanpath.com/pricing
   ```

2. **Click "Get Starter" (yearly for testing)**

3. **Complete checkout:**
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/34`
   - CVC: `123`
   - Email: Use your registered account email

4. **Expected result:**
   - Redirects to `/dashboard?success=true`
   - Dashboard shows 30 AI credits
   - Plan shows as "Starter" (not "Free")

5. **Verify in database:**
   - Check Vercel logs for webhook processing
   - Should see: `[Webhook] Subscription created for user...`
   - Should see: `[Webhook] Set 30 credits for plan...`

### Test 2: View Subscription

1. **Visit subscription page:**
   ```
   https://www.germanpath.com/subscription
   ```

2. **Expected to see:**
   - Current Plan: **Starter**
   - AI Credits: **30**
   - Billing Period: Renewal date
   - Buttons: Cancel Subscription, Manage Billing, Change Plan

### Test 3: Buy Credit Pack

1. **Visit pricing page:**
   ```
   https://www.germanpath.com/pricing#credits
   ```

2. **Click "Buy" on 100 credits pack**

3. **Complete checkout with test card**

4. **Expected result:**
   - Credits increase from 30 to 130
   - Check `/subscription` to verify

### Test 4: Cancel Subscription

1. **Visit `/subscription`**

2. **Click "Cancel Subscription"**

3. **Confirm cancellation**

4. **Expected result:**
   - Shows "Cancels on [date]"
   - Still have access until end of period
   - Button changes to "Reactivate Subscription"

### Test 5: Use CV Maker (Verify Unlock)

1. **Visit CV maker:**
   ```
   https://www.germanpath.com/cv-maker
   ```

2. **Expected result:**
   - All templates should be unlocked
   - No "PRO" badges blocking access
   - Can generate CVs without limits

---

## 🔍 Troubleshooting

### Issue: Subscription not showing after purchase

**Check:**
1. Is webhook configured in Stripe?
2. Is `STRIPE_WEBHOOK_SECRET` set in Vercel?
3. Check Vercel logs for webhook errors
4. Verify email used in checkout matches your account email

**Solution:**
- Configure webhook (see Step 1 above)
- Make sure you're using the same email for Stripe checkout and your account

### Issue: Credits not added

**Check:**
1. Webhook logs in Vercel
2. Look for: `[Webhook] Set X credits for plan...`

**Solution:**
- Webhook should automatically add credits based on plan:
  - Starter: 30 credits
  - Essential: 999,999 credits (unlimited)
  - Pro: 999,999 credits (unlimited)

### Issue: Tools still locked

**Check:**
1. Visit `/subscription` - does it show correct plan?
2. Check database: `subscription` table should have your userId

**Solution:**
- If subscription exists but tools locked, the tool needs to check subscription status
- Contact developer to update tool access logic

### Issue: Webhook signature verification failed

**Check:**
1. Is `STRIPE_WEBHOOK_SECRET` correct in Vercel?
2. Did you redeploy after adding the secret?

**Solution:**
- Copy the correct signing secret from Stripe Dashboard
- Update in Vercel
- Redeploy

---

## 📊 How It Works

### Purchase Flow:

1. **User clicks "Get Starter"**
   - Frontend sends request to `/api/stripe/create-checkout`
   - Creates Stripe checkout session
   - Redirects to Stripe payment page

2. **User completes payment**
   - Stripe processes payment
   - Stripe sends webhook to `/api/stripe/webhook`

3. **Webhook processes payment**
   - Finds user by email from checkout
   - Creates subscription record in database
   - Adds credits based on plan
   - Updates user's `aiCredits` field

4. **User redirected back**
   - Redirects to `/dashboard?success=true`
   - Dashboard fetches updated subscription
   - Shows correct plan and credits

### Credit Assignment:

- **Free**: 3 credits/month
- **Starter**: 30 credits (set on subscription creation)
- **Essential**: 999,999 credits (unlimited)
- **Pro**: 999,999 credits (unlimited)

### Plan Types in Database:

```typescript
planType: 'free' | 'starter' | 'essential' | 'pro'
```

---

## 🎯 Next Steps

1. ✅ Configure webhook in Stripe Dashboard
2. ✅ Add `STRIPE_WEBHOOK_SECRET` to Vercel
3. ✅ Redeploy application
4. ✅ Test purchase flow
5. ✅ Verify subscription shows correctly
6. ✅ Test tool access (CV maker, etc.)
7. ✅ Test subscription management (cancel, reactivate)

---

## 📞 Support

If issues persist after following this guide:

1. Check Vercel logs for webhook errors
2. Check Stripe Dashboard → Webhooks → Your webhook → Recent deliveries
3. Verify all environment variables are set correctly
4. Make sure you're using test mode keys for testing

**Important:** Always test in test mode first before going live!
