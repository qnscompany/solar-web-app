import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('--- Checking company_profiles Schema ---');
    const { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Available columns:', Object.keys(data[0]));
    } else {
        console.log('No data found to infer columns.');
        // Fallback: try to get column names from information_schema
        const { data: cols, error: colError } = await supabase.rpc('get_column_names', { table_name: 'company_profiles' });
        console.log('Columns from RPC:', cols || colError);
    }
}

checkSchema();
