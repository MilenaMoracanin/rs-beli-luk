# RS Beli Luk

Planer za uzgajanje belog luka — statička Next.js aplikacija hostovana na GitHub Pages.

## Pokretanje lokalno

```bash
npm install
npm run dev
```

Aplikacija: http://localhost:3000

## Javni link (GitHub Pages)

Svaki push na `main` pokreće GitHub Actions i deployuje sajt na:

**https://milenaMoracanin.github.io/rs-beli-luk/**

Prvi put: u repo **Settings → Pages → Build and deployment → Source** izaberi **GitHub Actions**.

## Podaci

Nema servera ni baze — sav sadržaj dolazi iz `packages/shared`, a tvoj napredak (checklist, sadnja, berba) se čuva u **localStorage** u browseru.

## Struktura

- `apps/web` — Next.js aplikacija
- `packages/shared` — sorte, šabloni zadataka, kalkulacije
