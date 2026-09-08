import type { IconType } from 'react-icons';
import {
  SiAngular, SiApachekafka, SiClaude, SiClickhouse, SiCursor, SiDigitalocean,
  SiDocker, SiElasticsearch, SiExpress, SiFirebase, SiGit, SiGithub,
  SiGithubcopilot, SiGitlab, SiGooglecloud, SiGooglegemini, SiJavascript,
  SiJenkins, SiKubernetes, SiLaravel, SiMongodb, SiMysql, SiNestjs,
  SiNextdotjs, SiNodedotjs, SiNuxt, SiOpenjdk, SiPaypal, SiPhp, SiPostgresql,
  SiPostman, SiPrisma, SiPython, SiRabbitmq, SiRazorpay, SiReact, SiRedis,
  SiRedux, SiSass, SiSequelize, SiSocketdotio, SiSqlite, SiStrapi, SiStripe,
  SiSupabase, SiTailwindcss, SiTypescript, SiVercel, SiVite, SiVuedotjs,
  SiZapier,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa6';
import { VscAzure } from 'react-icons/vsc';
import { RiOpenaiFill } from 'react-icons/ri';
import { TbDatabase, TbSearch } from 'react-icons/tb';

/**
 * Brand mark + official colour for each technology in the stack section.
 * Simple Icons has no mark for DynamoDB or Typesense, so those fall back to a
 * generic glyph tinted with the product's brand colour.
 */
export const TECH_ICONS: Record<string, { Icon: IconType; color: string }> = {
  // Frontend
  React: { Icon: SiReact, color: '#61DAFB' },
  'Next.js': { Icon: SiNextdotjs, color: '#000000' },
  TypeScript: { Icon: SiTypescript, color: '#3178C6' },
  JavaScript: { Icon: SiJavascript, color: '#F7DF1E' },
  Vue: { Icon: SiVuedotjs, color: '#4FC08D' },
  Angular: { Icon: SiAngular, color: '#DD0031' },
  Tailwind: { Icon: SiTailwindcss, color: '#06B6D4' },
  Nuxt: { Icon: SiNuxt, color: '#00DC82' },
  Redux: { Icon: SiRedux, color: '#764ABC' },
  Vite: { Icon: SiVite, color: '#646CFF' },
  Sass: { Icon: SiSass, color: '#CC6699' },

  // Backend
  'Node.js': { Icon: SiNodedotjs, color: '#5FA04E' },
  Express: { Icon: SiExpress, color: '#000000' },
  NestJS: { Icon: SiNestjs, color: '#E0234E' },
  Laravel: { Icon: SiLaravel, color: '#FF2D20' },
  PHP: { Icon: SiPhp, color: '#777BB4' },
  Python: { Icon: SiPython, color: '#3776AB' },
  Java: { Icon: SiOpenjdk, color: '#E76F00' },
  Prisma: { Icon: SiPrisma, color: '#2D3748' },
  Sequelize: { Icon: SiSequelize, color: '#52B0E7' },
  'Socket.IO': { Icon: SiSocketdotio, color: '#010101' },
  Strapi: { Icon: SiStrapi, color: '#4945FF' },

  // Database
  PostgreSQL: { Icon: SiPostgresql, color: '#4169E1' },
  MySQL: { Icon: SiMysql, color: '#4479A1' },
  MongoDB: { Icon: SiMongodb, color: '#47A248' },
  Redis: { Icon: SiRedis, color: '#FF4438' },
  Elasticsearch: { Icon: SiElasticsearch, color: '#005571' },
  Supabase: { Icon: SiSupabase, color: '#3FCF8E' },
  Firebase: { Icon: SiFirebase, color: '#FFCA28' },
  DynamoDB: { Icon: TbDatabase, color: '#4053D6' },
  SQLite: { Icon: SiSqlite, color: '#003B57' },
  ClickHouse: { Icon: SiClickhouse, color: '#FFCC01' },
  Typesense: { Icon: TbSearch, color: '#1F2937' },

  // Cloud platforms
  AWS: { Icon: FaAws, color: '#FF9900' },
  Azure: { Icon: VscAzure, color: '#0078D4' },
  DigitalOcean: { Icon: SiDigitalocean, color: '#0080FF' },
  Vercel: { Icon: SiVercel, color: '#000000' },
  'Google Cloud': { Icon: SiGooglecloud, color: '#4285F4' },

  // DevOps
  Docker: { Icon: SiDocker, color: '#2496ED' },
  Kubernetes: { Icon: SiKubernetes, color: '#326CE5' },
  Jenkins: { Icon: SiJenkins, color: '#D24939' },
  Git: { Icon: SiGit, color: '#F05032' },
  GitHub: { Icon: SiGithub, color: '#181717' },
  GitLab: { Icon: SiGitlab, color: '#FC6D26' },
  Postman: { Icon: SiPostman, color: '#FF6C37' },

  // AI
  OpenAI: { Icon: RiOpenaiFill, color: '#10A37F' },
  Claude: { Icon: SiClaude, color: '#D97757' },
  Copilot: { Icon: SiGithubcopilot, color: '#181717' },
  Gemini: { Icon: SiGooglegemini, color: '#8E75B2' },
  Cursor: { Icon: SiCursor, color: '#000000' },

  // Integrations
  Stripe: { Icon: SiStripe, color: '#635BFF' },
  Kafka: { Icon: SiApachekafka, color: '#231F20' },
  RabbitMQ: { Icon: SiRabbitmq, color: '#FF6600' },
  Razorpay: { Icon: SiRazorpay, color: '#3395FF' },
  PayPal: { Icon: SiPaypal, color: '#00457C' },
  Zapier: { Icon: SiZapier, color: '#FF4F00' },
};
