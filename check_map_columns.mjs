import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
    console.log('Checking company_profiles schema for latitude/longitude...');
    const { data, error } = await supabase
        .from('company_profiles')
        .select('latitude, longitude')
        .limit(1);

    if (error) {
        if (error.message.includes('column "latitude" does not exist')) {
            console.log('Columns do NOT exist yet. Please run the SQL in Supabase Editor.');
        } else {
            console.error('Error checking schema:', error);
        }
    } else {
        console.log('Columns exist! We are ready to go.');
    }
}

checkSchema();
