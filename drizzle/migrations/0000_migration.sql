CREATE TABLE public.student_seat_intakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 150),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  whatsapp_number text NOT NULL CHECK (char_length(whatsapp_number) BETWEEN 7 AND 30),
  linkedin_url text NOT NULL CHECK (char_length(linkedin_url) <= 500),
  resume_file_path text NOT NULL CHECK (char_length(resume_file_path) <= 300),
  current_title_employer text NOT NULL CHECK (char_length(current_title_employer) BETWEEN 1 AND 200),
  years_experience integer NOT NULL CHECK (years_experience BETWEEN 3 AND 60),
  contract_location text NOT NULL CHECK (contract_location IN ('Canada','USA','Remote either')),
  proof_consent text NOT NULL CHECK (proof_consent IN ('Full name ok','First name only','Do not use my name')),
  submitted_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.student_seat_intakes TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.student_seat_intakes TO authenticated;
GRANT ALL ON public.student_seat_intakes TO service_role;
ALTER TABLE public.student_seat_intakes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit seat intake" ON public.student_seat_intakes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins view seat intakes" ON public.student_seat_intakes FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update seat intakes" ON public.student_seat_intakes FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete seat intakes" ON public.student_seat_intakes FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Anyone can upload student resumes" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'student-resumes' AND (lower(name) LIKE '%.pdf' OR lower(name) LIKE '%.docx'));
CREATE POLICY "Admins read student resumes" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'student-resumes' AND public.has_role(auth.uid(),'admin'));