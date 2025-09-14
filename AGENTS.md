# Repository Guidelines

## Project Structure & Module Organization
- Astro app with Node 20. Source lives in `src/`:
  - `src/pages/` routes (e.g., `index.astro`)
  - `src/components/` UI parts (e.g., `Home.astro`)
  - `src/layouts/` shared shells (e.g., `Layout.astro`)
  - `src/assets/` local images/svg
- Static assets in `public/` (served at site root).
- Build output in `dist/` (published via Cloudflare Pages/Wrangler).

## Build, Test, and Development Commands
- `npm i` — install dependencies.
- `npm run dev` — start dev server at `http://localhost:4321`.
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve the built site locally.
- `npm run astro -- <cmd>` — run Astro CLI (e.g., `astro check`).

## Coding Style & Naming Conventions
- Use Prettier (configured in `.prettierrc`): 2 spaces, no semicolons, single quotes, width 80.
- Astro formatting via `prettier-plugin-astro`; imports auto-organized.
- Component files: `PascalCase.astro` (e.g., `Home.astro`). Page routes: `kebab-case.astro`.
- Keep inline styles minimal; prefer component-level `<style>` blocks or Tailwind (v4 is installed).
- Run formatting before commit: `npx prettier --check .` (or `--write`).

## Testing Guidelines
- No automated test framework is configured. Before PRs:
  - `npm run build` must succeed; verify `npm run preview` renders correctly.
  - Run `npm run astro -- check` for type/content diagnostics.
  - Add screenshots or a short screen recording for visual changes.

## Commit & Pull Request Guidelines
- Commit messages: short, imperative summary (JP or EN). Example: `og画像設置` or `Add Open Graph image`.
- PRs should include:
  - Purpose, scope, and screenshots of UI changes.
  - Linked issue(s) if applicable.
  - Notes on accessibility/SEO if affected (titles, meta, alt text).
- CI: PRs auto-build and deploy a Cloudflare Pages preview (see `.github/workflows/pr-preview.yml`). Ensure the preview renders as expected.

## Security & Deployment
- Production deploys use `dist/`. Do not commit secrets.
- PR previews require GitHub secrets: `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`.
- Large media: place in `public/`, optimize and use sensible filenames.

## Agent-Specific Notes
- Keep changes minimal and localized; follow structure and style above.
- Do not alter workflow or Wrangler config without explicit request.
- Preserve Japanese copy where present; coordinate text changes via PR review.

