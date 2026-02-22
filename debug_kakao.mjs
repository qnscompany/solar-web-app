import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jfnkcbrzernqmmnljagu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmbmtjYnJ6ZXJucW1tbmxqYWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzAzMDcsImV4cCI6MjA4NzMwNjMwN30.Oa8iprY85YhBIFJdD9MQ8UZkHLucYKjTHod99J4sDJs';
const kakaoRestApiKey = '888f33f046aed97ad0208cf8bdbb9ce9';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getCoordinates(address) {
    try {
        const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
        console.log(`Checking URL: ${url}`);
        const response = await fetch(
            url,
            {
                headers: {
                    Authorization: `KakaoAK ${kakaoRestApiKey}`,
                },
            }
        );

        const data = await response.json();
        console.log('Kakao Response:', JSON.stringify(data, null, 2));

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
    const address = '충남 당진시 무수동1길 11';
    console.log(`Testing with address: ${address}`);
    const coords = await getCoordinates(address);
    console.log('Result:', coords);
}

migrate();
