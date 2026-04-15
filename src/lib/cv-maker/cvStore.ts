import { randomUUID } from 'crypto';

export interface CVExperience {
  role: string;
  company: string;
  period: string;
  description: string;
  bullets: string[];
}

export interface CVEducation {
  school: string;
  degree: string;
  period: string;
}

export interface CVCustomSection {
  title: string;
  content: string;
}

export interface CVData {
  name: string;
  title: string;
  photo: string | null;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: CVExperience[];
  skills: string[];
  education: CVEducation[];
  customSections: CVCustomSection[];
  sectionTitles: {
    summary: string;
    experience: string;
    skills: string;
    education: string;
  };
  nationality?: string;
  dateOfBirth?: string;
  gender?: string;
  linkedin?: string;
}

export interface CV {
  id: string;
  templateId: string;
  data: CVData;
}

const buildSections = (data: Partial<CVData> = {}): CVData => ({
  name: data.name || 'Alex Carter',
  title: data.title || 'Product Designer',
  photo: data.photo || null,
  email: data.email || 'email@example.com',
  phone: data.phone || '+1 (555) 123-4567',
  location: data.location || 'City, Country',
  summary:
    data.summary ||
    'Human-centered designer with 6+ years crafting data-informed experiences across SaaS and consumer platforms.',
  experience:
    data.experience ||
    [
      {
        role: 'Senior Product Designer',
        company: 'Northwind',
        period: '2021 — Present',
        description: '',
        bullets: [
          'Led redesign of onboarding, boosting activation by 28%.',
          'Built component library adopted across 4 product teams.'
        ]
      },
      {
        role: 'UX Designer',
        company: 'Globex',
        period: '2018 — 2021',
        description: '',
        bullets: ['Launched experimentation program', 'Partnered with PMs to define KPI dashboards.']
      }
    ],
  skills: data.skills || ['Design systems', 'Rapid prototyping', 'User interviews', 'Motion design'],
  education:
    data.education || [
      {
        school: 'Pratt Institute',
        degree: 'BFA Communications Design',
        period: '2014 — 2018'
      }
    ],
  customSections: data.customSections || [],
  sectionTitles: data.sectionTitles || {
    summary: 'Summary',
    experience: 'Experience',
    skills: 'Skills',
    education: 'Education'
  }
});

export const createCvStore = () => {
  const items = new Map<string, CV>();

  const create = (payload: { templateId?: string; data?: Partial<CVData> }): string => {
    const id = randomUUID();
    items.set(id, {
      id,
      templateId: payload.templateId || 'aurora',
      data: buildSections(payload.data)
    });
    return id;
  };

  const update = (id: string, payload: { templateId?: string; data?: Partial<CVData> }): boolean => {
    if (!items.has(id)) return false;
    items.set(id, {
      id,
      templateId: payload.templateId || 'aurora',
      data: buildSections(payload.data)
    });
    return true;
  };

  const get = (id: string): CV | undefined => items.get(id);

  return { create, update, get };
};

export const cvStore = createCvStore();
