export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: 'guide' | 'visa' | 'finance' | 'life' | 'tips';
  readTime: number;
  publishedAt: string;
  updatedAt?: string;
  coverEmoji: string;
  featured?: boolean;
  body: string;
};

export const CATEGORIES: Record<BlogPost['category'], { label: string; color: string; bg: string }> = {
  guide: { label: 'Study Guide', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  visa: { label: 'Visa & Legal', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  finance: { label: 'Finance', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  life: { label: 'Student Life', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  tips: { label: 'Tips & Tricks', color: 'text-pink-400', bg: 'bg-pink-500/10' },
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'complete-guide-study-in-germany',
    title: 'The Complete Guide to Studying in Germany (2026)',
    excerpt: 'Everything you need to know about studying in Germany — from choosing a program to settling in. A step-by-step guide for international students.',
    category: 'guide',
    readTime: 12,
    publishedAt: '2024-09-10',
    updatedAt: '2025-03-15',
    coverEmoji: '🇩🇪',
    featured: true,
    body: `## Why Study in Germany?

Germany is one of the most popular destinations for international students, and for good reason. With over 400 universities, world-class education, and **tuition-free public universities** in most states, it's an incredible opportunity.

### Key Facts
- **Over 20,000 programs** available, including 1,800+ taught in English
- **No tuition fees** at most public universities (only a semester contribution of ~€150–350)
- **Post-study work visa** — 18 months to find a job after graduation
- **3rd most popular** destination for international students worldwide

## Step 1: Choose Your Program

Start by deciding what you want to study. Use our [Course Finder](/) to search through thousands of programs. Consider:

- **Degree level**: Bachelor's, Master's, or PhD
- **Language**: English-taught or German-taught programs
- **Subject area**: Engineering, business, sciences, arts, and more
- **Location**: Big cities like Berlin and Munich, or smaller university towns

### Tips for Choosing
- Check the program's **NC (Numerus Clausus)** — some programs have admission restrictions
- Look at the **curriculum** carefully — German programs can be very specialized
- Consider **dual-degree** or **Erasmus** partnerships for international experience

## Step 2: Check Admission Requirements

Each program has its own requirements, but common ones include:

### For Bachelor's Programs
- **School leaving certificate** equivalent to German Abitur
- **Language proficiency**: TestDaF, DSH (German), or IELTS/TOEFL (English)
- Some programs require a **Studienkolleg** (foundation year) first

### For Master's Programs
- **Bachelor's degree** in a related field (usually 180 ECTS)
- **GPA requirements** — use our [GPA Converter](/gpa-converter) to check your German equivalent
- **Language certificates**: Usually B2/C1 German or IELTS 6.5+ for English programs
- **Motivation letter** — use our [Motivation Letter tool](/motivation-letter) to generate one
- Some programs require **GRE/GMAT** scores

## Step 3: Prepare Your Documents

Start gathering documents early — some take weeks to obtain:

1. **Certified translations** of all documents (sworn translator required)
2. **Apostille** or legalization of certificates
3. **APS certificate** (required for students from China, India, Vietnam)
4. **Language certificates** (TestDaF, IELTS, etc.)
5. **CV/Resume** — create one with our [CV Maker](/cv-maker)
6. **Motivation letter** for each program
7. **Recommendation letters** (1-2, from professors or employers)
8. **Passport copy**
9. **Passport photos** (biometric format)

## Step 4: Apply

Most German universities use one of these application portals:

- **uni-assist** — centralized application service for many universities
- **Direct application** — through the university's own portal
- **hochschulstart.de** — for restricted programs (medicine, pharmacy, etc.)

### Important Deadlines
- **Winter semester** (October start): Apply by **July 15** (often earlier for international students)
- **Summer semester** (April start): Apply by **January 15**

> ⚠️ Many programs have earlier deadlines. Always check the specific program page!

## Step 5: Get Your Visa

Once you receive an admission letter:

1. **Open a blocked account** (Sperrkonto) — currently €11,904/year required
2. **Get health insurance** — mandatory in Germany
3. **Apply for a student visa** at the German embassy in your country
4. **Book accommodation** — start early, housing is competitive in big cities

## Step 6: Arrive and Settle In

After arriving in Germany:

1. **Register your address** (Anmeldung) at the local Bürgeramt within 14 days
2. **Enroll at your university** (Immatrikulation)
3. **Open a German bank account**
4. **Get a local SIM card**
5. **Apply for a residence permit** (Aufenthaltserlaubnis)

## Costs of Living

Monthly budget estimate for students in Germany:

| Expense | Monthly Cost |
|---------|-------------|
| Rent | €300–700 |
| Food | €200–300 |
| Health Insurance | €110–120 |
| Transport (semester ticket) | Included in semester fee |
| Phone & Internet | €20–40 |
| Study materials | €20–50 |
| **Total** | **€650–1,200** |

## Ready to Start?

Use our free AI-powered tools to begin your journey:
- [Find Programs](/) — Search 20,000+ courses
- [Build Your CV](/cv-maker) — Professional academic CV
- [Write Motivation Letters](/motivation-letter) — AI-generated, personalized
- [Convert Your GPA](/gpa-converter) — Check your German grade equivalent`,
  },
  {
    slug: 'german-student-visa-guide',
    title: 'German Student Visa: Complete Application Guide',
    excerpt: 'Step-by-step guide to applying for a German student visa — documents needed, blocked account, health insurance, and embassy appointment tips.',
    category: 'visa',
    readTime: 8,
    publishedAt: '2024-10-05',
    coverEmoji: '📋',
    featured: true,
    body: `## Do You Need a Student Visa?

Whether you need a visa depends on your nationality:

- **EU/EEA citizens**: No visa needed
- **Some countries** (USA, Canada, Australia, Japan, South Korea, etc.): Can enter without a visa and apply for a residence permit after arrival
- **Most other countries**: Need a student visa before entering Germany

> Check the [German Federal Foreign Office](https://www.auswaertiges-amt.de) for your country's specific requirements.

## Types of Student Visas

### 1. Student Visa (Studentenvisum)
- For students with a **confirmed admission letter**
- Valid for 3 months, then converted to a residence permit

### 2. Student Applicant Visa (Studienbewerbervisum)
- For students who are **still applying** to universities
- Valid for 3-6 months
- Can be converted to a student visa once admitted

### 3. Language Course Visa
- For intensive German language courses (18+ hours/week)
- Can sometimes be converted to a student visa

## Required Documents

Prepare these documents for your visa appointment:

1. **Valid passport** (valid for at least 6 months beyond your planned stay)
2. **Completed visa application form** (download from embassy website)
3. **Biometric passport photos** (2 recent photos, 35x45mm)
4. **University admission letter** or proof of application
5. **Proof of financial resources**:
   - **Blocked account** (Sperrkonto) with €11,904 (2026 requirement)
   - OR scholarship letter
   - OR formal obligation letter (Verpflichtungserklärung)
6. **Health insurance** coverage for Germany
7. **Academic certificates** (with certified translations)
8. **Language proficiency certificate**
9. **Motivation letter** (some embassies require this)
10. **CV/Resume**
11. **Visa fee** (~€75)

## The Blocked Account (Sperrkonto)

The blocked account is the most common way to prove financial resources:

- **Amount**: €11,904/year (€992/month) as of 2026
- **How it works**: You deposit the full amount, then can withdraw €992/month
- **Providers**: Expatrio, Fintiba, Deutsche Bank
- **Processing time**: 1-5 business days (Expatrio/Fintiba) or 2-4 weeks (Deutsche Bank)

### Recommended: Expatrio or Fintiba
Both are online services designed for international students. They're faster and easier than traditional banks.

## Health Insurance

Health insurance is **mandatory** in Germany. Options:

### Public Health Insurance (Gesetzliche Krankenversicherung)
- **Cost**: ~€110-120/month for students
- **Providers**: TK, AOK, Barmer, DAK
- **Recommended** for most students

### Private Health Insurance
- Can be cheaper for students over 30 or PhD students
- Must meet minimum coverage requirements

### Travel Health Insurance
- Needed for the visa application
- Covers you until your German insurance starts

## Embassy Appointment Tips

1. **Book early** — appointments can be 4-8 weeks out in busy seasons
2. **Bring originals AND copies** of all documents
3. **Dress professionally** — first impressions matter
4. **Be prepared for questions** about your study plans and motivation
5. **Bring extra passport photos** just in case
6. **Arrive 15 minutes early**

## After Getting Your Visa

Once you arrive in Germany:

1. **Register your address** (Anmeldung) within 14 days
2. **Open a German bank account** (if you haven't already)
3. **Enroll at your university** (Immatrikulation)
4. **Apply for a residence permit** at the Ausländerbehörde (foreigners' office)
5. **Activate your health insurance**

## Timeline

| When | What |
|------|------|
| 6-8 months before | Start researching programs |
| 4-6 months before | Apply to universities |
| 3-4 months before | Open blocked account, get insurance |
| 2-3 months before | Book embassy appointment |
| 1-2 months before | Attend visa appointment |
| 2-4 weeks before | Receive visa |
| Arrival | Register, enroll, settle in |

## Need Help?

Our AI tools can help you prepare:
- [Build Your CV](/cv-maker) — needed for visa applications
- [Write a Motivation Letter](/motivation-letter) — some embassies require this
- [Find Programs](/) — get your admission letter first`,
  },
  {
    slug: 'cost-of-studying-in-germany',
    title: 'How Much Does It Cost to Study in Germany? (2026 Breakdown)',
    excerpt: 'Detailed breakdown of all costs — tuition, living expenses, insurance, and hidden fees. Plus money-saving tips for international students.',
    category: 'finance',
    readTime: 7,
    publishedAt: '2024-11-12',
    coverEmoji: '💰',
    body: `## The Big Picture

Germany is one of the most affordable countries for higher education. Here's why:

- **Public universities**: No tuition fees (except Baden-Württemberg: €1,500/semester for non-EU students)
- **Semester contribution**: €150–350 per semester (covers admin, student union, transport)
- **Living costs**: €850–1,200/month depending on the city

## Tuition Fees

### Public Universities
| State | Tuition for International Students |
|-------|-----------------------------------|
| Most states | **€0** (free!) |
| Baden-Württemberg | €1,500/semester for non-EU |
| All states | €150–350 semester contribution |

### Private Universities
- Range from **€5,000 to €30,000+** per year
- Some offer scholarships
- Not necessarily better than public universities

## Living Costs by City

### Expensive Cities
| City | Avg. Rent (shared flat) | Total Monthly |
|------|------------------------|---------------|
| Munich | €500–800 | €1,100–1,500 |
| Frankfurt | €450–700 | €1,000–1,400 |
| Hamburg | €400–650 | €950–1,300 |
| Stuttgart | €400–650 | €950–1,300 |

### Affordable Cities
| City | Avg. Rent (shared flat) | Total Monthly |
|------|------------------------|---------------|
| Leipzig | €250–400 | €700–1,000 |
| Dresden | €250–400 | €700–1,000 |
| Chemnitz | €200–350 | €650–950 |
| Jena | €250–400 | €700–1,000 |

### Mid-Range Cities
| City | Avg. Rent (shared flat) | Total Monthly |
|------|------------------------|---------------|
| Berlin | €350–600 | €900–1,200 |
| Cologne | €350–550 | €850–1,200 |
| Bonn | €300–500 | €800–1,100 |
| Heidelberg | €350–550 | €850–1,200 |

## Monthly Budget Breakdown

Average monthly expenses for a student in Germany:

| Category | Budget | Mid-Range | Comfortable |
|----------|--------|-----------|-------------|
| Rent | €300 | €450 | €650 |
| Food & Groceries | €150 | €250 | €350 |
| Health Insurance | €110 | €110 | €110 |
| Transport | €0* | €30 | €50 |
| Phone & Internet | €15 | €25 | €40 |
| Study Materials | €10 | €30 | €50 |
| Entertainment | €30 | €60 | €100 |
| Clothing | €20 | €40 | €70 |
| **Total** | **€635** | **€995** | **€1,420** |

*Many semester tickets include free public transport

## One-Time Costs

Don't forget these initial expenses:

| Item | Cost |
|------|------|
| Blocked account deposit | €11,904 |
| Visa application fee | €75 |
| Health insurance (first month) | €110 |
| Flight to Germany | €300–1,000 |
| First month rent + deposit | €600–1,500 |
| Semester contribution | €150–350 |
| Residence permit fee | €100 |
| Furniture/essentials | €200–500 |
| **Total initial costs** | **€13,500–15,500** |

## Money-Saving Tips

1. **Cook at home** — Mensa (university cafeteria) meals are €2–5
2. **Get a student job** — you can work 120 full days or 240 half days per year
3. **Use student discounts** — museums, software, transport, and more
4. **Shop at discount supermarkets** — Aldi, Lidl, Netto, Penny
5. **Get a WG (shared apartment)** — much cheaper than living alone
6. **Use the semester ticket** — free public transport in your city/region
7. **Apply for scholarships** — DAAD, Deutschlandstipendium, and many more
8. **Buy second-hand** — eBay Kleinanzeigen, Facebook Marketplace
9. **Use free university resources** — libraries, sports facilities, language courses

## Scholarships

Popular scholarships for international students:

- **DAAD Scholarships** — Germany's largest scholarship organization
- **Deutschlandstipendium** — €300/month, merit-based
- **Heinrich Böll Foundation** — for students with social/political engagement
- **Friedrich Ebert Foundation** — for students from developing countries
- **Erasmus+** — for EU exchange students
- **University-specific scholarships** — check your university's website

## Working While Studying

As an international student, you can:
- Work **120 full days** or **240 half days** per year
- Work unlimited hours as a **student assistant (HiWi)** at your university
- Earn **€520/month tax-free** with a Minijob
- Average student job pays **€12–15/hour**`,
  },
  {
    slug: 'learn-german-for-university',
    title: 'How to Learn German for University: From Zero to B2',
    excerpt: 'Best resources, timeline, and strategies to learn German for university admission. Free and paid options compared.',
    category: 'tips',
    readTime: 6,
    publishedAt: '2024-12-03',
    coverEmoji: '🗣️',
    body: `## Do You Need German?

It depends on your program:

- **English-taught programs**: No German required for admission (but B1 recommended for daily life)
- **German-taught programs**: Usually B2 or C1 level required
- **Some programs**: Accept a mix — lectures in English, some courses in German

## German Language Levels (CEFR)

| Level | Description | Time Needed |
|-------|-------------|-------------|
| A1 | Beginner — basic phrases | 2-3 months |
| A2 | Elementary — simple conversations | 2-3 months |
| B1 | Intermediate — everyday situations | 3-4 months |
| B2 | Upper intermediate — university level | 3-4 months |
| C1 | Advanced — fluent academic German | 4-6 months |
| C2 | Mastery — native-like | 6-12 months |

**Total from zero to B2: approximately 10-14 months** of regular study.

## Accepted Language Certificates

### For German-Taught Programs
- **TestDaF** (Test Deutsch als Fremdsprache) — TDN 4 in all sections
- **DSH** (Deutsche Sprachprüfung für den Hochschulzugang) — DSH-2 or DSH-3
- **Goethe-Zertifikat** — B2 or C1
- **telc Deutsch** — B2 or C1 Hochschule

### For English-Taught Programs
- **IELTS** — usually 6.0–6.5 minimum
- **TOEFL iBT** — usually 80–90 minimum
- **Cambridge** — B2 First or C1 Advanced

## Best Free Resources

### Apps
- **Duolingo** — gamified learning, good for beginners (A1-A2)
- **Deutsche Welle (DW)** — excellent free courses from A1 to C1
- **Anki** — flashcard app for vocabulary (use shared German decks)

### YouTube Channels
- **Learn German with Anja** — fun, clear explanations
- **Easy German** — street interviews with subtitles
- **Deutsch für Euch** — grammar explanations in English
- **Lingoni German** — structured lessons

### Websites
- **DW Learn German** (learngerman.dw.com) — complete free courses
- **Goethe-Institut online** — free exercises and materials
- **German with Laura** — grammar guides

## Best Paid Resources

| Resource | Cost | Best For |
|----------|------|----------|
| Goethe-Institut courses | €800–1,200/level | Structured classroom learning |
| VHS (Volkshochschule) | €200–400/level | Affordable in-person courses in Germany |
| italki | €15–30/hour | 1-on-1 tutoring |
| Babbel | €7–13/month | Structured self-study |
| Seedlang | €10/month | Grammar-focused |

## Study Plan: Zero to B2 in 12 Months

### Months 1-3: A1-A2 (Foundation)
- **Daily**: 30 min Duolingo + 30 min DW course
- **Weekly**: 2-3 Easy German videos with subtitles
- **Focus**: Basic grammar, common phrases, numbers, alphabet

### Months 4-6: A2-B1 (Building)
- **Daily**: 1 hour DW course or Babbel
- **Weekly**: 1 italki session, 3-4 German podcasts
- **Focus**: Past tenses, cases (Akkusativ, Dativ), longer conversations

### Months 7-9: B1-B2 (Advancing)
- **Daily**: 1-1.5 hours structured study
- **Weekly**: 2 italki sessions, German news (slow news)
- **Focus**: Subjunctive, complex sentences, academic vocabulary
- **Start**: Reading simple German articles, watching German shows with subtitles

### Months 10-12: B2 (Exam Prep)
- **Daily**: 1.5-2 hours focused study
- **Weekly**: Practice tests, writing exercises
- **Focus**: TestDaF/DSH preparation, academic writing
- **Take**: A mock exam to assess readiness

## Tips for Faster Learning

1. **Change your phone language** to German
2. **Watch German Netflix** with German subtitles
3. **Find a Tandem partner** — language exchange
4. **Label items** in your house with German words
5. **Think in German** — narrate your daily activities
6. **Join German Discord/Reddit** communities
7. **Don't fear mistakes** — Germans appreciate the effort
8. **Study grammar systematically** — German grammar has rules (with exceptions!)

## German for Daily Life in Germany

Even if your program is in English, you'll need German for:
- **Bureaucracy** (Bürgeramt, Ausländerbehörde)
- **Shopping and restaurants**
- **Making friends** with German students
- **Finding apartments** (most listings are in German)
- **Student jobs** (many require at least B1)
- **Doctor visits**

> **Pro tip**: Most German universities offer **free German courses** for international students. Sign up as soon as you arrive!`,
  },
  {
    slug: 'student-life-in-germany',
    title: 'What Student Life in Germany Is Really Like',
    excerpt: 'From WG life to Mensa food, semester parties to study culture — an honest look at what to expect as an international student in Germany.',
    category: 'life',
    readTime: 6,
    publishedAt: '2025-01-18',
    coverEmoji: '🎓',
    body: `## A Typical Day

Student life in Germany is quite different from many other countries. Here's what a typical day might look like:

- **8:00** — Wake up, breakfast (Brötchen with cheese and coffee)
- **9:00** — Lectures or seminars at university
- **12:30** — Lunch at the Mensa (university cafeteria, €2–5)
- **14:00** — Library study session or group work
- **17:00** — Hochschulsport (university sports) or free time
- **19:00** — Cook dinner with flatmates
- **20:00** — Study, socialize, or explore the city

## Housing: The WG Life

Most students in Germany live in a **WG (Wohngemeinschaft)** — a shared apartment. It's not just about saving money; it's a core part of German student culture.

### Types of Housing
- **WG (shared flat)**: €250–500/month — most popular option
- **Studentenwohnheim (dorm)**: €200–400/month — apply early, long waiting lists
- **Own apartment**: €400–800/month — expensive, harder to find
- **Zwischenmiete (sublet)**: Temporary, good for your first months

### Finding Housing
- **WG-Gesucht.de** — the #1 platform for shared flats
- **Studierendenwerk** — apply for student dorms
- **eBay Kleinanzeigen** — apartments and sublets
- **Facebook groups** — "WG [City Name]" groups
- **University housing office** — some universities help international students

### WG Casting
Yes, it's a thing! When you apply for a WG, you'll often be invited for a "casting" — basically a casual meeting where the current flatmates decide if you're a good fit. Tips:
- Be friendly and open
- Bring a small gift (cake or snacks)
- Show interest in communal living
- Be honest about your habits

## University Culture

### Academic Freedom
German universities give you a lot of **freedom and responsibility**:
- You often **create your own schedule**
- Attendance isn't always mandatory (but recommended!)
- Exams might be your **only grade** — no homework grades
- Self-study is expected and essential

### Types of Classes
- **Vorlesung** (Lecture) — large hall, professor talks, you listen
- **Seminar** — smaller group, discussions, presentations
- **Übung** (Tutorial) — practice sessions for lectures
- **Praktikum** (Lab/Practical) — hands-on work

### Exam Period
- Usually at the **end of each semester** (February/March and July/August)
- Can be intense — 4-6 exams in a few weeks
- Libraries get very crowded (arrive early!)
- **Klausur** (written exam) or **mündliche Prüfung** (oral exam)

## Food and Eating

### Mensa (University Cafeteria)
- Meals cost **€2–5** for students
- Usually good variety, including vegetarian/vegan options
- Quality varies by university — some are excellent!

### Cooking at Home
- Most students cook regularly — it's much cheaper
- **Aldi, Lidl, Penny, Netto** — discount supermarkets
- **Weekly market (Wochenmarkt)** — fresh produce
- German students love **Abendbrot** — bread with cold cuts for dinner

### Student Favorites
- Döner Kebab (€4–6) — the unofficial student food of Germany
- Currywurst — classic German street food
- Flammkuchen — German-style pizza
- Brötchen — bread rolls for breakfast

## Social Life

### Making Friends
- **Orientation week (O-Woche)** — don't miss this! Best time to meet people
- **Fachschaft** — student council for your department, organizes events
- **Hochschulsport** — university sports (very cheap, huge variety)
- **Student clubs (Vereine)** — everything from chess to hiking
- **Stammtisch** — regular meetups at a bar/restaurant
- **Tandem partners** — language exchange = friendship

### Nightlife
- Germany has a vibrant nightlife culture
- **Kneipen** (pubs) — casual, affordable
- **Clubs** — especially in Berlin, but every city has options
- **House parties** — very common among students
- **Beer gardens** — a must in summer (especially in Bavaria)

## Transportation

### Semester Ticket
One of the best perks of being a student in Germany:
- Included in your **semester contribution** (€150–350)
- **Free public transport** in your city/region
- Some tickets cover the **entire state**!
- Includes buses, trams, S-Bahn, and regional trains

### Getting Around
- **Bicycle** — many students cycle everywhere (get a good lock!)
- **Deutsche Bahn** — trains across Germany (BahnCard 25/50 for discounts)
- **FlixBus** — cheap long-distance buses
- **Car sharing** — BlaBlaCar for longer trips

## Working as a Student

### Student Jobs
- **HiWi (Hilfswissenschaftler)** — research assistant at university (€12–15/hour)
- **Werkstudent** — part-time job in your field (€13–20/hour)
- **Minijob** — up to €520/month tax-free
- **Tutoring** — teach your native language or subjects

### Work Limits
- **120 full days** or **240 half days** per year
- University jobs (HiWi) don't count toward this limit
- During semester breaks, you can work more

## Health and Wellbeing

- **University sports** — incredibly cheap (€10–30/semester for unlimited access)
- **Psychological counseling** — free at most universities
- **Health insurance** — mandatory, covers doctor visits and hospital
- **Apotheke (pharmacy)** — for medications (some need a prescription)

## Pro Tips from Students

1. **Learn basic German** even for English programs — it makes life 10x easier
2. **Get a Schufa** (credit score) early — you'll need it for contracts
3. **Register your address** immediately — it's legally required
4. **Join your Fachschaft** — they know everything about your program
5. **Don't skip O-Woche** — you'll make your first friends there
6. **Buy a good rain jacket** — German weather is unpredictable
7. **Explore beyond your city** — weekend trips are cheap with semester tickets
8. **Embrace the bureaucracy** — it's part of the experience (bring patience and documents!)`,
  },
  {
    slug: 'blocked-account-germany-guide',
    title: 'Blocked Account (Sperrkonto) for Germany: Everything You Need to Know',
    excerpt: 'Complete guide to opening a blocked account for your German student visa — providers compared, step-by-step process, and common mistakes to avoid.',
    category: 'finance',
    readTime: 5,
    publishedAt: '2025-02-07',
    coverEmoji: '🏦',
    body: `## What Is a Blocked Account?

A **blocked account (Sperrkonto)** is a special bank account required by the German government to prove you can financially support yourself during your studies. You deposit a lump sum, and then can only withdraw a fixed monthly amount.

### 2026 Requirements
- **Total deposit**: €11,904 per year (€992/month × 12)
- **Monthly withdrawal**: Up to €992
- **Required for**: Student visa application

## Providers Compared

### Expatrio
- **Opening fee**: €49
- **Processing time**: 1-3 business days
- **Monthly fee**: €0 (included with account)
- **Pros**: Fast, fully online, good English support
- **Cons**: Slightly higher opening fee

### Fintiba
- **Opening fee**: €89
- **Processing time**: 1-5 business days
- **Monthly fee**: €4.90
- **Pros**: Well-established, includes health insurance option
- **Cons**: Monthly fee adds up

### Deutsche Bank
- **Opening fee**: €0
- **Processing time**: 2-6 weeks
- **Monthly fee**: €0
- **Pros**: No fees, traditional bank
- **Cons**: Very slow, requires more paperwork, not fully online

### Comparison Table

| Feature | Expatrio | Fintiba | Deutsche Bank |
|---------|----------|---------|---------------|
| Opening Fee | €49 | €89 | €0 |
| Monthly Fee | €0 | €4.90 | €0 |
| Speed | 1-3 days | 1-5 days | 2-6 weeks |
| Online Process | ✅ Full | ✅ Full | ❌ Partial |
| English Support | ✅ | ✅ | ⚠️ Limited |
| Health Insurance | ❌ | ✅ Bundle | ❌ |

**Recommendation**: **Expatrio** for speed and simplicity, or **Fintiba** if you want health insurance bundled.

## Step-by-Step: Opening a Blocked Account

### With Expatrio (Recommended)

1. **Create an account** at expatrio.com
2. **Upload your passport** and university admission letter
3. **Verify your identity** (video call or ID verification)
4. **Receive your account details** (1-3 business days)
5. **Transfer €11,904** from your home country bank
6. **Receive confirmation letter** — use this for your visa application

### Transfer Tips
- Use **Wise (TransferWise)** for the best exchange rates
- Bank wire transfers work but may have higher fees
- **Don't use PayPal** — it's not accepted
- Transfer may take **3-7 business days** to arrive
- Add a buffer of €50-100 for exchange rate fluctuations

## Common Mistakes to Avoid

1. **Starting too late** — begin 2-3 months before your visa appointment
2. **Wrong amount** — must be exactly €11,904 or more (not less!)
3. **Wrong name** — account name must match your passport exactly
4. **Slow transfer method** — use Wise or direct bank transfer
5. **Not getting the confirmation letter** — you need this for the visa
6. **Forgetting about exchange rates** — send slightly more to be safe

## After Arriving in Germany

Once you're in Germany:

1. **Activate monthly withdrawals** — usually automatic
2. **Open a regular German bank account** — for daily use
3. **Set up automatic transfer** from blocked account to regular account
4. **Keep the blocked account** until it's empty or you close it

### Regular Bank Account Options
- **N26** — fully online, free basic account
- **DKB** — free account, good for students
- **Sparkasse** — traditional, branches everywhere
- **Commerzbank** — free student account

## FAQ

**Q: Can I deposit more than €11,904?**
A: Yes, but you'll still only be able to withdraw €992/month.

**Q: What if I need more money in an emergency?**
A: You can request an exceptional withdrawal, but it requires documentation.

**Q: Can I close the account early?**
A: Yes, but remaining funds may take time to transfer back.

**Q: Do I need a new blocked account every year?**
A: For visa renewal, you may need to show proof of funds again. Some students top up the same account.`,
  },
  {
    slug: 'top-scholarships-international-students-germany',
    title: 'Top Scholarships for International Students in Germany (2026)',
    excerpt: 'Comprehensive list of scholarships available for international students — DAAD, Deutschlandstipendium, foundation scholarships, and how to apply.',
    category: 'finance',
    readTime: 7,
    publishedAt: '2025-03-22',
    coverEmoji: '🏆',
    featured: true,
    body: `## Overview

While tuition is free at most German public universities, you still need money for living expenses. Scholarships can help cover these costs. Here are the best options for international students.

## 1. DAAD Scholarships

The **German Academic Exchange Service (DAAD)** is the largest funding organization for international academic exchange.

### Types of DAAD Scholarships
- **Study Scholarships for Graduates**: €934/month + travel allowance + insurance
- **Research Grants for Doctoral Candidates**: €1,200/month
- **Short-term Research Grants**: For 1-6 months of research
- **DAAD-WISE**: For Indian engineering students (summer internship)

### How to Apply
1. Visit [daad.de/en](https://www.daad.de/en/) and search the scholarship database
2. Check eligibility and deadlines (usually October-November for the following year)
3. Prepare: CV, motivation letter, academic transcripts, recommendation letters
4. Apply through the DAAD portal

### Tips
- Applications are **very competitive** — strong motivation letter is key
- Use our [Motivation Letter tool](/motivation-letter) to draft yours
- Apply to multiple DAAD programs to increase your chances

## 2. Deutschlandstipendium

The **Germany Scholarship** is offered by individual universities:

- **Amount**: €300/month (€150 from federal government + €150 from private sponsors)
- **Duration**: At least 2 semesters, renewable
- **Eligibility**: Based on academic merit AND social engagement
- **How to apply**: Through your university's website (each has its own process)

### Tips
- Apply as soon as you're enrolled
- Highlight **volunteer work and extracurriculars**, not just grades
- Available at most German universities

## 3. Foundation Scholarships (Begabtenförderungswerke)

Germany has 13 major foundations that offer scholarships:

### Political Foundations
| Foundation | Affiliation | Monthly Stipend |
|-----------|-------------|-----------------|
| Friedrich Ebert Foundation | SPD | €934 |
| Konrad Adenauer Foundation | CDU | €934 |
| Heinrich Böll Foundation | Green Party | €934 |
| Rosa Luxemburg Foundation | Die Linke | €934 |
| Friedrich Naumann Foundation | FDP | €934 |
| Hanns Seidel Foundation | CSU | €934 |

### Other Major Foundations
| Foundation | Focus | Monthly Stipend |
|-----------|-------|-----------------|
| Studienstiftung des deutschen Volkes | Academic excellence | €934 |
| Hans Böckler Foundation | Trade union affiliated | €934 |
| Cusanuswerk | Catholic students | €934 |
| Avicenna Foundation | Muslim students | €934 |
| Ernst Ludwig Ehrlich Foundation | Jewish students | €934 |

### How to Apply
- Most require **nomination** by a professor or self-application
- Strong focus on **social engagement** and values
- Application includes essays, interviews, and references
- Deadlines vary — check each foundation's website

## 4. University-Specific Scholarships

Many universities offer their own scholarships:

- Check your university's **International Office** website
- Look for **faculty-specific** scholarships
- Some are for specific nationalities or fields of study
- Often less competitive than national scholarships

## 5. Country-Specific Scholarships

### For Indian Students
- **DAAD-WISE** — summer research internship
- **Mpower Financing** — student loans without cosigner
- **SBI Global Ed-Vantage** — education loans

### For African Students
- **DAAD In-Country/In-Region Scholarship**
- **African Leadership University scholarships**
- **KAAD** — Catholic Academic Exchange Service

### For Latin American Students
- **DAAD-ALEARG** — for Argentine students
- **COLFUTURO** — for Colombian students
- **CONACYT** — for Mexican students

## 6. Other Funding Options

### Working While Studying
- Earn €520/month tax-free with a Minijob
- Werkstudent positions pay €13–20/hour
- HiWi (research assistant) jobs at university

### BAföG (for some international students)
- German student financial aid
- Available for EU citizens and some non-EU students with permanent residence
- Half grant, half interest-free loan

### Education Loans
- **KfW Student Loan** — available to international students in some cases
- **Prodigy Finance** — for Master's students at select universities
- **Brain Capital** — income share agreement

## Application Timeline

| When | What |
|------|------|
| 12 months before | Research scholarships, check eligibility |
| 9-10 months before | Prepare documents, get recommendation letters |
| 6-8 months before | Submit applications (most deadlines) |
| 3-4 months before | Interviews (if shortlisted) |
| 1-2 months before | Receive decisions |

## Tips for Winning Scholarships

1. **Apply early and to multiple scholarships**
2. **Tailor each application** — don't use generic motivation letters
3. **Show social engagement** — Germans value community involvement
4. **Get strong recommendation letters** — from professors who know you well
5. **Proofread everything** — spelling mistakes = instant rejection
6. **Use our tools**: [CV Maker](/cv-maker) and [Motivation Letter](/motivation-letter) to prepare professional applications`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return BLOG_POSTS.filter(p => p.featured);
}

export function getPostsByCategory(category: BlogPost['category']): BlogPost[] {
  return BLOG_POSTS.filter(p => p.category === category);
}
