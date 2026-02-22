import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSpecific() {
    const qsID = '0ef63c60-ddbb-4a4c-8d53-1acf6c5e0f96';
    const jwID = 'd8898504-69db-4a58-81d0-a23455b28cef';

    console.log(`Checking Q&S (${qsID})...`);
    const { data: qs } = await supabase.from('company_profiles').select('*').eq('id', qsID).maybeSingle();
    console.log('Q&S Data:', qs ? `${qs.company_name} (Owner: ${qs.owner_id})` : 'NOT FOUND');

    console.log(`Checking JW (${jwID})...`);
    const { data: jw } = await supabase.from('company_profiles').select('*').eq('id', jwID).maybeSingle();
    console.log('JW Data:', jw ? `${jw.company_name} (Owner: ${jw.owner_id})` : 'NOT FOUND');
}

checkSpecific();
