import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Usage: node debug_profiles.mjs <URL> <KEY>');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDuplicates() {
    const targetUserId = 'd95a706a-f86b-4fe8-a571-12b7dab33908';
    console.log('Checking for duplicates of owner_id:', targetUserId);

    const { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('owner_id', targetUserId);

    if (error) {
        console.error('Query Error:', error);
    } else {
        console.log('Profiles found:', data.length);
        data.forEach((p, i) => {
            console.log(`Profile ${i + 1}:`, p.id, p.company_name, p.created_at);
        });

        if (data.length > 1) {
            console.log('--- DUPLICATES DETECTED ---');
            console.log('To fix this, we should delete the older profiles and keep the most recent one.');
        }
    }
}

checkDuplicates();
