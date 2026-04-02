export interface Template {
  id: string;
  name: string;
  accent: string;
  background: string;
  fonts: {
    heading: string;
    body: string;
  };
  layout: string;
  role: string;
  description: string;
  previewBackground: string;
  previewText: string;
  previewAccent: string;
  sampleName: string;
  sampleTitle: string;
  sampleSummary: string;
  sampleHighlights: string[];
  hasPhoto: boolean;
  headerStyle: string;
}

export const templates: Template[] = [
  {
    id: 'europass',
    name: 'Europass',
    accent: '#003399',
    background: '#FFFFFF',
    fonts: { heading: 'Arial', body: 'Arial' },
    layout: 'europass',
    role: 'Professional',
    description: 'Official EU format — recognized across Europe',
    previewBackground: '#FFFFFF',
    previewText: '#000000',
    previewAccent: '#003399',
    sampleName: 'Maria Schmidt',
    sampleTitle: 'Software Engineer',
    sampleSummary: 'Experienced developer with expertise in full-stack web applications.',
    sampleHighlights: ['Full-stack development', 'Cloud architecture'],
    hasPhoto: true,
    headerStyle: 'classic'
  },
  { id: 'dark-sidebar', name: 'Dark Sidebar', accent: '#6366F1', background: '#FFFFFF', fonts: { heading: 'Inter', body: 'Inter' }, layout: 'dark-sidebar', role: 'Tech / Engineering', description: 'Dark left panel with photo & skills, white content area', previewBackground: '#FFFFFF', previewText: '#111827', previewAccent: '#6366F1', sampleName: 'Alex Kim', sampleTitle: 'Software Engineer', sampleSummary: 'Full-stack engineer building scalable systems.', sampleHighlights: ['React', 'Node.js'], hasPhoto: true, headerStyle: 'sidebar' },
  { id: 'timeline', name: 'Timeline', accent: '#0EA5E9', background: '#FFFFFF', fonts: { heading: 'Roboto', body: 'Roboto' }, layout: 'timeline', role: 'Any', description: 'Vertical timeline with dots connecting experience entries', previewBackground: '#F0F9FF', previewText: '#0C4A6E', previewAccent: '#0EA5E9', sampleName: 'Jordan Lee', sampleTitle: 'Project Manager', sampleSummary: 'Certified PM with 8 years delivering on time.', sampleHighlights: ['Agile', 'Scrum'], hasPhoto: false, headerStyle: 'timeline' },
  { id: 'top-banner', name: 'Banner Hero', accent: '#7C3AED', background: '#FFFFFF', fonts: { heading: 'Montserrat', body: 'Open Sans' }, layout: 'top-banner', role: 'Creative / Marketing', description: 'Full-width colored banner header with large name and photo', previewBackground: '#FFFFFF', previewText: '#1F2937', previewAccent: '#7C3AED', sampleName: 'Sophie Chen', sampleTitle: 'Marketing Director', sampleSummary: 'Growth strategist scaling brands globally.', sampleHighlights: ['Brand strategy', 'Growth hacking'], hasPhoto: true, headerStyle: 'banner' },
  { id: 'two-column', name: 'Two Column', accent: '#059669', background: '#FFFFFF', fonts: { heading: 'Lato', body: 'Lato' }, layout: 'two-column', role: 'Business / Finance', description: 'Balanced two-column layout splitting skills and experience', previewBackground: '#F9FAFB', previewText: '#111827', previewAccent: '#059669', sampleName: 'Marcus Brown', sampleTitle: 'Financial Analyst', sampleSummary: 'CFA charterholder with 6 years in equity research.', sampleHighlights: ['Financial modeling', 'Valuation'], hasPhoto: false, headerStyle: 'two-col' },
  { id: 'infographic', name: 'Infographic', accent: '#F59E0B', background: '#FFFFFF', fonts: { heading: 'Poppins', body: 'Nunito' }, layout: 'infographic', role: 'Designer / Creative', description: 'Skill bars, icons, and visual sections for creative roles', previewBackground: '#FFFBEB', previewText: '#78350F', previewAccent: '#F59E0B', sampleName: 'Nina Okafor', sampleTitle: 'UX Designer', sampleSummary: 'Human-centered designer with 5 years experience.', sampleHighlights: ['Figma', 'User research'], hasPhoto: true, headerStyle: 'infographic' },
  { id: 'minimal-clean', name: 'Ultra Minimal', accent: '#111827', background: '#FFFFFF', fonts: { heading: 'Helvetica Neue', body: 'Helvetica Neue' }, layout: 'minimal-clean', role: 'Any / ATS-friendly', description: 'Pure white, no color, maximum ATS compatibility', previewBackground: '#FFFFFF', previewText: '#111827', previewAccent: '#111827', sampleName: 'Emma Wilson', sampleTitle: 'Business Analyst', sampleSummary: 'Data-driven analyst driving operational efficiency.', sampleHighlights: ['SQL', 'Excel'], hasPhoto: false, headerStyle: 'ultra-minimal' },
  { id: 'academic-cv', name: 'Academic CV', accent: '#1D4ED8', background: '#FFFFFF', fonts: { heading: 'Georgia', body: 'Georgia' }, layout: 'academic-cv', role: 'Academic / PhD', description: 'Multi-section academic CV with publications and research', previewBackground: '#EFF6FF', previewText: '#1E3A8A', previewAccent: '#1D4ED8', sampleName: 'Dr. Sarah Müller', sampleTitle: 'Research Scientist', sampleSummary: '20+ publications in machine learning and AI.', sampleHighlights: ['20+ publications', 'DFG grant'], hasPhoto: false, headerStyle: 'academic' },
  { id: 'din5008', name: 'DIN 5008', accent: '#374151', background: '#FFFFFF', fonts: { heading: 'Arial', body: 'Arial' }, layout: 'din5008', role: 'German standard', description: 'Official German business format with address field', previewBackground: '#FFFFFF', previewText: '#111827', previewAccent: '#374151', sampleName: 'Thomas Weber', sampleTitle: 'Ingenieur', sampleSummary: 'Erfahrener Ingenieur mit Kenntnissen in Automatisierung.', sampleHighlights: ['Automatisierung', 'CAD'], hasPhoto: true, headerStyle: 'din' },
  { id: 'photo-left', name: 'Photo Left', accent: '#DC2626', background: '#FFFFFF', fonts: { heading: 'Merriweather', body: 'Lato' }, layout: 'photo-left', role: 'Executive / Senior', description: 'Large photo on the left with bold name and title beside it', previewBackground: '#FEF2F2', previewText: '#7F1D1D', previewAccent: '#DC2626', sampleName: 'Robert Gant', sampleTitle: 'Chief Executive Officer', sampleSummary: 'Visionary leader with 20 years driving growth.', sampleHighlights: ['P&L management', 'Strategy'], hasPhoto: true, headerStyle: 'photo-left' },
  { id: 'colored-header', name: 'Colored Header', accent: '#0F766E', background: '#FFFFFF', fonts: { heading: 'Nunito', body: 'Open Sans' }, layout: 'colored-header', role: 'Healthcare / NGO', description: 'Solid teal header block with white text and clean body', previewBackground: '#F0FDFA', previewText: '#134E4A', previewAccent: '#0F766E', sampleName: 'Amara Diallo', sampleTitle: 'Public Health Specialist', sampleSummary: 'WHO-experienced specialist in global health programs.', sampleHighlights: ['Epidemiology', 'Field research'], hasPhoto: true, headerStyle: 'colored-header' },
  { id: 'compact-grid', name: 'Compact Grid', accent: '#7E22CE', background: '#FFFFFF', fonts: { heading: 'Roboto Condensed', body: 'Roboto' }, layout: 'compact-grid', role: 'Developer / Tech', description: 'Dense information grid, perfect for technical profiles', previewBackground: '#FAF5FF', previewText: '#3B0764', previewAccent: '#7E22CE', sampleName: 'Felix Ritter', sampleTitle: 'DevOps Engineer', sampleSummary: 'Cloud-native engineer automating at scale.', sampleHighlights: ['Kubernetes', 'Terraform'], hasPhoto: false, headerStyle: 'grid' },
  { id: 'elegant-serif', name: 'Elegant Serif', accent: '#78350F', background: '#FFFBF5', fonts: { heading: 'Cormorant Garamond', body: 'EB Garamond' }, layout: 'elegant-serif', role: 'Law / Consulting', description: 'Warm cream background with luxurious serif typography', previewBackground: '#FFFBF5', previewText: '#451A03', previewAccent: '#78350F', sampleName: 'Charlotte Voss', sampleTitle: 'Corporate Lawyer', sampleSummary: 'Counsel at Magic Circle firms with M&A expertise.', sampleHighlights: ['M&A', 'Capital markets'], hasPhoto: false, headerStyle: 'elegant' },
  { id: 'split-color', name: 'Split Color', accent: '#EC4899', background: '#FFFFFF', fonts: { heading: 'Space Grotesk', body: 'Inter' }, layout: 'split-color', role: 'Creative / Startup', description: 'Half-colored page split: vibrant left, white right', previewBackground: '#FDF2F8', previewText: '#1F2937', previewAccent: '#EC4899', sampleName: 'Lena Bauer', sampleTitle: 'Brand Strategist', sampleSummary: 'Award-winning brand builder for global companies.', sampleHighlights: ['Brand identity', 'Campaigns'], hasPhoto: true, headerStyle: 'split' },
  { id: 'modern-tech', name: 'Modern Tech', accent: '#10B981', background: '#F8FAFC', fonts: { heading: 'JetBrains Mono', body: 'Inter' }, layout: 'modern-tech', role: 'Software / Data', description: 'Dark header bar, monospace name, tech-forward grid layout', previewBackground: '#F8FAFC', previewText: '#111827', previewAccent: '#10B981', sampleName: 'Kai Nakamura', sampleTitle: 'Data Engineer', sampleSummary: 'Pipeline architect processing billions of events daily.', sampleHighlights: ['Apache Spark', 'BigQuery'], hasPhoto: false, headerStyle: 'tech' },
  { id: 'ats-classic', name: 'ATS Classic', accent: '#2563EB', background: '#FFFFFF', fonts: { heading: 'Arial', body: 'Arial' }, layout: 'ats-classic', role: 'Any / ATS-friendly', description: 'Single-column chronological layout optimized for screening systems', previewBackground: '#FFFFFF', previewText: '#111827', previewAccent: '#2563EB', sampleName: 'Daniel Hoffmann', sampleTitle: 'Operations Analyst', sampleSummary: 'Analytical operator improving process quality and reporting cadence.', sampleHighlights: ['Process improvement', 'Reporting'], hasPhoto: false, headerStyle: 'classic' },
  { id: 'student-first', name: 'Student First', accent: '#0F766E', background: '#FFFFFF', fonts: { heading: 'Inter', body: 'Inter' }, layout: 'student-first', role: 'Student / Graduate', description: 'Education-first layout for internships, graduates, and early-career roles', previewBackground: '#F0FDFA', previewText: '#134E4A', previewAccent: '#0F766E', sampleName: 'Lea Schneider', sampleTitle: 'M.Sc. Applicant', sampleSummary: 'Recent graduate highlighting coursework, projects, and internships.', sampleHighlights: ['Coursework', 'Projects'], hasPhoto: false, headerStyle: 'student' },
  { id: 'hybrid-pro', name: 'Hybrid Pro', accent: '#7C3AED', background: '#FFFFFF', fonts: { heading: 'Inter', body: 'Inter' }, layout: 'hybrid-pro', role: 'Engineering / Product', description: 'Balanced skills-and-experience resume for technical and hybrid roles', previewBackground: '#FAF5FF', previewText: '#3B0764', previewAccent: '#7C3AED', sampleName: 'Omar Rahman', sampleTitle: 'Product Engineer', sampleSummary: 'Builder blending technical delivery, product thinking, and execution.', sampleHighlights: ['Systems thinking', 'Stakeholder management'], hasPhoto: false, headerStyle: 'hybrid' },
  { id: 'executive-brief', name: 'Executive Brief', accent: '#1F2937', background: '#FFFFFF', fonts: { heading: 'Merriweather', body: 'Open Sans' }, layout: 'executive-brief', role: 'Leadership / Senior', description: 'Compact executive summary with core competencies and impact-led experience', previewBackground: '#F9FAFB', previewText: '#111827', previewAccent: '#1F2937', sampleName: 'Helena Kraus', sampleTitle: 'Chief Operating Officer', sampleSummary: 'Senior leader driving transformation, efficiency, and growth.', sampleHighlights: ['Leadership', 'Transformation'], hasPhoto: false, headerStyle: 'executive' },
  { id: 'consulting-clean', name: 'Consulting Clean', accent: '#0B3B82', background: '#FFFFFF', fonts: { heading: 'Calibri', body: 'Calibri' }, layout: 'consulting-clean', role: 'Consulting / Strategy', description: 'Structured clean format with concise impact sections for consulting applications', previewBackground: '#EFF6FF', previewText: '#1E3A8A', previewAccent: '#0B3B82', sampleName: 'Jonas Becker', sampleTitle: 'Strategy Consultant', sampleSummary: 'Structured problem-solver focused on measurable business results.', sampleHighlights: ['Problem solving', 'Client delivery'], hasPhoto: false, headerStyle: 'consulting' }
];
