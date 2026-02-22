import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function finalCheck() {
    const targetUserId = 'd95a706a-f86b-4fe8-a571-12b7dab33908';

    console.log('--- Current Profiles in DB ---');
    const { data: profiles } = await supabase
        .from('company_profiles')
        .select('*');

    profiles?.forEach(p => {
        console.log(`Profile: ${p.id}, Name: ${p.company_name}, Owner: ${p.owner_id}`);
    });

    console.log('\n--- Recent Leads in DB ---');
    const { data: leads } = await supabase
        .from('lead_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    leads?.forEach(l => {
        console.log(`Lead: ${l.id}, To Co ID: ${l.company_id}, From: ${l.customer_name}`);
    });
}

finalCheck();
