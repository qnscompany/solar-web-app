async function getCoords(query, apiKey) {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `KakaoAK ${apiKey}` }
        });
        const data = await response.json();
        if (data.documents && data.documents.length > 0) {
            return {
                lat: data.documents[0].y,
                lng: data.documents[0].x,
                addr: data.documents[0].address_name
            };
        }
        return null;
    } catch (error) {
        return null;
    }
}

async function run() {
    const apiKey = process.env.KAKAO_REST_API_KEY;
    const tasks = [
        { id: '6237c23f-2009-4227-8fdb-1cf221ea6c61', name: '한빛태양광시스템', query: '충남 당진시 당진중앙1로 10' },
        { id: 'f2601768-58d8-4868-8bce-0d9bb427bc8c', name: '서해햇살에너지', query: '충남 서산시 번화로 45' },
        { id: '0ef63c60-ddbb-4a4c-8d53-1acf6c5e0f96', name: '아산솔라텍', query: '충남 아산시 아산로 125' }
    ];

    console.log('--- Geocoding SQL ---');
    for (const task of tasks) {
        const result = await getCoords(task.query, apiKey);
        if (result) {
            console.log(`UPDATE public.company_profiles SET latitude = ${result.lat}, longitude = ${result.lng} WHERE id = '${task.id}'; -- ${task.name} (${result.addr})`);
        } else {
            console.log(`-- FAILED: ${task.name}`);
        }
    }
}

run();
