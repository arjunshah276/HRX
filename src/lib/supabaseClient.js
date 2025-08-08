// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * Convenience wrappers (optional)
 */
export const insertProject = async (project) => {
  try {
    const { data, error } = await supabase.from('projects').insert(project).select().single()
    if (error) throw error
    return data
  } catch (err) {
    console.error('insertProject error', err)
    throw err
  }
}

export const insertActivity = async (activity) => {
  try {
    const { data, error } = await supabase.from('activity_logs').insert(activity).select().single()
    if (error) throw error
    return data
  } catch (err) {
    console.error('insertActivity error', err)
    throw err
  }
}

export const fetchProjectsForUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  } catch (err) {
    console.error('fetchProjectsForUser err', err)
    return []
  }
}
