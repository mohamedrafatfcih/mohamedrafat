import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, getProfile, href } from '../lib/site';

export async function GET(context: APIContext) {
  const [posts, profile] = await Promise.all([getPosts(), getProfile()]);
  return rss({ title: `${profile.data.name} — Writing`, description: profile.data.description, site: context.site!, items: posts.map((post) => ({ title: post.data.title, description: post.data.description, pubDate: post.data.date, link: href(`blog/${post.id}/`) })), customData: '<language>en</language>' });
}
