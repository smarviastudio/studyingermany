import { Camera, Barcode, PieChart, Target, TrendingUp, Sparkles } from 'lucide-react';
import type { AppContent } from './types';

export const macromora: AppContent = {
  slug: 'macromora-ai-calorie-tracker',
  appId: '6756083419',
  name: 'MacroMora',
  storeName: 'MacroMora: Calorie Tracker',
  subtitle: 'Lose Weight Smarter',
  lang: 'en',
  appStoreUrl: 'https://apps.apple.com/us/app/smart-bites-macro-tracker/id6756083419',
  icon: '/apps/macromora/icon.webp',
  accent: '#4ade80',
  accentDark: '#059669',
  heroTitle: {
    pre: 'Count Calories by',
    highlight: 'Taking a Photo',
    post: '',
  },
  heroDescription:
    'MacroMora is an AI calorie tracker for iPhone that makes logging effortless: snap a photo of your meal and the AI recognizes it in seconds, logging calories, protein, carbs and fat automatically. Barcode scanner and manual search included — endless typing not.',
  heroBenefits: [
    'AI photo logging: snap your meal, get calories & macros in seconds',
    'Barcode scanner for packaged foods',
    'Clear daily targets for calories, protein, carbs & fat',
    'Progress charts that keep you motivated',
    'Built for weight loss, maintenance or muscle gain',
  ],
  metaTitle: 'MacroMora – AI Calorie Tracker: Count Calories by Photo',
  metaDescription:
    'Track calories by taking a photo. MacroMora\'s AI logs calories, protein, carbs and fat in seconds — plus barcode scanner and macro targets.',
  metaKeywords:
    'ai calorie tracker, photo calorie counter, calorie counter app, macro tracker app, food scanner app, count calories by photo, protein tracker, calorie deficit app, nutrition tracker iPhone',
  screenshots: [
    { src: '/apps/macromora/screenshot-1.webp', alt: 'MacroMora AI calorie tracker – snap a photo of your meal to log calories' },
    { src: '/apps/macromora/screenshot-2.webp', alt: 'MacroMora – AI recognizes the meal and calculates calories and macros' },
    { src: '/apps/macromora/screenshot-3.webp', alt: 'MacroMora macro tracker – daily protein, carbs and fat targets' },
    { src: '/apps/macromora/screenshot-4.webp', alt: 'MacroMora – barcode scanner for packaged food' },
    { src: '/apps/macromora/screenshot-5.webp', alt: 'MacroMora calorie tracker – daily overview and progress charts' },
    { src: '/apps/macromora/screenshot-6.webp', alt: 'MacroMora – weight loss progress and insights' },
  ],
  audience: [
    {
      badge: 'Weight Loss',
      title: 'Losing Weight',
      description: 'Stay in a calorie deficit without the logging fatigue that kills most diets by week three — a photo takes five seconds.',
      color: '#059669',
    },
    {
      badge: 'Muscle',
      title: 'Building Muscle',
      description: 'Hit your daily protein target consistently. MacroMora shows protein, carbs and fat per meal and per day at a glance.',
      color: '#7c3aed',
    },
    {
      badge: 'Simplicity',
      title: 'Tired of MyFitnessPal',
      description: 'If you quit calorie counting because logging felt like a second job, AI photo logging is the restart you\'ve been waiting for.',
      color: '#d97706',
    },
  ],
  features: [
    {
      icon: Camera,
      title: 'Snap & Log With AI',
      description:
        'Take a quick photo and the AI recognizes the meal, estimates portions and logs calories automatically. Homemade dinner or restaurant plate — five seconds, done.',
      color: '#059669',
    },
    {
      icon: Barcode,
      title: 'Barcode Scanner',
      description:
        'Scan any packaged food to pull calories and macros instantly from the label — perfect for snacks, drinks and supermarket staples.',
      color: '#0284c7',
    },
    {
      icon: PieChart,
      title: 'Macros Made Simple',
      description:
        'Protein, carbs and fat in one clean daily overview. See how each meal moves your numbers — without drowning in dashboards.',
      color: '#7c3aed',
    },
    {
      icon: Target,
      title: 'Personal Daily Targets',
      description:
        'Set goals for weight loss, maintenance or muscle gain and get daily calorie and macro targets matched to them.',
      color: '#d97706',
    },
    {
      icon: TrendingUp,
      title: 'Progress You Can See',
      description:
        'Daily and weekly charts show your intake trends and progress toward your goal — the feedback loop that keeps a diet alive.',
      color: '#dd0000',
    },
    {
      icon: Sparkles,
      title: 'Manual Search When You Want It',
      description:
        'Prefer precision for custom meals? Search the food database manually anytime — AI convenience never takes away control.',
      color: '#be185d',
    },
  ],
  steps: [
    { title: 'Set Your Goal', description: 'Choose weight loss, maintenance or muscle gain and get your daily calorie and macro targets.' },
    { title: 'Snap Your Meals', description: 'Photograph each meal — the AI identifies the food and logs calories and macros in seconds.' },
    { title: 'Scan or Search Extras', description: 'Use the barcode scanner for packaged foods and manual search for custom recipes.' },
    { title: 'Watch the Trend', description: 'Check your daily overview and weekly charts to stay on target and adjust as you go.' },
  ],
  platforms: ['iPhone', 'iPad'],
  pricingFree:
    'MacroMora is free to download on iPhone and iPad. Start logging immediately — premium plans unlock unlimited AI photo scans and advanced insights.',
  guides: [
    {
      slug: 'count-calories-by-taking-a-photo',
      keyword: 'count calories by taking a photo',
      title: 'How to Count Calories by Taking a Photo (AI Food Logging Explained)',
      metaTitle: 'Count Calories by Taking a Photo: How AI Food Logging Works',
      metaDescription:
        'AI can estimate calories and macros from one photo of your meal. How photo calorie counting works, how accurate it is, and how to log a meal.',
      excerpt: 'How AI estimates calories from a single photo, how accurate it really is, and when to use barcode or search instead.',
      intro: [
        'Photo-based calorie counting works exactly the way it sounds: you photograph your plate, and an AI model identifies the foods, estimates portion sizes and returns calories, protein, carbs and fat. What took two minutes of database searching per meal now takes five seconds.',
        'The technology matters because logging friction — not lack of willpower — is why most people abandon calorie tracking within three weeks. Remove the friction, and tracking becomes sustainable for months.',
      ],
      sections: [
        {
          heading: 'How AI food recognition works',
          paragraphs: [
            'Modern food-recognition models are trained on millions of labeled meal photos. From one image they detect the individual foods (rice, grilled chicken, broccoli), estimate the portion of each from visual cues like plate coverage and depth, and map everything to a nutrition database to compute calories and macros.',
          ],
          bullets: [
            'Mixed plates are fine: the AI separates components and estimates each one.',
            'You can always adjust: if the AI sees 150 g of rice and you had 250 g, one tap fixes the estimate.',
            'Every logged photo improves consistency — you converge on your true intake quickly.',
          ],
        },
        {
          heading: 'How accurate is photo calorie counting?',
          paragraphs: [
            'Studies and real-world tests put AI photo estimates within roughly 10–20% of true calories for typical meals — remarkably close to manual logging, where people routinely underestimate portions by 20–40%. In other words: photo logging is about as accurate as careful manual logging, and dramatically more accurate than tired, inconsistent manual logging. For weight management, consistency beats precision — and consistency is what photo logging delivers.',
          ],
        },
        {
          heading: 'When to use barcode or search instead',
          bullets: [
            'Packaged foods: scan the barcode — label data beats any estimate.',
            'Drinks and oils: hard to judge visually; log them manually.',
            'Repeated custom recipes: search once, save, and reuse.',
          ],
        },
      ],
      howToHeading: 'How to log your first meal with MacroMora',
      howToSteps: [
        { title: 'Open the camera', text: 'Tap the camera button in MacroMora and photograph your plate from above in decent light.' },
        { title: 'Review the AI result', text: 'In seconds you see the detected foods with calories, protein, carbs and fat. Adjust portions if needed.' },
        { title: 'Confirm the log', text: 'One tap adds the meal to your day — your remaining calorie and macro budget updates instantly.' },
        { title: 'Fill the gaps', text: 'Scan barcodes for packaged snacks and use manual search for drinks — your full day stays accurate.' },
      ],
      faqs: [
        {
          question: 'Is AI photo calorie counting accurate enough for weight loss?',
          answer: 'Yes — estimates typically land within 10–20% of true values, comparable to careful manual logging. Because it removes logging fatigue, real-world accuracy over weeks is usually better than manual tracking.',
        },
        {
          question: 'Does it work with homemade meals?',
          answer: 'Yes — the AI recognizes components of mixed home-cooked plates and estimates each. You can adjust any portion before saving.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'how-to-track-macros-for-beginners',
      keyword: 'how to track macros for beginners',
      title: 'How to Track Macros for Beginners (Without Losing Your Mind)',
      metaTitle: 'How to Track Macros for Beginners: Simple 4-Step System',
      metaDescription:
        'Macro tracking comes down to four steps: set targets, log meals, check the daily overview, adjust weekly. A beginner guide with realistic targets.',
      excerpt: 'Macros in plain English: what protein, carbs and fat targets to set, and the simplest system to actually hit them.',
      intro: [
        'Macro tracking means watching not just total calories, but where they come from: protein, carbohydrates and fat. It is the difference between "I ate 1800 calories" and "I ate 1800 calories with enough protein to keep muscle while losing fat".',
        'The reputation for complexity is outdated. With modern tools, macro tracking is four steps — and only one of them happens more than once a week.',
      ],
      sections: [
        {
          heading: 'What the macros do',
          bullets: [
            'Protein (4 kcal/g): builds and preserves muscle, keeps you full. The macro most beginners under-eat.',
            'Carbohydrates (4 kcal/g): primary energy for training and brain work. Not the enemy — the quantity is the lever.',
            'Fat (9 kcal/g): hormones, absorption of vitamins, satiety. Don\'t crash it below ~20% of calories.',
          ],
        },
        {
          heading: 'Beginner targets that work',
          paragraphs: [
            'A simple, defensible starting point: protein at 1.6–2.2 g per kg of body weight, fat at 25–30% of daily calories, and carbs filling the rest of your calorie budget. Your calorie budget itself comes from your goal — a moderate deficit (300–500 kcal below maintenance) for fat loss, a small surplus for muscle gain.',
          ],
        },
        {
          heading: 'The 4-step system',
          numbered: [
            'Set targets once: enter your goal and let the app compute daily calories and macros.',
            'Log every meal, imperfectly: a 90%-accurate log you keep beats a perfect log you quit.',
            'Glance at the daily overview before dinner: dinner is where you fix a low-protein or high-fat day.',
            'Adjust weekly, not daily: if weight and energy trends drift over 2+ weeks, tweak calories by ~10%.',
          ],
        },
      ],
      howToHeading: 'How to track macros with MacroMora',
      howToSteps: [
        { title: 'Set your goal', text: 'Choose weight loss, maintenance or muscle gain — MacroMora sets daily calorie and macro targets for you.' },
        { title: 'Log by photo', text: 'Snap each meal; the AI logs calories plus the protein, carb and fat breakdown automatically.' },
        { title: 'Check the overview', text: 'The daily view shows exactly where you stand on each macro — so dinner can fix what lunch missed.' },
        { title: 'Review the week', text: 'Weekly charts reveal your real averages. Adjust targets from data, not guilt.' },
      ],
      faqs: [
        {
          question: 'Do I need a food scale to track macros?',
          answer: 'Not to start. AI photo estimates plus barcode scans get you close enough to make progress. Add a scale later only if your results plateau and you want tighter numbers.',
        },
        {
          question: 'Which macro matters most for fat loss?',
          answer: 'Protein — it preserves muscle in a deficit and keeps you full. Hit protein and total calories first; carbs and fat can flex within the remainder.',
        },
      ],
      screenshotIndex: 2,
    },
    {
      slug: 'calorie-deficit-for-weight-loss',
      keyword: 'calorie deficit for weight loss',
      title: 'Calorie Deficit for Weight Loss: How to Calculate & Actually Maintain It',
      metaTitle: 'Calorie Deficit for Weight Loss: Calculate It & Stay In It',
      metaDescription:
        'A calorie deficit is the one non-negotiable of weight loss. How to calculate yours, why 300–500 kcal is the sweet spot, and how to stay in it.',
      excerpt: 'The one non-negotiable of weight loss: how to calculate your deficit, and the tracking habit that keeps you in it.',
      intro: [
        'Every diet that works — keto, fasting, low-fat, all of them — works through the same mechanism: a calorie deficit, meaning you consume less energy than you burn. The method is negotiable; the deficit is not.',
        'The practical challenge is twofold: knowing your numbers, and staying in the deficit for enough weeks to matter. Both are tracking problems, and both got much easier with AI logging.',
      ],
      sections: [
        {
          heading: 'Calculate your deficit in 3 steps',
          numbered: [
            'Estimate maintenance calories: body weight (kg) × 31–33 for moderately active people gives a workable starting estimate.',
            'Subtract 300–500 kcal: enough for ~0.25–0.5 kg of fat loss per week without wrecking energy, mood or muscle.',
            'Verify with reality: track intake and weight for two weeks. If weight doesn\'t trend down, your true maintenance is lower — adjust and continue.',
          ],
        },
        {
          heading: 'Why bigger deficits backfire',
          paragraphs: [
            'Crash deficits (800+ kcal) feel productive for two weeks, then collapse: hunger hormones surge, energy tanks, muscle loss accelerates and the diet ends in a rebound. A moderate deficit you can hold for twelve weeks beats an aggressive one you abandon in three. Sustainable is not a consolation prize — it is the winning strategy.',
          ],
        },
        {
          heading: 'The habit that keeps you in deficit',
          paragraphs: [
            'People who track their food consistently lose significantly more weight than those who don\'t — not because tracking burns calories, but because untracked eating drifts upward invisibly. A handful of nuts here, a splash of oil there, and the deficit quietly disappears. Five-second photo logging keeps the drift visible while it is still small.',
          ],
        },
      ],
      howToHeading: 'How to run your deficit with MacroMora',
      howToSteps: [
        { title: 'Set a weight-loss goal', text: 'MacroMora calculates your daily calorie target with a sensible built-in deficit.' },
        { title: 'Photo-log everything', text: 'Every meal and snack gets a five-second photo log — the consistency that makes deficits real.' },
        { title: 'Watch the daily budget', text: 'See remaining calories at any moment, so evening decisions are informed instead of hopeful.' },
        { title: 'Trust the weekly trend', text: 'Daily weight noise is meaningless; MacroMora\'s weekly charts show the trend that matters.' },
      ],
      faqs: [
        {
          question: 'How big should my calorie deficit be?',
          answer: '300–500 kcal below maintenance for most people — enough for steady fat loss while keeping energy, workouts and adherence intact.',
        },
        {
          question: 'Why am I not losing weight in a deficit?',
          answer: 'Almost always: the deficit exists on paper but not in reality — untracked bites, oils and drinks close the gap. Two weeks of complete photo logging usually reveals it.',
        },
      ],
      screenshotIndex: 4,
    },
  ],
  faqs: [
    {
      question: 'What is MacroMora?',
      answer:
        'MacroMora is an AI-powered calorie and macro tracker for iPhone: photograph your meal and the AI logs calories, protein, carbs and fat automatically — with barcode scanning and manual search when you want them.',
      learnMoreSlug: 'count-calories-by-taking-a-photo',
    },
    {
      question: 'How accurate is the AI food recognition?',
      answer:
        'Typical estimates land within 10–20% of true values — comparable to careful manual logging, and you can adjust any portion before saving. For packaged foods, the barcode scanner uses exact label data.',
      learnMoreSlug: 'count-calories-by-taking-a-photo',
    },
    {
      question: 'Can MacroMora help me lose weight?',
      answer:
        'Yes — set a weight-loss goal and MacroMora gives you a daily calorie target with a built-in deficit, then makes staying in it easy with five-second photo logging and clear progress charts.',
      learnMoreSlug: 'calorie-deficit-for-weight-loss',
    },
    {
      question: 'Does MacroMora track protein and macros?',
      answer:
        'Yes — every log includes protein, carbs and fat, with daily targets and a clean overview. It works great as a dedicated protein tracker too.',
      learnMoreSlug: 'how-to-track-macros-for-beginners',
    },
    {
      question: 'Is MacroMora free?',
      answer:
        'MacroMora is free to download and start using. Premium plans unlock unlimited AI photo scans and advanced insights.',
    },
    {
      question: 'How is MacroMora different from MyFitnessPal?',
      answer:
        'MacroMora is built around AI photo logging first — five seconds per meal instead of database searching. It keeps macros simple with one clean daily overview instead of heavy dashboards.',
    },
  ],
  ctaHeading: 'Start Tracking the Effortless Way',
  ctaText: 'Download MacroMora free and log your next meal with a single photo. Your calorie and macro targets are ready in two minutes.',
  category: 'HealthApplication',
  downloadNote: 'Free to download • In-app purchases available',
};
