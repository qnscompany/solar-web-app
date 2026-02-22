import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkLeads() {
    const activeCompanyId = 'd8898504-69db-4a58-81d0-a23455b28cef'; // 정원정민태양광 (활성 ID)

    console.log(`Checking leads for active Company ID: ${activeCompanyId}`);

    const { data: leads, error } = await supabase
        .from('lead_requests')
        .select('*')
        .eq('company_id', activeCompanyId);

    if (error) {
        console.error('Fetch Error:', error);
    } else {
        console.log(`Leads found in DB for active company: ${leads.length}`);
        leads.forEach((l, i) => {
            console.log(`[${i}] From: ${l.customer_name}, Status: ${l.status}, Created: ${l.created_at}`);
        });
    }
}

checkLeads();
