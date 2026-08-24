import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Difficulty } from './sudoku'

export type ScoreRow = {
  id: string
  player_name: string | null
  difficulty: Difficulty
  time_seconds: number
  created_at: string
}

const url = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

export const isSupabaseConfigured = Boolean(url && anonKey)

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null
  if (!client) {
    client = createClient(url, anonKey)
  }
  return client
}

export async function fetchTopScores(
  difficulty: Difficulty | 'all',
  limit = 10,
): Promise<ScoreRow[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  let query = supabase
    .from('scores')
    .select('id, player_name, difficulty, time_seconds, created_at')
    .order('time_seconds', { ascending: true })
    .limit(limit)

  if (difficulty !== 'all') {
    query = query.eq('difficulty', difficulty)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as ScoreRow[]
}

export async function saveScore(input: {
  playerName?: string
  difficulty: Difficulty
  timeSeconds: number
}): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) {
    throw new Error('Supabase nekonfigūruotas')
  }

  const name = input.playerName?.trim().slice(0, 32) || null
  const { error } = await supabase.from('scores').insert({
    player_name: name,
    difficulty: input.difficulty,
    time_seconds: input.timeSeconds,
  })

  if (error) throw error
}
