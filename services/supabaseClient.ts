/**
 * Supabase Client Configuration
 * Handles connection to Supabase database and authentication
 */

import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that credentials are provided
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
  console.error('You can find these values in your Supabase project settings at:');
  console.error('https://app.supabase.com/project/[PROJECT_ID]/settings/api');
}

// Create and export Supabase client
export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '');

/**
 * Test Supabase connection
 * Use this function to verify that the connection is working
 */
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('submissions').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ Supabase connection successful!');
    return { success: true };
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return { success: false, error: String(error) };
  }
};

/**
 * Get Supabase connection status
 */
export const getSupabaseStatus = () => {
  return {
    url: SUPABASE_URL ? '✅ Configured' : '❌ Missing',
    key: SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing',
    ready: !!(SUPABASE_URL && SUPABASE_ANON_KEY)
  };
};
