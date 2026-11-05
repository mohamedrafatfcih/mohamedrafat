# Mohamed Rafat — personal website

An Astro website for a resume, research, projects, and technical writing. The design uses warm neutrals, editorial typography, terracotta accents, and matching light/dark themes. The resume is a web page; there is no downloadable resume PDF.

## Run locally

Install Node.js 24 (24.12 or newer) and pnpm 11.25.0. Then:

```sh
pnpm install
pnpm dev
```

Open the local URL printed by Astro, normally `http://localhost:4321`.

```sh
pnpm check       # Astro and TypeScript checks
pnpm test        # Publishing, URL, and diagram-transform tests
pnpm test:site   # Separate fixture build plus generated-site checks
pnpm build      # Real content only, written to dist/
pnpm preview    # Preview the production build
```

The verification build goes to `.verification-dist/`; its example articles and publications never enter the production build.

## Update your content

You can edit these files directly on GitHub. Saving changes to `main` triggers validation and automatic publication after hosting is configured.

| Content | Location |
| --- | --- |
| Name, contact details, biography, homepage facts, optional profile links | `src/content/profile/about.md` |
| Resume | `src/content/resume/resume.md` |
| Project overviews | `src/content/projects/` |
| Publications | `src/content/research/` |
| Blog articles | `src/content/blog/` |

The text between the initial `---` lines is metadata; the text after it is Markdown. Keep personal claims current in the profile and resume when changing roles or education.

Add `github`, `linkedin`, or `scholar` HTTPS URLs to the profile metadata to show those links. They are hidden until real URLs are supplied. The initial profile, resume, and three professional work overviews were prepared from the supplied CV. No publications or blog articles have been invented.

### Add a post

1. Copy `content-templates/article.md` to `src/content/blog/your-article-slug.md`.
2. Set the title, summary, UTC publication date, and any number of technology tags.
3. Write your article. Change `draft: true` to `draft: false` when ready.
4. Commit to `main`.

The filename becomes the article URL. Keep it unchanged to preserve existing links. Technology pages are generated automatically; you do not need to create categories or edit navigation. Tags are case-insensitive and support spaces and punctuation, including `C++` and `C#`.

Drafts and future-dated posts are excluded from article pages, indexes, topic pages, RSS, and the sitemap. A future-dated post becomes visible on the first build after its date; there is no automatic scheduled build. Because the GitHub repository is public, draft source files are still readable in the repository.

### Technical writing

- **Code:** use fenced code blocks with a language such as `swift`, `python`, `typescript`, or `bash`. Blocks have light/dark highlighting, horizontal scrolling, and a copy button when clipboard access is available.
- **Diagrams:** use a fenced `mermaid` block. Add `accTitle` and `accDescr` for accessibility. Mermaid loads only on pages containing diagrams; readable source remains if rendering fails. Diagrams follow theme changes.
- **Math:** `$...$` for inline expressions and `$$...$$` on separate lines for display equations. KaTeX renders math during the build with local CSS/fonts.
- **MDX:** use a `.mdx` filename when an article needs an Astro component. Ordinary articles can remain `.md`.
- **Images:** put images in `public/images/`. In Markdown, use a relative path from the article, for example `![Describe the image](../../images/diagram.png)` for `/blog/article/`. Relative paths also work when the site is hosted under a repository subpath. In MDX you can import local images and Astro's `Image` component instead.

### Add research or a project

Copy the matching file from `content-templates/` into the appropriate content folder. Research supports title, summary, authors, year, optional venue, paper link (including a DOI URL), and code link. Projects support context, period, technology tags, ordering, and optional repository/demo links. Add the abstract or project details in the Markdown body. Keep `draft: true` until ready; optional links are hidden when omitted.

## Free GitHub Pages hosting

1. Create a **public** GitHub repository. Use `YOUR_USERNAME.github.io` for `https://YOUR_USERNAME.github.io/`, or another repository name for `https://YOUR_USERNAME.github.io/REPOSITORY/`.
2. Push this project, including `pnpm-lock.yaml`, to its `main` branch.
3. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
4. The included workflow validates content, runs tests, builds real content, and deploys. Its deployment job reports the live URL. Subsequent commits update the website automatically.

The configuration derives the domain and base path from `GITHUB_REPOSITORY`. This keeps navigation, topic links, feeds, and assets working for both user and repository sites. The GitHub Actions workflow itself cannot be exercised until the repository exists and is connected.

For a custom domain, configure GitHub Pages/DNS, add `public/CNAME`, and set the repository Actions variable `SITE_URL` to the full HTTPS origin. This sets the base path to `/`. Domain registration is separate from free hosting.

## Design and accessibility

Theme colors and spacing live in `src/styles/global.css`. The theme initially follows the system and remembers a manual choice. It also works without storage access. Motion is subtle and disabled for reduced-motion preferences. Navigation works with a keyboard, mobile navigation uses native disclosure controls, and the first focusable link skips to the main content.

External profile and project links open in the same tab. The site requires no database, CMS account, or runtime server.
