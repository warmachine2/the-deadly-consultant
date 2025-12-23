-- Drop the restrictive policy that blocks users from viewing their own roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Recreate as a PERMISSIVE policy (default) so users can see their own roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());