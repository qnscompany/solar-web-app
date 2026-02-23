-- 1. lead_requests 테이블에 기타사항(notes) 컬럼 추가
ALTER TABLE lead_requests ADD COLUMN IF NOT EXISTS notes TEXT;

-- 2. 기존 RLS 정책은 그대로 유지됩니다. (익명 사용자의 INSERT 허용)
