// Pull in required modules
const { createClient } = require('@supabase/supabase-js');
const baseUrls = require('../config');
const EnvHelper = require('../utils/envHelper');

// Create a single supabase client for use throughout the app
const supabase = createClient(baseUrls.SUPABASE_URL, EnvHelper.SUPABASE_SECRET_DEFAULT_KEY);
module.exports = supabase;