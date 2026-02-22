-- Lead Requests Table Schema
CREATE TABLE lead_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  expected_capacity TEXT NOT NULL, -- or NUMERIC if we want numbers
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Recommended)
ALTER TABLE lead_requests ENABLE ROW LEVEL SECURITY;

-- Allow public insertion for now (as it's a lead gen form)
CREATE POLICY "Allow public insert" ON lead_requests FOR INSERT WITH CHECK (true);

-- Allow reading only if authenticated (or whatever business logic is needed)
CREATE POLICY "Allow public select" ON lead_requests FOR SELECT USING (true);
