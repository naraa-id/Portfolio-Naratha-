export type ProjectCategory =
  | 'Arsitektur'
  | 'Konstruksi Lapangan'
  | 'Perencanaan RAB';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  year: string;
  location: string;
  client: string;
  area: string;
  budgetSummary: string;
  summary: string;
  deliverables: string[];
  imageUrl: string;
  featured: boolean;
  ownerUid?: string;
}

export type SaaSDemoType = 'finance' | 'warehouse' | 'water' | 'rab' | 'custom';

export interface SaaSProduct {
  id: string;
  name: string;
  domainLabel: string;
  tagline: string;
  description: string;
  priceLabel: string;
  billingPeriod: string;
  features: string[];
  demoType: SaaSDemoType;
  ownerUid?: string;
}

export interface Poem {
  id: string;
  title: string;
  excerpt: string;
  stanzas: string[];
  theme: string;
  writtenYear: string;
  authorNote?: string;
  ownerUid?: string;
}

export interface SiteProfile {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroImageCaption: string;
  heroImageLocation: string;
  aboutHeading: string;
  aboutBio: string;
  contactEmail: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  ownerUid?: string;
}

export type SectionId =
  | 'beranda'
  | 'portfolio'
  | 'aplikasi'
  | 'puisi'
  | 'tentang';
