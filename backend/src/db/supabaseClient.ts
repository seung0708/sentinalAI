import {createClient, SupabaseClient} from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or Service Role Key is not defined!');
  }

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)