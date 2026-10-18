import type { AppGuide } from './types';

const APP_URL = 'https://apps.apple.com/app/id6794609450?ppid=960b9159-f6f0-45d6-be31-c8035e782ee1';
const APP = 'Fahrschule 3D: Vorfahrt üben';

const law = (para: string, title: string, book = 'stvo_2013') => ({
  title,
  url: `https://www.gesetze-im-internet.de/${book}/__${para}.html`,
});
const stvo5 = law('5', '§ 5 StVO – Overtaking');
const stvo7 = law('7', '§ 7 StVO – Use of lanes by motor vehicles');
const stvo8 = law('8', '§ 8 StVO – Right of way (Vorfahrt)');
const stvo9 = law('9', '§ 9 StVO – Turning');
const stvo11 = law('11', '§ 11 StVO – Special traffic situations (emergency corridor)');
const stvo18 = law('18', '§ 18 StVO – Motorways and expressways');
const stvo26 = law('26', '§ 26 StVO – Pedestrian crossings');
const stvo37 = law('37', '§ 37 StVO – Traffic lights and green arrow');
const stvo38 = law('38', '§ 38 StVO – Blue and yellow flashing lights');
const anlage2 = { title: 'Annex 2 StVO – Regulatory signs (give way, stop)', url: 'https://www.gesetze-im-internet.de/stvo_2013/anlage_2.html' };
const anlage3 = { title: 'Annex 3 StVO – Informative signs (priority road)', url: 'https://www.gesetze-im-internet.de/stvo_2013/anlage_3.html' };
const fev = (para: string, title: string) => law(para, title, 'fev_2010');
const stvg2a = law('2a', '§ 2a StVG – Probationary licence', 'stvg');
const stvg24c = law('24c', '§ 24c StVG – Zero alcohol for new drivers', 'stvg');
const bkat = { title: 'German fines catalogue (BKatV)', url: 'https://www.gesetze-im-internet.de/bkatv_2013/' };

const guides: AppGuide[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'german-priority-road-signs-explained',
    keyword: 'German road signs right of way explained',
    title: 'German right-of-way signs explained in English',
    metaTitle: 'German Right-of-Way Signs in English – Priority, Yield, Stop',
    metaDescription:
      'The yellow diamond, the upside-down triangle, the stop sign and the X-triangle: what each German priority sign means, in English, with the order in which rules apply.',
    excerpt: 'Priority road, give way, stop, priority at the next junction and right-before-left: every sign in plain English.',
    keyTakeaways: [
      'Yellow diamond (sign 306): you are on a priority road until a crossed-out diamond (sign 307) ends it.',
      'Upside-down triangle (sign 205, “Vorfahrt gewähren”): give way; stop only if traffic is coming.',
      'Octagonal STOP (sign 206): always stop completely, then give way.',
      'Triangle with an X (sign 102): right-before-left applies at the next junction. No sign at all also means right-before-left.',
    ],
    intro: [
      'German right-of-way is decided in a fixed order: police officers first, then traffic lights, then signs, and only if none of those exist the default rule “rechts vor links” (right before left). Once you know the five or six priority signs below, you can solve almost every junction you meet in Germany and in the German theory test.',
      'The signs look similar to those in many other countries, but two catch newcomers out: the yellow diamond, which has no direct equivalent in the UK or US, and the X-triangle, which warns that you do not have priority at the next junction.',
    ],
    sections: [
      {
        heading: 'The signs that give you priority',
        bullets: [
          'Priority road (sign 306, yellow diamond with white border): you have priority at every junction until it is cancelled.',
          'End of priority road (sign 307, yellow diamond crossed out): from here on, the normal rules apply again – often right-before-left.',
          'Priority at the next junction only (sign 301, red-bordered triangle with a thick black arrow and a thin crossbar): you have priority at the next junction, not beyond.',
          'Priority over oncoming traffic (sign 308, blue square with a white arrow and a smaller red arrow): at a narrow section you may go first.',
        ],
      },
      {
        heading: 'The signs that make you wait',
        bullets: [
          'Give way (sign 205, triangle pointing down): let traffic on the crossing road go first. You may roll through if it is clear.',
          'Stop (sign 206, red octagon “STOP”): come to a complete stop at the stop line, or where you can see if there is none – every time.',
          'Oncoming traffic has priority (sign 208, round with a red and a black arrow): at a narrow section you must wait for oncoming vehicles.',
          'Right-before-left warning (sign 102, red triangle with a black X): at the next junction, traffic from the right goes first.',
        ],
      },
      {
        heading: 'The order in which rules apply',
        numbered: [
          'Hand signals from a police officer.',
          'Traffic lights (a flashing amber light does not count – it means the light is not regulating).',
          'Priority signs such as the yellow diamond, give way and stop.',
          'Right-before-left (rechts vor links) when nothing else applies.',
          'On top of this, turning drivers must let oncoming traffic, pedestrians and cyclists pass, and emergency vehicles with blue lights and siren go before everyone.',
        ],
      },
      {
        heading: 'The bending priority road',
        paragraphs: [
          'Below a yellow diamond you sometimes see an extra plate with a thick and a thin line. The thick line shows how the priority road runs through the junction – it can turn left or right. If you follow the bend, you keep priority but must indicate. If you go straight on and leave the thick line, you are leaving the priority road.',
        ],
      },
    ],
    appTip:
      'The app puts you at real-looking 3D junctions with these exact signs. You decide who goes first, then watch every vehicle move in the correct order with the rule explained. It is fully available in English.',
    howToHeading: 'Practise German priority signs in 3D',
    howToSteps: [
      { title: 'Spot the sign', text: 'See the sign where it actually stands, from the driver’s seat.' },
      { title: 'Decide the order', text: 'Choose which vehicle goes first, second and third.' },
      { title: 'Check the explanation', text: 'Each answer comes with the StVO rule behind it.' },
    ],
    faqs: [
      { question: 'What does the yellow diamond sign mean in Germany?', answer: 'It marks a priority road (Vorfahrtstraße). You have right of way at junctions until a crossed-out yellow diamond ends it.' },
      { question: 'What is the difference between give way and stop in Germany?', answer: 'At give way (sign 205) you only stop if traffic is coming. At a stop sign (sign 206) you must always come to a complete stop.' },
      { question: 'What if there is no sign at a German junction?', answer: 'Then right-before-left applies: traffic coming from your right goes first.' },
      { question: 'Does a traffic light override a priority sign?', answer: 'Yes. Working traffic lights take precedence over signs. If the lights are off or flashing amber, the signs apply again.' },
      { question: 'Is there an app in English to practise German right-of-way?', answer: `Yes. ${APP} for iPhone is fully in English and German and trains German junctions in 3D: ${APP_URL}` },
    ],
    sources: [stvo8, anlage2, anlage3],
    screenshotIndex: 2,
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'green-arrow-sign-germany-right-turn-on-red',
    keyword: 'green arrow sign Germany right turn on red',
    title: 'Green arrow sign in Germany: can you turn right on red?',
    metaTitle: 'Green Arrow Sign Germany – Right Turn on Red Rules',
    metaDescription:
      'In Germany you may only turn right on red where a green arrow sign is fixed next to the light – and only after a full stop. The rules, the fine and the difference from a lit green arrow.',
    excerpt: 'Full stop first, right lane only, pedestrians and cyclists first – the German “Grünpfeil”.',
    keyTakeaways: [
      'Right turn on red is not generally allowed in Germany – only where a metal green-arrow sign (Grünpfeil) is mounted next to the red light.',
      'You must first come to a complete stop at the stop line.',
      'Only from the right-hand lane, and without obstructing pedestrians, cyclists or cross traffic.',
      'Not stopping costs €70 and 1 penalty point.',
    ],
    intro: [
      'Unlike in much of the US, turning right on red is not a general rule in Germany. You may only do it where a small metal sign with a green arrow on a black background is fixed to the right of the red light. Even then, § 37 StVO requires you to stop completely first, turn only from the right-hand lane and make sure you neither obstruct nor endanger anyone – especially pedestrians and cyclists who have a green light.',
      'Many newcomers confuse this sign with a green arrow that lights up inside the traffic light. They mean different things, and the German theory test likes to ask about the difference.',
    ],
    sections: [
      {
        heading: 'How to use the green arrow sign',
        numbered: [
          'Stop completely at the stop line, even if the road is empty.',
          'Make sure you are in the right-hand lane.',
          'Look for pedestrians and cyclists crossing on green in the direction you are turning into.',
          'Check cross traffic from the left, which has a green light.',
          'Turn only when you can do so without obstructing anyone. If in doubt, wait for green.',
        ],
      },
      {
        heading: 'Green arrow sign vs. lit green arrow',
        bullets: [
          'Metal sign with a green arrow next to the red light: right turn allowed after stopping, with full caution.',
          'Green arrow lit up inside the traffic light: that direction has a green light. No stop is required, but watch for pedestrians and cyclists if their crossing is not separately stopped.',
          'Green arrow sign with a bicycle symbol: applies only to cyclists, not to cars.',
        ],
      },
      {
        heading: 'Fines',
        paragraphs: [
          'Turning without stopping first costs €70 and 1 point in the Flensburg register under the German fines catalogue; obstructing or endangering others costs more. During the probationary period it also counts as a serious (A) offence, which means a mandatory course and a probation extended to four years.',
        ],
      },
    ],
    appTip:
      'The app trains traffic-light junctions from the driver’s seat: you see the signals, pedestrians and cyclists at the same time, decide who goes first, and then get the rule explained in English or German.',
    howToHeading: 'Practise traffic-light junctions',
    howToSteps: [
      { title: 'Read the signals', text: 'Light, arrow or sign – work out what controls the junction.' },
      { title: 'Count everyone', text: 'Include pedestrians and cyclists at the crossing.' },
      { title: 'Check the result', text: 'The animation shows the correct order with the rule.' },
    ],
    faqs: [
      { question: 'Can you turn right on red in Germany?', answer: 'Only where a green arrow sign is mounted next to the red light, and only after stopping completely.' },
      { question: 'Do I have to stop at a green arrow sign?', answer: 'Yes. A full stop at the stop line is mandatory before turning.' },
      { question: 'What is the fine for not stopping at a green arrow?', answer: '€70 and 1 penalty point, more if someone is obstructed or endangered.' },
      { question: 'Does the green arrow apply to the middle lane?', answer: 'No. Only vehicles in the right-hand lane may turn on the green arrow sign.' },
      { question: 'How can I practise German traffic-light rules?', answer: `With ${APP} for iPhone, which is available in English: ${APP_URL}` },
    ],
    sources: [stvo37, stvo9, bkat],
    screenshotIndex: 0,
  },

  /* ------------------------------------------------------------------ 3 */
  {
    slug: 'emergency-vehicles-rettungsgasse-germany',
    keyword: 'Rettungsgasse emergency corridor Germany',
    title: 'Emergency vehicles and the Rettungsgasse: what to do in Germany',
    metaTitle: 'Rettungsgasse & Blue Lights in Germany – Rules in English',
    metaDescription:
      'Form the emergency corridor as soon as traffic slows to walking pace: far-left lane moves left, all others move right. Blue lights with siren override every other rule. Fines included.',
    excerpt: 'The far-left-goes-left rule, when the corridor is required and what blue lights mean.',
    keyTakeaways: [
      'Rettungsgasse: the far-left lane moves left, all other lanes move right – the gap is between the leftmost lane and the next one.',
      'It is required as soon as traffic on a motorway (or a rural road with two or more lanes per direction) moves at walking pace or stops – before you hear a siren.',
      'Blue lights plus siren mean: clear the way immediately. This beats green lights and priority roads.',
      'No emergency corridor: at least €200, 2 points and a one-month driving ban.',
    ],
    intro: [
      'On German motorways and multi-lane rural roads, you must form an emergency corridor (Rettungsgasse) as soon as traffic slows to walking pace or stops. The rule in § 11 StVO is simple: the vehicles in the far-left lane move left, everyone else moves right. The corridor is always between the leftmost lane and the lane next to it – whether there are two, three or four lanes.',
      'Separately, any vehicle with flashing blue lights and a siren has absolute priority: under § 38 StVO everyone must clear the way immediately. Blue lights without a siren are only a warning and do not give priority.',
    ],
    sections: [
      {
        heading: 'Where the corridor goes',
        bullets: [
          'Two lanes: left lane goes left, right lane goes right.',
          'Three lanes: left lane goes left; middle and right lanes go right.',
          'Four lanes: left lane goes left; the other three go right.',
          'Memory aid: hold up your right hand. Your thumb is the left lane; the gap between thumb and index finger is the corridor.',
        ],
      },
      {
        heading: 'Step by step in a traffic jam',
        numbered: [
          'Leave enough space to the car in front so you can still steer sideways.',
          'Move clearly to the left or right depending on your lane – onto the hard shoulder if needed.',
          'Keep the corridor open until traffic flows again; more emergency vehicles often follow.',
          'Never drive through the corridor yourself or follow an emergency vehicle through it.',
        ],
      },
      {
        heading: 'Blue lights at a junction',
        paragraphs: [
          'If an ambulance with blue lights and siren approaches a junction where you have a green light, it still goes first. Pull to the side and stop if necessary. If you are waiting at a red light, try to make space sideways. Creeping carefully over the stop line to let it through is generally tolerated as an emergency, but only if you endanger no one.',
        ],
      },
      {
        heading: 'Fines',
        bullets: [
          'No emergency corridor formed: €200, 2 points, 1-month driving ban; with obstruction €240, more with endangerment or damage.',
          'Driving through the corridor yourself: €240, 2 points, 1-month driving ban.',
          'Not clearing the way for blue lights and siren: €240, 2 points, 1-month driving ban.',
        ],
      },
    ],
    appTip:
      'Blue-light situations are part of the app’s 52 test scenarios. You see the emergency vehicle arrive at a 3D junction and decide how everyone must react – with the rule explained in English.',
    howToHeading: 'Practise emergency-vehicle situations',
    howToSteps: [
      { title: 'Spot the blue lights', text: 'Learn when an emergency vehicle overrides every other rule.' },
      { title: 'Decide who waits', text: 'Set the order for every vehicle at the junction.' },
      { title: 'Read the rule', text: 'Each solution comes with the StVO explanation.' },
    ],
    faqs: [
      { question: 'When do I have to form a Rettungsgasse in Germany?', answer: 'As soon as traffic on a motorway or a rural road with at least two lanes per direction moves at walking pace or stops – not only when you hear a siren.' },
      { question: 'Which way do I move in the middle lane?', answer: 'To the right. Only the far-left lane moves left.' },
      { question: 'Does an ambulance with blue lights but no siren have priority?', answer: 'No. Only blue lights combined with a siren require everyone to clear the way.' },
      { question: 'What is the fine for not forming an emergency corridor?', answer: 'At least €200, 2 points and a one-month driving ban.' },
      { question: 'Is there an English app for German road rules with emergency vehicles?', answer: `Yes. ${APP} for iPhone includes blue-light scenarios and works in English: ${APP_URL}` },
    ],
    sources: [stvo11, stvo38, bkat],
    screenshotIndex: 5,
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: 'german-autobahn-rules-new-drivers',
    keyword: 'German Autobahn rules',
    title: 'German Autobahn rules for new drivers and newcomers',
    metaTitle: 'German Autobahn Rules – Speed, Overtaking, Merging (2026)',
    metaDescription:
      'No general speed limit but an advisory 130 km/h, overtaking only on the left, the merging rule, minimum distance and the emergency corridor: the German Autobahn explained in English.',
    excerpt: 'The 130 advisory speed, keep-right, no undertaking, merging and safe distance.',
    keyTakeaways: [
      'There is no general speed limit on many Autobahn sections, but 130 km/h is the advisory speed and signed limits are common.',
      'Keep right; overtake only on the left. Passing on the right is only allowed in slow queues.',
      'Traffic already on the Autobahn has priority over merging vehicles.',
      'Stopping, turning and reversing are banned; only vehicles that can go faster than 60 km/h may use it.',
    ],
    intro: [
      'The German Autobahn has no general speed limit on many sections, but that does not mean there are no rules. The recommended speed is 130 km/h, signed limits are common, and the rules on keeping right, overtaking and merging are enforced strictly. Only motor vehicles with a design speed above 60 km/h may use it.',
      'For new drivers, two things matter most: overtaking only on the left, and understanding that traffic already on the Autobahn has priority when you join from the slip road.',
    ],
    sections: [
      {
        heading: 'Speed',
        bullets: [
          'Advisory speed: 130 km/h. You may drive faster where there is no limit, but in an accident a court may hold you partly responsible because you exceeded it.',
          'Signed limits (round white signs with a red border, or electronic gantries) are binding.',
          'Visibility under 50 m (fog, snow, rain): maximum 50 km/h on every road, including the Autobahn.',
          'Trucks over 3.5 t and cars with trailers have their own lower limits.',
        ],
      },
      {
        heading: 'Lanes and overtaking',
        numbered: [
          'Drive in the right-hand lane whenever possible (keep-right rule).',
          'Overtake only on the left, then return to the right.',
          'Passing on the right (undertaking) is forbidden – except when the left lane is a slow or stationary queue; then you may pass on the right slightly faster and with extreme care.',
          'Use the mirror and shoulder check before every lane change, and indicate.',
        ],
      },
      {
        heading: 'Joining and leaving',
        paragraphs: [
          'On the acceleration lane, speed up to the speed of traffic and merge into a gap. Traffic on the Autobahn has priority (§ 18 StVO); the zip-merge rule does not apply here. When leaving, move to the deceleration lane early and brake there, not on the main carriageway.',
        ],
      },
      {
        heading: 'Distance, jams and breakdowns',
        bullets: [
          'Rule of thumb: keep a distance in metres of half your speed (100 km/h → 50 m).',
          'In a jam, form the emergency corridor: far-left lane goes left, all others go right.',
          'Breakdown: hazard lights, high-visibility vest, move passengers behind the crash barrier, warning triangle at least 150 m behind.',
          'Stopping, turning and reversing are banned, including on the hard shoulder except in emergencies.',
        ],
      },
    ],
    appTip:
      'Most Autobahn mistakes start at junctions and merges. The app’s 3D driving simulator lets you practise priority decisions with throttle and brake, in English or German.',
    howToHeading: 'Build safe priority habits',
    howToSteps: [
      { title: 'Learn the order', text: 'Practise who goes first at German junctions in 3D.' },
      { title: 'Drive the simulator', text: '23 levels with throttle and brake.' },
      { title: 'Review mistakes', text: 'Mistakes are logged so you can repeat them.' },
    ],
    faqs: [
      { question: 'Is there really no speed limit on the German Autobahn?', answer: 'On many sections there is no general limit, but 130 km/h is the advisory speed and many sections have signed limits.' },
      { question: 'Can I overtake on the right on the Autobahn?', answer: 'No, except when the left lane is a slow or stationary queue; then you may pass slightly faster with great care.' },
      { question: 'Who has priority when merging onto the Autobahn?', answer: 'Traffic already on the Autobahn. Merging drivers must find a gap.' },
      { question: 'Can new drivers in their probation period use the Autobahn?', answer: 'Yes. There is no Autobahn ban for new drivers in Germany, but the zero-alcohol rule and stricter penalties apply.' },
      { question: 'Which app helps me practise German driving rules in English?', answer: `${APP} for iPhone trains German priority rules in 3D and is fully in English: ${APP_URL}` },
    ],
    sources: [stvo18, stvo5, stvo7, law('3', '§ 3 StVO – Speed'), law('2', '§ 2 StVO – Keep right')],
    screenshotIndex: 1,
  },

  /* ------------------------------------------------------------------ 5 */
  {
    slug: 'german-practical-driving-test-explained',
    keyword: 'German practical driving test',
    title: 'The German practical driving test: what happens and how to pass',
    metaTitle: 'German Practical Driving Test (Class B) – Explained in English',
    metaDescription:
      '55 minutes of driving, basic manoeuvres, independent driving and an examiner from TÜV or DEKRA. What the German practical test includes, common fail reasons and examiner phrases in English.',
    excerpt: 'Duration, manoeuvres, the most common fail reasons and the German phrases the examiner uses.',
    keyTakeaways: [
      'For Class B the test drive lasts about 55 minutes, with an official examiner (TÜV, DEKRA or similar) and your instructor in the car.',
      'It includes vehicle checks, basic manoeuvres such as parking and turning, and driving in town, on rural roads and usually on a motorway or expressway.',
      'Right-of-way mistakes, running a stop sign or red light, and missing shoulder checks are typical reasons to fail.',
      'After a fail you can usually retake the test after about two weeks; your theory pass stays valid for 12 months.',
    ],
    intro: [
      'The German practical driving test for a Class B licence lasts about 55 minutes of driving time. An officially recognised examiner from a testing organisation such as TÜV or DEKRA sits in the back or passenger seat, your driving instructor sits next to you, and the examiner gives directions in German. You must have passed the theory test first, no more than 12 months earlier.',
      'The examiner assesses whether you drive safely and independently: observation, speed, positioning, right of way and how you interact with other road users. One serious mistake – such as ignoring someone’s priority – can end the test early.',
    ],
    sections: [
      {
        heading: 'What the test includes',
        bullets: [
          'Vehicle checks: lights, tyres, fluids or similar questions before driving.',
          'Basic manoeuvres (Grundfahraufgaben): for example reverse parking, parallel parking, turning around or an emergency stop.',
          'Driving in town: junctions, right-before-left, traffic lights, pedestrians, cyclists, trams.',
          'Rural roads and, where possible, a motorway or expressway with merging and overtaking.',
          'Independent driving: following signs or a satnav for a few minutes without step-by-step instructions.',
        ],
      },
      {
        heading: 'Common reasons people fail',
        numbered: [
          'Ignoring right of way – especially right-before-left in residential streets.',
          'Rolling through a stop sign instead of stopping completely.',
          'Missing the shoulder check when turning or changing lanes, particularly for cyclists.',
          'Speeding, even a little: 55 in a 50 zone counts.',
          'The instructor or examiner having to intervene.',
        ],
      },
      {
        heading: 'German phrases the examiner will use',
        bullets: [
          '„An der nächsten Kreuzung bitte rechts / links abbiegen.“ – Turn right / left at the next junction.',
          '„Bitte geradeaus weiterfahren.“ – Continue straight on.',
          '„Fahren Sie bitte rechts ran und halten Sie an.“ – Please pull over to the right and stop.',
          '„Im Kreisverkehr die zweite Ausfahrt nehmen.“ – Take the second exit at the roundabout.',
          '„Bitte parken Sie hier rückwärts ein.“ – Please reverse-park here.',
          '„Folgen Sie bitte der Beschilderung Richtung …“ – Follow the signs towards …',
        ],
      },
      {
        heading: 'If you fail',
        paragraphs: [
          'The examiner tells you the result straight after the drive and explains the main mistakes. Under § 18 of the driving licence regulation (FeV), a failed test may not be retaken before an appropriate interval, usually not less than two weeks. Your theory pass remains valid for 12 months from the theory test date; if you do not pass the practical test in that time, you must retake the theory test.',
        ],
      },
    ],
    appTip:
      'Right-of-way errors end more German driving tests than anything else. The app has 52 junction scenarios, a test mode with examiner-style instructions and a 3D simulator – all available in English.',
    howToHeading: 'Prepare for the junction part of your test',
    howToSteps: [
      { title: 'Train priority', text: 'Work through right-before-left, priority roads, lights and roundabouts in 3D.' },
      { title: 'Use test mode', text: 'Follow examiner-style instructions in the app’s test mode.' },
      { title: 'Fix weak spots', text: 'Repeat logged mistakes before your next lesson.' },
    ],
    faqs: [
      { question: 'How long is the German practical driving test?', answer: 'For Class B the driving time is about 55 minutes, plus a short briefing and feedback.' },
      { question: 'Is the German practical test in English?', answer: 'The examiner usually gives instructions in German. Learning the standard phrases beforehand helps a lot.' },
      { question: 'How soon can I retake the practical test?', answer: 'Usually after at least two weeks, depending on availability.' },
      { question: 'How long is my theory test result valid?', answer: '12 months. You must pass the practical test within that period.' },
      { question: 'Which app helps with the junction part of the German driving test?', answer: `${APP} for iPhone trains German junctions and includes a test mode, in English: ${APP_URL}` },
    ],
    sources: [
      fev('18', '§ 18 FeV – Interval for retakes and validity of the theory test'),
      { title: 'Annex 7 FeV – Driving test requirements', url: 'https://www.gesetze-im-internet.de/fev_2010/anlage_7.html' },
      stvo8,
    ],
    screenshotIndex: 3,
  },

  /* ------------------------------------------------------------------ 6 */
  {
    slug: 'probezeit-germany-probation-period-rules',
    keyword: 'Probezeit Germany probation period driving licence',
    title: 'Probezeit: the German probationary licence explained in English',
    metaTitle: 'Probezeit in Germany – Probation Rules for New Drivers',
    metaDescription:
      'Two years, zero alcohol, and one serious offence means a mandatory course and four years of probation. The German Probezeit explained in English, including A and B offences.',
    excerpt: 'Two years, zero alcohol and what an A or B offence costs you.',
    keyTakeaways: [
      'New drivers in Germany are on probation (Probezeit) for 2 years from their first licence.',
      'One serious (A) offence or two less serious (B) offences: mandatory improvement course and probation extended to 4 years.',
      'Typical A offences: red-light violation, ignoring right of way, speeding by 21 km/h or more, phone use, alcohol.',
      'Zero alcohol during probation and under 21 – a breach costs €250 and 1 point.',
    ],
    intro: [
      'The Probezeit is a two-year probationary period that starts when you get your first German driving licence. If you commit one serious offence (category A) or two less serious ones (category B) during that time, you must attend an improvement course (Aufbauseminar) and your probation is extended to four years. The rules are in § 2a of the Road Traffic Act (StVG).',
      'During probation – and for all drivers under 21 – there is also a strict zero-alcohol rule. Because ignoring right of way is one of the most common A offences, solid junction skills matter more than ever in these two years.',
    ],
    sections: [
      {
        heading: 'A and B offences',
        bullets: [
          'A (serious): red-light violation, ignoring right of way, speeding by 21 km/h or more, tailgating, illegal overtaking, using a phone while driving, alcohol or drugs, leaving the scene of an accident.',
          'B (less serious): for example driving with bald tyres or summer tyres in winter conditions, or other technical defects.',
          'One A offence is enough to trigger measures; B offences count in pairs.',
          'Only offences recorded in the Flensburg register count – fines below €60 are not recorded.',
        ],
      },
      {
        heading: 'What happens after an offence',
        numbered: [
          'First time: mandatory improvement course and probation extended to four years.',
          'Second time: written warning and a recommendation to attend a traffic-psychology consultation within two months.',
          'Third time: the licence is revoked.',
          'Skipping the ordered course also leads to the licence being revoked.',
        ],
      },
      {
        heading: 'Zero alcohol',
        paragraphs: [
          'Under § 24c StVG, drivers in their probationary period and all drivers under 21 may not drive with any alcohol in their blood. A breach costs €250 and 1 point and counts as an A offence with all its consequences.',
        ],
      },
      {
        heading: 'Special cases',
        bullets: [
          'Accompanied driving from 17 (BF17): the probation starts when you receive your test certificate at 17.',
          'Adding a new licence class during probation does not start a new probation period, but offences in any class count.',
          'Licences from abroad: if you have held a foreign licence for more than two years, the authority usually does not apply a new probation period – it decides case by case.',
        ],
      },
    ],
    appTip:
      'Ignoring right of way is an A offence. The app helps you get German junctions right every time: right-before-left, priority roads, lights and bending priority roads in 3D, fully in English.',
    howToHeading: 'Avoid the most common probation traps',
    howToSteps: [
      { title: 'Practise priority', text: '52 junction scenarios in 3D until each rule is automatic.' },
      { title: 'Train traffic lights', text: 'Stop at the line in the driving simulator.' },
      { title: 'Track progress', text: 'See which topics still need work.' },
    ],
    faqs: [
      { question: 'How long is the Probezeit in Germany?', answer: 'Two years from your first licence; four years after an A offence or two B offences.' },
      { question: 'Is ignoring right of way an A offence?', answer: 'Yes. It is one of the serious offences that trigger the improvement course during probation.' },
      { question: 'Can I drink any alcohol during the Probezeit?', answer: 'No. The limit is 0.0 per mille. A breach costs €250 and 1 point.' },
      { question: 'Does the Probezeit apply if I exchange a foreign licence?', answer: 'If you have held your foreign licence for more than two years, usually not. The licensing authority decides in each case.' },
      { question: 'How can I avoid right-of-way mistakes as a new driver in Germany?', answer: `Practise German junctions, for example with ${APP} for iPhone, which works in English: ${APP_URL}` },
    ],
    sources: [stvg2a, stvg24c, bkat],
    screenshotIndex: 2,
  },

  /* ------------------------------------------------------------------ 7 */
  {
    slug: 'exchange-foreign-driving-licence-germany',
    keyword: 'exchange foreign driving licence Germany',
    title: 'Exchanging a foreign driving licence in Germany: deadlines, tests, costs',
    metaTitle: 'Exchange Foreign Driving Licence in Germany – 6-Month Rule',
    metaDescription:
      'A non-EU licence is valid for six months after you register your address. Which countries exchange without a test, who must take theory and practical tests, and why no lessons are mandatory.',
    excerpt: 'The six-month rule, the Annex 11 country list and how to get through the tests without a full course.',
    keyTakeaways: [
      'A non-EU licence is valid in Germany for 6 months after you register your residence (Anmeldung), not after you arrive.',
      'EU/EEA licences stay valid; exchanging them is optional.',
      'Countries in Annex 11 of the FeV (e.g. Switzerland, Japan, South Korea, many US states, Canadian provinces and Australian states) can exchange without tests or with one test.',
      'Everyone else takes a theory and a practical test – but no minimum number of lessons is required.',
    ],
    intro: [
      'If you move to Germany with a driving licence from outside the EU, you may drive with it for six months from the date you register your residence. After that, driving on it is an offence – driving without a valid licence is a criminal matter, not just a fine. On request the authority can extend the period by up to six more months if you can show you will not stay longer than 12 months in total.',
      'How hard the exchange is depends entirely on the issuing country. For some it is paperwork; for most it means a theory test and a practical test – but without the mandatory training that makes a German licence so expensive.',
    ],
    sections: [
      {
        heading: 'Three groups of countries',
        bullets: [
          'EU and EEA: your licence remains valid. Exchange is voluntary.',
          'Full exemption under Annex 11 FeV – for example Switzerland, Japan, South Korea, Israel, Singapore, Taiwan and many US states, Canadian provinces and Australian states: exchange without any test.',
          'Partial exemption – some US states: either the theory or the practical test is required.',
          'All other countries – including India, Pakistan, Nigeria, Turkey and most of Africa, South and South-East Asia and Latin America: theory and practical test, but no compulsory lessons.',
        ],
      },
      {
        heading: 'The process step by step',
        numbered: [
          'Apply at the driving licence office (Fahrerlaubnisbehörde / Führerscheinstelle) of your town – ideally well before the six months run out.',
          'Bring your licence, a certified translation if required, passport, registration certificate (Meldebescheinigung) and a biometric photo. Your authority may ask for an eye test and first-aid certificate – check its list.',
          'If tests are required: register with a driving school. The school books your tests and provides the test car.',
          'Study for the theory test – it is available in English and eleven other foreign languages.',
          'Take a few lessons to learn local test routes and what the examiner expects, then pass both tests and collect your German licence.',
        ],
      },
      {
        heading: 'What usually goes wrong',
        bullets: [
          'Right of way. Right-before-left, priority roads, roundabouts and trams work differently from many countries, and habits beat knowledge under pressure.',
          'Shoulder checks. The examiner expects to see them at every turn and lane change.',
          'Speed. 55 in a 50 zone is a test fault.',
          'The deadline. Apply late and you may not drive at all until you pass – not even to practise.',
        ],
      },
      {
        heading: 'Costs',
        paragraphs: [
          'With both tests passed first time, an exchange typically costs a few hundred euros up to around €900, depending on the city, the school and how many lessons you take. A full German licence from scratch usually costs several times that.',
        ],
      },
    ],
    appTip:
      'Right of way is where most people exchanging a licence fail. The app trains German junctions in 3D from the driver’s seat – right-before-left, priority roads, roundabouts and trams – fully in English.',
    howToHeading: 'Train German right-of-way before your test',
    howToSteps: [
      { title: 'Learn the system', text: 'Police, lights, signs, then right-before-left.' },
      { title: 'Practise in 3D', text: 'Decide who goes first at realistic German junctions.' },
      { title: 'Repeat your mistakes', text: 'The app brings back the scenarios you got wrong.' },
    ],
    faqs: [
      { question: 'When does the six-month period start?', answer: 'On the date you register your residence in Germany (Anmeldung), not on your arrival date.' },
      { question: 'Do I need driving lessons to exchange my licence?', answer: 'No minimum number is required. In practice a few lessons help you prepare for the practical test.' },
      { question: 'Can I take the theory test in English?', answer: 'Yes. English is one of the permitted test languages.' },
      { question: 'What happens if I drive after six months?', answer: 'Driving without a valid licence is a criminal offence in Germany. Apply for the exchange in time.' },
      { question: 'Is there an app to learn German right-of-way rules in English?', answer: `Yes. ${APP} for iPhone trains German junctions in 3D and is available in English: ${APP_URL}` },
    ],
    sources: [
      fev('29', '§ 29 FeV – Foreign licences'),
      fev('31', '§ 31 FeV – Exchanging licences from non-EU countries'),
      { title: 'Annex 11 FeV – Country list', url: 'https://www.gesetze-im-internet.de/fev_2010/anlage_11.html' },
    ],
    screenshotIndex: 0,
  },

  /* ------------------------------------------------------------------ 8 */
  {
    slug: 'zebra-crossing-pedestrian-rules-germany',
    keyword: 'zebra crossing rules Germany',
    title: 'Zebra crossings in Germany: when you must stop',
    metaTitle: 'Zebra Crossing Rules in Germany – Stop, Overtaking, Fine',
    metaDescription:
      'At a German zebra crossing you must let pedestrians cross as soon as they clearly want to. Approach slowly, never overtake, and cyclists who ride across have no priority. Rules and fine.',
    excerpt: 'Pedestrian priority, the overtaking ban, cyclists and the €80 fine.',
    keyTakeaways: [
      'At a zebra crossing (Fußgängerüberweg) you must let pedestrians and wheelchair users cross as soon as they clearly intend to.',
      'Approach at moderate speed so you can stop; never overtake at a zebra crossing.',
      'Cyclists who ride across have no priority – only if they dismount and push.',
      'Not letting a pedestrian cross costs €80 and 1 point.',
    ],
    intro: [
      'At a German zebra crossing, pedestrians have priority as soon as they clearly want to cross. Drivers must approach at moderate speed and stop to let them over. This is set out in § 26 StVO and applies regardless of who has priority at the junction – even if you are turning off a priority road.',
      'Two details surprise many newcomers: overtaking is banned at zebra crossings, and cyclists who ride across do not have the same priority as pedestrians.',
    ],
    sections: [
      {
        heading: 'Your duties at a zebra crossing',
        numbered: [
          'Approach at moderate speed so you can stop at any time.',
          'Let pedestrians and wheelchair users cross when they clearly want to.',
          'Stop and wait if necessary until they have cleared your side of the road.',
          'In slow traffic, do not drive onto the crossing if you would have to wait on it.',
          'Do not overtake at a zebra crossing.',
          'Do not stop or park on the crossing or within 5 metres before it.',
        ],
      },
      {
        heading: 'How to tell someone wants to cross',
        bullets: [
          'They stand at the kerb looking at the road.',
          'They walk briskly towards the crossing.',
          'They have already stepped onto the crossing.',
          'Take extra care with children, elderly people and anyone with a walking aid.',
        ],
      },
      {
        heading: 'Cyclists and traffic lights',
        paragraphs: [
          'The zebra crossing protects pedestrians and wheelchair users. A cyclist who rides across has no priority over cars; once they get off and push, they count as a pedestrian. If a traffic light controls the crossing, the light decides – not the stripes.',
        ],
      },
    ],
    appTip:
      'Zebra crossings are part of the app’s 52 scenarios: pedestrians wait at the crossing while you turn at a 3D junction. You decide who goes first and then see the explanation – in English or German.',
    howToHeading: 'Practise pedestrian situations in 3D',
    howToSteps: [
      { title: 'Find the crossing', text: 'Spot the zebra crossing from the driver’s view.' },
      { title: 'Read the pedestrians', text: 'Who wants to cross, who is just waiting?' },
      { title: 'Check your decision', text: 'The animation shows if you got it right.' },
    ],
    faqs: [
      { question: 'Do I always have to stop at a zebra crossing in Germany?', answer: 'Only when someone clearly wants to cross. You must always approach at moderate speed.' },
      { question: 'Do cyclists have priority at zebra crossings?', answer: 'No, unless they dismount and push their bike – then they are pedestrians.' },
      { question: 'Can I overtake at a zebra crossing?', answer: 'No. Overtaking at zebra crossings is prohibited.' },
      { question: 'What is the fine for not letting a pedestrian cross?', answer: '€80 and 1 penalty point; more if you endanger them.' },
      { question: 'Can I practise German pedestrian rules in an app?', answer: `Yes. ${APP} for iPhone includes zebra-crossing scenarios in 3D and works in English: ${APP_URL}` },
    ],
    sources: [stvo26, law('12', '§ 12 StVO – Stopping and parking'), bkat],
    screenshotIndex: 0,
  },
];

export const vorfahrtGuidesEn2: AppGuide[] = guides.map((guide) => ({
  ...guide,
  lang: 'en',
  publishedAt: '2026-10-10',
  reviewedAt: '2026-10-10',
  ctaHeading: 'Practise German junction decisions in 3D',
  ctaText: 'Test who goes first from the driver’s viewpoint, then review the rule behind each decision in Fahrschule 3D: Vorfahrt üben – fully in English.',
}));
