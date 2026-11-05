export function deployment(env = {}) {
  const [owner, repository] = (env.GITHUB_REPOSITORY || '').split('/');
  const isUserSite = repository?.toLowerCase() === `${owner}.github.io`.toLowerCase();
  const site = env.SITE_URL || (owner ? `https://${owner}.github.io` : 'http://localhost:4321');
  const base = env.BASE_PATH ?? (!env.SITE_URL && repository && !isUserSite ? `/${repository}/` : '/');
  const segments = base.split('/').filter(Boolean);
  return { site, base: `/${segments.join('/')}${segments.length ? '/' : ''}` };
}
