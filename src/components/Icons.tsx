/** Inline icon set. All icons inherit currentColor and a 24-box stroke grid. */
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

const base = (p: P) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...p,
});

export const ArrowUpRight = (p: P) => (
  <svg {...base(p)} width={p.width ?? 16} height={p.height ?? 16}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const ChevronDown = (p: P) => (
  <svg {...base(p)} width={p.width ?? 14} height={p.height ?? 14}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronLeft = (p: P) => (
  <svg {...base(p)} width={p.width ?? 18} height={p.height ?? 18}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRight = (p: P) => (
  <svg {...base(p)} width={p.width ?? 18} height={p.height ?? 18}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const ArrowUp = (p: P) => (
  <svg {...base(p)} width={p.width ?? 18} height={p.height ?? 18}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

export const Plus = (p: P) => (
  <svg {...base(p)} width={p.width ?? 16} height={p.height ?? 16}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Mail = (p: P) => (
  <svg {...base(p)} width={p.width ?? 18} height={p.height ?? 18}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const Star = (p: P) => (
  <svg {...base(p)} width={p.width ?? 14} height={p.height ?? 14} fill="currentColor" stroke="none">
    <path d="m12 2 2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.1 6.1 20.2l1.2-6.6L2.5 9l6.6-.9L12 2Z" />
  </svg>
);

/* ── Service / industry glyphs ─────────────────────────────────────────── */
const glyphs: Record<string, JSX.Element> = {
  'layers-window': (
    <>
      <rect x="3" y="4" width="13" height="11" rx="2" />
      <path d="M8 19h11a2 2 0 0 0 2-2V8" />
      <path d="M3 8h13" />
    </>
  ),
  code: (
    <>
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
      <path d="M2.5 8h19" />
      <path d="m9 12-2 2 2 2M15 12l2 2-2 2" />
    </>
  ),
  stack: (
    <>
      <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" />
      <path d="m3 12 9 4.5 9-4.5" />
      <path d="m3 16.5 9 4.5 9-4.5" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.7 4.6L18 9.3l-4.3 1.7L12 15.6l-1.7-4.6L6 9.3l4.3-1.7L12 3Z" />
      <path d="M18.5 15.5 19.3 18l2.2.8-2.2.8-.8 2.4-.8-2.4-2.2-.8 2.2-.8.8-2.5Z" />
    </>
  ),
  rocket: (
    <>
      <path d="M14 6c3.5 2 5.5 5.5 5.5 9.5 0 1-.2 2-.5 3-1-.3-2-.5-3-.5-4 0-7.5-2-9.5-5.5" />
      <path d="M9.5 3.5c4 0 7.5 2 9.5 5.5" />
      <path d="M4.5 14.5c-1.5 1.5-2 5-2 5s3.5-.5 5-2" />
      <circle cx="14" cy="10" r="1.6" />
    </>
  ),
  cloud: (
    <>
      <path d="M7.2 18.5a4.2 4.2 0 0 1-.5-8.37 5.5 5.5 0 0 1 10.55-1.2A3.9 3.9 0 0 1 17.6 18.5H7.2Z" />
      <path d="M9.9 14.2 12 12.1l2.1 2.1" />
      <path d="M12 12.1v4.2" />
    </>
  ),
  monitor: (
    <>
      <rect x="2.5" y="4" width="19" height="13" rx="2.5" />
      <path d="M8 21h8M12 17v4" />
      <path d="m9.5 8 2 2.5-2 2.5M14.5 8l-1.5 5" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 10h19" />
      <path d="M6 15h3" />
    </>
  ),
  heart: (
    <>
      <path d="M20.5 8.6c0 4.3-6.2 8.4-8.5 10-2.3-1.6-8.5-5.7-8.5-10A4.6 4.6 0 0 1 12 6.3a4.6 4.6 0 0 1 8.5 2.3Z" />
      <path d="m8 12 2-1.5 1.5 3L13.5 11l1 1h1.5" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l-1 11.5a1.5 1.5 0 0 1-1.5 1.4h-9A1.5 1.5 0 0 1 6 19.5L5 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V6.5L12 3l8 3.5V21" />
      <path d="M4 21h16" />
      <path d="M9.5 21v-5h5v5" />
      <path d="M9 10h1.5M13.5 10H15" />
    </>
  ),
  cap: (
    <>
      <path d="m12 4 9 4.5-9 4.5-9-4.5L12 4Z" />
      <path d="M7 11v4.5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V11" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6.5h11v10h-11z" />
      <path d="M13.5 10H17l3.5 3v3.5h-7" />
      <circle cx="7" cy="18.5" r="1.8" />
      <circle cx="17" cy="18.5" r="1.8" />
    </>
  ),
  send: (
    <>
      <path d="M21 3 10.5 13.5" />
      <path d="M21 3 14.5 21l-4-7.5L3 9.5 21 3Z" />
    </>
  ),
  factory: (
    <>
      <path d="M3 21V10l6 3.5V10l6 3.5V7l6 3.5V21H3Z" />
      <path d="M7 21v-3.5M12 21v-3.5M17 21v-3.5" />
    </>
  ),
  play: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
      <path d="m10 9.5 5 2.5-5 2.5v-5Z" />
    </>
  ),
  speaker: (
    <>
      <path d="M4 9v6h3.5L14 19V5L7.5 9H4Z" />
      <path d="M17.5 9.5a4 4 0 0 1 0 5M20 7a7.5 7.5 0 0 1 0 10" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8" r="3.2" />
      <path d="M3.5 19.5a6 6 0 0 1 12 0" />
      <path d="M16 5.5a3.2 3.2 0 0 1 0 5.5M17.5 14.2a6 6 0 0 1 3 5.3" />
    </>
  ),
  link: (
    <>
      <path d="M10 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.6 1.6" />
      <path d="M14 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.6-1.6" />
    </>
  ),
  'user-code': (
    <>
      <circle cx="9" cy="7.5" r="3.2" />
      <path d="M3 19.5a6 6 0 0 1 9.8-4.6" />
      <path d="m17 13.5-2 2 2 2M20.5 13.5l2 2-2 2" />
    </>
  ),
  support: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <path d="M4 13.5h1.8a1.2 1.2 0 0 1 1.2 1.2v2.6A1.2 1.2 0 0 1 5.8 18.5H4Z" />
      <path d="M20 13.5h-1.8a1.2 1.2 0 0 0-1.2 1.2v2.6a1.2 1.2 0 0 0 1.2 1.2H20Z" />
      <path d="M20 18.5v.6a2.4 2.4 0 0 1-2.4 2.4H13" />
    </>
  ),
};

export const Glyph = ({ name, ...p }: { name: string } & P) => (
  <svg {...base(p)}>{glyphs[name] ?? glyphs.stack}</svg>
);

/* ── Social ────────────────────────────────────────────────────────────── */
export const Social = ({ name, ...p }: { name: string } & P) => {
  const paths: Record<string, JSX.Element> = {
    linkedin: <path d="M6.94 8.5H4.2V19h2.74V8.5ZM5.57 4.5a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM19.8 19h-2.74v-5.1c0-1.28-.46-2.16-1.6-2.16-.88 0-1.4.6-1.63 1.17-.08.2-.1.5-.1.79V19H11c.04-8.1 0-8.9 0-10.5h2.73v1.49c.36-.57 1.02-1.38 2.48-1.38 1.81 0 3.17 1.19 3.17 3.74V19Z" />,
    facebook: <path d="M13.5 20v-7h2.35l.35-2.73H13.5V8.53c0-.79.22-1.33 1.35-1.33h1.44V4.76c-.25-.03-1.11-.11-2.1-.11-2.08 0-3.5 1.27-3.5 3.6v2.02H8.34V13h2.35v7h2.81Z" />,
    x: <path d="M17.3 4.5h2.6l-5.68 6.5L21 19.5h-5.24l-4.1-5.36-4.7 5.36H4.35l6.08-6.95L4 4.5h5.37l3.71 4.9 4.22-4.9Zm-.91 13.4h1.44L8.7 6.02H7.15l9.24 11.88Z" />,
    instagram: (
      <>
        <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="16.6" cy="7.4" r="1.05" />
      </>
    ),
    youtube: <path d="M20.6 8.2a2.25 2.25 0 0 0-1.58-1.6C17.62 6.22 12 6.22 12 6.22s-5.62 0-7.02.38A2.25 2.25 0 0 0 3.4 8.2C3 9.6 3 12 3 12s0 2.4.4 3.8a2.25 2.25 0 0 0 1.58 1.6c1.4.38 7.02.38 7.02.38s5.62 0 7.02-.38a2.25 2.25 0 0 0 1.58-1.6c.4-1.4.4-3.8.4-3.8s0-2.4-.4-3.8ZM10.25 14.7V9.3L14.9 12l-4.65 2.7Z" />,
  };
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} {...p}>
      {paths[name]}
    </svg>
  );
};
