# Sudoku — užrašai ir atsakymai

Žaidžiamas Sudoku su **užrašų režimu**, širdimis, laikmačiu, pauze ir viešais **rekordais** (Supabase).

## Kaip žaisti

1. Pasirink langelį lentoje.
2. Įjunk **Užrašai** — skaičius atsiranda mažas, kampe (galima kelis).
3. Įjunk **Atsakymas** — skaičius įrašomas didelis kaip galutinis atsakymas.
4. Naudok **Tikrinti atsakymus** arba **Užuomina**, jei įstrigai.
5. Laimėjęs gali (nebūtinai) įrašyti laiką į viešą **Rekordai** lentelę.

### Klaviatūra

- `1–9` — įrašyti skaičių
- `N` — perjungti Užrašai / Atsakymas
- `Backspace` / `Delete` — išvalyti langelį
- Rodyklės — judėti lentoje

## Vietinis paleidimas

```bash
npm install
cp .env.example .env.local   # užpildyk Supabase kintamuosius (nebūtina žaidimui)
npm run dev
```

Atidaryk adresą, kurį parodys Vite (numatytasis: `http://127.0.0.1:47321`).

Be `VITE_SUPABASE_*` žaidimas veikia visiškai; rekordų skiltyje matysi pranešimą, kad lentelė nepasiekiama.

## Stack

- Vite + React + TypeScript + Tailwind CSS v4
- Vercel (statinis hostingas)
- Supabase (`scores` lentelė, anoniminis skaitymas/įrašymas)

---

## 1) Supabase — vienas SQL žingsnis (privaloma rekordams)

1. Atidaryk [Supabase Dashboard](https://supabase.com/dashboard) → savo projektą.
2. Kairėje: **SQL Editor** → **New query**.
3. Įklijuok visą failą `supabase/migrations/20260324120000_create_scores.sql` → **Run**.

Po to rekordai veikia lokaliai ir po deploy.

### Saugumas

- Commit’ink tik `.env.example`, niekada tikrų raktų (`.env.local` yra gitignore).
- Fronte naudok **anon / publishable** raktą (`VITE_SUPABASE_ANON_KEY`), ne `service_role`.
- RLS leidžia tik SELECT + INSERT; UPDATE/DELETE anonimui nėra.

---

## 2) Viešas URL be GitHub (rekomenduojama, jei Vercel Import nepavyksta)

Kompiuteryje projekto aplanke:

```bash
npm install
npm i -g vercel
vercel login
vercel --prod
```

Kai paklaus env:

- `VITE_SUPABASE_URL` = tavo Project URL  
- `VITE_SUPABASE_ANON_KEY` = anon / publishable raktas  

Arba po deploy: Vercel Dashboard → Project → **Settings → Environment Variables** → pridėk abu → **Redeploy**.

Gausi viešą URL (pvz. `https://….vercel.app`). Keli žmonės gali žaisti vienu metu.

### Alternatyva: drag-and-drop `dist`

```bash
npm run build
```

Tada [vercel.com/new](https://vercel.com/new) → įkelk `dist` aplanką (arba naudok Netlify Drop / panašų static host). Env kintamieji Vite build metu turi būti jau nustatyti (`.env.local` prieš `npm run build`), nes jie įdedami į JS.

---

## 3) Jei Vercel „Import Git Repository“ nepavyksta

- Patikrink, ar Vercel paskyra turi prieigą prie GitHub repo (GitHub → Settings → Applications → Vercel → Repository access).
- Import’ui rinkis tą pačią GitHub paskyrą / organizaciją, kurioje yra repo.
- Jei vis tiek stringa — naudok CLI aukščiau (`vercel login` → `vercel --prod`), GitHub Import nereikia.

---

## Build

```bash
npm run build
npm run preview
```
