# Amin Aziz — Portfolio

A single-page portfolio for Amin Aziz, a Business Analyst. The site is built with React, TypeScript, and Vite.

## Run locally

```bash
npm install
npm run dev
```

## Update content

Edit `src/portfolio-data.ts` to update the public copy, career journey, capability cards, and contact details. Keep public details limited to information you have approved for publication.

## Build

```bash
npm run build
```

The static site is produced in `dist/`.

## GitHub Pages

The included workflow deploys the `main` branch to GitHub Pages. Before publishing:

1. Create or choose a repository.
2. In GitHub, set **Settings → Pages → Source** to **GitHub Actions**.
3. Update the canonical and Open Graph URLs in `index.html` with the final Pages address.
4. Review public content and push `main`.

`General CV.md` is intentionally ignored and must not be committed.
