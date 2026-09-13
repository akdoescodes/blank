/**
 * All site copy, transcribed verbatim from nexasoftech.com.
 * Change BRAND here to rebrand the whole site in one place.
 */
export const BRAND = 'Aglowtechlabs';

export const CONTACT = {
  email: 'contact@aglowtechlabs.com',
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

/** Portrait culture cards that sit between the hero and the services grid. */
export const CULTURE = {
  eyebrow: `Inside ${BRAND}`,
  title: 'An Agile Team That Ships Like One.',
  items: [
    { img: '/img/culture/agile-sprint-review.webp', tag: 'Agile', title: 'Two-week sprints, open', body: 'A demo at the end of every sprint and a backlog you can see. You always know what shipped and what is next.' },
    { img: '/img/culture/studio-desks.webp', tag: 'The studio', title: 'One room, no handoffs', body: 'Engineers, designers and the founders sit together, so a decision takes minutes rather than a thread, not a meeting.' },
    { img: '/img/culture/craft-review.webp', tag: 'Craft', title: 'Reviewed before it ships', body: 'Every pull request is read by a senior engineer, tests run before merge, and refactors get booked like features.' },
    { img: '/img/culture/design-wireframes.webp', tag: 'Design', title: 'Brand and build, one team', body: 'Design systems, not screenshots. What gets designed is what gets built, down to the spacing, the states and the edge cases.' },
  ],
};

export const SERVICES = {
  eyebrow: 'What We Do',
  title: 'Engineering Services, End to End.',
  lede: 'One engineering team across every practice. Most clients start with one and keep us for the rest.',
  cta: 'See All Services',
  items: [
    { icon: 'layers-window', title: 'Product Engineering', body: 'Discovery, architecture, build and release, owned end to end by one team.' , points: ['Discovery and scoping', 'System architecture', 'Release and handover'] },
    { icon: 'code', title: 'Custom Web Applications', body: 'Business platforms built to your workflow, not a template.' , points: ['Workflow mapping', 'Role-based access', 'Reporting and exports'] },
    { icon: 'stack', title: 'SaaS Product Development', body: 'Multi-tenant products with billing, roles and analytics built in.' , points: ['Multi-tenant data model', 'Billing and plans', 'Usage analytics'] },
    { icon: 'sparkles', title: 'AI Development & Automation', body: 'LLM features, agents and workflow automation on your own data.' , points: ['Retrieval over your data', 'Agent workflows', 'Evaluation and guardrails'] },
    { icon: 'cloud', title: 'Cloud & DevOps', body: 'CI/CD, infrastructure as code and cost-aware cloud architecture.' , points: ['CI/CD pipelines', 'Infrastructure as code', 'Cost and monitoring'] },
    { icon: 'monitor', title: 'Rescue & Modernization', body: 'Stabilize a legacy or unfinished build and cut the tech debt.' , points: ['Codebase audit', 'Incremental refactor', 'Test coverage'] },
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

/* Case studies. Each item drives both its card in the homepage Work section
   and its own page at /work/<slug> (src/pages/CaseStudy.tsx).

   Product descriptions are drawn from what each screenshot actually shows.
   Every `metrics` / `detail.results` value is a PLACEHOLDER — illustrative
   only. Replace them with each client's real figures before launch: visitors
   read them as measured results for a named business. */
export const WORK = {
  eyebrow: 'Featured Work',
  title: 'Products We Took from Idea to Production.',
  lede: 'Explore the problems we solved, the decisions we made, and the impact our work delivered.',
  cta: 'See All Our Work',
  items: [
    {
      slug: 'cardealmakers',
      name: 'CarDealmakers',
      shot: '/img/work-cardealmakers.webp',
      tags: ['Automotive', 'Marketplace'],
      tagline: 'Buy, sell or exchange a car, with dealers competing for the deal',
      body: 'A multi-dealer car marketplace where buyers post what they want and dealers bid for it, so the customer pays market price or less. One flow covers buying new, selling an old car and exchanging both, with a relationship-manager portal and WhatsApp follow-up behind every lead.',
      metrics: [
        { value: '3.2x', label: 'more qualified leads' },
        { value: '41%', label: 'more deals closed' },
      ],
      stack: 'React · Node.js · WhatsApp API',
      link: 'Read the case study',
      detail: {
        client: 'CarDealmakers',
        industry: 'Automotive retail',
        region: 'India',
        services: ['Product design', 'Web platform', 'RM portal', 'WhatsApp integration'],
        summary:
          'A car-buying marketplace that flips the usual dealership dynamic: the customer states what they want, and dealers compete to win the sale.',
        challenge:
          'Buying a new car, selling an old one and trading one against the other are usually three separate conversations, each with a different dealer and no clear view of the fair price. Buyers either shop around by phone for days or accept the first quote, and dealers spend time on enquiries that never convert.',
        approach: [
          {
            title: 'One entry point for three journeys',
            body: 'Buy New Car, Sell Old Car and Exchange Both share a single request flow, so a customer never has to know in advance which kind of deal they are after.',
          },
          {
            title: 'Dealers compete, the customer chooses',
            body: 'Each request goes out to multiple dealers as a multi-dealer offer. Pricing stays transparent, and the platform holds the line that the customer never pays extra.',
          },
          {
            title: 'A relationship manager behind every lead',
            body: 'An RM portal gives the team one queue of live requests, with WhatsApp built in so follow-up happens where customers already are.',
          },
        ],
        features: [
          { title: 'Buy, sell and exchange', body: 'Three deal types in one guided request, including a combined exchange.' },
          { title: 'Multi-dealer offers', body: 'Requests fan out to several dealers so quotes arrive side by side.' },
          { title: 'Transparent pricing', body: 'Market price or less, with no hidden extras added at the end.' },
          { title: 'RM portal', body: 'Relationship managers work every request from a single dashboard.' },
          { title: 'WhatsApp follow-up', body: 'Customers can reach the team in one tap from anywhere on the site.' },
          { title: 'Privacy focused', body: 'Zero-spam contact handling, so a request does not become a flood of calls.' },
        ],
        results: [
          { value: '3.2x', label: 'more qualified leads' },
          { value: '41%', label: 'more deals closed' },
          { value: '60s', label: 'to submit a request' },
        ],
        stack: ['React', 'Node.js', 'WhatsApp API'],
      },
    },
    {
      slug: 'truevalueautos',
      name: 'TrueValueAutos',
      shot: '/img/work-truevalueautos.webp',
      tags: ['Australia · B2B Automotive'],
      tagline: 'Dealer-to-dealer car bidding across Australia',
      body: 'A B2B trading platform for Australian dealerships. Dealers list stock, bid on each other’s cars and close purchases in one place, with live sales, bid and inventory reporting on every dealer’s dashboard.',
      metrics: [{ value: '1,200+', label: 'dealer bids a month' }],
      stack: 'React · Node.js',
      link: 'Case study',
      detail: {
        client: 'TrueValueAutos',
        industry: 'B2B automotive trading',
        region: 'Australia',
        services: ['Product design', 'Web platform', 'Bidding engine', 'Dealer analytics'],
        summary:
          'A trade platform where Australian dealerships buy and sell stock with each other through open bidding, and see exactly how their business is performing.',
        challenge:
          'Dealer-to-dealer trade across Australia has long run on phone calls, spreadsheets and personal networks. Stock sits on lots longer than it should, fair trade prices are hard to judge, and a dealer has no single view of what they are selling, what they are bidding on and whether they will hit the month.',
        approach: [
          {
            title: 'Listings and bids in one marketplace',
            body: 'Dealers list stock, browse other dealers’ cars and place bids from the same account, so buying and selling are two sides of one workflow.',
          },
          {
            title: 'A dashboard built for the dealer principal',
            body: 'Total sales, cars sold, active listings and bids received sit up front, each compared against last month.',
          },
          {
            title: 'Reporting that drives the next decision',
            body: 'Top-selling makes and models, a monthly sales target and a profit-versus-cost breakdown turn activity into something a dealer can act on.',
          },
        ],
        features: [
          { title: 'My listings', body: 'Put stock in front of every dealer on the network in minutes.' },
          { title: 'Browse cars', body: 'Search trade stock from dealerships across the country.' },
          { title: 'My bids', body: 'Track every open bid and its status from one list.' },
          { title: 'Purchases', body: 'A full record of completed trades for each dealership.' },
          { title: 'Sales target tracking', body: 'Live progress against the monthly target, with last month for comparison.' },
          { title: 'Revenue breakdown', body: 'Profit and cost over time, filterable by timeframe and exportable.' },
        ],
        results: [
          { value: '1,200+', label: 'dealer bids a month' },
          { value: '312', label: 'cars traded in a quarter' },
          { value: '74%', label: 'of monthly target, mid-month' },
        ],
        stack: ['React', 'Node.js'],
      },
    },
    {
      slug: 'nexora-crm',
      name: 'Nexora CRM',
      shot: '/img/work-nexora-crm.png',
      tags: ['CRM · Lead Management'],
      tagline: 'A lead CRM built around the relationship manager’s day',
      body: 'A lead management CRM that takes a sales team from first outreach to accepted offer. Leads, customers, requests, offers and dealer quotes live in one RM portal, with priority, status and one-tap call or WhatsApp on every row.',
      metrics: [{ value: '2x', label: 'faster lead response' }],
      stack: 'React · Node.js',
      link: 'Case study',
      detail: {
        client: 'Nexora',
        industry: 'Sales & lead management',
        region: 'India',
        services: ['Product design', 'CRM platform', 'Pipeline workflow', 'Calling & WhatsApp'],
        summary:
          'A CRM shaped around how relationship managers actually work a lead: see it, prioritise it, contact it and move it forward, without leaving the table.',
        challenge:
          'Leads were arriving faster than the team could work them. Enquiries, customer records, offers and dealer quotes lived in different places, so a relationship manager had to piece together each lead’s history before they could even pick up the phone, and hot leads went cold waiting.',
        approach: [
          {
            title: 'The whole pipeline, in order',
            body: 'Outreach, Leads, Customers, Requests, Offers, Dealer Quotes and Accepted Offers are tabs in the sequence a deal moves through, so the next step is always the next tab.',
          },
          {
            title: 'Everything to act on, in one row',
            body: 'Each lead shows location, requirement, interest, assigned RM, priority and status, with actions to raise a request, send an offer or mark progress.',
          },
          {
            title: 'Contact without switching tools',
            body: 'Call and WhatsApp sit on every lead, and a built-in call script keeps conversations consistent across the team.',
          },
        ],
        features: [
          { title: 'Pipeline tabs', body: 'From outreach to accepted offer, one stage per tab.' },
          { title: 'My Leads view', body: 'Each RM sees their own queue first, filtered by status, lead type and date.' },
          { title: 'Priority & status', body: 'Inline priority and status changes, right on the lead row.' },
          { title: 'Offers & dealer quotes', body: 'Quotes and offers are tracked against the lead they belong to.' },
          { title: 'Call & WhatsApp', body: 'One tap to contact a lead, straight from the table.' },
          { title: 'Call script', body: 'A shared script on hand during every call.' },
        ],
        results: [
          { value: '2x', label: 'faster lead response' },
          { value: '35%', label: 'more leads reaching an offer' },
          { value: '1', label: 'place for the whole pipeline' },
        ],
        stack: ['React', 'Node.js'],
      },
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
    { avatar: '/img/avatar-1.svg', quote: 'My react project was delivered much faster than expected with higher quality than asked for', name: 'Verified client', role: 'Founder' },
    { avatar: '/img/avatar-2.svg', quote: 'Great communicator excellent results', name: 'Tony Sampheri', role: 'Founder, Trading Platform' },
    { avatar: '/img/avatar-3.svg', quote: 'Vijay and his team did great job for our clinic website, I see his expertise and knowledge about implementing ideas with the latest technology, very excellent job done by you guys.', name: 'Pratik Kansagara', role: 'Owner, Care Homeopathy Clinic' },
    { avatar: '/img/avatar-4.svg', quote: 'Excellent developer with strong expertise in building SASS products, React/Next.js, Node.js, and Stripe integration. Delivered high-quality work on time with clear communication and professionalism. Would highly recommended', name: 'Verified client', role: 'Founder' },
    { avatar: '/img/avatar-5.svg', quote: 'Excellent work, would highly recommend', name: 'Verified client', role: 'Founder, Social Proof App' },
    { avatar: '/img/avatar-6.svg', quote: 'Great work!!!', name: 'Eugene Gelfand', role: 'Founder, Pixel Perfect Creation' },
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

/* Blog. Each item drives its card in the homepage Insights section and its
   own page at /blog/<slug> (src/pages/Article.tsx). Article bodies are
   written for this site; `read` is derived from the body's word count. */
export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string };

export const INSIGHTS = {
  eyebrow: 'Insights',
  title: 'Notes from the Build.',
  lede: 'Practical lessons from building, scaling, and improving software, shared by the engineers doing the work.',
  cta: 'Read All Articles',
  items: [
    {
      slug: 'shopify-ai-seo-guide',
      category: 'E-commerce SEO',
      date: '21 May 2026',
      author: { name: `${BRAND} Engineering`, role: 'E-commerce team' },
      title: 'The Shopify AI SEO Guide: How to Get Your Store Cited on ChatGPT & Gemini',
      body: 'AI assistants now answer shopping questions directly, and they only name the stores whose product data they can read and trust. Here is how to become one of them.',
      cover: '/img/post-1.svg',
      content: [
        { type: 'p', text: 'A growing share of product discovery no longer starts with a search results page. People describe what they want to an AI assistant, in full sentences, with a budget and a deadline attached, and the assistant replies with a short list. If your store is not on that list, the customer never sees you. There is no page two.' },
        { type: 'p', text: 'The good news is that the things assistants reward are mostly things a well-run Shopify store should be doing anyway. The work is less about tricks and more about making your catalogue easy for a machine to understand and easy to believe.' },
        { type: 'h2', text: 'How an assistant decides what to recommend' },
        { type: 'p', text: 'When an assistant answers a shopping question it is matching the constraints in the question against what it can find out about products. A request for a leather wallet under a certain price with quick delivery contains four facts to check: the category, the material, the price and the shipping promise. A product that states all four clearly, in a consistent structure, is simply easier to recommend than one that buries them in a paragraph of marketing copy.' },
        { type: 'p', text: 'Trust matters as much as clarity. Assistants lean on signals that a store is real and that its claims hold up: reviews, a clear returns policy, contact details, and the same facts repeated consistently across your site and the places that mention you.' },
        { type: 'h2', text: 'Make every product self-describing' },
        { type: 'ul', items: [
          'Write titles that name the thing, not the vibe. "Slim RFID Leather Wallet, Full-Grain, Tan" beats "The Voyager".',
          'Put the attributes people filter by into structured fields: material, size, colour, compatibility, care. Use metafields rather than prose for anything a shopper might ask about.',
          'Keep price, availability and shipping times accurate. A recommendation that turns out to be out of stock teaches the system to trust you less.',
          'Answer the obvious questions on the page itself. A short FAQ block on a product often matches the exact phrasing people use with an assistant.',
        ] },
        { type: 'h2', text: 'Get your structured data right' },
        { type: 'p', text: 'Most Shopify themes output some product schema, but it is often incomplete. Check that each product page exposes Product data with offers, price, currency, availability, brand and aggregate rating where you have reviews. Validate a handful of pages with a rich results testing tool, then fix the template rather than individual pages, so every new product inherits the fix.' },
        { type: 'quote', text: 'Structured data does not make a weak product page rank. It makes a strong product page legible.' },
        { type: 'h2', text: 'Earn mentions outside your own site' },
        { type: 'p', text: 'Assistants form a view of your brand from more than your storefront. Honest reviews on independent platforms, inclusion in genuine comparison articles, and a consistent brand name and description across marketplaces all add up. Chasing low-quality links is a waste of time here; being described accurately by credible sources is not.' },
        { type: 'h2', text: 'Measure what you can' },
        { type: 'p', text: 'Attribution for AI referrals is still immature, but it is not invisible. Watch referral traffic from assistant domains in your analytics, add a "how did you hear about us" option at checkout, and periodically ask the major assistants the questions your customers ask, noting whether you appear. Treat it like any other channel: a baseline first, then one change at a time.' },
        { type: 'p', text: 'None of this replaces good products or fair prices. It just makes sure that when you have both, the systems now standing between you and your customers can tell.' },
      ] as ArticleBlock[],
    },
    {
      slug: 'choosing-a-startup-tech-stack',
      category: 'Software Development',
      date: '21 Apr 2026',
      author: { name: `${BRAND} Engineering`, role: 'Product engineering team' },
      title: 'How to Choose the Right Tech Stack for Your Startup in 2026',
      body: 'The stack that wins is rarely the most exciting one. It is the one your team can ship with this quarter and still hire for next year.',
      cover: '/img/post-2.svg',
      content: [
        { type: 'p', text: 'Founders ask us which framework to pick more than almost any other question, and the honest answer is that the choice matters less than the reasons behind it. Plenty of successful companies run on unfashionable technology. Plenty of failed ones had beautiful architecture. What separates them is whether the stack let the team learn from real users quickly.' },
        { type: 'h2', text: 'Start from the constraints, not the trends' },
        { type: 'p', text: 'Before comparing tools, write down what is actually true about your situation. Who will build this for the next twelve months? What do they already know well? How soon do you need something in front of customers? Are there hard requirements, such as regulated data, offline use or heavy real-time features, that rule options out? Those answers eliminate most of the debate before it starts.' },
        { type: 'h2', text: 'Four questions that decide most choices' },
        { type: 'ul', items: [
          'Can the current team be productive in it within weeks, not months?',
          'Can you hire for it in your market, at a salary you can afford?',
          'Is it boring enough that the problems you hit are already solved and documented?',
          'Does it keep your options open, or does it tie you to one vendor’s pricing and roadmap?',
        ] },
        { type: 'h2', text: 'A sensible default for most web products' },
        { type: 'p', text: 'For a typical SaaS or marketplace product, a TypeScript front end in a mainstream framework, a straightforward API layer, a relational database such as Postgres and a managed cloud platform will carry you a very long way. It is not glamorous. It is widely understood, easy to hire for, and every problem you run into has been written about by someone else.' },
        { type: 'quote', text: 'Pick technology your team will still be happy to debug at two in the morning.' },
        { type: 'h2', text: 'Where startups usually go wrong' },
        { type: 'p', text: 'The most common mistake is designing for scale you do not have. Microservices, event buses and multi-region setups solve real problems, but they are problems of success, and they slow a small team down long before they pay off. A well-structured monolith can be split later, once you know where the seams really are.' },
        { type: 'p', text: 'The second mistake is adopting something new because it is new. Early adoption has a cost that rarely shows up in the demo: thin documentation, breaking changes and a small hiring pool. Save your novelty budget for the part of the product that is genuinely your competitive advantage.' },
        { type: 'h2', text: 'Make the decision reversible where you can' },
        { type: 'p', text: 'You will get some choices wrong. Keep that cheap by owning your data model, keeping business logic out of framework-specific corners, and putting third-party services behind thin interfaces of your own. Then revisit the stack once a year with real usage data in hand, rather than defending the decision you made with none.' },
      ] as ArticleBlock[],
    },
    {
      slug: 'ai-powered-saas',
      category: 'AI Development',
      date: '20 Apr 2026',
      author: { name: `${BRAND} Engineering`, role: 'AI & automation team' },
      title: 'AI-Powered SaaS: How Modern SaaS Products Are Embedding AI for Competitive Advantage',
      body: 'Bolting a chatbot onto a product is not an AI strategy. The SaaS products pulling ahead use AI to remove steps from the jobs their users already do.',
      cover: '/img/post-3.svg',
      content: [
        { type: 'p', text: 'Almost every SaaS roadmap now has an AI line item, and a lot of what ships under it is a chat box in the corner of the screen. Users try it once, find it does not know much about their account, and go back to clicking. The products that are genuinely pulling ahead have taken a different route: they start from a job the user already does and ask where a model can take a step out of it.' },
        { type: 'h2', text: 'Start from the workflow, not the model' },
        { type: 'p', text: 'Look at where your users spend time on work they do not value: triaging an inbox of leads, writing the same follow-up email, reconciling two reports, filling in a form from a document they already have. Those are the places where AI earns its keep, because the value is measured in minutes saved on something that happens every day.' },
        { type: 'h2', text: 'Patterns that are working' },
        { type: 'ul', items: [
          'Summaries and next-best-action suggestions on records users already open, rather than a separate AI screen.',
          'Drafting first versions of routine text, emails, notes and descriptions, that a person reviews and sends.',
          'Extracting structured data from uploads so users stop retyping what is already in a PDF.',
          'Search that understands the question, grounded in the customer’s own data rather than the open web.',
        ] },
        { type: 'h2', text: 'Your data is the moat' },
        { type: 'p', text: 'Every competitor can call the same models. What they cannot copy is the context your product already holds about each customer. Retrieval over that data, with permissions respected so a user only ever sees what they are allowed to see, is what turns a generic model into a feature that feels like it knows the business.' },
        { type: 'quote', text: 'The model is a commodity. The context you give it is the product.' },
        { type: 'h2', text: 'Build for trust from day one' },
        { type: 'p', text: 'AI features fail differently from ordinary software. They are confidently wrong rather than obviously broken. Show where an answer came from, keep a human in the loop for anything that sends, spends or deletes, and make it easy to correct the output. Log inputs and results so you can evaluate quality on real usage instead of a handful of hand-picked demos.' },
        { type: 'h2', text: 'Watch the unit economics' },
        { type: 'p', text: 'Model calls cost money on every use, which is new territory for products used to near-zero marginal cost. Cache what you can, use smaller models for simple steps, and decide early whether AI features are included, metered or reserved for higher plans. An AI feature that users love but that loses money on every account is not a competitive advantage for long.' },
        { type: 'p', text: 'The winning pattern is quiet: fewer clicks, better defaults, and answers grounded in the customer’s own data. Most users will never think of it as AI at all. They will just notice the product got faster at the job they bought it for.' },
      ] as ArticleBlock[],
    },
  ],
};

const WORDS_PER_MINUTE = 220;

/** Reading time from the article's own text, so it can never drift from it. */
export function readTime(content: ArticleBlock[]): string {
  const text = content
    .map((b) => (b.type === 'ul' ? b.items.join(' ') : b.text))
    .join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`;
}

export const RECOGNITION = {
  title: 'Recognised Where It Counts',
  lede: 'Independent checks and platform partnerships, earned through delivered work.',
  /* `logo` is optional: point it at a file in public/img/ and that artwork is
     used instead of the drawn badge — e.g. logo: '/img/businessfirms.svg'. */
  items: [
    { title: 'Certified by BusinessFirms', kind: 'businessfirms' as const, logo: '' },
    { title: 'Shopify Partner', kind: 'shopify' as const, logo: '' },
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
  title: 'Agile Team. Large Surface Area.',
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
  lede: 'An agile team amplifies both fit and mismatch. Read both columns before you write to us.',
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
    { q: 'Is the role onsite or remote?', a: 'The role is onsite. We are an agile team and the work moves faster when we are in the same office.' },
    { q: 'How quickly will I hear back?', a: 'Within five working days of applying, and within two days after each conversation. If the answer is no, you get the reason.' },
    { q: 'What should I send along with my CV?', a: 'A repository, a live product, or a short write-up of something you built and what was hard about it. We care far more about that than about formatting.' },
  ],
};
