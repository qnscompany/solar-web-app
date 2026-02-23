/**
 * 숫자를 한국 화폐 단위(억, 만)로 변환하는 유틸리티 함수입니다.
 * 
 * @param amount - 변환할 원 단위의 금액
 * @returns 변환된 문자열 (예: 15.0억 원, 7,500만 원)
 * 
 * 변환 규칙:
 * 1. 1억 이상: 억 단위로 변환, 소수점 1자리까지 표시
 * 2. 1억 미만 1천만 이상: '○천만 원' 표기
 * 3. 1천만 미만 1백만 이상: '○백만 원' 표기
 * 4. 그 외: 천 단위 콤마
 */
export function formatKoreanWon(amount: number): string {
    if (!amount || amount === 0) return '0원';

    if (amount >= 100_000_000) {
        return `${(amount / 100_000_000).toFixed(1)}억 원`;
    } else if (amount >= 10_000_000) {
        // 천만 단위에서는 콤마를 포함하여 '○,○○○만 원' 형태가 될 수 있도록 함
        return `${(amount / 10_000).toLocaleString('ko-KR')}만 원`;
    } else if (amount >= 1_000_000) {
        return `${(amount / 10_000).toLocaleString('ko-KR')}만 원`;
    }

    return `${amount.toLocaleString('ko-KR')}원`;
}
