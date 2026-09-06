import { ScanLine, BellRing, PieChart, XCircle, LayoutDashboard, ShieldCheck } from 'lucide-react';
import type { AppContent } from './types';

export const renewly: AppContent = {
  slug: 'subscription-tracker-app',
  appId: '6787279940',
  name: 'Renewly',
  storeName: 'Subscription Tracker: Billmora',
  subtitle: 'Know before the money leaves',
  lang: 'en',
  appStoreUrl: 'https://apps.apple.com/de/app/subscription-tracker-billmora/id6787279940',
  icon: '/apps/renewly/icon.webp',
  accent: '#14b8a6',
  accentDark: '#0f766e',
  heroTitle: {
    pre: 'Every subscription, bill and free trial in one place —',
    highlight: 'and a warning before each charge',
    post: '',
  },
  heroDescription:
    'Screenshot your iPhone subscriptions page and Renewly imports them all at once. Photograph a paper bill and the amount, cycle and due date are read for you. Then it reminds you before every charge — and loudly before a free trial turns into a paid plan.',
  heroBenefits: [
    'Import everything from one screenshot of your subscriptions page',
    'Snap a paper bill and let AI read amount, cycle and due date',
    'Extra-loud alerts before free trials convert to paid',
    'Live monthly and yearly totals, with spending by category',
    'Cancel links and step-by-step instructions for 50 services',
    'Home-screen widget and Siri: "What is renewing soon?"',
  ],
  metaTitle: 'Subscription Tracker App: Stop Paying for Forgotten Plans',
  metaDescription:
    'Renewly tracks every subscription, bill and free trial and warns you before each charge. Import from a screenshot, a photo of a bill, or a pasted receipt.',
  metaKeywords:
    'subscription tracker app, free trial reminder, recurring bills app, cancel subscriptions, subscription manager iphone, bill reminder app, track monthly spending, renewal reminder',
  screenshots: [
    { src: '/apps/renewly/screenshot-1.webp', alt: 'Renewly subscription tracker – overview of upcoming renewals' },
    { src: '/apps/renewly/screenshot-2.webp', alt: 'Renewly – importing subscriptions from a screenshot with AI' },
    { src: '/apps/renewly/screenshot-3.webp', alt: 'Renewly – monthly and yearly spending totals by category' },
    { src: '/apps/renewly/screenshot-4.webp', alt: 'Renewly – reminder before a free trial converts to paid' },
    { src: '/apps/renewly/screenshot-5.webp', alt: 'Renewly – cancel instructions for popular services' },
  ],
  audience: [
    {
      badge: 'Trial users',
      title: 'Anyone who signs up for free trials',
      description:
        'Trials are designed to be forgotten. A reminder two days before the conversion date is the difference between a free trial and a year of payments.',
      color: '#0f766e',
    },
    {
      badge: 'Households',
      title: 'People with bills on paper',
      description:
        'Electricity, internet, insurance and rent are recurring costs too. Photograph the bill once and it joins the same overview as Netflix and Spotify.',
      color: '#0369a1',
    },
    {
      badge: 'Budgeters',
      title: 'Anyone trimming monthly costs',
      description:
        'You cannot cut what you cannot see. Live monthly and yearly totals make the biggest recurring costs obvious in a few seconds.',
      color: '#7c3aed',
    },
  ],
  features: [
    {
      icon: ScanLine,
      title: 'Import in 30 Seconds',
      description:
        'Screenshot the iPhone subscriptions page and everything is imported at once. Or photograph a paper bill, paste a confirmation email, or just type "gym 40€ monthly starting Monday".',
      color: '#0f766e',
    },
    {
      icon: BellRing,
      title: 'Warned Before Every Charge',
      description:
        'Reminders days before each renewal, with a lead time you choose — and extra-loud alerts before a free trial converts to a paid plan.',
      color: '#d97706',
    },
    {
      icon: PieChart,
      title: 'See Where Money Goes',
      description:
        'Live monthly and yearly totals, spending by category, and your biggest recurring costs at a glance rather than spread across a bank statement.',
      color: '#059669',
    },
    {
      icon: XCircle,
      title: 'Cancel With Confidence',
      description:
        'Direct cancel links and step-by-step instructions for 50 popular services. Archive what you cancelled and watch the yearly saving add up.',
      color: '#dc2626',
    },
    {
      icon: LayoutDashboard,
      title: 'Widget and Siri',
      description:
        'A home-screen widget with your next renewals and monthly total. Ask Siri "What is renewing soon in Renewly?" or add a subscription by voice.',
      color: '#7c3aed',
    },
    {
      icon: ShieldCheck,
      title: 'Private by Design',
      description:
        'Your data stays on your device. Only the text or image you explicitly choose to import is sent for AI extraction — nothing else ever leaves your iPhone.',
      color: '#0369a1',
    },
  ],
  steps: [
    { title: 'Import What You Pay For', description: 'One screenshot of your iPhone subscriptions page brings in everything at once.' },
    { title: 'Add the Paper Bills', description: 'Photograph electricity, internet or insurance — amount, cycle and due date are read automatically.' },
    { title: 'Choose Your Lead Time', description: 'Decide how many days before a charge you want to hear about it.' },
    { title: 'Cancel What You Do Not Use', description: 'Follow the direct link or the steps for that service, then archive it and watch the savings grow.' },
  ],
  platforms: ['iPhone', 'iPad'],
  pricingFree:
    'Renewly is free: unlimited manual tracking, reminders, insights and the widget, plus 3 free AI imports.',
  pricingPro: {
    name: 'Renewly Pro',
    bullets: [
      'Unlimited AI imports from screenshots, bills and emails',
      'Everything in the free version stays available',
      'Monthly or yearly billing',
      '7-day free trial on the yearly plan',
    ],
    note: 'Optional subscription',
  },
  guides: [
    {
      slug: 'find-forgotten-subscriptions',
      keyword: 'find subscriptions I forgot about',
      title: 'How to Find Every Subscription You Forgot You Were Paying For',
      metaTitle: 'Find Forgotten Subscriptions: A Complete Audit in 20 Minutes',
      metaDescription:
        'The four places recurring charges hide, how to audit a year of statements quickly, and why the App Store list is only part of the picture.',
      excerpt: 'The four places recurring charges hide — and the twenty-minute audit that finds all of them.',
      intro: [
        'Almost nobody can list their own subscriptions from memory. The count is usually higher than the guess, and the gap is made up of things bought once, used twice and never cancelled.',
        'The reason is structural: recurring charges are billed through at least four different channels, and no single screen shows all of them.',
      ],
      sections: [
        {
          heading: 'The four places charges hide',
          bullets: [
            'Apple: Settings → your name → Subscriptions. Covers anything bought through an app on iPhone or iPad.',
            'Google Play, if you have ever had an Android device — those subscriptions survive the switch to iPhone.',
            'Direct card billing: anything you signed up for on a website with your card, which is where most of the expensive ones live.',
            'PayPal and similar wallets, which hold their own list of recurring agreements under automatic payments.',
          ],
        },
        {
          heading: 'The statement audit',
          numbered: [
            'Export or open twelve months of card and bank statements — twelve, not three, because annual plans only appear once.',
            'Mark every charge that repeats, and every round-number charge you cannot immediately explain.',
            'Watch specifically for annual renewals: antivirus, cloud storage, domains, insurance add-ons, password managers.',
            'List each one with amount, cycle and next expected date.',
            'Decide per item: keep, downgrade, or cancel — and do the cancelling in the same sitting, or it will not happen.',
          ],
        },
        {
          heading: 'The ones people miss most often',
          bullets: [
            'Cloud storage upgrades taken during a full-phone moment years ago.',
            'A second music or video service kept "for the family" that nobody uses.',
            'App subscriptions bought inside a free trial and never revisited.',
            'Domain and hosting renewals for a project that ended.',
            'Gym or class memberships with a notice period, where cancelling late costs another full term.',
          ],
        },
      ],
      howToHeading: 'Doing the audit with Renewly',
      howToSteps: [
        { title: 'Import the Apple list', text: 'Screenshot Settings → Subscriptions and let Renewly import all of them at once.' },
        { title: 'Add card-billed services', text: 'Paste a confirmation email or type the details — service, price and renewal date are filled in for you.' },
        { title: 'Add the paper bills', text: 'Photograph electricity, internet or insurance so the full monthly picture is in one place.' },
        { title: 'Read the yearly total', text: 'The annual figure is usually the number that prompts the first cancellations.' },
      ],
      faqs: [
        {
          question: 'Does Renewly connect to my bank?',
          answer:
            'No. You import what you choose to import — a screenshot, a photo, a pasted receipt, or typed details. There is no bank connection and no access to your accounts.',
        },
        {
          question: 'Why check twelve months of statements?',
          answer: 'Annual subscriptions only appear once a year. A three-month review misses every one of them.',
        },
      ],
      screenshotIndex: 1,
    },
    {
      slug: 'free-trial-reminder',
      keyword: 'free trial reminder',
      title: 'Free Trials: How Not to Pay for the One You Meant to Cancel',
      metaTitle: 'Free Trial Reminders: Cancel Before You Are Charged',
      metaDescription:
        'Free trials convert quietly by design. How the timing actually works, when to set your reminder, and how to cancel while keeping the trial.',
      excerpt: 'Trials convert quietly by design. The reminder timing that actually saves the charge.',
      intro: [
        'A free trial is a marketing instrument with a payment attached. The business model does not depend on you forgetting, but it certainly benefits from it — and the interface is rarely designed to remind you.',
        'The good news is that trials are the most predictable charge you will ever have: you know the exact date on the day you sign up.',
      ],
      sections: [
        {
          heading: 'How trial timing really works',
          bullets: [
            'The charge lands at the end of the trial period, not at the start of the next month.',
            'Cancelling during the trial normally keeps access until the trial ends — you lose nothing by cancelling early.',
            'Annual plans with a trial are the expensive ones: one missed date costs a full year, not a month.',
            'Some services require cancellation a day or more before the end; the effective deadline is earlier than the date shown.',
          ],
        },
        {
          heading: 'Where to set the reminder',
          paragraphs: [
            'Two days before the conversion date is the practical sweet spot. One day is too tight if you are travelling or busy; a week ahead gets dismissed and forgotten.',
            'The reminder needs to be louder than an ordinary notification, because it competes with dozens of others on the same day. That is the one alert genuinely worth making intrusive.',
            'Record the trial the moment you sign up, not later. The date is never easier to find than in the confirmation email you are looking at right then.',
          ],
        },
        {
          heading: 'Cancelling without losing the trial',
          numbered: [
            'Cancel immediately after signing up, in the same session — most services keep your access until the trial ends.',
            'Screenshot the confirmation, since disputes are far easier with a timestamp.',
            'Check whether the service downgrades to a free tier instead of blocking you; often that is enough.',
            'If you decide to keep it, set a reminder before the next renewal rather than treating the decision as permanent.',
          ],
        },
      ],
      howToHeading: 'Tracking a trial in Renewly',
      howToSteps: [
        { title: 'Add it while signing up', text: 'Type it in plain language — "Netflix expiring in 20 days" — or share the confirmation email into Renewly.' },
        { title: 'Mark it as a trial', text: 'Trials get the extra-loud alert rather than the ordinary renewal reminder.' },
        { title: 'Set the lead time', text: 'Two days before conversion is the default worth keeping.' },
        { title: 'Decide once', text: 'Keep it and set the next renewal reminder, or cancel and archive it into your savings total.' },
      ],
      faqs: [
        {
          question: 'Can Renewly cancel a subscription for me?',
          answer:
            'No — it gives you the direct cancel link and the steps for that service. Cancelling stays your action, which also means nothing is ever cancelled by accident.',
        },
        {
          question: 'What if the trial length is unusual?',
          answer: 'Any length works. Type the end date or the number of days and the reminder is set from that.',
        },
      ],
      screenshotIndex: 3,
    },
    {
      slug: 'cut-monthly-subscription-costs',
      keyword: 'reduce monthly subscription costs',
      title: 'Cutting Monthly Costs Without Giving Up What You Actually Use',
      metaTitle: 'Reduce Subscription Costs: What to Cut, Keep and Downgrade',
      metaDescription:
        'A practical order for reviewing recurring costs, the switch from monthly to annual that pays off, and the trap of cancelling things you will resubscribe to.',
      excerpt: 'A review order that works, and the cancellations that quietly reverse themselves.',
      intro: [
        'The usual advice — cancel everything you have not used this month — produces a burst of savings and a wave of resubscriptions six weeks later. Reductions that hold come from a different question: what is this worth per use?',
        'It also helps to know the yearly figure. Nine euros a month reads as small; a hundred and eight a year reads as a decision.',
      ],
      sections: [
        {
          heading: 'A review order that works',
          numbered: [
            'Start with duplicates — two services doing the same job, where one can go with no loss at all.',
            'Then the dormant ones: no use in three months and no upcoming plan to use them.',
            'Then the overpowered tiers: a plan sized for a household you no longer have, or storage you never filled.',
            'Then price-per-use: divide the yearly cost by realistic annual uses and see what each session actually costs.',
            'Leave the genuinely used ones alone. Cutting those is what makes people abandon the whole exercise.',
          ],
        },
        {
          heading: 'Where downgrading beats cancelling',
          bullets: [
            'Cloud storage: one tier down is often plenty once photos are tidied.',
            'Streaming: the ad-supported tier costs a fraction and changes little for background viewing.',
            'Family plans: worth checking whether the shared plan is genuinely cheaper than the individual ones being paid separately.',
            'Annual instead of monthly, but only for the services you have kept for a year already.',
          ],
        },
        {
          heading: 'Making the saving stick',
          paragraphs: [
            'Cancellations reverse themselves when the underlying need is real. If you cancel a service you use weekly, you will be back within two months and possibly at a higher price, having lost any legacy rate.',
            'Archiving cancelled subscriptions helps here: seeing the accumulated yearly saving is a better motivator than a one-off tidy-up, and it makes the resubscriptions visible too.',
          ],
        },
      ],
      howToHeading: 'Running the review in Renewly',
      howToSteps: [
        { title: 'Sort by yearly cost', text: 'The annual figure surfaces the ones worth thinking about first.' },
        { title: 'Check spending by category', text: 'Two entertainment services and three cloud plans stand out immediately once grouped.' },
        { title: 'Use the cancel instructions', text: 'Direct links and steps for 50 popular services, so the friction does not stop you.' },
        { title: 'Archive and watch the total', text: 'Cancelled subscriptions move to the archive and add up into a running yearly saving.' },
      ],
      faqs: [
        {
          question: 'Does the archive keep my history?',
          answer: 'Yes. Cancelled subscriptions stay visible in the archive along with what they were costing you.',
        },
        {
          question: 'Can I track non-subscription bills too?',
          answer:
            'Yes — electricity, internet, insurance and rent can all be added, either by photographing the bill or typing the details.',
        },
      ],
      screenshotIndex: 2,
    },
  ],
  faqs: [
    {
      question: 'How do I add my subscriptions?',
      answer:
        'The fastest way is a screenshot of the iPhone subscriptions page in Settings — Renewly imports all of them at once. You can also photograph a paper bill, paste a receipt or confirmation email, type it in plain language, share from Mail or Photos, or ask Siri.',
      learnMoreSlug: 'find-forgotten-subscriptions',
    },
    {
      question: 'Will it warn me before a free trial converts?',
      answer:
        'Yes, with an extra-loud alert rather than an ordinary notification, because that is the charge people most want to avoid.',
      learnMoreSlug: 'free-trial-reminder',
    },
    {
      question: 'Can Renewly cancel subscriptions for me?',
      answer:
        'No. It gives you direct cancel links and step-by-step instructions for 50 popular services — the cancelling itself stays your decision.',
      learnMoreSlug: 'cut-monthly-subscription-costs',
    },
    {
      question: 'Does it connect to my bank account?',
      answer:
        'No. Your data stays on your device, and only the text or image you explicitly choose to import is sent for AI extraction. Nothing else ever leaves your iPhone.',
    },
    {
      question: 'What is free and what is Pro?',
      answer:
        'Unlimited manual tracking, reminders, insights and the widget are free, plus 3 AI imports. Pro unlocks unlimited AI imports; the yearly plan includes a 7-day free trial.',
    },
    {
      question: 'Can I track bills that are not app subscriptions?',
      answer:
        'Yes — electricity, internet, insurance and rent all work. Photograph the bill and the recurring amount, cycle and due date are read automatically.',
    },
  ],
  ctaHeading: 'Know What Is Renewing Before It Renews',
  ctaText:
    'One screenshot imports everything you pay for. Download Renewly free and stop discovering charges on your statement.',
  category: 'FinanceApplication',
  downloadNote: 'Free to download • Optional Pro subscription',
};
