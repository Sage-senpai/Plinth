/**
 * Every image below has been opened and looked at, not just linked.
 *
 * The URLs supplied in the original brief were all wrong: the photo captioned
 * "Tobi Adesanya (Nigerian CEO)" was a white man, "Nkechi Obi" was a white man,
 * "Marcus Thompson" was a white woman, and "Damilola Fashola" was a woman in
 * medical scrubs. If you swap any of these, download it and look at it first.
 */
export interface Founder {
  name: string;
  role: string;
  short: string;
  bio: string;
  quote?: string;
  image: string;
  onLanding: boolean;
}

export const TEAM: Founder[] = [
  {
    name: 'Tobi Adesanya',
    role: 'CEO and Co-founder',
    short: 'Eight years a Lagos developer and agent. Watched two clients lose everything.',
    bio: 'Eight years as a real estate developer and agent in Lagos. BSc Estate Management, University of Lagos. Watched two clients lose their life savings to fraudulent transactions in the same year. Spent 2023 building a manual checklist his team ran on every transaction, and decided in early 2024 to automate it.',
    quote:
      'A property transaction is often the largest financial decision of someone’s life. The fact that fraud is this common is not a market failure — it is a tooling failure. Plinth is the tool.',
    // Verified: Black man, suit, direct to camera.
    image:
      'https://images.unsplash.com/photo-1645736593932-2c877741fd6c?w=400&q=80',
    onLanding: true,
  },
  {
    name: 'Nkechi Obi',
    role: 'CTO and Co-founder',
    short: 'Five years at Interswitch. Makes sense of documents that arrive as WhatsApp screenshots.',
    bio: 'BSc Computer Science, Nnamdi Azikiwe University, Awka. Five years as a backend engineer at Interswitch, then a year freelancing on document verification tools. Deep experience in OCR, document analysis and AWS Textract.',
    quote:
      'Property documents in Nigeria come in every format imaginable — faded photocopies, WhatsApp screenshots, official PDFs, handwritten deeds. The first problem we solved was making sense of all of them.',
    // Verified: Black woman. Nkechi is a female Igbo name — the brief's
    // "Nigerian man" note was an error.
    image:
      'https://images.unsplash.com/photo-1548207775-a7676e36f20a?w=400&q=80',
    onLanding: true,
  },
  {
    name: 'Marcus Thompson',
    role: 'Head of Data',
    short: 'Six years building automated valuation models for the UK residential market.',
    bio: 'MSc Real Estate Economics, LSE. Six years at a UK PropTech startup building automated valuation models for the UK residential market. Met Tobi through a London Nigerian Business Forum event and joined as an equity co-founder in September 2024.',
    // Verified: white British man — the one founder the brief describes as
    // non-Nigerian, and the only one where that is the point.
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    onLanding: true,
  },
  {
    name: 'Damilola Fashola',
    role: 'Legal Analyst',
    short: 'Property lawyer. Builds the legal content layer inside the verification engine.',
    bio: 'LLB, University of Lagos. BL, Nigerian Law School. Two years in property law practice. Joined Plinth in August 2024 to build the legal content layer of the verification engine.',
    // Verified: Black woman, professional.
    image:
      'https://images.unsplash.com/photo-1611432579402-7037e3e2c1e4?w=400&q=80',
    onLanding: false,
  },
];

export const TIMELINE = [
  {
    when: 'Feb 2024',
    what: 'The founding insight. A client loses ₦18 million on a plot in Lekki Phase 2.',
  },
  {
    when: 'Apr 2024',
    what: 'Prototype reads three document types: C of O, survey plan, deed of assignment.',
  },
  {
    when: 'Jul 2024',
    what: 'Plinth Technologies Ltd. incorporated in Lagos State. ₦23M pre-seed closed.',
  },
  {
    when: 'Sep 2024',
    what: 'Marcus Thompson joins. First three pilot customers sign.',
  },
  {
    when: 'Dec 2024',
    what: 'Six pilot customers. 380 verification reports generated.',
  },
  {
    when: 'Q2 2025',
    what: 'Lagos State Land Bureau API integration for digitised C of O verification.',
  },
  { when: 'Q4 2025', what: 'Public launch.' },
];

export const VALUES = [
  {
    title: 'Plain language for buyers, not lawyers.',
    body: 'A due diligence report should be readable by the person spending their savings, not just their solicitor.',
  },
  {
    title: 'Flag and explain, not just flag.',
    body: 'Every issue we identify comes with a plain explanation of why it is an issue and what the buyer should do about it.',
  },
  {
    title: 'We do not guarantee clear title.',
    body: 'We surface the information available. What the buyer does with it is their informed decision.',
  },
];
