import { createClient } from '@supabase/supabase-js';

// Define the types for our database
export type Registration = {
  id?: string;
  name: string;
  email: string;
  created_at?: string;
  reminder_week_sent?: boolean;
  reminder_day_sent?: boolean;
  reminder_hour_sent?: boolean;
  calendar_downloaded?: boolean;
};

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
