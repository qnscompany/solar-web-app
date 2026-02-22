'use server';

export async function getCoordinatesAction(address: string) {
    const kakaoRestApiKey = process.env.KAKAO_REST_API_KEY;

    if (!kakaoRestApiKey) {
        throw new Error('KAKAO_REST_API_KEY is not defined');
    }

    try {
        const response = await fetch(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
            {
                headers: {
                    Authorization: `KakaoAK ${kakaoRestApiKey}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Kakao API request failed: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.documents && data.documents.length > 0) {
            const { x, y } = data.documents[0];
            return {
                lat: parseFloat(y),
                lng: parseFloat(x),
            };
        }

        return null;
    } catch (error) {
        console.error('Error in getCoordinatesAction:', error);
        throw error;
    }
}
