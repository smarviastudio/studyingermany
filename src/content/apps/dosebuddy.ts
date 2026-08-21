import { Bell, ListChecks, Eye, History, FileText, PillBottle } from 'lucide-react';
import type { AppContent } from './types';

export const dosebuddy: AppContent = {
  slug: 'dosebuddy-pill-reminder-app',
  appId: '6787779516',
  name: 'DoseBuddy',
  storeName: 'DoseBuddy: Pill Reminder',
  subtitle: 'Medication Tracker & Alarm',
  lang: 'en',
  appStoreUrl: 'https://apps.apple.com/us/app/dosebuddy-pill-reminder/id6787779516',
  icon: '/apps/dosebuddy/icon.webp',
  accent: '#34d399',
  accentDark: '#0284c7',
  heroTitle: {
    pre: 'The Pill Reminder App That Keeps Your',
    highlight: 'Medication On Track',
    post: '',
  },
  heroDescription:
    'DoseBuddy is a simple pill reminder and medication tracker for iPhone. Add your medicines, set reminder times, and check off each dose as taken or skipped — with large text, big buttons and a calm design that works for every age.',
  heroBenefits: [
    'Daily pill and medicine reminders you can\'t miss',
    'Big, clear medication checklist for today',
    'Mark doses as taken or skipped — with snooze',
    'Pill counter with refill warnings before you run out',
    'Share your medicine list with your doctor as a PDF',
  ],
  metaTitle: 'DoseBuddy – Pill Reminder & Med Tracker for iPhone',
  metaDescription:
    'Never miss a dose again. DoseBuddy is a simple pill reminder and medication tracker with alarms, refill warnings and dose history. Free on iPhone.',
  metaKeywords:
    'pill reminder app, medication tracker app, medicine reminder, medication reminder app for seniors, pill tracker iPhone, dose tracker, refill reminder, medication schedule app, tablet reminder',
  screenshots: [
    { src: '/apps/dosebuddy/screenshot-1.webp', alt: 'DoseBuddy pill reminder app – today\'s medication checklist on iPhone' },
    { src: '/apps/dosebuddy/screenshot-2.webp', alt: 'DoseBuddy – add a medicine with dosage and reminder times' },
    { src: '/apps/dosebuddy/screenshot-3.webp', alt: 'DoseBuddy medication tracker – dose history and streaks' },
    { src: '/apps/dosebuddy/screenshot-4.webp', alt: 'DoseBuddy – pill counter and refill warning' },
  ],
  audience: [
    {
      badge: 'Daily Meds',
      title: 'Anyone on Regular Medication',
      description: 'Blood pressure, thyroid, antibiotics or vitamins — if it matters that you take it on time, DoseBuddy keeps it on schedule.',
      color: '#0284c7',
    },
    {
      badge: 'Seniors',
      title: 'Older Adults',
      description: 'Large text, high contrast and big buttons make DoseBuddy genuinely usable without reading glasses or tech experience.',
      color: '#059669',
    },
    {
      badge: 'Caregivers',
      title: 'Family Caregivers',
      description: 'Keep a parent\'s medicine list organized, track what was taken, and share the full list with doctors as a PDF.',
      color: '#7c3aed',
    },
  ],
  features: [
    {
      icon: Bell,
      title: 'Reminders That Work',
      description:
        'Set one or more reminder times per medicine and get a clear alarm for every dose. Snooze when you need a few minutes — DoseBuddy asks again instead of letting the dose slip.',
      color: '#0284c7',
    },
    {
      icon: ListChecks,
      title: 'Today\'s Checklist',
      description:
        'One glance shows everything due today. Tap to mark each dose taken or skipped and watch the list clear — a simple daily ritual that builds the habit.',
      color: '#059669',
    },
    {
      icon: Eye,
      title: 'Senior-Friendly Design',
      description:
        'Large text, high contrast and big touch targets throughout. DoseBuddy was designed so older adults and anyone with reduced vision can use it comfortably.',
      color: '#d97706',
    },
    {
      icon: PillBottle,
      title: 'Refill Warnings',
      description:
        'The pill counter tracks how many tablets you have left and warns you before you run out — so the pharmacy trip happens before the last pill, not after.',
      color: '#dd0000',
    },
    {
      icon: History,
      title: 'Dose History & Streaks',
      description:
        'Every taken or skipped dose is logged. Review your history, see adherence streaks, and answer "did I already take it?" with data instead of doubt.',
      color: '#7c3aed',
    },
    {
      icon: FileText,
      title: 'PDF Medicine List',
      description:
        'Export your complete medicine list with dosages and instructions as a PDF — perfect for doctor visits, hospital stays or sharing with family.',
      color: '#be185d',
    },
  ],
  steps: [
    { title: 'Add Your Medicines', description: 'Enter each medicine with its dosage, instructions and how many pills you have.' },
    { title: 'Set Reminder Times', description: 'Choose when each dose is due — morning, evening, multiple times a day, or as-needed.' },
    { title: 'Check Off Each Dose', description: 'When the reminder fires, mark the dose taken or skipped right from the notification.' },
    { title: 'Stay on Track', description: 'Watch your streaks grow, get refill warnings early, and share your list with your doctor.' },
  ],
  platforms: ['iPhone'],
  pricingFree:
    'DoseBuddy is free to download and free for everyday use. Premium unlocks unlimited medicines, multiple reminder times per medicine, refill tracking and full history.',
  pricingPro: {
    name: 'DoseBuddy Premium',
    bullets: [
      'Unlimited medicines',
      'Multiple reminder times per medicine',
      'Refill tracking & warnings',
      'Full dose history',
    ],
    note: 'One-time and subscription options available in the app',
  },
  guides: [
    {
      slug: 'how-to-remember-to-take-medication',
      keyword: 'how to remember to take medication',
      title: 'How to Remember to Take Your Medication: 6 Habits That Work',
      metaTitle: 'How to Remember to Take Medication: 6 Habits',
      metaDescription:
        'Forgetting doses is the top reason medications fail. These 6 evidence-based habits — anchoring, visual cues, smart reminders — make it automatic.',
      excerpt: 'Six evidence-based habits — from habit anchoring to dose logging — that make taking medication automatic.',
      intro: [
        'Roughly half of all long-term medications are not taken as prescribed, and the most common reason is simple forgetting. That is not a discipline problem — it is a systems problem. Human memory is bad at "invisible" repeated tasks, especially ones with no immediate consequence when skipped.',
        'The fix is to stop relying on memory entirely. These six habits, used together, make taking medication as automatic as brushing your teeth.',
      ],
      sections: [
        {
          heading: 'The 6 habits',
          numbered: [
            'Anchor to an existing habit: take pills immediately after something you never skip — brushing teeth, morning coffee, feeding the cat.',
            'Use one consistent time and place: same counter, same water glass. Context is memory\'s strongest trigger.',
            'Set a real alarm, not a mental note: a notification that names the medicine and waits for confirmation beats any intention.',
            'Confirm every dose: checking off a dose closes the mental loop. It also kills the "did I take it already?" double-dose risk.',
            'Prepare visually: keep the bottle where the habit happens (safely away from children), not in a drawer.',
            'Review weekly: a quick look at your adherence history shows drift early — three missed Tuesdays in a row is a schedule problem you can fix.',
          ],
        },
        {
          heading: 'Why "did I take it?" is the dangerous question',
          paragraphs: [
            'Skipping a dose is usually less harmful than doubling one. When you cannot remember whether you took your blood-pressure pill, both choices are bad guesses. A logged confirmation — one tap when you take the dose — turns that guess into a fact you can check in two seconds.',
          ],
        },
      ],
      howToHeading: 'How to build the system with DoseBuddy',
      howToSteps: [
        { title: 'Add each medicine once', text: 'Enter name, dosage and instructions. This is your single source of truth for every dose that follows.' },
        { title: 'Set reminders at your anchor times', text: 'Schedule notifications to fire right after your anchor habit — with your morning coffee, not vaguely "in the morning".' },
        { title: 'Confirm from the notification', text: 'Mark the dose taken (or snooze it) directly when the reminder fires. The checklist clears, the history logs itself.' },
        { title: 'Check your streak weekly', text: 'DoseBuddy\'s history and streaks show your real adherence — and make not breaking the chain oddly satisfying.' },
      ],
      faqs: [
        {
          question: 'What should I do if I miss a dose?',
          answer: 'It depends on the medicine — check the leaflet or ask your pharmacist. Never double a dose to catch up unless your doctor has told you to. A dose log helps you give your doctor exact information.',
        },
        {
          question: 'Do pill reminder apps actually improve adherence?',
          answer: 'Yes — studies on reminder apps consistently show meaningful adherence improvements, especially for people taking multiple daily medications.',
        },
      ],
      screenshotIndex: 0,
    },
    {
      slug: 'pill-reminder-app-for-seniors',
      keyword: 'pill reminder app for seniors',
      title: 'The Best Pill Reminder Setup for Seniors (Simple & Readable)',
      metaTitle: 'Pill Reminder App for Seniors: Large-Text Setup',
      metaDescription:
        'What makes a pill reminder app senior-friendly? Large text, big buttons, no clutter, loud reminders. The checklist and setup for older adults.',
      excerpt: 'What actually makes a medication app usable for older adults — and a 10-minute setup a family member can do.',
      intro: [
        'Most medication apps fail older users for boring reasons: text too small, buttons too close together, features buried in menus, and notifications that are easy to dismiss by accident. For a senior managing five or more daily medicines, the app must be simpler than the paper list it replaces.',
        'Here is what genuinely senior-friendly looks like, and a setup a son or daughter can complete in ten minutes on a parent\'s iPhone.',
      ],
      sections: [
        {
          heading: 'The senior-friendly checklist',
          bullets: [
            'Large, high-contrast text readable without glasses at arm\'s length.',
            'One main screen: today\'s medicines as a simple checklist — no dashboards, no tabs to hunt through.',
            'Big tap targets: "Taken" should be impossible to miss with an unsteady finger.',
            'Loud, persistent reminders with snooze — a silent badge is not a reminder.',
            'No account, no ads, no popups asking for ratings mid-dose.',
          ],
        },
        {
          heading: 'Setting it up for a parent (10 minutes)',
          numbered: [
            'Sit together with the actual pill bottles and enter each medicine with its exact dosage text from the label.',
            'Set reminder times matching their real routine — not the "ideal" schedule, the one they actually live.',
            'Turn iPhone text size up in Settings → Display & Brightness if needed; a good app respects it.',
            'Do one practice run: let the reminder fire, and have them mark it taken themselves.',
            'Enable refill warnings so the app — not memory — watches the pill count.',
          ],
        },
      ],
      howToHeading: 'Why DoseBuddy works for older adults',
      howToSteps: [
        { title: 'Everything is big by design', text: 'DoseBuddy uses large text, high contrast and generous buttons throughout — designed for readability first.' },
        { title: 'Today is one simple list', text: 'The main screen is just today\'s medicines in order. Tap the big checkmark when taken — done.' },
        { title: 'Reminders that persist', text: 'Alarms name the medicine and wait for confirmation; snooze gives a few more minutes instead of losing the dose.' },
        { title: 'Family stays in the loop', text: 'The PDF medicine list shares the full, current medication plan with doctors and family in one tap.' },
      ],
      faqs: [
        {
          question: 'Can a family member set up DoseBuddy remotely?',
          answer: 'The fastest path is 10 minutes together with the pill bottles (in person or on a video call). After setup, day-to-day use is a single checklist tap.',
        },
        {
          question: 'Does DoseBuddy require an account or subscription?',
          answer: 'No account is needed. The app is free for everyday use; Premium adds unlimited medicines, multiple reminder times, refill tracking and full history.',
        },
      ],
      screenshotIndex: 1,
    },
    {
      slug: 'medication-list-for-caregivers',
      keyword: 'medication list for caregiver doctor visits',
      title: 'Keeping a Medication List as a Caregiver (and Sharing It With Doctors)',
      metaTitle: 'Caregiver Medication List: Track & Share With Doctors',
      metaDescription:
        'Caring for a parent? How to keep an always-current medication list, track taken and skipped doses, and hand doctors a complete PDF.',
      excerpt: 'How caregivers keep an always-current medication list — and hand doctors the full picture at every appointment.',
      intro: [
        'Every doctor visit starts with the same question: "What medications are they currently taking?" For caregivers juggling a parent\'s prescriptions across multiple doctors, answering from memory is risky — outdated lists cause prescribing errors, duplicate therapies and dangerous interactions.',
        'The solution is a single, living medication list that updates the moment anything changes, tracks what was actually taken, and exports cleanly for every appointment.',
      ],
      sections: [
        {
          heading: 'What a complete medication list contains',
          bullets: [
            'Every prescription medicine with exact dosage and schedule ("Metoprolol 47.5 mg, 1x morning").',
            'Over-the-counter medicines, vitamins and supplements — doctors need these for interaction checks.',
            'As-needed (PRN) medicines and how often they are actually used.',
            'Instructions that matter: with food, not with dairy, at least 2 hours apart.',
          ],
        },
        {
          heading: 'Why tracking doses matters as much as the list',
          paragraphs: [
            'When a doctor asks "is the new blood-pressure medication working?", the honest answer depends on whether it was actually taken consistently. A dose history — taken, skipped, when — turns "I think so" into real data, and helps spot patterns like evening doses being missed far more often than morning ones.',
          ],
        },
        {
          heading: 'The appointment routine',
          numbered: [
            'Update the list the same day any prescription changes — new medicine, new dosage, anything stopped.',
            'Before each appointment, export the current list as a PDF.',
            'Bring the dose history for any medicine the doctor is evaluating.',
            'After the appointment, apply the changes immediately while they are fresh.',
          ],
        },
      ],
      howToHeading: 'How DoseBuddy supports caregivers',
      howToSteps: [
        { title: 'Keep one source of truth', text: 'Enter every medicine with dosage and instructions in DoseBuddy — prescriptions, vitamins and as-needed medicines without a fixed schedule.' },
        { title: 'Track every dose', text: 'Reminders fire on schedule; each dose is marked taken or skipped, building an accurate adherence history automatically.' },
        { title: 'Export the PDF', text: 'One tap creates a clean PDF of the full medicine list — ready to hand to any doctor, specialist or hospital.' },
        { title: 'Update in seconds', text: 'When a prescription changes, edit the medicine once — the checklist, reminders and future PDFs all update together.' },
      ],
      faqs: [
        {
          question: 'Can I manage someone else\'s medications in DoseBuddy?',
          answer: 'Yes — many caregivers run DoseBuddy on the care recipient\'s iPhone, or track a parent\'s regimen on their own device to stay organized.',
        },
        {
          question: 'What does the PDF export include?',
          answer: 'The complete medicine list with dosages and instructions — the exact information every doctor asks for at the start of an appointment.',
        },
      ],
      screenshotIndex: 3,
    },
  ],
  faqs: [
    {
      question: 'What is DoseBuddy?',
      answer:
        'DoseBuddy is a simple pill reminder and medication tracker for iPhone: add your medicines, get reminders for every dose, check them off as taken or skipped, and keep a clear history — with refill warnings and a PDF medicine list built in.',
      learnMoreSlug: 'how-to-remember-to-take-medication',
    },
    {
      question: 'Is DoseBuddy suitable for seniors?',
      answer:
        'Yes — it was designed with large text, high contrast and big buttons so older adults can use it comfortably. Today\'s medicines appear as one simple checklist.',
      learnMoreSlug: 'pill-reminder-app-for-seniors',
    },
    {
      question: 'Can I track medications for a family member?',
      answer:
        'Yes. Caregivers use DoseBuddy to keep a parent\'s medicine list current, track taken and skipped doses, and share the complete list with doctors as a PDF.',
      learnMoreSlug: 'medication-list-for-caregivers',
    },
    {
      question: 'Does DoseBuddy warn me before pills run out?',
      answer:
        'Yes — the pill counter tracks your remaining tablets and warns you in time to refill, so you never discover an empty bottle at dose time.',
    },
    {
      question: 'Does DoseBuddy handle as-needed medicines?',
      answer:
        'Yes — medicines without a fixed schedule (pain relief, allergy tablets) can be logged as-needed, so they appear in your history and on your PDF list.',
    },
    {
      question: 'Is DoseBuddy free?',
      answer:
        'DoseBuddy is free to download and use daily. Premium unlocks unlimited medicines, multiple reminder times per medicine, refill tracking and full history.',
    },
    {
      question: 'Is DoseBuddy a medical device?',
      answer:
        'No — DoseBuddy is a reminder and tracking tool and does not provide medical advice. Always follow your doctor\'s or pharmacist\'s instructions.',
    },
  ],
  ctaHeading: 'Never Miss a Dose Again',
  ctaText: 'Download DoseBuddy free, add your medicines in two minutes, and let the reminders take over from memory.',
  category: 'MedicalApplication',
  downloadNote: 'Free to download • In-app purchases available',
};
