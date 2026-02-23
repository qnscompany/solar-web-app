-- 1. company_profiles 테이블에 알림 수신 이메일 컬럼 추가
ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS notification_email TEXT;

-- 2. (옵션) 기존 데이터에 연락처가 있다면 초기값으로 활용할 수 있으나, 
-- 현재는 수동 입력을 원칙으로 하므로 빈 상태로 둡니다.

-- 3. RLS 정책 확인: 사장님(owner)만 자신의 notification_email을 수정할 수 있어야 함
-- 기존 "Allow all for admin dashboard" 정책이 있어 어드민은 가능하며,
-- 일반 사용자의 프로필 수정 정책은 onboarding 페이지 로직에서 처리됩니다.
