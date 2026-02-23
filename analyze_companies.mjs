import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeData() {
    console.log('--- DB Data Analysis (Step 1) ---');
    const { data, error } = await supabase.from('company_profiles').select(`
        id,
        company_name,
        owner_id,
        is_verified,
        business_registration_number,
        created_at,
        company_capabilities (*)
    `).order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    console.log(JSON.stringify(data, null, 2));
}

analyzeData();
