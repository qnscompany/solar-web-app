import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkLeadStatus() {
    const leadId = '6924022e-1c3d-4b23-92ca-2d2bbd686168';
    const { data: lead } = await supabase
        .from('lead_requests')
        .select('*')
        .eq('id', leadId)
        .maybeSingle();

    console.log('Lead Data:', JSON.stringify(lead, null, 2));
}

checkLeadStatus();
