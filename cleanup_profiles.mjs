import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listAndDelete() {
    const targetUserId = 'd95a706a-f86b-4fe8-a571-12b7dab33908';
    const { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('owner_id', targetUserId)
        .order('created_at', { ascending: false });

    if (data && data.length > 1) {
        console.log(`Found ${data.length} profiles for user ${targetUserId}`);
        data.forEach((p, i) => {
            console.log(`[${i}] ID: ${p.id}, Name: ${p.company_name}, Created: ${p.created_at}`);
        });

        // Keep the first (latest) and delete others
        const toKeep = data[0].id;
        const toDelete = data.slice(1).map(p => p.id);

        console.log(`Keeping: ${toKeep}`);
        console.log(`Deleting: ${toDelete.join(', ')}`);

        for (const id of toDelete) {
            const { error: delError } = await supabase
                .from('company_profiles')
                .delete()
                .eq('id', id);
            if (delError) console.error(`Failed to delete ${id}:`, delError);
            else console.log(`Successfully deleted ${id}`);
        }
    } else {
        console.log('No duplicates found now.');
    }
}

listAndDelete();
