const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_DEFAULT_KEY; 
const supabase = createClient('https://imbvxuzmecbzylydhehk.supabase.co', supabaseKey);
module.exports = supabase;