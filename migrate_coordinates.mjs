import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jfnkcbrzernqmmnljagu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmbmtjYnJ6ZXJucW1tbmxqYWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzAzMDcsImV4cCI6MjA4NzMwNjMwN30.Oa8iprY85YhBIFJdD9MQ8UZkHLucYKjTHod99J4sDJs';
const kakaoRestApiKey = '888f33f046aed97ad0208cf8bdbb9ce9';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getCoordinates(address) {
    try {
        const response = await fetch(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
            {
                headers: {
                    Authorization: `KakaoAK ${kakaoRestApiKey}`,
                },
            }
        );

        const data = await response.json();
        if (data.documents && data.documents.length > 0) {
            const { x, y } = data.documents[0];
            return { lat: parseFloat(y), lng: parseFloat(x) };
        }
        return null;
    } catch (error) {
        console.error(`Error geocoding ${address}:`, error);
        return null;
    }
}

async function migrate() {
    console.log('Fetching companies without coordinates...');
    const { data: companies, error } = await supabase
        .from('company_profiles')
        .select('id, company_name, headquarters_address')
        .or('latitude.is.null,longitude.is.null');

    if (error) {
        console.error('Fetch error:', error);
        return;
    }

    console.log(`Found ${companies.length} companies to update.`);

    for (const company of companies) {
        if (!company.headquarters_address) {
            console.log(`Skipping ${company.company_name}: No address`);
            continue;
        }

        console.log(`Geocoding ${company.company_name}: ${company.headquarters_address}`);
        const coords = await getCoordinates(company.headquarters_address);

        if (coords) {
            const { error: updateError } = await supabase
                .from('company_profiles')
                .update({
                    latitude: coords.lat,
                    longitude: coords.lng
                })
                .eq('id', company.id);

            if (updateError) {
                console.error(`Failed to update ${company.company_name}:`, updateError);
            } else {
                console.log(`Updated ${company.company_name} with ${coords.lat}, ${coords.lng}`);
            }
        } else {
            console.warn(`Could not find coordinates for ${company.company_name}`);
        }
    }
    console.log('Migration complete.');
}

migrate();
