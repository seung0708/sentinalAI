import {createClient, SupabaseClient} from '@supabase/supabase-js'
import {Database} from '../types/supabase'
import dotenv from 'dotenv'

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL or Service Role Key is not defined!');
  }

export const supabase: SupabaseClient = createClient<Database>(supabaseUrl, supabaseKey)