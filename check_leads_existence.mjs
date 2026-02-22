import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkExistence() {
    // 1. Check all profiles (this will only work if RLS allows anon to see or if we find the correct target)
    const targetUserId = 'd95a706a-f86b-4fe8-a571-12b7dab33908';

    console.log('--- Checking Profiles for User ---');
    // We can't see them via anon if RLS is on, UNLESS we are that user.
    // Instead, let's look at lead_requests and see what company_ids are being used.

    const { data: leads } = await supabase
        .from('lead_requests')
        .select('company_id, customer_name, created_at')
        .limit(10);

    console.log('Recent leads (anon view):', leads?.length || 0);
    if (leads) {
        leads.forEach(l => console.log(`Lead for Company ID: ${l.company_id}, From: ${l.customer_name}`));
    }
}

checkExistence();
