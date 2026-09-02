# RS Beli Luk

Planer za uzgajanje belog luka — Next.js aplikacija sa SQLite bazom, hostovana na Railway.

## Pokretanje lokalno

```bash
npm install
npm run dev
```

Aplikacija: http://localhost:3000

## Deploy na Railway

1. Na [railway.app](https://railway.app) kreiraj novi projekat iz GitHub repoa `rs-beli-luk`
2. Railway automatski koristi `Dockerfile` iz repoa
3. Dodaj **Volume** mount na `/app/apps/web/data` (SQLite baza ostaje trajna)
4. Railway dodeljuje javni URL — taj link možeš deliti

Podaci (checklist, troškovi) čuvaju se u SQLite bazi na serveru — isti su na svim uređajima i browserima.

## Struktura

- `apps/web` — Next.js aplikacija
- `packages/shared` — sorte, šabloni zadataka, kalkulacije
- `apps/web/data/` — SQLite baza (runtime, na Railway volume-u)
