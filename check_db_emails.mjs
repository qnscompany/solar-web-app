import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStatus() {
    const { data, error } = await supabase
        .from('company_profiles')
        .select('id, company_name, notification_email, is_verified');

    if (error) {
        console.error('Fetch error:', error.message);
        return;
    }

    console.log('--- COMPANY VERIFICATION STATUS ---');
    console.log(JSON.stringify(data, null, 2));
}

checkStatus();
