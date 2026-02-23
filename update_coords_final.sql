-- [Step 1] 주소 변경에 따른 위도/경도 좌표 업데이트 (충남 지역 반영)

-- 1. 한빛태양광시스템 (충남 당진시 당진중앙1로 10)
UPDATE public.company_profiles 
SET 
  latitude = 36.8896748, 
  longitude = 126.6322312 
WHERE id = '6237c23f-2009-4227-8fdb-1cf221ea6c61';

-- 2. 서해햇살에너지 (충남 서산시 번화로 45)
UPDATE public.company_profiles 
SET 
  latitude = 36.7828235, 
  longitude = 126.4525992 
WHERE id = 'f2601768-58d8-4868-8bce-0d9bb427bc8c';

-- 3. 아산솔라텍 (충남 아산시 아산로 125)
UPDATE public.company_profiles 
SET 
  latitude = 36.7899741, 
  longitude = 127.0040182 
WHERE id = '0ef63c60-ddbb-4a4c-8d53-1acf6c5e0f96';
