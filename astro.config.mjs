import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { deployment } from './src/lib/deployment.mjs';
import { remarkMermaid } from './src/lib/remark-mermaid.mjs';

const { site, base } = deployment(process.env);

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  outDir: process.env.VERIFY_SITE === 'true' ? './.verification-dist' : './dist',
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkMermaid],
      rehypePlugins: [[rehypeKatex, { strict: 'warn', trust: false }]],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
  vite: { build: { chunkSizeWarningLimit: 800 } },
});
