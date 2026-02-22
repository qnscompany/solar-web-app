export async function getCoordinates(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const apiKey = process.env.KAKAO_REST_API_KEY;
        if (!apiKey) {
            console.error('KAKAO_REST_API_KEY is not defined in environment variables.');
            return null;
        }

        const response = await fetch(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
            {
                headers: {
                    Authorization: `KakaoAK ${apiKey}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Kakao API request failed with status ${response.status}`);
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
        console.error('Error in getCoordinates:', error);
        return null;
    }
}
