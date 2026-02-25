-- 1. Installation Count Automation Setup
ALTER TABLE company_capabilities ADD COLUMN IF NOT EXISTS installation_count INTEGER DEFAULT 0;

-- Function to update installation count based on completed leads
CREATE OR REPLACE FUNCTION update_company_installation_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND NEW.status = 'installed') OR (TG_OP = 'INSERT' AND NEW.status = 'installed') OR (TG_OP = 'UPDATE' AND OLD.status = 'installed' AND NEW.status <> 'installed') OR (TG_OP = 'DELETE' AND OLD.status = 'installed') THEN
        UPDATE company_capabilities
        SET installation_count = (
            SELECT count(*) 
            FROM lead_requests 
            WHERE company_id = COALESCE(NEW.company_id, OLD.company_id) 
            AND status = 'installed'
        )
        WHERE company_id = COALESCE(NEW.company_id, OLD.company_id);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on lead_requests
DROP TRIGGER IF EXISTS tr_update_installation_count ON lead_requests;
CREATE TRIGGER tr_update_installation_count
AFTER INSERT OR UPDATE OR DELETE ON lead_requests
FOR EACH ROW EXECUTE FUNCTION update_company_installation_count();

-- 2. Review System Tables
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
    lead_request_id UUID REFERENCES lead_requests(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    display_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(lead_request_id) -- One review per lead
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users with completed lead can insert review" ON reviews;
CREATE POLICY "Users with completed lead can insert review" ON reviews FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM lead_requests 
        WHERE id = lead_request_id 
        AND status = 'installed'
    )
);

-- 3. Experience Board Tables
CREATE TABLE IF NOT EXISTS experience_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES company_profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    pros TEXT,
    cons TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experience_post_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES experience_posts(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE experience_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_post_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for experience board
DROP POLICY IF EXISTS "Authenticated users can view experience posts" ON experience_posts;
CREATE POLICY "Authenticated users can view experience posts" ON experience_posts FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can create experience posts" ON experience_posts;
CREATE POLICY "Users can create experience posts" ON experience_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own experience posts" ON experience_posts;
CREATE POLICY "Users can update their own experience posts" ON experience_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can view experience images" ON experience_post_images;
CREATE POLICY "Authenticated users can view experience images" ON experience_post_images FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can upload images to their own posts" ON experience_post_images;
CREATE POLICY "Users can upload images to their own posts" ON experience_post_images FOR INSERT TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM experience_posts 
        WHERE id = post_id AND user_id = auth.uid()
    )
);

-- Constraint for max 3 images per post
CREATE OR REPLACE FUNCTION check_post_image_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT count(*) FROM experience_post_images WHERE post_id = NEW.post_id) >= 3 THEN
        RAISE EXCEPTION 'A post cannot have more than 3 images.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_check_post_image_limit ON experience_post_images;
CREATE TRIGGER tr_check_post_image_limit
BEFORE INSERT ON experience_post_images
FOR EACH ROW EXECUTE FUNCTION check_post_image_limit();

-- 4. Seed Data (Realistic Reviews - Location Specific)
-- 한빛태양광시스템 (6237c23f-2009-4227-8fdb-1cf221ea6c61) - 당진
INSERT INTO reviews (company_id, rating, content, display_name) VALUES
('6237c23f-2009-4227-8fdb-1cf221ea6c61', 5, '당진 시내 아파트 살면서 옥상 설치 고민했는데, 한빛 덕분에 정부 지원금 혜택까지 꼼꼼히 챙겼습니다. 당진 주민들한테는 역시 여기가 최고네요.', '김*진'),
('6237c23f-2009-4227-8fdb-1cf221ea6c61', 4, '합덕읍 전원주택 설치했습니다. 거리가 좀 있는데도 상담부터 시공까지 제때 와주셔서 감사해요. 당진 중앙시장 쪽에서 소문 듣고 왔는데 확실히 친절합니다.', '이*호'),
('6237c23f-2009-4227-8fdb-1cf221ea6c61', 5, '신평면 부모님 댁 설치해드렸어요. 당진 지역 업체라 나중에 A/S 걱정도 덜해서 좋습니다. 발전량이 생각보다 더 좋네요.', '박*아');

-- 서해햇살에너지 (f2601768-58d8-4868-8bce-0d9bb427bc8c) - 서산
INSERT INTO reviews (company_id, rating, content, display_name) VALUES
('f2601768-58d8-4868-8bce-0d9bb427bc8c', 5, '서산 호수공원 근처 상가에 설치했습니다. 가격이 서산 지역에서 가장 합리적이었고, 시청 보조금 신청 절차도 완벽하게 대행해주셨어요.', '최*서'),
('f2601768-58d8-4868-8bce-0d9bb427bc8c', 3, '대산읍 공장 지붕에 시공했습니다. 작업 속도는 빨랐는데 서산 바닷바람 때문인지 마감을 더 신경 써달라고 했더니 바로 보강해주시네요.', '정*우'),
('f2601768-58d8-4868-8bce-0d9bb427bc8c', 5, '서산 동문동 단독주택입니다. 지역 업체라 그런지 사후 관리가 정말 빠릅니다. 어제 점검 요청했는데 오늘 아침에 바로 오셨어요.', '강*윤');

-- 아산솔라텍 (0ef63c60-ddbb-4a4c-8d53-1acf6c5e0f96) - 아산
INSERT INTO reviews (company_id, rating, content, display_name) VALUES
('0ef63c60-ddbb-4a4c-8d53-1acf6c5e0f96', 4, '아산 온양동 주택 설치 후기입니다. 친절한 설명 덕분에 태양광에 대해 잘 알게 되었습니다. 아산 지역 다른 업체보다 전문성이 느껴졌어요.', '윤*태'),
('0ef63c60-ddbb-4a4c-8d53-1acf6c5e0f96', 5, '둔포면 공장 부지 설치 만족합니다. 설치한 지 6개월 지났는데 천안/아산 인근에서 여기가 제일 꼼꼼한 것 같네요.', '임*희'),
('0ef63c60-ddbb-4a4c-8d53-1acf6c5e0f96', 2, '배방읍 아파트 베란다형 설치했는데 소통이 약간 어긋나서 시간이 좀 걸렸습니다. 그래도 설치 자체는 견고하네요.', '송*민');

-- Initial count update
UPDATE company_capabilities cc
SET installation_count = (
    SELECT count(*) 
    FROM lead_requests lr 
    WHERE lr.company_id = cc.company_id 
);
-- 5. Seed Leads (Diverse status data for Dashboard testing)
DELETE FROM reviews;
DELETE FROM experience_posts;
DELETE FROM lead_requests;

INSERT INTO lead_requests (company_id, customer_name, phone, address, expected_capacity, status) VALUES
-- 한빛태양광시스템 (당진)
('6237c23f-2009-4227-8fdb-1cf221ea6c61', '이*호', '010-1111-2222', '충남 당진시 합덕읍', '5kW', 'installed'),
('6237c23f-2009-4227-8fdb-1cf221ea6c61', '박*아', '010-3333-4444', '충남 당진시 신평면', '3kW', 'installed'),
('6237c23f-2009-4227-8fdb-1cf221ea6c61', '김*지', '010-9999-8888', '충남 당진시 읍내동', '6kW', 'completed'),
('6237c23f-2009-4227-8fdb-1cf221ea6c61', '최*민', '010-7777-6666', '충남 당진시 송악읍', '10kW', 'consulting'),
('6237c23f-2009-4227-8fdb-1cf221ea6c61', '한*수', '010-5555-4444', '충남 당진시 고대면', '3kW', 'pending'),

-- 서해햇살에너지 (서산)
('f2601768-58d8-4868-8bce-0d9bb427bc8c', '정*우', '010-3333-4444', '충남 서산시 대산읍', '3kW', 'installed'),
('f2601768-58d8-4868-8bce-0d9bb427bc8c', '조*현', '010-8888-7777', '충남 서산시 석남동', '5kW', 'completed'),
('f2601768-58d8-4868-8bce-0d9bb427bc8c', '백*희', '010-2222-3333', '충남 서산시 해미면', '15kW', 'consulting'),
('f2601768-58d8-4868-8bce-0d9bb427bc8c', '유*재', '010-4444-5555', '충남 서산시 동문동', '5kW', 'pending'),

-- 아산솔라텍 (아산)
('0ef63c60-ddbb-4a4c-8d53-1acf6c5e0f96', '임*희', '010-5555-6666', '충남 아산시 둔포면', '10kW', 'installed'),
('0ef63c60-ddbb-4a4c-8d53-1acf6c5e0f96', '송*민', '010-1111-9999', '충남 아산시 배방읍', '3kW', 'completed'),
('0ef63c60-ddbb-4a4c-8d53-1acf6c5e0f96', '노*준', '010-6666-7777', '충남 아산시 온양동', '5kW', 'consulting'),
('0ef63c60-ddbb-4a4c-8d53-1acf6c5e0f96', '권*아', '010-1234-5678', '충남 아산시 탕정면', '6kW', 'pending');
