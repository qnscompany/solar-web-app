import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkLeads() {
    const targetUserId = 'd95a706a-f86b-4fe8-a571-12b7dab33908';

    // 1. Get the company ID for this user
    const { data: profile } = await supabase
        .from('company_profiles')
        .select('id, company_name')
        .eq('owner_id', targetUserId)
        .maybeSingle();

    if (!profile) {
        console.log('No profile found for user');
        return;
    }

    console.log(`Checking leads for Company: ${profile.company_name} (ID: ${profile.id})`);

    // 2. Check leads directly (bypassing RLS if we had service role, but here we use anon so RLS applies)
    const { data: leads, error } = await supabase
        .from('lead_requests')
        .select('*')
        .eq('company_id', profile.id);

    if (error) {
        console.error('Fetch Error:', error);
    } else {
        console.log(`Leads found in DB: ${leads.length}`);
        leads.forEach((l, i) => {
            console.log(`[${i}] From: ${l.customer_name}, Status: ${l.status}, Created: ${l.created_at}`);
        });
    }
}

checkLeads();
