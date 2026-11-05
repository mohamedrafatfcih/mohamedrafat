import { getEntry, getCollection } from 'astro:content';
import { isPublished, newestFirst } from './content.mjs';

export async function getProfile() {
  const profile = await getEntry('profile', 'about');
  if (!profile) throw new Error('Add src/content/profile/about.md before building.');
  return profile;
}

export async function getPosts() {
  return (await getCollection('blog')).filter((entry) => isPublished(entry)).sort(newestFirst);
}

export async function getResearch() {
  return (await getCollection('research')).filter((entry) => isPublished(entry)).sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title));
}

export async function getProjects() {
  return (await getCollection('projects')).filter((entry) => isPublished(entry)).sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

export function href(path = '') {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date);
}
