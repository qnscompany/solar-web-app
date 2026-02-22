import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateLeads() {
    const activeCompanyId = 'd8898504-69db-4a58-81d0-a23455b28cef';
    const deletedCompanyIds = [
        '0ef63c60-ddbb-4a4c-8d53-1acf6c5e0f96',
        '29b26374-3968-477a-a824-893b1e0b69d2'
    ];

    console.log(`Migrating leads to active Company ID: ${activeCompanyId}`);

    for (const oldId of deletedCompanyIds) {
        const { data, error } = await supabase
            .from('lead_requests')
            .update({ company_id: activeCompanyId })
            .eq('company_id', oldId)
            .select();

        if (error) {
            console.error(`Error migrating from ${oldId}:`, error);
        } else if (data && data.length > 0) {
            console.log(`Successfully migrated ${data.length} leads from ${oldId}`);
        } else {
            console.log(`No leads to migrate from ${oldId}`);
        }
    }
}

migrateLeads();
