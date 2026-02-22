import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fullAudit() {
    console.log('--- ALL PROFILES ---');
    const { data: profiles } = await supabase
        .from('company_profiles')
        .select('id, company_name, owner_id');

    profiles?.forEach(p => console.log(`ID: ${p.id}, Name: ${p.company_name}, Owner: ${p.owner_id}`));

    console.log('\n--- ALL LEADS ---');
    const { data: leads } = await supabase
        .from('lead_requests')
        .select('id, company_id, customer_name');

    leads?.forEach(l => console.log(`Lead: ${l.id}, CoID: ${l.company_id}, From: ${l.customer_name}`));

    console.log('\n--- SYSTEM USERS (auth.uid check) ---');
    // We can't list all users via anon key, but we can check the current one if possible
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current Session User ID:', session?.user?.id);
}

fullAudit();
