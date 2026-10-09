ALTER TABLE public.student_seat_intakes ALTER COLUMN years_experience DROP NOT NULL;
ALTER TABLE public.student_seat_intakes ALTER COLUMN proof_consent DROP NOT NULL;
COMMENT ON COLUMN public.student_seat_intakes.years_experience IS 'DEPRECATED: no longer collected by Student Intake';
COMMENT ON COLUMN public.student_seat_intakes.proof_consent IS 'DEPRECATED: no longer collected by Student Intake';