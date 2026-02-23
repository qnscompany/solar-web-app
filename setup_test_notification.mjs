import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTestEmail() {
    const testEmail = process.argv[2];
    const companyQuery = process.argv[3] || '큐엔에스'; // 기본값으로 큐엔에스 설정

    if (!testEmail) {
        console.error('Usage: node --env-file=.env.local setup_test_notification.mjs <your-email> [company-name-keyword]');
        process.exit(1);
    }

    console.log(`Searching for company containing: "${companyQuery}"...`);

    // 업체명으로 검색
    const { data: companies, error: fetchError } = await supabase
        .from('company_profiles')
        .select('id, company_name')
        .ilike('company_name', `%${companyQuery}%`)
        .limit(1);

    if (fetchError || !companies || !companies.length) {
        console.error('Failed to find company:', fetchError?.message || `No company found with name containing "${companyQuery}"`);
        // 검색 실패 시 목록 보여주기
        const { data: all } = await supabase.from('company_profiles').select('company_name').limit(5);
        if (all) console.log('Available companies:', all.map(c => c.company_name).join(', '));
        return;
    }

    const target = companies[0];
    console.log(`Found: [${target.company_name}]. Updating to ${testEmail}...`);

    const { error: updateError } = await supabase
        .from('company_profiles')
        .update({ notification_email: testEmail })
        .eq('id', target.id);

    if (updateError) {
        console.error('Update failed:', updateError.message);
    } else {
        console.log(`✅ Successfully updated [${target.company_name}] with ${testEmail}`);
        console.log('Now you can test the lead request on the website!');
    }
}

setupTestEmail();
