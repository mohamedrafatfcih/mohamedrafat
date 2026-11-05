import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const tags = z.array(text).transform((values) => [...new Map(values.map((value) => [value.toLowerCase(), value])).values()]);
const link = z.url().refine((value) => /^https?:\/\//.test(value), 'Use an HTTP or HTTPS URL');
const visibility = { draft: z.boolean().default(false) };
const contentRoot = process.env.VERIFY_SITE === 'true' ? './tests/fixtures/content' : './src/content';

export const collections = {
  profile: defineCollection({
    loader: glob({ pattern: '*.md', base: './src/content/profile' }),
    schema: z.object({ name: text, role: text, location: text, email: z.email(), description: text, current: text, experience: text, study: z.object({ degree: text, university: text, period: text, status: text }), github: link.optional(), linkedin: link.optional(), scholar: link.optional() }),
  }),
  resume: defineCollection({
    loader: glob({ pattern: '*.md', base: './src/content/resume' }),
    schema: z.object({ title: text }),
  }),
  blog: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: `${contentRoot}/blog` }),
    schema: z.object({ title: text, description: text, date: z.coerce.date(), tags: tags.default([]), ...visibility }),
  }),
  research: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: `${contentRoot}/research` }),
    schema: z.object({ title: text, description: text, authors: z.array(text).min(1), year: z.number().int(), venue: text.optional(), paper: link.optional(), code: link.optional(), ...visibility }),
  }),
  projects: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: `${contentRoot}/projects` }),
    schema: z.object({ title: text, description: text, context: text, period: text, tags: tags.default([]), order: z.number().default(0), repository: link.optional(), demo: link.optional(), ...visibility }),
  }),
};
