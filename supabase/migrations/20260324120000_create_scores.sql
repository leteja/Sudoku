-- Public Sudoku completion times (anonymous play — no auth required).
-- Safe to re-run in Supabase SQL Editor.

create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  player_name text,
  difficulty text not null
    check (difficulty in ('easy', 'medium', 'hard')),
  time_seconds integer not null
    check (time_seconds > 0 and time_seconds < 86400),
  created_at timestamptz not null default now()
);

create index if not exists scores_difficulty_time_idx
  on public.scores (difficulty, time_seconds asc);

alter table public.scores enable row level security;

grant select, insert on table public.scores to anon, authenticated;

drop policy if exists "Public read scores" on public.scores;
create policy "Public read scores"
  on public.scores
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public insert scores" on public.scores;
create policy "Public insert scores"
  on public.scores
  for insert
  to anon, authenticated
  with check (
    time_seconds > 0
    and time_seconds < 86400
    and difficulty in ('easy', 'medium', 'hard')
    and (player_name is null or char_length(player_name) <= 32)
  );
