-- ============================================
-- MOBENG RECRUITMENT PORTAL - DATABASE SCHEMA
-- ============================================
-- Run this migration in your Supabase SQL Editor
-- Go to: https://app.supabase.com/project/[PROJECT_ID]/sql/new

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Question Sets Table
CREATE TABLE IF NOT EXISTS public.question_sets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  question_set_id TEXT REFERENCES public.question_sets(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of strings: ["Option A", "Option B", "Option C", "Option D"]
  correct_answer_index INT NOT NULL CHECK (correct_answer_index >= 0 AND correct_answer_index < 4)
);

-- Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  initial_scenario TEXT NOT NULL,
  system_instruction TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notification Logs Table
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  candidate_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp')),
  type TEXT NOT NULL CHECK (type IN ('invitation', 'result', 'reminder')),
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
  sent_at TIMESTAMPTZ,
  error TEXT
);

-- Update Submissions Table (Add document upload support)
ALTER TABLE IF EXISTS public.submissions 
ADD COLUMN IF NOT EXISTS uploaded_documents JSONB DEFAULT '[]'::jsonb;

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_questions_question_set_id ON public.questions(question_set_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_candidate_id ON public.notification_logs(candidate_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON public.notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_notification_logs_channel ON public.notification_logs(channel);

-- ============================================
-- 3. INSERT SAMPLE DATA
-- ============================================

-- Insert sample question sets
INSERT INTO public.question_sets (id, name, description) VALUES
  ('set_a', 'Paket A', 'Question set A - Numeracy & Verbal Reasoning'),
  ('set_b', 'Paket B', 'Question set B - Spatial & Logical Reasoning'),
  ('set_c', 'Paket C', 'Question set C - Mixed Difficulty'),
  ('set_d', 'Paket D', 'Question set D - Advanced Level'),
  ('set_e', 'Paket E', 'Question set E - Expert Level')
ON CONFLICT (id) DO NOTHING;

-- Insert sample questions for Set A
INSERT INTO public.questions (question_set_id, text, options, correct_answer_index) VALUES
  ('set_a', 'Jika 2x + 5 = 15, berapa nilai x?', '["2", "3", "4", "5"]', 2),
  ('set_a', 'Manakah kata yang merupakan sinonim dari "cepat"?', '["lambat", "gesit", "berat", "gelap"]', 1),
  ('set_a', 'Berapa hasil dari 25 × 4?', '["50", "75", "100", "125"]', 2),
  ('set_a', 'Jika sebuah persegi memiliki sisi 5 cm, berapa luasnya?', '["20 cm²", "25 cm²", "30 cm²", "35 cm²"]', 1),
  ('set_a', 'Manakah urutan yang benar dari terkecil ke terbesar: 0.5, 0.05, 0.505, 0.055?', '["0.05, 0.055, 0.5, 0.505", "0.05, 0.055, 0.505, 0.5", "0.05, 0.5, 0.055, 0.505", "0.055, 0.05, 0.5, 0.505"]', 0),
  ('set_a', 'Jika Anda membeli 3 item seharga Rp 15.000 masing-masing dan mendapat diskon 10%, berapa total yang harus dibayar?', '["Rp 40.500", "Rp 42.000", "Rp 40.500", "Rp 45.000"]', 0),
  ('set_a', 'Manakah yang bukan merupakan bilangan prima?', '["7", "11", "15", "13"]', 2),
  ('set_a', 'Berapa persentase dari 50 adalah 25?', '["25%", "50%", "75%", "100%"]', 1),
  ('set_a', 'Jika rata-rata dari 4 angka adalah 10, berapa jumlah keseluruhan?', '["30", "35", "40", "45"]', 2),
  ('set_a', 'Manakah kalimat yang gramatikal benar?', '["Dia pergi ke toko untuk membeli barang", "Dia pergi ke toko untuk membeli barang-barang", "Dia pergi ke toko untuk membeli barang yang", "Dia pergi ke toko untuk membeli"]', 0)
ON CONFLICT DO NOTHING;

-- Insert sample roles
INSERT INTO public.roles (id, label, description, initial_scenario, system_instruction) VALUES
  ('store_leader', 'Store Leader', 'Kepemimpinan toko dan manajemen tim', 
   'Anda adalah seorang Store Leader di Mobeng. Seorang customer datang dengan keluhan tentang produk yang rusak. Bagaimana Anda menangani situasi ini?',
   'Evaluasi kemampuan kepemimpinan, pengambilan keputusan, dan customer service. Berikan skor untuk Sales, Leadership, Operations, dan Customer Experience.'),
  ('sales_executive', 'Sales Executive', 'Penjualan dan customer engagement', 
   'Anda adalah Sales Executive. Seorang customer tertarik dengan produk tapi masih ragu dengan harga. Apa yang Anda lakukan?',
   'Evaluasi kemampuan sales, persuasi, dan product knowledge. Berikan skor untuk Sales, Leadership, Operations, dan Customer Experience.'),
  ('customer_service', 'Customer Service', 'Layanan pelanggan dan support', 
   'Anda adalah Customer Service Representative. Seorang customer menelepon dengan masalah teknis. Bagaimana Anda meresponnya?',
   'Evaluasi kemampuan customer service, empati, dan problem solving. Berikan skor untuk Sales, Leadership, Operations, dan Customer Experience.'),
  ('operations_manager', 'Operations Manager', 'Manajemen operasional dan efisiensi', 
   'Anda adalah Operations Manager. Terjadi keterlambatan pengiriman barang. Apa langkah Anda?',
   'Evaluasi kemampuan manajemen operasional, planning, dan crisis management. Berikan skor untuk Sales, Leadership, Operations, dan Customer Experience.'),
  ('marketing_specialist', 'Marketing Specialist', 'Pemasaran dan brand awareness', 
   'Anda adalah Marketing Specialist. Kampanye terbaru tidak mencapai target. Apa strategi Anda?',
   'Evaluasi kemampuan marketing, kreativitas, dan analytical thinking. Berikan skor untuk Sales, Leadership, Operations, dan Customer Experience.')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on tables
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. CREATE RLS POLICIES
-- ============================================

-- Questions: Everyone can read, only admin can write
CREATE POLICY "questions_read" ON public.questions
  FOR SELECT USING (true);

CREATE POLICY "questions_write" ON public.questions
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "questions_update" ON public.questions
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "questions_delete" ON public.questions
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Roles: Everyone can read, only admin can write
CREATE POLICY "roles_read" ON public.roles
  FOR SELECT USING (true);

CREATE POLICY "roles_write" ON public.roles
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "roles_update" ON public.roles
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "roles_delete" ON public.roles
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Question Sets: Everyone can read, only admin can write
CREATE POLICY "question_sets_read" ON public.question_sets
  FOR SELECT USING (true);

CREATE POLICY "question_sets_write" ON public.question_sets
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Notification Logs: Only admin can read/write
CREATE POLICY "notification_logs_read" ON public.notification_logs
  FOR SELECT USING (auth.jwt() ->> 'role' IN ('admin', 'recruiter'));

CREATE POLICY "notification_logs_write" ON public.notification_logs
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'recruiter'));

-- ============================================
-- 6. CREATE STORAGE BUCKET FOR DOCUMENTS
-- ============================================

-- This needs to be done via Supabase UI or CLI
-- Go to: https://app.supabase.com/project/[PROJECT_ID]/storage/buckets
-- Create a new bucket named "candidate-documents"
-- Set it to Private
-- Add policy to allow authenticated users to upload

-- ============================================
-- 7. VERIFY SETUP
-- ============================================

-- Check if all tables were created
SELECT 
  table_name 
FROM 
  information_schema.tables 
WHERE 
  table_schema = 'public' 
  AND table_name IN ('questions', 'roles', 'question_sets', 'notification_logs')
ORDER BY table_name;

-- Check sample data
SELECT COUNT(*) as question_count FROM public.questions;
SELECT COUNT(*) as role_count FROM public.roles;
SELECT COUNT(*) as question_set_count FROM public.question_sets;
