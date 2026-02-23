import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCoords() {
    console.log('--- Checking Address vs Coordinates ---');
    const { data, error } = await supabase
        .from('company_profiles')
        .select('id, company_name, headquarters_address, latitude, longitude');

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    console.log(JSON.stringify(data, null, 2));
}

checkCoords();
