import { createClient } from '@supabase/supabase-js'
import config from '@/config'

// Create a single supabase client for interacting with your database
if (!config.supabaseUrl || !config.supabaseKey) {
    throw new Error('Supabase URL and Key must be provided in config.js');
}

const supabase = createClient(config.supabaseUrl, config.supabaseKey);

export default supabase;
  
