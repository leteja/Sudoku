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
cp .env.example .env   # užpildyk Supabase kintamuosius (nebūtina žaidimui)
npm run dev
```

Atidaryk adresą, kurį parodys Vite (numatytasis: `http://127.0.0.1:47321`).

Be `VITE_SUPABASE_*` žaidimas veikia visiškai (offline); rekordų skiltyje matysi pranešimą, kad lentelė nepasiekiama.

## Stack

- Vite + React + TypeScript + Tailwind CSS v4
- Vercel (statinis hostingas)
- Supabase (`scores` lentelė, anoniminis skaitymas/įrašymas)

---

## Vercel — viešas URL

1. Įkelk repo į GitHub (arba naudok esamą).
2. [Vercel](https://vercel.com) → **Add New Project** → prijunk repo.
3. Framework: **Vite**. Build: `npm run build`, Output: `dist` (žr. `vercel.json`).
4. **Environment Variables** (Production):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy → gausi viešą URL (pvz. `https://….vercel.app`).

Arba CLI:

```bash
npx vercel login
npx vercel --prod
```

CLI paklaus env kintamųjų arba juos gali nustatyti dashboard’e prieš `--prod`.

---

## Supabase — rekordai

1. Sukurk projektą [supabase.com](https://supabase.com).
2. **SQL Editor** → paleisk failą  
   `supabase/migrations/20260324120000_create_scores.sql`  
   (lenta `scores`, RLS: viešas SELECT + INSERT, be UPDATE/DELETE anonimui).
3. **Project Settings → API**: nukopijuok **Project URL** ir **anon public** raktą.
4. Įrašyk juos į `.env` lokaliai ir į Vercel Environment Variables.
5. Po deploy bet kas gali atidaryti URL, žaisti be prisijungimo ir (pasirinktinai) įrašyti laiką į **Rekordai**.

### Saugumas

- Commit’ink tik `.env.example`, niekada tikrų raktų.
- Naudok **anon** raktą fronte (ne `service_role`).
- RLS leidžia tik skaityti ir įterpti; atnaujinimų/trynimų anonimui nėra.

## Build

```bash
npm run build
npm run preview
```
