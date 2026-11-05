import { spawnSync } from 'node:child_process';
import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';

const result = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, VERIFY_SITE: 'true', SITE_URL: 'https://example.org', BASE_PATH: '/portfolio/', ASTRO_TELEMETRY_DISABLED: '1' },
});
assert.equal(result.status, 0, 'Verification build must pass');
const root = resolve('.verification-dist');
async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? filesIn(join(directory, entry.name)) : join(directory, entry.name)))).flat();
}
const allFiles = await filesIn(root);
const pages = allFiles.filter((path) => /\.(html|xml)$/.test(path));
for (const path of pages) {
  const source = await readFile(path, 'utf8');
  assert.doesNotMatch(source, /DO_NOT_PUBLISH_/, `Unpublished content leaked into ${path}`);
  for (const [, link] of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!link.startsWith('/')) continue;
    assert.ok(link.startsWith('/portfolio/'), `Subpath missing: ${link} in ${path}`);
    const pathname = new URL(link.replaceAll('&amp;', '&'), 'https://example.org').pathname.slice('/portfolio/'.length);
    const candidates = [...new Set([pathname, decodeURI(pathname), decodeURIComponent(pathname)])].map((value) => join(root, value, value.endsWith('/') || !value ? 'index.html' : ''));
    const exists = await Promise.all(candidates.map((candidate) => access(candidate).then(() => true, () => false)));
    assert.ok(exists.some(Boolean), `Broken generated link: ${link} in ${path}`);
  }
}
const article = await readFile(join(root, 'blog/technical-note/index.html'), 'utf8');
assert.match(article, /astro-code/);
assert.match(article, /--shiki-light/);
assert.match(article, /--shiki-dark/);
assert.match(article, /mermaid-source/);
assert.match(article, /katex-display/);
assert.match(article, /class="katex"/);
const mdx = await readFile(join(root, 'blog/mdx-note/index.html'), 'utf8');
assert.match(mdx, /mermaid-source/);
assert.match(mdx, /class="katex"/);
const resume = await readFile(join(root, 'resume/index.html'), 'utf8');
assert.doesNotMatch(resume, /href="[^"]*\.pdf/i);
const topics = allFiles.filter((path) => path.includes('/blog/topics/') && path.endsWith('index.html'));
assert.equal(topics.length, 3, 'New technology tags should automatically generate pages');
const feed = await readFile(join(root, 'rss.xml'), 'utf8');
assert.equal((feed.match(/<item>/g) || []).length, 2);
const sitemap = (await Promise.all(allFiles.filter((path) => /sitemap.*\.xml$/.test(path)).map((path) => readFile(path, 'utf8')))).join('');
assert.match(sitemap, /technical-note/);
assert.match(sitemap, /blog\/topics/);
console.log(`Verified ${pages.length} HTML/XML files: links, subpaths, topics, drafts, future dates, RSS, sitemap, Markdown, MDX, code, diagrams, math, and no resume PDF.`);
