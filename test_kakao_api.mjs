async function testApi() {
    const apiKey = process.env.KAKAO_REST_API_KEY;
    const address = '충남도청'; // 확실한 장소
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(address)}`;

    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `KakaoAK ${apiKey}` }
        });
        const data = await response.json();
        console.log('API Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('API Test Error:', error);
    }
}

testApi();
