// Shared FAQ content for the German GPA Calculator page.
// Used for both the visible FAQ section (page.tsx) and the FAQPage JSON-LD (layout.tsx).

export const GPA_CONVERTER_FAQS = [
  {
    q: 'How do German universities convert foreign grades?',
    a: 'Most German universities use the Modified Bavarian Formula to convert international grades to the German grading scale (1.0–5.0). This formula considers your grade, the maximum possible grade, and the minimum passing grade from your country\'s system. Our calculator uses this official formula for accurate conversions.',
  },
  {
    q: 'What is the German grading scale?',
    a: 'Germany uses a 1.0 to 5.0 scale where 1.0 is the best (excellent) and 4.0 is the minimum passing grade. Grades above 4.0 are failing. For reference: 1.0–1.5 is "sehr gut" (very good), 1.6–2.5 is "gut" (good), 2.6–3.5 is "befriedigend" (satisfactory), and 3.6–4.0 is "ausreichend" (sufficient).',
  },
  {
    q: 'What GPA do I need to study in Germany?',
    a: 'Requirements vary by university and program. Competitive programs like Computer Science at TU Munich may require grades equivalent to 2.0 or better. Many programs accept students with grades up to 2.5 or 3.0. Some programs have no grade requirements (NC-frei). Use our converter to check where you stand.',
  },
  {
    q: 'How do I convert my US GPA to German grades?',
    a: 'A US 4.0 GPA typically converts to approximately 1.0 on the German scale. A 3.0 GPA converts to around 2.3–2.5, and a 2.0 GPA converts to approximately 3.5–3.7. Our calculator provides precise conversions based on the Modified Bavarian Formula.',
  },
  {
    q: 'How do I convert Indian percentage or CGPA to German grades?',
    a: 'Indian percentages and 10-point CGPA are converted using the Modified Bavarian Formula. Generally, 90%+ converts to around 1.0–1.3, 80–89% to 1.4–2.0, 70–79% to 2.1–2.7, and 60–69% to 2.8–3.5. Our calculator handles the exact conversion for your specific grade.',
  },
  {
    q: 'Is this GPA converter accurate for uni-assist applications?',
    a: 'Our converter uses the same Modified Bavarian Formula that uni-assist and most German universities use. However, final grade conversion is always done officially by the university or uni-assist. Use our tool to estimate your converted grade before applying.',
  },
] as const;
