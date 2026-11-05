import test from 'node:test';
import assert from 'node:assert/strict';
import { isPublished, newestFirst, collectTags, tagSlug } from '../src/lib/content.mjs';
import { deployment } from '../src/lib/deployment.mjs';
import { remarkMermaid } from '../src/lib/remark-mermaid.mjs';

test('drafts and future posts are excluded at the shared publishing boundary', () => {
  const now = new Date('2026-11-05T12:00:00Z');
  assert.equal(isPublished({ data: { draft: true } }, now), false);
  assert.equal(isPublished({ data: { date: '2099-01-01' } }, now), false);
  assert.equal(isPublished({ data: { date: '2020-01-01' } }, now), true);
  assert.equal(isPublished({ data: {} }, now), true);
});

test('topic URLs distinguish programming language names and normalize spaces and non-ASCII labels', () => {
  assert.notEqual(tagSlug('C++'), tagSlug('C#'));
  assert.equal(tagSlug(' Swift '), tagSlug('swift'));
  assert.equal(tagSlug('Machine Learning'), 'machine-learning');
  assert.equal(tagSlug('الذكاء الاصطناعي'), 'الذكاء-الاصطناعي');
});

test('topics are collected across articles without fixed technology lists', () => {
  const entries = [{ data: { tags: ['Swift', 'C++'] } }, { data: { tags: ['swift', 'A new technology'] } }];
  const tags = collectTags(entries);
  assert.equal(tags.length, 3);
  assert.equal(tags.find((tag) => tag.slug === 'swift').count, 2);
  assert.equal(tags[0].label, 'A new technology');
});

test('articles sort chronologically with deterministic ordering for equal dates', () => {
  const entries = [{ id: 'z', data: { date: '2024-01-01' } }, { id: 'b', data: { date: '2026-01-01' } }, { id: 'a', data: { date: '2026-01-01' } }];
  assert.deepEqual(entries.sort(newestFirst).map((entry) => entry.id), ['a', 'b', 'z']);
});

test('deployment supports user sites, project subpaths, and custom domains', () => {
  assert.deepEqual(deployment({ GITHUB_REPOSITORY: 'person/person.github.io' }), { site: 'https://person.github.io', base: '/' });
  assert.deepEqual(deployment({ GITHUB_REPOSITORY: 'person/portfolio' }), { site: 'https://person.github.io', base: '/portfolio/' });
  assert.deepEqual(deployment({ GITHUB_REPOSITORY: 'person/portfolio', SITE_URL: 'https://example.org' }), { site: 'https://example.org', base: '/' });
  assert.equal(deployment({ BASE_PATH: '///notes///' }).base, '/notes/');
});

test('Mermaid fences preserve source as escaped text-compatible AST, not raw HTML', () => {
  const source = 'flowchart LR\nA["<script>alert(1)</script>"] --> B';
  const tree = { type: 'root', children: [{ type: 'code', lang: 'mermaid', value: source }, { type: 'code', lang: 'swift', value: 'let x = 1' }] };
  remarkMermaid()(tree);
  assert.equal(tree.children[0].data.hName, 'figure');
  assert.equal(tree.children[0].children[0].children[0].value, source);
  assert.equal(tree.children[1].type, 'code');
});
