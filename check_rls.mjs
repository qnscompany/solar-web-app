import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Admin 권한 필요

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPolicies() {
    console.log('Checking RLS Policies for lead_requests...');
    try {
        const { data, error } = await supabase.rpc('get_policies', { table_name: 'lead_requests' });

        // rpc가 없을 경우를 대비해 직접 쿼리 (pg_policies)
        const { data: policies, error: queryError } = await supabase
            .from('pg_policies')
            .select('*')
            .eq('tablename', 'lead_requests');

        if (queryError) {
            console.log('Direct query fallback...');
            const { data: raw, error: rawError } = await supabase.run_sql?.('SELECT * FROM pg_policies WHERE tablename = \'lead_requests\'');
            console.log(raw || rawError);
        } else {
            console.log(JSON.stringify(policies, null, 2));
        }
    } catch (err) {
        console.error('Failed to fetch policies:', err.message);
    }
}

// 간단하게 insert후 select가 되는지만 테스트
async function testInsertSelect() {
    const { data, error } = await createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        .from('lead_requests')
        .insert([{ customer_name: 'RLS TEST', company_id: '0ef63c60-ddbb-4a4c-8d53-1acf6c5e0f96' }])
        .select();

    console.log('Anon Insert+Select Test Success:', !!data && data.length > 0);
    if (!data || data.length === 0) {
        console.log('Potential RLS Issue: Insert succeeded but Select returned empty data.');
    }
}

testInsertSelect();
