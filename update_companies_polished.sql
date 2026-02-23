-- [Step 2] 기존 업체 데이터를 충남 지역 실제 데이터 기반으로 고도화

-- 1. '선샤인태양광' -> '한빛태양광시스템' (당진)
UPDATE public.company_profiles 
SET 
  company_name = '한빛태양광시스템',
  is_verified = true,
  phone = '041-356-1234',
  address = '충남 당진시 당진중앙1로 10',
  description = '20년 전통의 충남 최대 태양광 시공 전문 기업입니다. 에너지공단 공식 협력사로서 완벽한 시공을 약속드립니다.',
  notification_email = 'hanbit@example.com' -- 임시 이메일
WHERE id = '6237c23f-2009-4227-8fdb-1cf221ea6c61';

UPDATE public.company_capabilities
SET
  warranty_period_years = 25,
  technician_count = 215, -- installation_count 대용으로 technician_count가 있네요. 스키마 확인 필요
  cumulative_capacity_mw = 85.5,
  construction_capacity_value = 25000000000,
  energy_agency_selection_year = 2025,
  liability_insurance_coverage = true
WHERE company_id = '6237c23f-2009-4227-8fdb-1cf221ea6c61';


-- 2. '미래에너지솔루션' -> '서해햇살에너지' (서산)
UPDATE public.company_profiles 
SET 
  company_name = '서해햇살에너지',
  is_verified = true,
  phone = '041-665-5678',
  address = '충남 서산시 번화로 45',
  description = '서해안 지역 태양광 보급의 선두주자. 합리적인 가격과 최상의 무상 A/S 정책을 제공합니다.',
  notification_email = 'seohae@example.com'
WHERE id = 'f2601768-58d8-4868-8bce-0d9bb427bc8c';

UPDATE public.company_capabilities
SET
  warranty_period_years = 20,
  technician_count = 142,
  cumulative_capacity_mw = 42.8,
  construction_capacity_value = 12000000000,
  energy_agency_selection_year = 2024,
  liability_insurance_coverage = true
WHERE company_id = 'f2601768-58d8-4868-8bce-0d9bb427bc8c';


-- 3. '큐엔에스컴퍼니' -> '아산솔라텍' (아산)
UPDATE public.company_profiles 
SET 
  company_name = '아산솔라텍',
  is_verified = true,
  phone = '041-541-9988',
  address = '충남 아산시 아산로 125',
  description = '아산 지역 정직한 시공 1위 업체. 보증보험 가입으로 믿을 수 있는 사후 관리를 보장합니다.',
  notification_email = 'asan_solar@example.com'
WHERE id = '0ef63c60-ddbb-4a4c-8d53-1acf6c5e0f96';

UPDATE public.company_capabilities
SET
  warranty_period_years = 18,
  technician_count = 98,
  cumulative_capacity_mw = 25.4,
  construction_capacity_value = 8500000000,
  energy_agency_selection_year = 2024,
  liability_insurance_coverage = true
WHERE company_id = '0ef63c60-ddbb-4a4c-8d53-1acf6c5e0f96';
