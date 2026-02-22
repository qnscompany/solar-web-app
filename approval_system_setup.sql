-- 1. company_profiles 테이블에 승인 여부 컬럼 추가 (기본값 false)
ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- 2. 기존에 이미 등록된 6개 업체는 즉시 승인 처리 (서비스 중단 방지)
UPDATE company_profiles SET is_verified = TRUE WHERE is_verified IS FALSE;

-- 3. RLS 정책 업데이트 (운영자가 아니더라도 승인된 업체는 누구나 볼 수 있어야 함)
DROP POLICY IF EXISTS "Individuals can view all company profiles" ON company_profiles;
CREATE POLICY "Individuals can view all company profiles" ON company_profiles 
FOR SELECT USING (is_verified = TRUE);

-- 4. 어드민 대시보드 기능을 위한 정책 (UI 테스트 및 관리용)
DROP POLICY IF EXISTS "Allow all for admin dashboard" ON company_profiles;
CREATE POLICY "Allow all for admin dashboard" ON company_profiles 
FOR ALL USING (true) WITH CHECK (true);
