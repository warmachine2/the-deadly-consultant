-- Create strategy_sessions table
CREATE TABLE public.strategy_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role_current TEXT NOT NULL,
  years_experience INTEGER NOT NULL,
  education_certifications TEXT,
  biggest_pain_point TEXT NOT NULL,
  pivot_timeline TEXT,
  whatsapp_number TEXT
);

-- Add unique constraint on email
CREATE UNIQUE INDEX strategy_sessions_email_unique ON public.strategy_sessions(email);

-- Enable Row Level Security
ALTER TABLE public.strategy_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit strategy session requests"
ON public.strategy_sessions
FOR INSERT
WITH CHECK (true);

-- Create app_role enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table for admin access
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Only admins can read strategy sessions
CREATE POLICY "Admins can view all strategy sessions"
ON public.strategy_sessions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update strategy sessions
CREATE POLICY "Admins can update strategy sessions"
ON public.strategy_sessions
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete strategy sessions
CREATE POLICY "Admins can delete strategy sessions"
ON public.strategy_sessions
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));