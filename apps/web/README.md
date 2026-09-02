# RS Beli Luk

Planer za uzgajanje belog luka — Next.js PWA sa SQLite bazom.

## Pokretanje lokalno

```bash
npm install
npm run dev
```

Aplikacija: http://localhost:3000

## Javni link (Render + GitHub Actions)

1. Na [render.com](https://render.com) kreiraj **New → Blueprint** i poveži repo `MilenaMoracanin/beli-luk-ekosistem` (koristi `render.yaml`).
2. Render će dati javni URL, npr. `https://beli-luk-ekosistem.onrender.com`.
3. Svaki push na `main` pokreće GitHub Actions:
   - **CI** — provera builda
   - **Deploy** — Docker slika na GHCR + opcioni Render deploy hook

Opciono: u GitHub repo **Settings → Secrets → Actions** dodaj `RENDER_DEPLOY_HOOK` (Render → Service → Deploy Hook) da Actions automatski osvežava sajt posle pusha.

## Struktura

- `apps/web` — Next.js aplikacija
- `packages/shared` — sorte i šabloni zadataka
