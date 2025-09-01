// Pull in required modules
const { createClient } = require('@supabase/supabase-js');
const baseUrls = require('../config');

// Create a single supabase client for use throughout the app
const supabaseKey = process.env.SUPABASE_SECRET_DEFAULT_KEY; 
const supabase = createClient(baseUrls.SUPABASE_URL, supabaseKey);
module.exports = supabase;