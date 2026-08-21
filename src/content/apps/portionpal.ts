import { Salad, Scale, Target, Utensils, ShoppingCart, TrendingUp } from 'lucide-react';
import type { AppContent } from './types';

export const portionpal: AppContent = {
  slug: 'portion-control-app',
  appId: '6787688123',
  name: 'PortionPal',
  storeName: 'PortionPal: Portion Control',
  subtitle: 'Balanced Plates & Serving Sizes',
  lang: 'en',
  appStoreUrl: 'https://apps.apple.com/us/app/portionpal-portion-control/id6787688123',
  icon: '/apps/portionpal/icon.webp',
  accent: '#f97316',
  accentDark: '#c2410c',
  heroTitle: {
    pre: 'Eat Better Portions',
    highlight: 'Without Logging Every Meal',
    post: '',
  },
  heroDescription:
    'PortionPal is portion control without the spreadsheet. Build a balanced plate for breakfast, lunch and dinner, learn what a real serving of protein, carbs, vegetables and fat looks like, and keep it consistent — no barcode scanning, no calorie diary.',
  heroBenefits: [
    'Balanced plates for breakfast, lunch and dinner',
    'Simple serving-size guidance you can eyeball',
    'Portion planning for protein, carbs, veg and fats',
    'Supports weight loss and steadier eating habits',
    'Practical enough to use while you cook',
  ],
  metaTitle: 'PortionPal – Portion Control App & Balanced Plate Planner',
  metaDescription:
    'Portion control without calorie counting. PortionPal helps you build balanced plates, learn real serving sizes and plan portions for weight loss.',
  metaKeywords:
    'portion control app, serving size guide, balanced plate, meal portion planner, portion sizes for weight loss, healthy eating app, plate method, portion guide without calorie counting',
  screenshots: [
    { src: '/apps/portionpal/screenshot-1.webp', alt: 'PortionPal portion control app – balanced plate overview on iPhone' },
    { src: '/apps/portionpal/screenshot-2.webp', alt: 'PortionPal – portion sizes for protein, carbs and vegetables' },
    { src: '/apps/portionpal/screenshot-3.webp', alt: 'PortionPal – planning meal portions for the day' },
    { src: '/apps/portionpal/screenshot-4.webp', alt: 'PortionPal – serving size guidance for everyday foods' },
    { src: '/apps/portionpal/screenshot-5.webp', alt: 'PortionPal – building a healthier plate step by step' },
    { src: '/apps/portionpal/screenshot-6.webp', alt: 'PortionPal – portion control for weight loss goals' },
  ],
  audience: [
    {
      badge: 'Weight Loss',
      title: 'People Losing Weight Slowly',
      description: 'You do not need a calorie diary to eat less. Right-sizing portions is the change most people can actually keep up for a year.',
      color: '#c2410c',
    },
    {
      badge: 'Burnt Out',
      title: 'Ex-Calorie-Trackers',
      description: 'If logging every meal stopped working — or started feeling obsessive — portion guidance gives you structure without the numbers.',
      color: '#0284c7',
    },
    {
      badge: 'Cooking',
      title: 'Home Cooks & Meal Preppers',
      description: 'Plan how much protein, carbs and veg to cook so the plate is balanced before it reaches the table, not after.',
      color: '#059669',
    },
  ],
  features: [
    {
      icon: Salad,
      title: 'Build a Balanced Plate',
      description:
        'See what a complete breakfast, lunch or dinner should look like: how much of the plate is protein, how much is carbohydrate, how much is vegetables and where fats fit in.',
      color: '#059669',
    },
    {
      icon: Scale,
      title: 'Real Serving Sizes',
      description:
        'Learn what one portion actually is — for rice, pasta, meat, cheese, oil and the rest — in terms you can judge by eye instead of weighing.',
      color: '#c2410c',
    },
    {
      icon: Target,
      title: 'Portions for Your Goal',
      description:
        'Adjust portions towards weight loss, maintenance or a higher protein intake without switching to a calorie-counting mindset.',
      color: '#7c3aed',
    },
    {
      icon: Utensils,
      title: 'Made for Real Meals',
      description:
        'Use it while you cook, plate up or check whether what is in front of you is balanced — not two hours later when you are trying to remember what you ate.',
      color: '#0284c7',
    },
    {
      icon: ShoppingCart,
      title: 'Plan Before You Shop',
      description:
        'Deciding portions ahead of the supermarket makes the trolley smaller and the week simpler — you buy for the plates you intend to eat.',
      color: '#d97706',
    },
    {
      icon: TrendingUp,
      title: 'Consistency Over Perfection',
      description:
        'Small, repeatable changes beat strict plans that last ten days. PortionPal is built for the version of healthy eating you can still be doing next spring.',
      color: '#be185d',
    },
  ],
  steps: [
    { title: 'Pick the Meal', description: 'Breakfast, lunch or dinner — start from the meal you are actually about to eat.' },
    { title: 'Set Your Portions', description: 'Choose portions for protein, carbohydrate, vegetables and fats.' },
    { title: 'Plate It Up', description: 'Use the guidance while serving, so the balance happens on the plate.' },
    { title: 'Repeat Tomorrow', description: 'The same simple structure, meal after meal, is what makes it stick.' },
  ],
  platforms: ['iPhone'],
  pricingFree:
    'PortionPal is free to download and free for everyday portion guidance and balanced plates.',
  pricingPro: {
    name: 'PortionPal Pro',
    bullets: [
      'Full portion and meal planning tools',
      'Guidance for more goals and meal types',
      'Subscription or lifetime unlock',
      'Free features stay usable without buying',
    ],
    note: 'Optional in-app purchase',
  },
  guides: [
    {
      slug: 'portion-control-for-weight-loss',
      keyword: 'portion control for weight loss',
      title: 'Portion Control for Weight Loss (Without Counting Calories)',
      metaTitle: 'Portion Control for Weight Loss: A No-Counting Guide',
      metaDescription:
        'You can lose weight without logging every meal. How portion control creates a calorie deficit by default, and the mistakes that quietly undo it.',
      excerpt: 'How right-sized portions create a deficit by default — and the four mistakes that quietly undo it.',
      intro: [
        'Every diet that works does the same thing underneath: it reduces how much you eat. Calorie counting is one way to get there, and it is a good one for people who enjoy data. For everyone else it collapses within a few weeks, because logging every meal is a part-time job.',
        'Portion control gets to the same place through a different door. Instead of measuring what you ate, you decide in advance how much goes on the plate.',
      ],
      sections: [
        {
          heading: 'Why portions work when counting fails',
          bullets: [
            'The decision happens once, at plating, rather than continuously through the meal.',
            'It survives eating out, other people cooking, and days you cannot be bothered.',
            'It removes the all-or-nothing failure mode: a missed log does not end the streak, because there is no log.',
            'It builds a durable skill — recognising a normal portion — that you keep after you stop using any app.',
          ],
        },
        {
          heading: 'Where to start',
          numbered: [
            'Fill half the plate with vegetables or salad. This one change does most of the work.',
            'Make a quarter of the plate protein — roughly a palm-sized serving of meat, fish, tofu or pulses.',
            'Make a quarter starch: a cupped-hand serving of rice, pasta, potato or bread.',
            'Keep added fats to about a thumb-sized portion — oil, butter, cheese, nut butters.',
            'Serve from the kitchen, not from dishes on the table. Second helpings should require standing up.',
          ],
        },
        {
          heading: 'The four mistakes that undo it',
          bullets: [
            'Drinking calories: juices, lattes and soft drinks bypass portion logic entirely.',
            'Plate creep: portions grow back over weeks. Re-checking every month or two catches it early.',
            'Cutting too hard: half-portions leave you hungry by 4pm, and hungry evenings are where plans die.',
            'Ignoring protein: too little protein makes portion control feel like deprivation instead of a meal.',
          ],
        },
      ],
      howToHeading: 'Using PortionPal for weight loss',
      howToSteps: [
        { title: 'Set portions for your goal', text: 'Start from guidance aimed at gradual loss rather than an aggressive cut you will abandon.' },
        { title: 'Check the plate before you eat', text: 'Use PortionPal while serving — that is the moment the decision is still cheap.' },
        { title: 'Keep protein and veg fixed', text: 'Adjust starches and fats first; keeping protein and vegetables steady keeps meals filling.' },
        { title: 'Re-check monthly', text: 'Compare your current portions to the guidance to catch plate creep before it adds up.' },
      ],
      faqs: [
        {
          question: 'How fast will I lose weight with portion control?',
          answer: 'Typically slower than a strict diet and far more sustainably — often in the region of half a kilo a week when portions are consistently right-sized. Slower loss that lasts beats fast loss you regain.',
        },
        {
          question: 'Do I have to weigh food?',
          answer: 'No. The whole point of portion guidance is that you can judge servings by eye and by hand-sized references.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'how-to-build-a-balanced-plate',
      keyword: 'how to build a balanced plate',
      title: 'How to Build a Balanced Plate at Every Meal',
      metaTitle: 'How to Build a Balanced Plate: Protein, Carbs, Veg & Fats',
      metaDescription:
        'The plate method in practice: how much protein, carbohydrate, vegetables and fat belongs on a plate, plus worked examples for breakfast, lunch and dinner.',
      excerpt: 'The plate method with worked examples for breakfast, lunch and dinner — including the meals it does not fit.',
      intro: [
        'The plate method is the most useful nutrition idea that fits in one sentence: half vegetables, a quarter protein, a quarter starch, plus a small amount of fat.',
        'It gets less obvious the moment you apply it to a real meal — breakfast, a curry, a sandwich, a bowl of pasta. Here is how it works in practice.',
      ],
      sections: [
        {
          heading: 'The four components',
          bullets: [
            'Vegetables and salad: half the plate, and the component almost everyone under-serves.',
            'Protein: a palm-sized portion — chicken, fish, eggs, tofu, beans, dairy.',
            'Starch: a cupped handful — rice, pasta, potatoes, bread, couscous.',
            'Fat: a thumb-sized amount of oil, butter, nuts, cheese or dressing.',
          ],
        },
        {
          heading: 'Worked examples',
          numbered: [
            'Breakfast: eggs or Greek yoghurt as protein, oats or toast as starch, fruit standing in for the vegetable half.',
            'Lunch: a big salad base, a palm of chicken or chickpeas, a cupped hand of rice or half a roll, a thumb of dressing.',
            'Dinner: half the plate roasted vegetables, a palm of salmon, a cupped hand of potatoes, olive oil to cook.',
            'Mixed dishes: for a curry or stir-fry, apply the ratios to the pan rather than the plate — more vegetables, less rice.',
          ],
        },
        {
          heading: 'When the plate method does not fit',
          paragraphs: [
            'Soups, sandwiches, pasta bakes and one-pot meals do not separate into quarters. Apply the ratios where the food is assembled: more vegetables in the sauce, a modest weight of dry pasta, protein present in every meal rather than only at dinner.',
            'Athletes, pregnant women and people with medical conditions have different needs — the plate is a default, not a prescription.',
          ],
        },
      ],
      howToHeading: 'Building the plate with PortionPal',
      howToSteps: [
        { title: 'Choose the meal type', text: 'Breakfast, lunch and dinner have different natural shapes — start from the right one.' },
        { title: 'Set each component', text: 'Protein, carbohydrate, vegetables and fats, each with a portion you can eyeball.' },
        { title: 'Serve to the guidance', text: 'Plate up against it rather than checking after the fact.' },
        { title: 'Adapt for mixed dishes', text: 'For curries, bowls and bakes, apply the ratios to the pan before serving.' },
      ],
      faqs: [
        {
          question: 'Does the plate method work for vegetarians?',
          answer: 'Yes — the protein quarter comes from pulses, tofu, tempeh, eggs or dairy. The structure is unchanged.',
        },
        {
          question: 'What about snacks?',
          answer: 'Treat a snack as a small plate: something with protein, something with fibre, and a portion decided before you start eating rather than during.',
        },
      ],
      screenshotIndex: 1,
    },
    {
      slug: 'portion-sizes-without-a-food-scale',
      keyword: 'portion sizes without a scale',
      title: 'Portion Sizes Without a Scale: The Hand Method',
      metaTitle: 'Portion Sizes Without a Food Scale: Hand & Eye Guide',
      metaDescription:
        'No scale, no measuring cups. Learn the hand-portion method — palm, fist, cupped hand, thumb — and how to estimate servings accurately when eating out.',
      excerpt: 'Palm, fist, cupped hand, thumb: portion references that travel with you, including at restaurants.',
      intro: [
        'Kitchen scales are accurate and stay in the kitchen. The portions that derail most people happen elsewhere: at a restaurant, at a buffet, at someone else’s dinner table, at 11pm in front of the fridge.',
        'The hand method exists for those moments. It is less precise than weighing and far more useful, because it is always with you and scales to your body.',
      ],
      sections: [
        {
          heading: 'The four hand references',
          bullets: [
            'Palm = one portion of protein (chicken breast, fish fillet, tofu block).',
            'Fist = one portion of vegetables — and most people need two.',
            'Cupped hand = one portion of carbohydrate (cooked rice, pasta, potato).',
            'Thumb = one portion of fat (oil, butter, cheese, nut butter).',
          ],
        },
        {
          heading: 'Eating out',
          numbered: [
            'Assume restaurant portions are one and a half to two times a home portion — plan to leave some.',
            'Order a vegetable side you actually like; it is the easiest way to rebalance a plate you did not design.',
            'Ask for sauces and dressings on the side, where a thumb-sized portion is visible rather than poured.',
            'Split a starter or a dessert instead of skipping the social part of the meal entirely.',
            'For buffets, walk the whole line once before taking anything, then serve one plate and sit down.',
          ],
        },
        {
          heading: 'Calibrating your eye',
          paragraphs: [
            'Spend one week checking your hand estimates against a scale or a measuring cup, then stop. The point is not to weigh forever — it is to find out whether your "cupped hand of rice" is 60 grams or 140.',
            'Most people discover their starch and fat portions are considerably larger than they assumed, and their vegetable portions smaller. Once recalibrated, the estimate stays reliable for months.',
          ],
        },
      ],
      howToHeading: 'Practising portions with PortionPal',
      howToSteps: [
        { title: 'Learn the reference portions', text: 'PortionPal shows what a serving of each food group looks like in everyday terms.' },
        { title: 'Apply them to your own plate', text: 'Use the guidance while serving at home, where portions are under your control.' },
        { title: 'Take them out with you', text: 'The same references work in a restaurant, where nothing can be measured.' },
        { title: 'Recheck occasionally', text: 'Portions drift. A quick comparison every few weeks keeps your eye honest.' },
      ],
      faqs: [
        {
          question: 'Do hand portions work if I have small hands?',
          answer: 'That is the design: hand size correlates roughly with body size, so the portions scale to the person using them.',
        },
        {
          question: 'Is PortionPal a calorie tracker?',
          answer: 'No. It is a portion and balanced-plate guide, built for people who want structure without logging every meal.',
        },
      ],
      screenshotIndex: 3,
    },
  ],
  faqs: [
    {
      question: 'What is PortionPal?',
      answer:
        'PortionPal is a portion control app for iPhone. It helps you build balanced plates and learn practical serving sizes for protein, carbohydrates, vegetables and fats — without calorie counting or food logging.',
      learnMoreSlug: 'how-to-build-a-balanced-plate',
    },
    {
      question: 'Can portion control help me lose weight?',
      answer:
        'Yes — right-sizing portions reduces intake without a diary, which is why many people stick with it far longer than calorie counting.',
      learnMoreSlug: 'portion-control-for-weight-loss',
    },
    {
      question: 'Do I need kitchen scales?',
      answer:
        'No. PortionPal works with practical serving references you can judge by eye and by hand, including when you eat out.',
      learnMoreSlug: 'portion-sizes-without-a-food-scale',
    },
    {
      question: 'Does PortionPal count calories or macros?',
      answer: 'No — it deliberately avoids logging. The focus is portion size and plate balance.',
    },
    {
      question: 'Does it work for vegetarian and vegan meals?',
      answer: 'Yes. The protein portion can come from pulses, tofu, tempeh, eggs or dairy — the plate structure stays the same.',
    },
    {
      question: 'Is PortionPal free?',
      answer:
        'Yes, PortionPal is free to download and use. An optional Pro purchase unlocks the full planning tools; free features remain available without buying.',
    },
  ],
  ctaHeading: 'Better Portions, Starting With Your Next Meal',
  ctaText: 'Download PortionPal free and build your next plate with guidance instead of guesswork.',
  category: 'HealthApplication',
  downloadNote: 'Free to download • Optional in-app purchases',
};
