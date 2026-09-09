/**
 * All site copy, transcribed verbatim from nexasoftech.com.
 * Change BRAND here to rebrand the whole site in one place.
 */
export const BRAND = 'Alikima';

export const CONTACT = {
  email: 'contact@alikima.com',
  phone: '(+91) 99258 76005',
  address: 'A-510, Dev Aashish Pride & Plaza, Hanspura Crossroad, Naroda, Ahmedabad, Gujarat 382330',
};

export const SERVICE_LINKS = [
  'Product Engineering',
  'Custom Web Applications',
  'SaaS Product Development',
  'AI Development & Automation',
  'Cloud & DevOps',
  'Rescue & Modernization',
] as const;

/** The nine services listed in the header mega menu. */
export const MENU_SERVICES = [
  { icon: 'layers-window', title: 'Product Engineering' },
  { icon: 'code', title: 'Custom Web Applications' },
  { icon: 'stack', title: 'SaaS Product Development' },
  { icon: 'sparkles', title: 'AI Development & Automation' },
  { icon: 'cloud', title: 'Cloud & DevOps' },
  { icon: 'monitor', title: 'Rescue & Modernization' },
  { icon: 'link', title: 'API & Systems Integration' },
  { icon: 'user-code', title: 'Hire Dedicated Developers' },
  { icon: 'support', title: 'Maintenance & Support' },
] as const;

export const MENU_FOOTNOTE = 'One partner from discovery to production support.';

/** Promo rail on the right of the services mega menu. */
export const MENU_PROMO = {
  eyebrow: 'Not Sure Where to Start',
  title: 'Bring the Problem, Leave with a Plan.',
  body: 'A free 30 minute call to talk through scope, architecture and timeline.',
  cta: 'Book a call',
};

/** `to` starting with "/" is a route; "#" is a section on the homepage. */
export const ABOUT_LINKS = [
  { title: 'About us', body: 'Who we are and how we work.', to: '#why' },
  { title: 'Careers', body: 'Open engineering roles.', to: '/careers' },
] as const;

export const NAV = [
  { label: 'Services', href: '#services', menu: 'services' as const },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#why', menu: 'about' as const },
  { label: 'Blog', href: '#insights' },
  { label: 'Contact', href: '#contact' },
] as const;

export const HERO = {
  titleLead: 'Built in India,',
  titlePrefix: 'hosted in',
  /** Cycled one at a time under "hosted in". */
  places: ['Europe', 'Australia', 'Germany', 'Turkey', 'Poland', 'Canada'],
  cta: 'Talk to an Expert',
  note: '30-minute technical call with an engineer. No pressure. No sales pitch.',
};

/** Draggable board in the hero. Reads like a real sprint, not lorem. */
export const HERO_BOARD = [
  {
    id: 'backlog',
    title: 'Backlog',
    cards: [
      { id: 'c1', title: 'Multi-tenant billing', tag: 'Payments', who: 'RS' },
      { id: 'c2', title: 'Rate limit the API gateway', tag: 'Platform', who: 'AK' },
    ],
  },
  {
    id: 'progress',
    title: 'In progress',
    cards: [
      { id: 'c3', title: 'Stripe webhook retries', tag: 'Payments', who: 'MJ' },
      { id: 'c4', title: 'Postgres read replica', tag: 'Infra', who: 'RS' },
    ],
  },
  {
    id: 'shipped',
    title: 'Shipped',
    cards: [
      { id: 'c5', title: 'SSO with Okta', tag: 'Auth', who: 'AK' },
      { id: 'c6', title: 'CI cache: 4m to 90s', tag: 'DevOps', who: 'MJ' },
    ],
  },
];

export const HERO_PIPELINE = {
  env: 'production',
  version: 'v2.14.0',
  steps: ['Build', 'Test', 'Scan', 'Deploy'],
  metrics: [
    { label: 'Uptime', value: '99.98%' },
    { label: 'p95', value: '142ms' },
    { label: 'Coverage', value: '87%' },
  ],
};

export const STATS = {
  title: 'Small Team. Real Production Experience.',
  link: 'See Our Work',
  items: [
    { value: 30, label: 'Projects completed' },
    { value: 15, label: 'Clients served' },
    { value: 8, label: 'Countries served' },
    { value: 9, label: 'Services offered' },
    { value: 2, label: 'Years building' },
  ],
};

export const SERVICES = {
  eyebrow: 'What We Do',
  title: 'Engineering Services, End to End.',
  lede: 'One engineering team across every practice. Most clients start with one and keep us for the rest.',
  cta: 'See All Services',
  items: [
    { icon: 'layers-window', title: 'Product Engineering', body: 'Discovery, architecture, build and release, owned end to end by one team.' },
    { icon: 'code', title: 'Custom Web Applications', body: 'Business platforms built to your workflow, not a template.' },
    { icon: 'stack', title: 'SaaS Product Development', body: 'Multi-tenant products with billing, roles and analytics built in.' },
    { icon: 'sparkles', title: 'AI Development & Automation', body: 'LLM features, agents and workflow automation on your own data.' },
    { icon: 'cloud', title: 'Cloud & DevOps', body: 'CI/CD, infrastructure as code and cost-aware cloud architecture.' },
    { icon: 'monitor', title: 'Rescue & Modernization', body: 'Stabilize a legacy or unfinished build and cut the tech debt.' },
  ],
};

export const WHY = {
  eyebrow: `Why ${BRAND}`,
  title: 'An Engineering Team That Owns the Outcome.',
  body: 'We take technical ownership from architecture to production, with direct communication, clear accountability, and no unnecessary layers.',
  pills: ['You own the code', 'You own the cloud accounts', 'No vendor lock-in'],
  cta: 'How We Work',
  points: [
    { n: '01', title: 'Technical Ownership', body: 'A senior engineering team owns your architecture, code, and releases. You work directly with the people building your product.' },
    { n: '02', title: 'Production First', body: 'Monitoring, CI/CD, security, testing, and documentation are built into the development process from day one.' },
    { n: '03', title: 'Full Transparency', body: 'Your codebase, cloud accounts, and infrastructure remain under your control, with visibility into every important technical decision.' },
    { n: '04', title: 'Flexible Engagements', body: 'Choose the model that fits your needs, from fixed-scope projects and dedicated teams to long-term partnerships and white-label development.' },
  ],
};

export const PROCESS = {
  eyebrow: 'How We Work',
  title: 'A Process You Can Follow, Not a Black Box.',
  lede: 'A clear, structured process that keeps you informed, involved, and confident at every stage.',
  stages: [
    { key: 'Discover', sub: 'Scope', title: 'Discover', body: 'We understand your goals, users, business needs, and existing systems, then define what matters most.', gets: ['Scope document', 'Effort estimate', 'Risk assessment'] },
    { key: 'Plan', sub: 'Roadmap', title: 'Scope / Plan', body: 'We create a clear delivery roadmap covering priorities, milestones, responsibilities, and risks.', gets: ['Delivery roadmap', 'Milestone plan', 'Responsibility matrix'] },
    { key: 'Design', sub: 'Architecture', title: 'Design / Architecture', body: 'We define the system architecture, data model, and user flows before development begins.', gets: ['System architecture', 'Data model', 'User flows'] },
    { key: 'Build', sub: 'Development', title: 'Build / Development', body: 'We develop in the open, with working software, regular updates, and full access to your codebase.', gets: ['Working software', 'Regular updates', 'Full repo access'] },
    { key: 'Ship', sub: 'CI/CD', title: 'Ship / CI-CD', body: 'We set up deployment pipelines, environments, monitoring, and security checks for reliable releases.', gets: ['Deployment pipeline', 'Environments', 'Monitoring and alerts'] },
    { key: 'Test', sub: 'QA', title: 'Test / QA', body: 'We combine automated and manual testing to catch issues before they reach your users.', gets: ['Automated tests', 'Manual QA passes', 'Bug reports'] },
    { key: 'Review', sub: 'Feedback', title: 'Review / Feedback', body: 'We review each release with you, gather feedback, and use it to guide the next iteration.', gets: ['Release review', 'Feedback log', 'Next iteration plan'] },
    { key: 'Support', sub: 'Maintenance', title: 'Support / Maintenance', body: 'We provide ongoing monitoring, fixes, improvements, and technical support after launch.', gets: ['Ongoing monitoring', 'Fixes and improvements', 'Technical support'] },
  ],
};

export const WORK = {
  eyebrow: 'Featured Work',
  title: 'Products We Took from Idea to Production.',
  lede: 'Explore the problems we solved, the decisions we made, and the impact our work delivered.',
  cta: 'See All Our Work',
  items: [
    {
      name: 'Giveable',
      tags: ['Fundraising', 'SaaS platform'],
      tagline: 'AI-powered fundraising for non-profits and creators',
      body: 'A donor engagement platform that combines branded donation experiences with intelligent automation, so organisations raise more while doing less manual work.',
      metrics: [
        { value: '2.4x', label: 'more recurring donors' },
        { value: '60%', label: 'less manual admin' },
      ],
      stack: 'Next.js · React · Node.js · Express',
      link: 'Read the case study',
    },
    {
      name: 'Bookify',
      tags: ['AI Document Intelligence'],
      tagline: 'Chat with any document, book, site or video',
      body: 'An AI knowledge platform that turns PDFs, books, websites and video into a conversation, so people get answers without searching through the source themselves.',
      metrics: [{ value: '15s', label: 'to a cited answer' }],
      stack: 'Next.js · React · Node.js',
      link: 'Case study',
    },
    {
      name: 'Boltify',
      tags: ['Lead Automation'],
      tagline: 'Lead discovery and outreach, automated end to end',
      body: 'A sales automation platform that finds prospects from Google Maps data, then runs outreach, follow-ups and scheduling from one place.',
      metrics: [{ value: '3x', label: 'more qualified meetings' }],
      stack: 'Next.js · React · Node.js',
      link: 'Case study',
    },
  ],
};

export const INDUSTRIES = {
  eyebrow: 'Industries',
  title: 'We Learn Your Domain Before We Write Code.',
  lede: 'We understand your industry, workflows, and challenges to build software that fits your business.',
  items: [
    { icon: 'stack', title: 'SaaS & Software', sub: 'Multi-tenant platforms' },
    { icon: 'card', title: 'Fintech', sub: 'Payments and compliance' },
    { icon: 'heart', title: 'Healthcare & MedTech', sub: 'HIPAA-ready systems' },
    { icon: 'bag', title: 'E-commerce & Retail', sub: 'Storefronts and order flow' },
    { icon: 'building', title: 'Real Estate & PropTech', sub: 'Listings, CRM and portals' },
    { icon: 'cap', title: 'Education & EdTech', sub: 'Learning platforms' },
    { icon: 'truck', title: 'Logistics & Supply Chain', sub: 'Tracking and dispatch' },
    { icon: 'send', title: 'Travel & Hospitality', sub: 'Booking engines' },
    { icon: 'factory', title: 'Manufacturing', sub: 'ERP and shop floor tools' },
    { icon: 'play', title: 'Media & Entertainment', sub: 'Content and streaming' },
    { icon: 'speaker', title: 'Marketing & Agencies', sub: 'White label delivery' },
    { icon: 'users', title: 'HR & Recruitment', sub: 'ATS and onboarding' },
  ],
};

export const GLOBAL = {
  eyebrow: 'Global Coverage',
  title: 'Built in India. Trusted Worldwide.',
  lede: 'We work with startups, agencies, and businesses worldwide, delivering reliable engineering from India across time zones.',
  // lat/long drive the globe projection
  countries: [
    { name: 'India', lat: 21, lon: 79, home: true },
    { name: 'United States', lat: 39, lon: -98 },
    { name: 'Poland', lat: 52, lon: 19 },
    { name: 'Canada', lat: 56, lon: -106 },
    { name: 'Germany', lat: 51, lon: 10 },
    { name: 'Australia', lat: -25, lon: 133 },
    { name: 'United Kingdom', lat: 54, lon: -2 },
    { name: 'Turkey', lat: 39, lon: 35 },
  ],
};

export const TECH = {
  eyebrow: 'Technologies',
  title: 'The Stack, Layer by Layer.',
  lede: 'We pick the stack after we understand the problem, and we tell you why. Nothing exotic that only we can maintain.',
  rows: [
    { label: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Vue', 'Angular', 'Tailwind', 'Nuxt', 'Redux', 'Vite', 'Sass'] },
    { label: 'Backend', items: ['Node.js', 'Express', 'NestJS', 'Laravel', 'PHP', 'Python', 'Java', 'Prisma', 'Sequelize', 'Socket.IO', 'Strapi'] },
    { label: 'Database', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Supabase', 'Firebase', 'DynamoDB', 'SQLite', 'ClickHouse', 'Typesense'] },
    { label: 'Cloud platforms', items: ['AWS', 'Azure', 'DigitalOcean', 'Vercel', 'Google Cloud'] },
    { label: 'DevOps', items: ['Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab', 'Postman'] },
    { label: 'AI', items: ['OpenAI', 'Claude', 'Copilot', 'Gemini', 'Cursor'] },
    { label: 'Integrations', items: ['Stripe', 'Kafka', 'RabbitMQ', 'Razorpay', 'PayPal', 'Zapier'] },
  ],
};

export const ENGAGE = {
  eyebrow: 'How We Engage',
  title: 'Three Ways to Work with Us.',
  lede: 'Choose the engagement model that fits your product, team, and goals. Scale or change the model as your needs evolve.',
  items: [
    {
      tag: 'Model 1',
      title: 'Fixed Scope',
      sub: 'You know exactly what you need built.',
      body: 'Clear deliverables, agreed pricing, and defined milestones for well-scoped projects or modules.',
      features: ['Defined scope and deliverables', 'Milestone-based payments', 'Documentation and handover'],
    },
    {
      tag: 'Model 2',
      title: 'Dedicated Team',
      sub: 'You need engineering capacity that stays.',
      body: 'A dedicated team focused on your product, working with your tools, processes, and roadmap.',
      features: ['Monthly engagement', 'Direct access to engineers', 'Flexible team scaling'],
    },
    {
      tag: 'Model 3',
      title: 'White Label',
      sub: 'You need an engineering team behind your brand.',
      body: 'We work under your brand, in your repositories, and stay behind the scenes while you own the client relationship.',
      features: ['Your brand and workflows', 'NDA and IP assignment', 'We stay behind the scenes'],
    },
  ],
};

export const TESTIMONIALS = {
  eyebrow: 'Clients',
  title: 'What the People Who Hired Us Say.',
  items: [
    { quote: 'My react project was delivered much faster than expected with higher quality than asked for', name: 'Verified client', role: 'Founder' },
    { quote: 'Great communicator excellent results', name: 'Tony Sampheri', role: 'Founder, Trading Platform' },
    { quote: 'Vijay and his team did great job for our clinic website, I see his expertise and knowledge about implementing ideas with the latest technology, very excellent job done by you guys.', name: 'Pratik Kansagara', role: 'Owner, Care Homeopathy Clinic' },
    { quote: 'Excellent developer with strong expertise in building SASS products, React/Next.js, Node.js, and Stripe integration. Delivered high-quality work on time with clear communication and professionalism. Would highly recommended', name: 'Verified client', role: 'Founder' },
    { quote: 'Excellent work, would highly recommend', name: 'Verified client', role: 'Founder, Social Proof App' },
    { quote: 'Great work!!!', name: 'Eugene Gelfand', role: 'Founder, Pixel Perfect Creation' },
  ],
};

export const FAQS = {
  eyebrow: 'Questions',
  title: 'Answers Before You Ask.',
  lede: 'If something here is not covered, ask us on the call. We answer technical questions directly.',
  items: [
    { q: 'How do we start working together?', a: 'A 30 minute call where you describe the product and we ask the technical questions that matter. After that you get a written scope, an estimate and a delivery plan, usually within two working days. Nothing is billed until you approve it.' },
    { q: 'Who actually writes the code?', a: 'The senior engineers you meet on the first call. We do not hand work down to juniors after the sale, and there is no account manager sitting between you and the people building your product.' },
    { q: 'Do we own the code and the infrastructure?', a: 'Yes, from the first commit. The repository, the cloud accounts and the domain are yours, and we work inside them. There is no proprietary layer that forces you to stay with us.' },
    { q: 'What if we already have a codebase in bad shape?', a: 'That is a large part of what we do. We audit it, tell you honestly what is worth keeping, then stabilise and modernise it rather than pushing a rewrite you do not need.' },
    { q: 'How do you handle security and confidentiality?', a: 'NDA before anything technical is shared, least privilege access to your systems, secrets kept out of the repository, and dependency and vulnerability checks as part of the pipeline rather than a one off audit.' },
    { q: 'Can you work with our in-house team?', a: 'Yes. We join your standups, your board and your review process, and we follow your standards. Many clients use us as extra senior capacity rather than a separate vendor.' },
  ],
};

export const INSIGHTS = {
  eyebrow: 'Insights',
  title: 'Notes from the Build.',
  lede: 'Practical lessons from building, scaling, and improving software, shared by the engineers doing the work.',
  cta: 'Read All Articles',
  items: [
    {
      category: 'E-commerce SEO',
      date: '21 May 2026',
      read: '5 min read',
      title: 'The Shopify AI SEO Guide: How to Get Your Store Cited on ChatGPT & Gemini',
      body: 'Shoppers no longer type three-word keywords into Google. They ask ChatGPT, Gemini, and Perplexity full conversational questions like "find me an eco-friendly leather wallet on Shopify under $50 with fast shipping."',
      hue: 205,
    },
    {
      category: 'Software Development',
      date: '21 Apr 2026',
      read: '3 min read',
      title: 'How to Choose the Right Tech Stack for Your Startup in 2026',
      body: 'Choosing the right tech stack is one of the most critical decisions for any startup. In 2026, the technology landscape is evolving rapidly, with new frameworks, AI tools, and cloud solutions emerging constantly.',
      hue: 175,
    },
    {
      category: 'AI Development',
      date: '20 Apr 2026',
      read: '3 min read',
      title: 'AI-Powered SaaS: How Modern SaaS Products Are Embedding AI for Competitive Advantage',
      body: 'The SaaS industry is undergoing a major transformation as artificial intelligence becomes a core part of modern software products. In 2026, successful SaaS platforms are no longer just feature-rich, they are intelligent, adaptive, and data-driven.',
      hue: 145,
    },
  ],
};

export const RECOGNITION = {
  title: 'Recognised Where It Counts',
  lede: 'Independent checks and platform partnerships, earned through delivered work.',
  items: [
    { title: 'Certified by BusinessFirms', kind: 'businessfirms' as const },
    { title: 'Shopify Partner', kind: 'shopify' as const },
  ],
};

export const CONTACT_SECTION = {
  eyebrow: 'Contact',
  title: 'Tell Us What You Are Building.',
  lede: 'Bring the problem, the half finished codebase, or just the idea. We will tell you honestly what it takes.',
  submit: 'Send Message',
  note: 'Reply within one business day.',
};

export const NEWSLETTER = {
  eyebrow: 'Newsletter',
  title: 'Engineering Notes, Once a Month.',
  body: 'What we learn shipping, scaling and rescuing products. No sales mail, unsubscribe in one click.',
  cta: 'Subscribe',
};

export const FOOTER = {
  company: [
    { label: 'About us', to: '#why' },
    { label: 'Work', to: '#work' },
    { label: 'Blog', to: '#insights' },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact', to: '#contact' },
  ],
  legal: ['Privacy policy', 'Terms and conditions'],
  copyright: `© 2026 ${BRAND}. All rights reserved.`,
};

/* ── Careers page ─────────────────────────────────────────────────────────
   Transcribed verbatim from nexasoftech.com/careers.                       */
export const CAREERS_EMAIL = `careers@${BRAND.toLowerCase()}.com`;

export const CAREERS_HERO = {
  eyebrow: 'Careers',
  title: 'Small Team. Large Surface Area.',
  body: 'We are early, which means the work is broad and the decisions are yours to make. If you want to build products end to end rather than fill in tickets, this is a good place to be.',
  primary: 'Send an Open Application',
  secondary: 'See How Hiring Works',
  centre: 'You here',
  orbit: ['Ship in week one', 'Own the feature', 'Talk to clients'],
};

export const CAREERS_STATUS = {
  title: 'No Open Roles This Month',
  body: 'We hire when the work is there, not to fill a headcount plan. Open applications still get read.',
  stats: [
    { value: '5 days', label: 'to a reply, either way' },
    { value: '6 months', label: 'we keep your application on file' },
    { value: 'Onsite', label: 'we work together, in one office' },
  ],
};

export const CAREERS_WORK = {
  eyebrow: 'The Work',
  title: 'What the Job Actually Gives You.',
  lede: 'The things that actually shape a career, not a list of snacks.',
  items: [
    { icon: 'trend', title: 'Career growth', body: 'A clear path from where you are now to where you want to be, reviewed openly every six months rather than whenever someone remembers.' },
    { icon: 'mentor', title: 'Senior mentorship', body: 'Every pull request is read by someone more experienced, with comments that explain the reasoning rather than just the fix.' },
    { icon: 'ownership', title: 'Real ownership', body: 'You take features end to end, from schema to release, and your name stays on the work after it ships.' },
    { icon: 'stack', title: 'Modern stack', body: 'React, Node, TypeScript, Python, AWS and Docker. We upgrade deliberately and pay down debt instead of talking about it.' },
    { icon: 'network', title: 'Build real products', body: 'Not internal tools nobody uses. The things you build go live and are used by people who notice when they break.' },
    { icon: 'balance', title: 'Balance that is real', body: 'Sensible hours, protected weekends, and Friday afternoons kept for learning rather than for catching up.' },
  ],
};

export const CAREERS_FIT = {
  eyebrow: 'Fit',
  title: 'Honest About Who Thrives Here.',
  lede: 'A small team amplifies both fit and mismatch. Read both columns before you write to us.',
  good: {
    title: 'You Will Do Well Here If',
    items: [
      'You would rather ask a blunt question than guess quietly',
      'You read the error message before you paste it into a search box',
      'You care that the thing works for the person using it',
      'You can take a review comment without taking it personally',
      'You are curious about the parts of the stack that are not your job',
    ],
  },
  bad: {
    title: 'This Is Probably Not for You If',
    items: [
      'You want a fixed ticket queue and no contact with clients',
      'You prefer a large team where responsibility is shared thinly',
      'You are looking for a title more than the work behind it',
      'You want to specialise narrowly and never touch anything else',
    ],
  },
};

export const CAREERS_HIRING = {
  eyebrow: 'Hiring',
  title: 'Five Steps, No Black Box.',
  lede: 'Two to three weeks end to end, and you always know where you stand.',
  steps: [
    { n: '01', title: 'Apply', body: 'Send your CV and anything you have built. A person reads it, and you hear back either way inside five working days.' },
    { n: '02', title: 'Intro call', body: 'Thirty minutes with an engineer, not a recruiter. What you have built, what you want next, how we work.' },
    { n: '03', title: 'Technical conversation', body: 'Ninety minutes on real problems, no whiteboard puzzles. We look at your code and talk about the decisions in it.' },
    { n: '04', title: 'Test task', body: 'A small, scoped piece of real work, done in your own time and reviewed like any other pull request.' },
    { n: '05', title: 'Offer', body: 'Numbers, role and start date in writing within two days of the last conversation.' },
  ],
  rolesTitle: 'Roles We Hire For',
  rolesBody: 'Nothing is open today. Tell us which of these fits you and we will come back to you first when it opens.',
  rolesPill: 'Open applications welcome',
  roles: [
    'Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'DevOps Engineer',
    'QA Engineer', 'AI Engineer', 'UI Designer', 'Project Manager', 'Internships',
  ],
};

export const CAREERS_APPLY = {
  eyebrow: 'Open Application',
  title: 'Write to Us Before a Role Exists.',
  lede: 'Send what you have built and what you want to build next. One of the founders reads it.',
  dropTitle: 'Drag and drop your CV here, or click to browse',
  dropNote: 'PDF only, up to 10 MB',
  submit: 'Send Application',
};

export const CAREERS_FAQS = {
  eyebrow: 'Candidate Questions',
  title: 'Things People Ask Us.',
  items: [
    { q: 'There are no openings. Should I still apply?', a: 'Yes, and it is the best time to. We read every open application, keep it on file for six months, and reach out first when a role opens. Several of our conversations started this way.' },
    { q: 'Do you hire freshers and interns?', a: 'We do, in small numbers, because mentoring properly takes time. Show us something you built and can explain end to end. A finished small project beats a long list of tutorials.' },
    { q: 'Is the role onsite or remote?', a: 'The role is onsite. We are a small team and the work moves faster when we are in the same office.' },
    { q: 'How quickly will I hear back?', a: 'Within five working days of applying, and within two days after each conversation. If the answer is no, you get the reason.' },
    { q: 'What should I send along with my CV?', a: 'A repository, a live product, or a short write-up of something you built and what was hard about it. We care far more about that than about formatting.' },
  ],
};
