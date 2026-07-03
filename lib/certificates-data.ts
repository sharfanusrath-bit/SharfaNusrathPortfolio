export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: 'AI' | 'Development' | 'Cloud' | 'Data' | 'Professional';
  description?: string;
  credential_link?: string;
  image_url?: string;
  featured?: boolean;
}

export const LINKEDIN_CERTIFICATIONS_URL =
  'https://www.linkedin.com/in/sharfa-nusrath-026600378/details/certifications/';

/** Static certificates synced from LinkedIn profile — update here when you add new ones */
export const linkedInCertificates: Certificate[] = [
  {
    id: 'ai-program-1stop',
    title: 'Artificial Intelligence Program',
    issuer: '1Stop.ai',
    date: 'Feb 2026',
    category: 'AI',
    description:
      'Comprehensive AI program covering machine learning fundamentals, model building, and real-world AI application development.',
    credential_link: LINKEDIN_CERTIFICATIONS_URL,
    featured: true,
  },
  {
    id: 'generative-ai-microsoft',
    title: 'Career Essentials in Generative AI',
    issuer: 'Microsoft',
    date: '2025',
    category: 'AI',
    description:
      'Foundational generative AI concepts, responsible AI practices, and practical applications in modern software development.',
    credential_link: LINKEDIN_CERTIFICATIONS_URL,
  },
  {
    id: 'intro-ai-infosys',
    title: 'Introduction to Artificial Intelligence',
    issuer: 'Infosys Springboard',
    date: '2025',
    category: 'AI',
    description:
      'Introduction to AI concepts, neural networks, and intelligent systems with hands-on learning modules.',
    credential_link: LINKEDIN_CERTIFICATIONS_URL,
  },
];

export const categoryStyles: Record<
  Certificate['category'],
  { gradient: string; badge: string; icon: string }
> = {
  AI: {
    gradient: 'from-violet-500/20 via-purple-500/10 to-[#ed6094]/20',
    badge: 'bg-violet-100 text-violet-700',
    icon: '🤖',
  },
  Development: {
    gradient: 'from-blue-500/20 via-cyan-500/10 to-teal-500/20',
    badge: 'bg-blue-100 text-blue-700',
    icon: '💻',
  },
  Cloud: {
    gradient: 'from-sky-500/20 via-indigo-500/10 to-blue-500/20',
    badge: 'bg-sky-100 text-sky-700',
    icon: '☁️',
  },
  Data: {
    gradient: 'from-amber-500/20 via-orange-500/10 to-yellow-500/20',
    badge: 'bg-amber-100 text-amber-700',
    icon: '📊',
  },
  Professional: {
    gradient: 'from-[#ed6094]/20 via-rose-500/10 to-pink-500/20',
    badge: 'bg-rose-100 text-rose-700',
    icon: '🏆',
  },
};
