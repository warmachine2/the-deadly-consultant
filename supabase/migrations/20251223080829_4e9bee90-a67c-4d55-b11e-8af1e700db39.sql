-- Drop the restrictive insert policy temporarily
DROP POLICY IF EXISTS "Admins can insert user roles" ON public.user_roles;

-- Create a bootstrap policy: allow any authenticated user to insert IF no admins exist yet
CREATE POLICY "Bootstrap first admin"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  role = 'admin' 
  AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
);

-- Re-add the admin insert policy for future admin assignments
CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));