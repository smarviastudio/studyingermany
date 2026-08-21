import { ChefHat, Flame, Refrigerator, Timer, ShoppingCart, Sparkles } from 'lucide-react';
import type { AppContent } from './types';

export const airfryer: AppContent = {
  slug: 'air-fryer-recipes-app',
  appId: '6786803692',
  name: 'AirFryer Chef',
  storeName: 'Air Fryer Chef: Recipes',
  subtitle: 'Recipes, Times & Temperatures',
  lang: 'en',
  appStoreUrl: 'https://apps.apple.com/us/app/air-fryer-chef-recipes/id6786803692',
  icon: '/apps/airfryer/icon.webp',
  accent: '#f59e0b',
  accentDark: '#b45309',
  heroTitle: {
    pre: 'Air Fryer Recipes With the',
    highlight: 'Times and Temperatures',
    post: 'Already Dialled In',
    },
  heroDescription:
    'AirFryer Chef is a cookbook built for one appliance. Every recipe comes with the exact temperature in °C and °F, preheat and shake timings, step-by-step instructions with a built-in timer, and full nutrition per serving.',
  heroBenefits: [
    'Recipes for chicken, seafood, vegetables, snacks and desserts',
    'Exact temperature in °C and °F, plus preheat and shake timing',
    'Step-by-step cooking with a built-in timer',
    'Cook with what is already in your kitchen',
    'Scale servings — ingredient amounts update automatically',
  ],
  metaTitle: 'AirFryer Chef – Air Fryer Recipes App with Times & Temperatures',
  metaDescription:
    'Air fryer recipes with exact times, temperatures and step-by-step guidance. Filter by time, diet or calories, cook with what you have, and build a shopping list. Free on iPhone.',
  metaKeywords:
    'air fryer recipes, air fryer cookbook app, air fryer cooking times, air fryer temperature chart, air fryer chicken recipes, healthy air fryer meals, what to cook in air fryer, air fryer app',
  screenshots: [
    { src: '/apps/airfryer/screenshot-1.webp', alt: 'AirFryer Chef app – air fryer recipe with cooking time and temperature' },
    { src: '/apps/airfryer/screenshot-2.webp', alt: 'AirFryer Chef – meal planning with air fryer recipes' },
    { src: '/apps/airfryer/screenshot-3.webp', alt: 'AirFryer Chef – swipe through the For You recipe deck' },
    { src: '/apps/airfryer/screenshot-4.webp', alt: 'AirFryer Chef – cook with the ingredients you already have' },
    { src: '/apps/airfryer/screenshot-5.webp', alt: 'AirFryer Chef – step-by-step cooking mode with a timer' },
    { src: '/apps/airfryer/screenshot-6.webp', alt: 'AirFryer Chef – shopping list grouped by recipe' },
  ],
  audience: [
    {
      badge: 'New Owners',
      title: 'New Air Fryer Owners',
      description: 'The appliance is easy; knowing 190°C for 18 minutes with a shake at 10 is the part nobody tells you. Every recipe here already answers it.',
      color: '#b45309',
    },
    {
      badge: 'Weeknights',
      title: 'Busy Weeknight Cooks',
      description: 'Filter by time and cook something decent in twenty minutes, without heating a full oven for two portions.',
      color: '#0284c7',
    },
    {
      badge: 'Meal Prep',
      title: 'Meal Preppers & Gym Cooks',
      description: 'Full nutrition per serving, scalable portions and a shopping list that groups by recipe — Sunday prep without the spreadsheet.',
      color: '#059669',
    },
  ],
  features: [
    {
      icon: Flame,
      title: 'Dialled-In Temperatures',
      description:
        'Every recipe carries the exact temperature in both Celsius and Fahrenheit, plus preheat, shake-or-flip and rest timings — the details that separate crispy from disappointing.',
      color: '#b45309',
    },
    {
      icon: Timer,
      title: 'Step-by-Step With a Timer',
      description:
        'Cook along one instruction at a time with the timer built into the step, instead of squinting at a wall of text with greasy hands.',
      color: '#0284c7',
    },
    {
      icon: Refrigerator,
      title: 'Cook With What You Have',
      description:
        'Tell the app what is in your kitchen and see which recipes match and what is missing. Advanced pantry matching is part of Pro.',
      color: '#059669',
    },
    {
      icon: Sparkles,
      title: 'For You & Surprise Me',
      description:
        'Swipe the For You deck when nothing sounds appealing, or tap Surprise Me and let the app pick tonight’s dinner for you.',
      color: '#7c3aed',
    },
    {
      icon: ChefHat,
      title: 'Filter How You Actually Cook',
      description:
        'By time, cuisine, difficulty, diet or calories — so "something under 25 minutes, high protein" is a filter rather than a scroll.',
      color: '#be185d',
    },
    {
      icon: ShoppingCart,
      title: 'Smart Shopping List',
      description:
        'Ingredients group by recipe, tick off as you shop, and share the whole list as text with whoever is going to the supermarket.',
      color: '#0f766e',
    },
  ],
  steps: [
    { title: 'Find a Recipe', description: 'Browse, filter by time or diet, swipe the For You deck, or hit Surprise Me.' },
    { title: 'Check Time & Temperature', description: 'Every recipe shows the exact setting, preheat and when to shake.' },
    { title: 'Cook Step by Step', description: 'Follow the instructions with the timer running inside the step.' },
    { title: 'Shop for Next Time', description: 'Add what you need to the shopping list, grouped by recipe.' },
  ],
  platforms: ['iPhone'],
  pricingFree:
    'AirFryer Chef is free to download, with recipes, times, temperatures and the shopping list included.',
  pricingPro: {
    name: 'AirFryer Chef Pro',
    bullets: [
      'Pro recipe collection',
      'Personalised meal planning',
      'Cook Mode',
      'Advanced pantry matching',
    ],
    note: 'Monthly, yearly, or lifetime where available',
  },
  guides: [
    {
      slug: 'air-fryer-cooking-times-chart',
      keyword: 'air fryer cooking times and temperatures',
      title: 'Air Fryer Cooking Times and Temperatures: The Reference Chart',
      metaTitle: 'Air Fryer Cooking Times & Temperature Chart (°C and °F)',
      metaDescription:
        'Typical air fryer times and temperatures for chicken, fish, chips, vegetables and frozen food — plus how to convert oven recipes and why shaking matters.',
      excerpt: 'Typical times and temperatures by food type, plus the oven-conversion rule and why shaking matters.',
      intro: [
        'An air fryer is a small convection oven with an aggressive fan. That single fact explains almost everything about how to cook in one: heat moves faster, food browns sooner, and oven timings will overcook your dinner if you use them unchanged.',
        'These are typical starting points. Wattage, basket size and how full the basket is all shift the result, so treat the chart as a first attempt and note what your machine actually does.',
      ],
      sections: [
        {
          heading: 'Typical settings by food',
          bullets: [
            'Chicken breast: 190°C / 375°F, 16–20 min, flip halfway — cook to 74°C / 165°F internal.',
            'Chicken wings: 200°C / 400°F, 20–24 min, shake twice for even crisping.',
            'Salmon fillet: 190°C / 375°F, 8–11 min, skin down, no flip.',
            'Homemade chips: 190°C / 375°F, 18–24 min, shake every 8 minutes.',
            'Frozen chips or nuggets: 200°C / 400°F, 12–16 min, shake once.',
            'Roasted vegetables: 190°C / 375°F, 12–18 min depending on density.',
            'Halloumi or tofu: 200°C / 400°F, 10–14 min, turn once.',
            'Reheating pizza: 160°C / 320°F, 3–4 min, better than any microwave.',
          ],
        },
        {
          heading: 'Converting an oven recipe',
          numbered: [
            'Drop the temperature by about 20°C / 25°F.',
            'Cut the time by roughly 20 per cent.',
            'Check at 70 per cent of the original time — air fryers finish sooner than you expect.',
            'Cook in a single layer. Overlapping food steams instead of crisping, whatever the recipe says.',
            'Use a thermometer for meat rather than trusting the clock.',
          ],
        },
        {
          heading: 'Why shaking matters more than preheating',
          paragraphs: [
            'Most baskets have a hot zone near the element. Shaking or flipping halfway is what turns "crisp on one side" into evenly cooked food, and it matters more than whether you preheated.',
            'Preheating still helps for anything you want to sear — steak, halloumi, chicken thighs with skin. For chips and frozen food the difference is small.',
          ],
        },
      ],
      howToHeading: 'Using the timings in AirFryer Chef',
      howToSteps: [
        { title: 'Open the recipe', text: 'Temperature in °C and °F, total time and preheat guidance are on the recipe itself.' },
        { title: 'Follow the shake prompts', text: 'Steps tell you when to shake or flip rather than leaving it to your memory.' },
        { title: 'Run the built-in timer', text: 'The timer lives inside the step, so you are not juggling a separate clock.' },
        { title: 'Scale the servings', text: 'Change the serving count and ingredient amounts recalculate automatically.' },
      ],
      faqs: [
        {
          question: 'Do I need to preheat an air fryer?',
          answer: 'For most foods, two to three minutes helps, and for anything you want to sear it matters. Frozen foods and chips are fine without it.',
        },
        {
          question: 'Why is my air fryer food not crispy?',
          answer: 'Almost always an overfull basket. Food needs space for air to circulate — cook in two batches rather than one crowded layer.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'air-fryer-recipes-with-what-you-have',
      keyword: 'what to cook in air fryer with what I have',
      title: 'What to Cook in the Air Fryer With What You Already Have',
      metaTitle: 'What to Cook in an Air Fryer With Ingredients You Have',
      metaDescription:
        'Nothing planned for dinner? Here is how to cook from your fridge and cupboard with an air fryer — reliable combinations, timing rules and how pantry matching works.',
      excerpt: 'Cooking from the fridge: reliable combinations, timing rules, and how pantry matching shortcuts the decision.',
      intro: [
        'The hardest part of weeknight cooking is not technique, it is the decision. You have chicken thighs, half a bag of potatoes, something green that needs using, and no idea what that adds up to.',
        'The air fryer is unusually good at this problem, because most of what it does well follows the same pattern: protein plus a starch plus a vegetable, all cut to a similar size and cooked hot.',
      ],
      sections: [
        {
          heading: 'Combinations that always work',
          bullets: [
            'Any protein + potato + a green vegetable, all cut to roughly 2cm.',
            'Chickpeas or tofu tossed in oil and spice, 200°C until crisp, over rice you already had.',
            'Frozen anything: the air fryer beats an oven for frozen chips, fish and nuggets, and takes half the time.',
            'Leftover roast vegetables reheated at 180°C for 5 minutes — better than they were yesterday.',
            'Eggs, bread and cheese: toasted sandwiches and baked eggs work far better than most people expect.',
          ],
        },
        {
          heading: 'Rules for cooking mixed ingredients together',
          numbered: [
            'Cut everything to a similar size or nothing finishes together.',
            'Start with what takes longest — potatoes and root vegetables get a head start of 8 to 10 minutes.',
            'Add quick items later: peppers, courgette and asparagus need 8 to 12 minutes total.',
            'Oil everything lightly. Dry surfaces go leathery rather than crisp.',
            'Season after cooking for herbs, before cooking for salt and paprika.',
          ],
        },
      ],
      howToHeading: 'Finding a recipe from your kitchen in AirFryer Chef',
      howToSteps: [
        { title: 'Tell the app what you have', text: 'Enter the ingredients in your fridge and cupboard.' },
        { title: 'See what matches', text: 'Recipes you can make appear alongside ones that need only a couple of extra items.' },
        { title: 'Swipe if you are undecided', text: 'The For You deck and Surprise Me exist for the evenings when nothing sounds right.' },
        { title: 'Add the gaps to your list', text: 'Missing ingredients go to the shopping list, grouped by recipe.' },
      ],
      faqs: [
        {
          question: 'Can I cook a full meal in one air fryer basket?',
          answer: 'Yes, if you stage it: start the dense items, add quicker ones later, and keep everything in a single layer.',
        },
        {
          question: 'Is pantry matching free?',
          answer: 'Basic use is included; advanced pantry matching is part of AirFryer Chef Pro.',
        },
      ],
      screenshotIndex: 3,
    },
    {
      slug: 'air-fryer-for-beginners',
      keyword: 'air fryer for beginners',
      title: 'Air Fryer for Beginners: The First Two Weeks',
      metaTitle: 'Air Fryer for Beginners: What to Cook First and What to Avoid',
      metaDescription:
        'Just unboxed an air fryer? Here is what to cook in the first week, the mistakes everyone makes, how to clean it properly, and what genuinely does not work in one.',
      excerpt: 'What to cook first, the mistakes everyone makes, and the foods that genuinely do not work.',
      intro: [
        'The air fryer sitting on your counter is a convection oven with a fan strong enough to crisp food using a fraction of the oil. It is very good at a specific set of things and quite bad at a few others, and knowing which is which is most of the learning curve.',
        'Two weeks of cooking is enough to know your machine. Here is how to spend them.',
      ],
      sections: [
        {
          heading: 'Cook these first',
          numbered: [
            'Frozen chips — the fastest way to learn your machine’s timing and see the appeal immediately.',
            'Chicken thighs, skin on, 200°C for 22 minutes. Nearly impossible to ruin.',
            'Roasted vegetables with oil and salt, 190°C for 15 minutes.',
            'Halloumi or tofu at 200°C for 12 minutes, turned once.',
            'Reheated leftovers: pizza, roast potatoes, fried chicken. This alone justifies the counter space.',
          ],
        },
        {
          heading: 'Mistakes everyone makes once',
          bullets: [
            'Overfilling the basket, then wondering why nothing crisped.',
            'Using too much oil — a light coating is enough, and excess smokes.',
            'Cooking wet marinades that steam the food rather than browning it. Pat things dry first.',
            'Putting baking paper in without food on top: it lifts into the element and burns.',
            'Skipping the shake, then finding one side pale and the other nearly burnt.',
          ],
        },
        {
          heading: 'What does not work, and cleaning',
          paragraphs: [
            'Wet batters run through the basket. Loose leafy greens fly into the element. Cheese on its own melts through and welds itself to the base. Large roasting joints do not fit or cook evenly. Anything that needs to stay submerged in liquid belongs in a pan.',
            'Clean the basket after every use while it is still warm — soak for ten minutes, then a soft brush. Burnt-on residue smokes the next time you cook, which is the most common reason a new air fryer starts setting off the smoke alarm.',
          ],
        },
      ],
      howToHeading: 'Getting started with AirFryer Chef',
      howToSteps: [
        { title: 'Filter by difficulty', text: 'Start with easy recipes to learn how your machine behaves before anything ambitious.' },
        { title: 'Use the exact settings', text: 'Each recipe gives the temperature and total time, so nothing is guesswork on day one.' },
        { title: 'Cook along step by step', text: 'The built-in timer handles preheat, shake and rest without you tracking them.' },
        { title: 'Save what worked', text: 'Build a small repertoire of reliable weeknight recipes before expanding.' },
      ],
      faqs: [
        {
          question: 'Is air frying healthier than deep frying?',
          answer: 'It uses far less oil for a similar texture, which cuts a substantial amount of fat from fried food. Whether a given meal is healthy still depends on the meal.',
        },
        {
          question: 'Can I put foil or baking paper in an air fryer?',
          answer: 'Yes, weighted down with food and never covering the whole base — airflow is the entire mechanism, and blocking it defeats the appliance.',
        },
      ],
      screenshotIndex: 4,
    },
  ],
  faqs: [
    {
      question: 'What is AirFryer Chef?',
      answer:
        'AirFryer Chef is an air fryer cookbook app for iPhone. Every recipe includes the exact temperature in °C and °F, preheat and shake timing, step-by-step instructions with a timer, and full nutrition per serving.',
      learnMoreSlug: 'air-fryer-cooking-times-chart',
    },
    {
      question: 'Can it suggest recipes from ingredients I already have?',
      answer:
        'Yes — tell the app what is in your kitchen and it shows matching recipes and what is missing. Advanced pantry matching is part of Pro.',
      learnMoreSlug: 'air-fryer-recipes-with-what-you-have',
    },
    {
      question: 'Is it useful if I have never used an air fryer?',
      answer:
        'Especially then. Filter by difficulty, start with the easy recipes, and the exact settings mean nothing is guesswork.',
      learnMoreSlug: 'air-fryer-for-beginners',
    },
    {
      question: 'Does it show Celsius or Fahrenheit?',
      answer: 'Both, on every recipe.',
    },
    {
      question: 'Can I scale recipes for more people?',
      answer: 'Yes — change the number of servings and all ingredient amounts update automatically.',
    },
    {
      question: 'Is AirFryer Chef free?',
      answer:
        'Yes, it is free to download. AirFryer Chef Pro is an optional purchase unlocking Pro recipes, meal planning, Cook Mode and advanced pantry matching, available monthly, yearly, or as a lifetime option where offered.',
    },
  ],
  ctaHeading: 'Cook Something Crispy Tonight',
  ctaText: 'Download AirFryer Chef free and get the time, the temperature and the steps for your next air fryer meal.',
  category: 'FoodApplication',
  downloadNote: 'Free to download • Optional in-app purchases',
};
