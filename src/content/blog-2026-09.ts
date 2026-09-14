import type { BlogPost } from './blog';

/**
 * September 2026 batch, written against Search Console demand rather than
 * guesswork. Each post targets a query cluster the site was already being
 * shown for with no page that answered it (Fachhochschule vs university,
 * numeric grade conversions, SIM cards, salary after tax, data science
 * masters, Studienkolleg, driving licences). Spliced into BLOG_POSTS ahead of
 * the older posts so the homepage and blog index surface them first.
 */
export const SEPTEMBER_2026_POSTS: BlogPost[] = [
  {
    slug: 'university-vs-university-of-applied-sciences-germany',
    title: 'University vs University of Applied Sciences in Germany: Which One Should You Pick?',
    seoTitle: 'University vs University of Applied Sciences (Germany)',
    excerpt: 'Germany has two kinds of higher-education institution and they are not ranked above each other — they are built for different students. The differences that actually change your degree, your job prospects and your PhD options.',
    seoDescription: 'Universität vs Hochschule (Fachhochschule) in Germany: teaching style, degrees, PhD rights, employer view, admission rules and who each one suits.',
    category: 'guide',
    readTime: 9,
    publishedAt: '2026-09-14',
    coverEmoji: '🏛️',
    tags: ['application', 'planning', 'programs'],
    body: `If you have searched for a programme in Germany, you have already met both: the *Universität* and the *Hochschule für angewandte Wissenschaften* — the university of applied sciences, still widely called a Fachhochschule or FH. Many international applicants assume the second is a lesser version of the first. It is not. They are two deliberately different systems that award degrees of equal legal standing, and picking the wrong one for *your* goals is a far more common mistake than picking a "bad" institution.

Here is how they genuinely differ, and how to decide.

## The short version

| | Universität | University of Applied Sciences (HAW / FH) |
|---|---|---|
| Focus | Theory, research, method | Application, practice, industry |
| Typical bachelor | 6 semesters | 6–7 semesters, often with a compulsory internship semester |
| Class size | Large lectures, especially early | Smaller groups, more contact time |
| Professors | Career academics | Required to have years of professional experience outside academia |
| Doctorate (PhD) | Yes, directly | Usually via a cooperating university; a growing number now have their own right to award doctorates in specific fields |
| Subjects | Everything, including medicine, law, most pure sciences and humanities | Engineering, business, IT, design, social work, health — the applied fields |
| Admission | Abitur or recognised equivalent | Same, plus Fachhochschulreife is enough in Germany; international applicants need the same recognised school-leaving qualification either way |
| Degree awarded | Bachelor / Master | Bachelor / Master — identical titles, identical legal value |

## What the difference feels like day to day

At a university, the early semesters are built around large lectures and independent study. You are expected to work out much of it yourself, and the exam at the end of the semester carries most of the weight. Research is in the air: professors run projects, and good students end up in them.

At a university of applied sciences, semesters look more like an intense school timetable. Groups are smaller, attendance is often expected, projects and lab work count towards grades, and one semester is typically spent in a company on a *Praxissemester*. Professors are required to have worked in industry for several years before being appointed, which shapes how they teach.

Neither is easier. Applied-sciences degrees are frequently *more* structured and time-consuming week to week; university degrees are more demanding in independence and in the exams.

## The PhD question — read this if you plan to go on

This is the one place the systems still diverge in a way that can matter years later.

A university can award doctorates in every subject it teaches. Universities of applied sciences historically could not, and a master's from one would take you into a PhD only through a cooperation agreement with a partner university. That route works and is used every year, but it adds a step.

The picture is changing: several federal states have granted specific universities of applied sciences the right to award doctorates in defined research areas, and cooperative doctoral programmes have become normal. If a PhD is a serious plan for you, check three things before choosing a master's: whether the institution can award the doctorate itself in your field, which universities it cooperates with if not, and whether your target university accepts applied-sciences master's graduates directly (most do, sometimes with additional credits).

If you are not planning a doctorate, this section changes nothing about your decision.

## What employers think

German employers know both systems well and hire from both — and for many roles they actively prefer applied-sciences graduates, because those graduates arrive with an internship semester and project work already done. In engineering, IT and business the two are treated as equivalent at entry level; the specific institution and your internships matter more than the type.

Where a university degree carries an edge is in research and development roles, in consulting firms that recruit by brand, and in academic careers. Where the applied-sciences degree carries an edge is in getting the first job quickly, particularly through the company where you did your practical semester.

Internationally, the distinction is often invisible: your diploma says Bachelor of Science or Master of Engineering, and the institution's English name is usually "University of Applied Sciences" or simply "University". Nobody outside Germany will treat it as a lesser degree.

## Admission rules for international applicants

For international applicants the practical difference is small. Both require a school-leaving qualification recognised as equivalent to the German *Abitur*, and if yours is not fully recognised, both route you through a [Studienkolleg](/blog/studienkolleg-germany-guide). Both accept applications through uni-assist or directly, both have the same language requirements, and both are tuition-free at public institutions in most federal states.

One difference does show up: many applied-sciences programmes, especially in engineering, require or strongly recommend a pre-study internship (*Vorpraktikum*) of several weeks. Check the programme page early, because it has to be done before you start, not during.

## Decide with these questions

1. **Do you learn better by doing or by reading?** Structured, project-based, smaller groups points to applied sciences. Independence, theory and large lectures points to a university.
2. **Is a PhD a real plan?** If yes, a university, or an applied-sciences institution with confirmed doctorate rights in your field.
3. **Which subject?** Medicine, law, teaching, most natural sciences and humanities exist only at universities. Design, social work and many niche engineering fields are strongest at applied sciences.
4. **How fast do you want to be employable?** The practical semester at an applied-sciences institution is often where the first job comes from.
5. **Which city and which programme?** In the end you are choosing a specific programme, not a type. A strong programme at either kind beats a weak one at the other.

## Find both in one search

You can [search every programme in our database](/) and filter by degree type, language and tuition — both universities and universities of applied sciences are included, so compare them side by side rather than guessing. Once you have a shortlist, your [German-format CV](/cv-maker) and [motivation letter](/motivation-letter) are what the admissions office actually reads.

And if the programme is taught in German, start the language early: an app like [Lesen Lab](/lesenlab-german-reading-app) is built for exactly the graded reading that gets you from B1 to the C1 most German-taught programmes need.`,
  },
  {
    slug: 'german-grade-to-gpa-conversion-table',
    title: 'German Grade to GPA Conversion Table: What a 1.7, 2.3 or 3.0 Means (and What a 3.5 GPA Becomes)',
    seoTitle: 'German Grade to GPA Conversion Table (Both Directions)',
    excerpt: 'German grades run from 1.0 (best) to 4.0 (pass), the opposite way to a GPA. The full conversion table in both directions, the formula universities actually use, and the answers to the exact questions people search for.',
    seoDescription: 'German grade to GPA and GPA to German grade conversion table, the Modified Bavarian Formula, and what 3.5, 3.0 or 2.7 GPA and 1.4, 1.7, 2.5 German grades convert to.',
    category: 'guide',
    readTime: 8,
    publishedAt: '2026-09-14',
    coverEmoji: '🧮',
    tags: ['application', 'documents', 'planning'],
    body: `The German grading scale confuses everyone the first time: **1.0 is the best grade and 4.0 is the lowest pass**, which is the mirror image of a GPA. A German student with a 1.3 is near the top of the class; an American student with a 1.3 GPA is in trouble.

This page gives you the tables in both directions, the formula German universities use to convert *your* grades when you apply, and direct answers to the specific numbers people search for. If you just want your own number, the [free German GPA converter](/gpa-converter) does the calculation instantly.

## The German scale

| German grade | Word | Meaning |
|---|---|---|
| 1.0 – 1.5 | sehr gut | Excellent |
| 1.6 – 2.5 | gut | Good |
| 2.6 – 3.5 | befriedigend | Satisfactory |
| 3.6 – 4.0 | ausreichend | Sufficient — a pass |
| 4.1 – 5.0 | nicht ausreichend | Fail |

Individual courses are usually graded in steps of 1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0 and 5.0. Final degree grades are averages and can land anywhere in between.

## German grade → GPA (for applying abroad, or for curiosity)

There is no single official mapping — every foreign university applies its own — but the approximation below is the one most credential evaluators and admissions offices use.

| German grade | Approx. US GPA (4.0 scale) | Letter |
|---|---|---|
| 1.0 – 1.3 | 4.0 | A |
| 1.4 – 1.7 | 3.7 | A− |
| 1.8 – 2.0 | 3.3 | B+ |
| 2.1 – 2.3 | 3.0 | B |
| 2.4 – 2.7 | 2.7 | B− |
| 2.8 – 3.0 | 2.3 | C+ |
| 3.1 – 3.3 | 2.0 | C |
| 3.4 – 3.7 | 1.7 | C− |
| 3.8 – 4.0 | 1.0 | D |

So the answers to the questions people actually type:

- **1.4 German grade to GPA** — about 3.7.
- **1.7 German grade to GPA** — about 3.7 (some evaluators say 3.5).
- **2.0 German grade to GPA** — about 3.3.
- **2.5 German grade equivalent** — about 2.7 to 3.0; a solid "good".
- **2.7 German grade to GPA** — about 2.7.
- **3.0 German grade to GPA** — about 2.3.

Treat these as the honest approximation they are. A US or Canadian university evaluating your German transcript will do its own conversion, and it may be kinder or harsher than this table.

## GPA → German grade (for applying to Germany)

This direction has an actual formula. German universities and uni-assist convert foreign grades with the **Modified Bavarian Formula**:

> German grade = 1 + 3 × (max grade − your grade) ÷ (max grade − minimum passing grade)

The *minimum passing grade* is the lowest grade that still counts as a pass in your system, and it is the number that changes everything. For a US 4.0 scale most universities take 1.0 (a D) as the minimum pass; a few take 2.0. The table below uses 1.0.

| Your GPA (4.0 scale) | German grade | Word |
|---|---|---|
| 4.0 | 1.0 | sehr gut |
| 3.8 | 1.2 | sehr gut |
| 3.7 | 1.3 | sehr gut |
| 3.5 | 1.5 | sehr gut |
| 3.3 | 1.7 | gut |
| 3.0 | 2.0 | gut |
| 2.7 | 2.3 | gut |
| 2.5 | 2.5 | gut |
| 2.3 | 2.7 | befriedigend |
| 2.0 | 3.0 | befriedigend |
| 1.7 | 3.3 | befriedigend |
| 1.5 | 3.5 | befriedigend |
| 1.0 | 4.0 | ausreichend |

Direct answers:

- **What is a 3.5 GPA on the German scale?** — 1.5, which is *sehr gut*. Good enough for almost every master's programme in Germany.
- **What is a 3.0 GPA in Germany?** — 2.0, a clear *gut*. Competitive programmes often set their cut-off around 2.5, so this is comfortably inside.
- **What is a 2.5 GPA in Germany?** — 2.5. Right on the line for selective programmes, fine for most.

If the university uses 2.0 as the minimum pass instead of 1.0, every number moves down slightly: a 3.5 GPA becomes 1.75, a 3.0 becomes 2.5. When a programme states its cut-off, ask which minimum they apply — it is a legitimate question and admissions offices answer it.

## Indian CGPA and percentage to German grade

The formula is the same; only the inputs change.

**CGPA out of 10**, minimum pass usually 4.0 or 5.0 depending on the university — check your transcript's own definition, because the difference is not small:

| CGPA (min pass 4.0) | German grade |
|---|---|
| 9.5 | 1.25 |
| 9.0 | 1.5 |
| 8.5 | 1.75 |
| 8.0 | 2.0 |
| 7.5 | 2.25 |
| 7.0 | 2.5 |
| 6.5 | 2.75 |
| 6.0 | 3.0 |

**Percentage** with minimum pass 40 % (the norm for many Indian universities; some use 35 % or 50 %):

| Percentage | German grade |
|---|---|
| 90 % | 1.5 |
| 85 % | 1.75 |
| 80 % | 2.0 |
| 75 % | 2.25 |
| 70 % | 2.5 |
| 65 % | 2.75 |
| 60 % | 3.0 |

The same shape applies to Pakistani, Nigerian, Nepalese and Bangladeshi transcripts — plug in your own maximum and minimum pass. The [converter](/gpa-converter) has presets for each and lets you enter a custom scale.

## Three things that trip people up

1. **Minimum pass is not "the grade I would be unhappy with."** It is the lowest grade your institution records as passed. If your transcript says 40 % passes, use 40 even if nobody you know scored below 60.
2. **Universities may recompute your average first.** Some drop your worst subjects, some weight your final year, some use the *anabin* database's own thresholds. The formula tells you where you stand, not the exact number a particular office will print.
3. **A cut-off is a filter, not a prediction.** Meeting the grade gets your file read. What decides the outcome is the rest of it — which is why a [German-format CV](/cv-maker) and a [motivation letter written for that programme](/motivation-letter) are worth more effort than a second decimal place.

Once you know your German grade, [search programmes](/) with it in mind — and if you are heading for a German-taught programme, an app like [Lesen Lab](/lesenlab-german-reading-app) is a cheap way to keep your reading level moving while the applications are out.`,
  },
  {
    slug: 'best-sim-card-germany-students',
    title: 'Best SIM Card in Germany for Students (2026): Networks, Prepaid Plans and the ID Rule Nobody Warns You About',
    seoTitle: 'Best SIM Card in Germany for Students (2026)',
    excerpt: 'Three networks, a dozen brands, and a legal identity check that means you cannot just buy a SIM and start using it. Which network works where, what a good student plan costs, and how to get connected on day one.',
    seoDescription: 'Best SIM card and mobile plan for international students in Germany: Telekom vs Vodafone vs O2 coverage, prepaid plans, eSIM, and the mandatory ID registration.',
    category: 'life',
    readTime: 8,
    publishedAt: '2026-09-14',
    coverEmoji: '📱',
    tags: ['arrival', 'living', 'finance'],
    body: `Getting a German phone number is one of the first things you need — for the *Anmeldung* appointment, the bank, the health insurer, the landlord — and it is slightly harder than in most countries for one reason: **German law requires every SIM card to be registered to an identified person before it can be activated.** You cannot buy one at the airport and start calling. Plan for it, and it takes an hour; don't, and you spend your first days offline.

## The three networks

Every SIM in Germany runs on one of three physical networks, whatever brand is printed on the packaging.

| Network | Coverage | Speed | Price level | Typical brands |
|---|---|---|---|---|
| **Deutsche Telekom** | Best, especially rural areas and trains | Fastest | Highest | Telekom, congstar, fraenk |
| **Vodafone** | Very good in cities, patchy in some rural regions | Fast | Middle | Vodafone, Lidl Connect, otelo |
| **O2 (Telefónica)** | Good in cities, weakest in the countryside, has improved a lot | Good in cities | Cheapest | O2, Aldi Talk, Blau, Lebara |

For a student living in a city and mostly using the phone there, **O2-based prepaid is the value choice**. If you will commute by regional train, live in a smaller town or travel around Germany a lot, the **Telekom network is worth the extra few euros**, and congstar or fraenk get you onto it far cheaper than a Telekom contract.

## Prepaid vs contract

Take **prepaid** (*Prepaid-Tarif*) for at least your first months. It needs no German bank account, no credit history and no notice period, all of which you will lack on arrival. Plans renew every four weeks and you can switch or stop at any time.

A **contract** (*Vertrag*, typically 24 months) only makes sense once you are settled, have a German bank account, and know you are staying. Contract prices are not dramatically better any more, and the two-year lock-in with a three-month notice period is a trap for anyone who might leave after a semester.

## What a reasonable student plan costs

Prices move, but as a benchmark in 2026:

- **€8 – €12 per four weeks** buys roughly 10–20 GB of data with unlimited calls and texts within Germany on an O2- or Vodafone-based prepaid brand.
- **€10 – €15** gets similar data on the Telekom network via congstar or fraenk.
- **€15 – €20** reaches 30 GB and up, or the flagship brands' own prepaid tiers.

Discount supermarket brands — **Aldi Talk** (O2), **Lidl Connect** (Vodafone) — are genuinely good and are sold at the till of every Aldi and Lidl in the country. Ethnic-focused brands like **Lebara** and **Lycamobile** (both O2) bundle cheap international minutes, which matters if you call home a lot.

All plans include **EU roaming** at no extra cost, so your German SIM works on a trip to France or Poland just as it does at home.

## The ID rule, and how to get past it in an hour

Since 2017 every SIM sold in Germany must be linked to a verified identity before activation. Three ways to do it:

1. **In a shop.** Buy at a network store, an electronics chain, or a supermarket that offers on-the-spot activation. Show your passport, they verify you, done. The most reliable route on day one.
2. **Video-Ident.** Buy the SIM anywhere, then verify online via a video call where an agent checks your passport on camera. Works well, needs a stable connection — use hotel or university Wi-Fi.
3. **Post-Ident.** Take the SIM and your passport to a Deutsche Post branch, where a clerk verifies you. Slower but foolproof.

Bring the **passport**, not a national ID card from outside the EU — most systems only accept an EU ID card or a passport. Your visa or residence permit is not needed for the SIM itself.

## eSIM

Most brands now sell eSIM as well as physical cards, and for an unlocked recent iPhone or Android it is the fastest option: order online, verify by Video-Ident, scan a QR code, connected. Check two things first — that your phone is **unlocked** (carrier-locked phones from some countries will not work on any German SIM), and that it supports the LTE/5G bands used in Germany, which nearly all phones sold in the last five years do.

## Practical sequence for arrival week

1. **Before you fly:** make sure your phone is unlocked. If you have an eSIM-capable phone, you can even order a German eSIM in advance and activate it on landing.
2. **Day one:** buy a prepaid SIM where activation is done in the shop, with your passport. Aldi, Lidl, a Telekom or O2 store, or MediaMarkt/Saturn all work.
3. **Week one:** this German number goes on every form — Anmeldung, bank, health insurance, university portal. Choose a plan you will keep for a while so the number stays stable.
4. **Month three:** once you have a bank account and a routine, review. Switching brands is painless; switching *numbers* is not, so port the number if you move (*Rufnummernmitnahme*, free by law).

## The mistakes that cost money

- **Buying a contract at the airport kiosk.** Convenient, expensive, and you are locked in for two years before you know where you will live.
- **Letting prepaid credit expire.** Most prepaid SIMs deactivate after a long period without top-up. If you go home for the summer, top up once before you leave.
- **Assuming coverage from the brand name.** A €7 plan on O2 is superb in Berlin and nearly useless in parts of the Black Forest. Match the network to where you will actually be.
- **Ignoring the number on official letters.** German offices communicate by post, not by phone — read every letter that arrives. If one from a *Behörde* is hard to understand, [Amtsbrief](/amtsbrief-uebersetzer-app) photographs the letter and explains in plain language what it means and whether you need to act.

Once the phone works, the rest of arrival week is Anmeldung, bank and insurance — we have guides for [registering your address](/blog/anmeldung-germany-address-registration), [opening a bank account](/blog/opening-german-bank-account-student) and [student health insurance](/blog/health-insurance-students-germany).`,
  },
  {
    slug: 'salary-after-tax-germany-explained',
    title: 'Salary After Tax in Germany: What Your Gross Really Pays in 2026 (and Why Two People on €50,000 Take Home Different Amounts)',
    seoTitle: 'Salary After Tax in Germany (2026): Gross to Net Explained',
    excerpt: 'German payslips take a third or more off the top before you see a euro. What each deduction is, how tax class changes the number, why Werkstudent jobs are special, and what typical salaries actually leave you.',
    seoDescription: 'How gross becomes net salary in Germany: income tax, tax classes 1–6, social contributions, Werkstudent and Minijob rules, and worked examples for 2026.',
    category: 'finance',
    readTime: 10,
    publishedAt: '2026-09-14',
    coverEmoji: '💶',
    tags: ['finance', 'jobs', 'living'],
    body: `The job offer says €50,000. The first payslip says roughly €2,700 a month. Nobody warned you, and now you are wondering whether something went wrong.

Nothing went wrong — that is a normal German net salary for that gross in tax class 1. This guide explains where the money goes, which factors you can influence, and what common salaries actually leave you with. For your own numbers, the [free German salary calculator](/netto-brutto-calculator) applies the 2026 rules to your exact situation.

## What comes off a German payslip

Every deduction falls into one of two groups.

**1. Taxes**

- **Income tax** (*Lohnsteuer*). Progressive: nothing on roughly the first €12,300 of annual income (the *Grundfreibetrag*), then rising from 14 % to 42 %, with 45 % only far above €270,000. Your *marginal* rate is not your *average* rate — on €50,000 you pay around 17 % of gross in income tax, not 42 %.
- **Solidarity surcharge** (*Solidaritätszuschlag*). Abolished for around 90 % of earners; only applies once income tax passes a high threshold.
- **Church tax** (*Kirchensteuer*). 8–9 % *of your income tax*, only if you are registered as a member of a tax-collecting church. You are asked at *Anmeldung*; if you say none, you pay none.

**2. Social insurance contributions** — split roughly half and half with your employer; the figures below are your half.

| Contribution | Your share (approx.) | What it buys |
|---|---|---|
| Pension insurance | 9.3 % | State pension; refundable under conditions if you leave Germany |
| Health insurance | ~8.5 % (7.3 % + half of your insurer's supplementary rate) | Public health cover, no deductibles for basic care |
| Long-term care insurance | 1.8 % (+0.6 % surcharge if childless and over 23) | Nursing care |
| Unemployment insurance | 1.3 % | Unemployment benefit |

Together, roughly **20–21 % of gross** goes to social insurance, capped above certain income ceilings. Add income tax and the total deduction on a typical mid-range salary is **35–40 %**.

## Tax class: why identical salaries pay differently

Germany assigns every employee a *Steuerklasse* that sets how much income tax is withheld monthly. It does not change what you owe over the year — that is settled by the tax return — but it changes what lands in your account each month, which is what most people mean by "salary after tax".

| Class | Who | Monthly effect |
|---|---|---|
| **1** | Single, divorced, widowed | Standard deductions |
| **2** | Single parent | Extra relief amount |
| **3** | Married, the higher earner (partner takes 5) | Much lower withholding |
| **4** | Married, both earn similar amounts | Same as class 1 |
| **5** | Married, the lower earner (partner takes 3) | Much higher withholding |
| **6** | Second job | Highest withholding |

An international student who marries in Germany, or arrives with a spouse, should know that 3/5 vs 4/4 is a choice, and that choosing 3/5 shifts money between the partners' payslips rather than saving tax overall.

## Students and the Werkstudent privilege

If you are enrolled at a German university and work up to 20 hours a week during the semester, you count as a *Werkstudent*, and the rules are unusually favourable:

- **No unemployment, health or care contributions** from your salary. You keep paying your student health insurance separately, but the job does not add to it.
- **Pension contributions still apply** (9.3 %).
- **Income tax applies normally** — but because the tax-free allowance is annual, a student earning €1,000 a month usually pays little or none, and anything withheld is often refunded through a tax return.

The result is that a Werkstudent keeps a far higher share of gross than a regular employee. Our [Werkstudent guide](/blog/werkstudent-jobs-germany-rules) covers the hour limits, and the [tax return guide](/blog/student-tax-return-germany-verlustvortrag) explains how to get the withheld tax back.

## Minijob

A *Minijob* pays up to a fixed monthly ceiling (around €600 in 2026, tied to the minimum wage) and is **tax-free and contribution-free for you**. Above the ceiling you enter the *Midijob* band with reduced contributions, and above that the normal rules. Minijobs are common alongside studies, but the ceiling is low — a Werkstudent role usually pays more overall.

## Worked examples (tax class 1, no church tax, public health insurance)

| Gross per year | Gross per month | Net per month (approx.) | Share kept |
|---|---|---|---|
| €30,000 | €2,500 | ~€1,900 | ~76 % |
| €40,000 | €3,333 | ~€2,350 | ~70 % |
| €50,000 | €4,167 | ~€2,750 | ~66 % |
| €60,000 | €5,000 | ~€3,200 | ~64 % |
| €70,000 | €5,833 | ~€3,600 | ~62 % |

These are rounded 2026 figures for someone without children. Children (via the child allowance and *Kindergeld*), a different tax class, church tax, private health insurance and the federal state all move the number — which is exactly why a [calculator](/netto-brutto-calculator) beats a table for your own case.

## What families should also count

If you have children in Germany, the state pays **Kindergeld** — a fixed monthly amount per child, paid on a date determined by the last digit of your Kindergeld number. It is not part of your salary and does not appear on the payslip, but it belongs in any honest calculation of what a family actually has each month. The [Kindergeld Termine](/kindergeld-termine-rechner-app) app shows the payment date from that one digit and checks whether you also qualify for the *Kinderzuschlag* top-up.

## The negotiation point most people miss

Because deductions are progressive, **a raise is worth less net than it looks** — on a mid-range salary you keep roughly 55–60 cents of each additional euro. When comparing offers, compare net, and remember that non-cash benefits (a *Deutschlandticket*, a company pension contribution, a bike lease) are often taxed more lightly than the same value in salary.

And before the negotiation happens at all, the application has to get you in the room: a [German-format CV](/cv-maker) and a [cover letter written for German employers](/cover-letter) are still what most hiring managers here expect to see first.`,
  },
  {
    slug: 'masters-data-science-germany',
    title: "Master's in Data Science in Germany: Universities, Requirements and What English-Taught Really Means",
    seoTitle: "Master's in Data Science in Germany: Universities & Requirements",
    excerpt: 'Data science and AI master\'s programmes are among the most searched degrees in Germany and among the most competitive. Where the strong programmes are, what they actually require, and how to tell a real data science degree from a rebranded one.',
    seoDescription: "Master's in data science in Germany: leading universities, admission requirements, ECTS prerequisites, English-taught options, tuition and how to build a competitive application.",
    category: 'guide',
    readTime: 9,
    publishedAt: '2026-09-14',
    coverEmoji: '📊',
    tags: ['programs', 'application', 'jobs'],
    body: `Data science is the master's degree international applicants search for most in Germany, and for good reasons: the programmes are strong, tuition is mostly free, and the job market for data and machine-learning roles in Germany is deep. It is also where the most applications are rejected on formalities, because the prerequisites are specific and the competition is real.

## Where the strong programmes are

Germany does not have one "best" data science programme; it has several clusters with different flavours.

**Technical universities** — TUM (Munich), RWTH Aachen, KIT (Karlsruhe), TU Berlin, TU Darmstadt, TU Dortmund. Strong on machine learning theory, systems and engineering; highly competitive; often the largest cohorts.

**Research universities with dedicated programmes** — LMU Munich (Data Science), University of Mannheim (Data Science, with a business-analytics lean), Universität Magdeburg, Universität Hildesheim, Saarland University (strong in ML and NLP), Universität Potsdam / Hasso Plattner Institute (Data Engineering).

**Universities of applied sciences** — Hochschule Darmstadt, TH Ingolstadt, HTW Berlin and others offer data science master's with a strong applied and industry focus, smaller cohorts, and often a compulsory project with a company. If your goal is a data role in industry rather than a PhD, do not skip these — read our [university vs applied sciences comparison](/blog/university-vs-university-of-applied-sciences-germany) before deciding.

A meaningful number of these programmes are **taught entirely in English**, and many others are bilingual. You can [filter the full list by language, city and tuition](/) to see them side by side.

## What they actually require

This is where applications fail. Data science master's programmes in Germany are *consecutive* degrees: they assume a specific quantitative background and check it by counting credits.

**A related bachelor's degree** — computer science, mathematics, statistics, physics, electrical engineering, or a quantitative economics degree. A business or social-science degree with a few statistics modules is usually not enough on its own.

**Minimum ECTS in specific areas.** Typical requirements are along the lines of 20–30 ECTS in mathematics (analysis, linear algebra, probability, statistics) and 20–30 ECTS in computer science (programming, algorithms, databases). Programmes list these explicitly. Convert your transcript's credits to ECTS before applying, and be honest: a shortfall of a few ECTS can sometimes be covered with conditional admission; a large one cannot.

**Grades.** Cut-offs of 2.5 on the German scale are common at selective programmes, and 2.0 or better at the most competitive. Use the [GPA converter](/gpa-converter) to see where your grade lands, and read the [conversion table](/blog/german-grade-to-gpa-conversion-table) for what the numbers mean.

**English.** IELTS 6.5 or TOEFL iBT 88–90 are typical minimums for English-taught programmes; some accept a bachelor's taught in English as proof. **German** is normally not required for English-taught programmes, but a few ask for A2 or B1 by the end of the degree.

**GRE.** Rarely required in Germany. A handful of programmes accept it as supporting evidence. Do not spend money on it unless a target programme names it.

**A motivation letter and CV**, almost always. These are read, and in tie-break situations they decide.

## Tuition and cost

Public universities in most federal states charge **no tuition** for master's programmes, only a semester contribution of roughly €150–€400 that usually includes public transport. **Baden-Württemberg** charges non-EU students €1,500 per semester at its public universities — that covers KIT, Stuttgart, Heidelberg and Mannheim among others. A few programmes, especially at technical universities, run as "professional" or continuing-education degrees with genuine tuition; the programme page will say so.

Living costs are the larger number: budget €950–€1,300 a month depending on the city, and note that the blocked-account requirement for the visa is set nationally. Our [cost of studying guide](/blog/cost-of-studying-in-germany) breaks it down by city.

## Telling a real data science degree from a rebranded one

The label has become popular. Check three things on the programme page:

1. **The module list.** A real programme has machine learning, statistics, optimisation, databases or data engineering, and a substantial project or thesis. If half the modules are general management, it is a business degree with a new name.
2. **Who teaches it.** Look for a department of computer science, mathematics or statistics behind it, and for professors with research output in the field.
3. **What graduates do.** Programmes with strong industry links publish where their alumni went. Absence of that information is itself information.

## Building an application that survives the first cut

- **Map your transcript to their ECTS list.** Make the mapping explicit in your application — a short table in the motivation letter or an appendix saves the reviewer work and removes the easiest reason to reject you.
- **Show code.** A GitHub link with a couple of clean, documented projects does more than a paragraph about passion for data.
- **Write for the programme, not for data science in general.** Name the specialisation, the lab or the industry link that makes *this* programme the one. Our [motivation letter tool](/motivation-letter) is built to draft around a specific programme rather than a generic template.
- **Use the German CV format.** A one- or two-page *Lebenslauf* in reverse chronological order with dates on the left is what the office expects; the [CV maker](/cv-maker) produces exactly that.
- **Apply to a spread.** Two reach programmes, three realistic ones, one at a university of applied sciences. Deadlines for winter intake cluster around 15 May to 15 July; check each programme, some close earlier.

## After the degree

Data and ML roles in Germany hire across automotive, industrial software, fintech, e-commerce and a large research sector. Graduates of German master's programmes get an 18-month job-seeker residence permit to find a position, and the *Blue Card* threshold for IT roles is deliberately lower than for other professions. If a German-taught workplace is where you end up, an app like [Lesen Lab](/lesenlab-german-reading-app) is a low-effort way to keep the language moving during the degree, and [SchreibCoach](/deutsch-b1-schreiben-app) covers the formal written German that emails to colleagues and authorities need.`,
  },
  {
    slug: 'studienkolleg-germany-guide',
    title: 'Studienkolleg in Germany: Who Needs It, How to Get In, and How to Pass the Feststellungsprüfung',
    seoTitle: 'Studienkolleg Germany: Who Needs It & How to Get In',
    excerpt: 'If your school-leaving certificate is not recognised as equivalent to the German Abitur, the Studienkolleg is your route in. What it is, which course you need, the German level required, and how the final exam works.',
    seoDescription: 'Studienkolleg explained for international students: who needs it, course types T/W/M/G/S, German language requirements, admission test, costs and the Feststellungsprüfung.',
    category: 'guide',
    readTime: 9,
    publishedAt: '2026-09-14',
    coverEmoji: '🎓',
    tags: ['application', 'planning', 'language'],
    body: `For students from many countries — including India, Pakistan, Nigeria, Nepal, Bangladesh, Iran, Vietnam and parts of the Middle East and Africa — the first shock of applying to Germany is learning that a completed secondary school is not, by itself, enough. If the *anabin* database rates your certificate as *not* directly equivalent to the German Abitur, you need either a year or two of university study at home first, or a **Studienkolleg**.

The Studienkolleg is a one-year preparatory college run by or alongside German universities. It ends with the *Feststellungsprüfung*, an exam that gives you a university entrance qualification for the subject group you studied. Done right, it costs almost nothing and puts you on exactly the same footing as a German school-leaver.

## Do you need one?

Check your certificate on **anabin** (the official recognition database) or through **uni-assist**'s preliminary review. You will land in one of three categories:

1. **Direct access** (*direkter Hochschulzugang*) — your certificate is equivalent. No Studienkolleg needed.
2. **Subject-restricted access** — you can apply directly, but only to the subject group your school qualification covers.
3. **Indirect access** — you need a Studienkolleg, *or* proof of one to two years of successful university study in your home country in a related subject.

Common cases: an Indian CBSE/ISC 12th standard usually needs a Studienkolleg or one year of university unless the grades are very high; a Pakistani HSSC needs a Studienkolleg or two years of university; Nigerian WAEC needs a Studienkolleg or university study; a Nepalese +2 needs one year of university or a Studienkolleg. Always confirm your own case — the rules are certificate-specific and change.

## The course types

You choose the course by the degree you want afterwards. It determines which subjects you study and which universities the final exam qualifies you for.

| Course | For degrees in | Main subjects |
|---|---|---|
| **T-Kurs** | Engineering, mathematics, natural sciences | Maths, physics, chemistry or computer science, German |
| **W-Kurs** | Business, economics, social sciences | Maths, economics, business studies, German, English |
| **M-Kurs** | Medicine, dentistry, pharmacy, biology | Biology, chemistry, physics, maths, German |
| **G-Kurs** | Humanities, languages, German studies, arts | History, German literature, social studies, English |
| **S-Kurs** | Languages, translation | German, a second language, history or social studies |

Universities of applied sciences run their own variants (often labelled TI, WW, GD, SW) that qualify you for that type of institution. Choose deliberately: switching course after admission is rarely possible without starting over.

## The German you need before you start

This is the requirement that decides most applications. The Studienkolleg is taught in German, and the entrance test is in German. You need **at least B1, and realistically B2**, at the time of the entrance exam — and the entrance exam itself is often a German test plus a maths test for T/W/M courses.

Practically: if you are at A2 now, a Studienkolleg is at least a year away, and that year should be spent on the language. Intensive courses in Germany or at home, plus daily reading and writing practice, are how people get there. Apps help with the daily part — [Lesen Lab](/lesenlab-german-reading-app) for graded reading with audio, and [SchreibCoach](/deutsch-b1-schreiben-app) specifically for the B1 writing tasks that the entrance and final exams demand.

## How to apply

1. **Get the certificate assessed** — via uni-assist or the university's international office, depending on the Studienkolleg. Some require a preliminary university application; the Studienkolleg place comes as a conditional admission.
2. **Apply to the Studienkolleg** by its deadline. Public Studienkollegs typically have deadlines around 15 January (summer) and 15 July (winter), but many differ; some require the university application first. Apply to more than one — places are limited.
3. **Sit the entrance test** (*Aufnahmeprüfung*). German at B1/B2 plus maths for quantitative courses. Competition varies by state and course; T and M courses fill fastest.
4. **Get the visa.** The admission or the invitation to the entrance test is enough to apply for a student-applicant or student visa. Financial proof via [blocked account](/blog/blocked-account-germany-guide) applies exactly as for a degree.

## Public vs private

**Public Studienkollegs** are attached to public universities and charge only a semester contribution — a few hundred euros, often including a transport ticket. They are free in the sense degrees are free, and they are competitive to enter.

**Private Studienkollegs** charge tuition, commonly €300–€700 per month, sometimes more. They are easier to get into and often start more frequently. Two cautions: check that the private college is *state-recognised* and that its Feststellungsprüfung is accepted by the universities you want — some private colleges send students to sit the exam externally at a public institution, which is fine, but you should know that in advance.

## Living through the year

The Studienkolleg is two semesters, full time, around 30 hours of classes a week. You are enrolled as a student, which means you can hold student health insurance, work the limited hours allowed on a student visa, and use the university's facilities. Grades from the year do not count toward your degree — only the final exam does — but the year is where the habit of studying in German is built, and students who treat it as a language year rather than a school year do better.

## The Feststellungsprüfung

The final exam is written and oral, in the main subjects of your course, in German. Pass it and you receive a certificate that qualifies you to apply for the relevant subject group **at any university in Germany**, not just the one attached to the Studienkolleg. Your exam grade combines with the grade of your school certificate to form the grade universities use for admission, so it matters for competitive subjects.

You may retake the exam once. Fail twice and the route is closed, which is the strongest argument for arriving with solid German rather than the minimum.

## After the exam

You apply to universities like any other applicant: through [programme search](/), uni-assist or direct application, with a [German-format CV](/cv-maker) and, where asked, a [motivation letter](/motivation-letter). The Studienkolleg certificate replaces the missing Abitur equivalence, and nobody will ask about it again.`,
  },
  {
    slug: 'driving-licence-germany-international-students',
    title: 'Driving in Germany as an International Student: How Long Your Licence Is Valid and How to Convert It',
    seoTitle: 'Driving Licence in Germany for International Students',
    excerpt: 'Your home licence works in Germany — for a while. When the six-month clock starts, which countries get a straight swap, who has to sit the German tests, and how to pass them without a full driving school course.',
    seoDescription: 'Foreign driving licence in Germany: EU vs non-EU validity, the six-month rule, Umschreibung, which countries are exempt from tests, and how to pass the German theory and practical exams.',
    category: 'life',
    readTime: 9,
    publishedAt: '2026-09-14',
    coverEmoji: '🚗',
    tags: ['living', 'arrival', 'planning'],
    body: `Most international students do not need a car in Germany — public transport is good and the *Deutschlandticket* is cheap. But many end up driving anyway: a part-time job outside the city, a road trip, a car-share membership, a first job after graduation. And when they do, they discover that the rules on foreign licences are strict, time-based, and enforced.

## The rule that matters: six months

**EU or EEA licence:** valid in Germany for as long as it is valid at home. Nothing to do. You can swap it for a German one voluntarily, but you do not have to.

**Any other licence:** valid for **six months from the day you establish your normal residence in Germany** — which in practice means your *Anmeldung* date, not your arrival date. After that, driving on it is driving without a licence, which is a criminal offence, not a fine.

There are two exceptions:

- If you can show you will stay in Germany for **no more than twelve months in total**, you can apply to extend the six months to twelve. Most degree students cannot use this.
- Before the six months end, you need a **German translation** of the licence to accompany it, unless it is in English or from a country whose licence format Germany recognises without translation. An ADAC or sworn translation is the usual route.

Students often assume the clock only starts when they *want* to drive. It does not. If you registered your address in October, your home licence stops working in April, whether or not you have driven since.

## Converting the licence (*Umschreibung*)

You apply at the local driving-licence office (*Führerscheinstelle* or *Fahrerlaubnisbehörde*) in the city where you are registered. What happens next depends entirely on where the licence was issued.

**Countries with a full exemption** — the licence is swapped for a German one without any test. Switzerland, Japan, South Korea, Israel, Singapore, Taiwan, Australia (most states), New Zealand, Canada (most provinces), and a number of US states are in this group. The list, called *Anlage 11* to the driving-licence regulation, is precise and changes; check it for your country and, for the US and Canada, your specific state or province.

**Countries with a partial exemption** — you keep your licence but must pass **either** the theory **or** the practical exam. Several US states fall here.

**Everyone else** — including India, Pakistan, Nigeria, Nepal, Bangladesh, Turkey, most of Africa, most of South and Southeast Asia and most of Latin America — must pass **both the theory and the practical exam** in Germany. But — and this is the part people miss — you are **not required to attend a driving school course** to do it. No minimum number of lessons, no first-aid course, no eye test. You register with a driving school to be able to book the exams and use their car for the practical, take as many lessons as you personally need, and sit the tests.

## What the German tests involve

**Theory exam.** 30 questions drawn from a public pool of roughly 1,100, on a computer, available in **English and eleven other languages**, including Arabic, Turkish, Russian, Spanish, French and Romanian. You may lose at most 10 error points, and no more than one question worth 5 points. Questions with video clips are included. The pool is public, so the exam is learnable; most people who fail have either not practised or have practised in a language they then did not choose for the test.

The questions that trip up foreign drivers most are **right of way** — *rechts vor links* at unmarked junctions, priority-road signs, roundabouts, trams and cyclists all have rules that differ from what many countries drill. This is precisely what [Vorfahrt üben](/vorfahrt-ueben-app) exists for: a 3D simulator that puts you at the junction and makes you decide who goes first, over and over, until it is automatic. It is built for the German theory exam and it is in German, which is itself useful practice if you plan to take the test in German.

**Practical exam.** Around 45–55 minutes in the driving school's car with an examiner, in normal traffic, including motorway or expressway where available, parking manoeuvres, and typically a stretch in a 30 km/h zone. Examiners look for defensive, rule-exact driving: mirror checks, shoulder checks before turning, strict speed compliance, correct behaviour at right-before-left junctions and pedestrian crossings. Confident drivers from countries with looser road culture fail not on skill but on habits — rolling through a stop line, missing a cyclist check, going 55 in a 50.

## Costs, realistically

- Application at the licence office: roughly €40–€50, plus the translation if needed.
- Driving school registration and administration: varies widely, often €150–€300.
- Theory exam fee: around €25; practical exam fee: around €130, plus the school's charge for using the car, often another €150–€250.
- Lessons: none required, but budget for a few practice hours (roughly €60–€90 each) to learn the examiner's expectations and the local exam routes.

Someone converting from a non-exempt country and passing first time typically spends €500–€900 — far less than the €2,500–€4,000 a full German licence from scratch costs, because the training obligation is what makes the full course expensive.

## Timeline

1. **Month 1–2 after Anmeldung:** decide whether you will drive at all in your time here. If not, the licence simply lapses for German purposes and you do nothing.
2. **Month 2–3:** if yes, apply at the Führerscheinstelle. Processing takes weeks and the application must be *submitted* before the six months end.
3. **Month 3–5:** learn the theory pool in your exam language; practise right of way until it is reflex; take a few lessons to learn the examiner's standard.
4. **Before month 6:** sit both exams. If the practical is scheduled after month six, you cannot legally practise on your own licence in the meantime — so do not leave the practical to the end.

## Common mistakes

- **Counting from arrival, not Anmeldung.** The residence date is what the office checks.
- **Driving after six months "because nobody checks".** Police do check at routine stops, and insurance does not pay in an accident if the driver was unlicensed.
- **Doing the theory in German when English was available.** Unless your German is strong, take the test in a language you read fast — the questions are precise and the time is short.
- **Skipping practice on junction rules.** It is the single largest source of both theory errors and practical fails for drivers trained elsewhere.

If you are staying in Germany long term, the same habits carry forward: the *Einbürgerungstest* for citizenship has a comparable public question pool, and the same study approach — practise the actual pool, in the actual format — works there too ([Einbürgerungstest 2026](/einbuergerungstest-2026-app) is built the same way). And any letter from the licence office or the *Ordnungsamt* that you do not fully understand can be photographed into [Amtsbrief](/amtsbrief-uebersetzer-app), which explains what it says and whether it has a deadline.`,
  },
];
