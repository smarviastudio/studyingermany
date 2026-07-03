# German Path — Organic Traffic & Conversion Plan

Diagnosis and action plan for the two problems: low organic traffic and zero paid conversions. Written 2026-06-16.

---

## TL;DR

- **Technical SEO is healthy** (SSR HTML, correct canonical/redirects, valid sitemap with 114 URLs, structured data, 79 blog posts). Traffic is low mostly because the **domain is young** (first commit Jan 31 2026) and the niche is hyper-competitive. This is a time + content problem, not a bug.
- **Conversions were broken by a real bug** (now fixed): live-mode credit-pack purchases charged the customer but granted **0 credits**. See "Conversion fixes shipped" below.
- The **business model was mismatched**: students applying once were only offered a €9.99/mo subscription. We now lead with one-time credit packs (from €2.99) at every decision point.

---

## Conversion fixes shipped (this change)

1. **Critical billing bug fixed.** `create-checkout` only stamped the `credits` metadata for *test* price IDs, and the webhook grants credits solely from that metadata. So every **live** credit-pack purchase granted nothing. Fixed via a single source of truth: [`src/lib/creditPacks.ts`](src/lib/creditPacks.ts), now used by the checkout API, pricing page, and paywall modal.
   - **Action for you:** check Stripe for any past one-time `payment` purchases. If anyone bought credits in live mode, manually grant their credits (and apologize / refund). Going forward it's automatic.
2. **Paywall now leads with a one-time pack.** When a user hits their credit limit (peak intent), the modal's primary CTA is "Buy 20 credits — €2.99, no subscription." Pro is now the secondary option. ([`PaywallModal.tsx`](src/components/PaywallModal.tsx))
3. **Homepage surfaces the paid value.** A new "Build your entire German application with AI" band sits directly under the hero, leading with "from €2.99 one-time." Previously the paid tools were buried mid-page. ([`src/app/page.tsx`](src/app/page.tsx))
4. **Pricing page** uses the shared pack config so prices can't drift out of sync again.

### Recommended next conversion step (not yet done — needs a decision)
**Value-first generation.** Today the AI tools require sign-in *before* a user sees any output. Let an anonymous user generate one real result, show it, then gate the *download/full result* behind signup + credits. This is the single biggest remaining lever but needs IP-based rate limiting to prevent abuse of the OpenAI cost. Treat as its own task.

---

## Organic traffic plan

### Step 0 — Instrument (do this first)
- **Google Search Console**: verify the domain, submit `sitemap.xml`, and check **Pages → Indexed** count vs. the 114 submitted. This is the #1 diagnostic — it shows what's actually indexed and which queries already get impressions.
- **Bing Webmaster Tools**: same, 5 minutes, non-trivial extra traffic for this audience.

### Step 1 — Target winnable keywords, not head terms
You will not rank for "study in germany" for a long time (DAAD, studying-in-germany.org, universities own it). Win the **long-tail, high-intent** queries:
- Country + intent: "study masters in germany from india requirements 2026", "germany student visa from pakistan checklist". You already have country pages — **expand the set and deepen each** (requirements, costs, timeline, FAQ).
- Tool intent (these are your buyers): "german cv format template", "lebenslauf generator english", "motivation letter for german university example", "gpa to german grade converter". Your `/cv-maker/landing` etc. pages target these — prioritize and interlink them.
- Question/long-tail blog: you have 79 posts; make sure each targets one specific query and links to a relevant tool.

### Step 2 — Internal linking
- From every blog post and country guide, link to the relevant **tool landing page** and **program search**. This passes authority to your money pages and improves crawl depth.
- Add contextual links between related blog posts (topic clusters: visa, housing, finance, language).

### Step 3 — Backlinks & distribution (the real bottleneck for a young domain)
- Answer questions on Reddit (r/germany, r/studyAbroad), Quora, and student forums with genuinely useful replies that link where relevant.
- Get listed in study-abroad directories and student resource roundups.
- The free tools (GPA converter, salary calculator) are linkable assets — pitch them to student blogs/communities.

### Step 4 — Be patient & measure
New domain in a competitive niche: expect 6–12 months for meaningful organic growth. Track Search Console impressions monthly; double down on pages already getting impressions but ranking page 2.

---

## Housekeeping
- ~30 duplicate `" 2"` folders exist locally under `src/app` (e.g. `api/auth 2`). They are **not** in git and **not** deployed — local file-sync junk. Safe to delete to reduce confusion.
