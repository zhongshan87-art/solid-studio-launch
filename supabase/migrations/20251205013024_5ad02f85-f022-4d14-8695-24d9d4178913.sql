-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
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

-- RLS policy for user_roles: users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS policy for user_roles: only admins can manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop old permissive policies and create new secure ones for media_cards
DROP POLICY IF EXISTS "Anyone can delete media cards" ON public.media_cards;
DROP POLICY IF EXISTS "Anyone can insert media cards" ON public.media_cards;
DROP POLICY IF EXISTS "Anyone can update media cards" ON public.media_cards;
DROP POLICY IF EXISTS "Anyone can view media cards" ON public.media_cards;

CREATE POLICY "Anyone can view media cards"
ON public.media_cards FOR SELECT
USING (true);

CREATE POLICY "Admins can insert media cards"
ON public.media_cards FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update media cards"
ON public.media_cards FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete media cards"
ON public.media_cards FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop old permissive policies and create new secure ones for projects
DROP POLICY IF EXISTS "Anyone can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can update projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;

CREATE POLICY "Anyone can view projects"
ON public.projects FOR SELECT
USING (true);

CREATE POLICY "Admins can insert projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects"
ON public.projects FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects"
ON public.projects FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop old permissive policies and create new secure ones for project_images
DROP POLICY IF EXISTS "Anyone can delete project images" ON public.project_images;
DROP POLICY IF EXISTS "Anyone can insert project images" ON public.project_images;
DROP POLICY IF EXISTS "Anyone can update project images" ON public.project_images;
DROP POLICY IF EXISTS "Anyone can view project images" ON public.project_images;

CREATE POLICY "Anyone can view project images"
ON public.project_images FOR SELECT
USING (true);

CREATE POLICY "Admins can insert project images"
ON public.project_images FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update project images"
ON public.project_images FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete project images"
ON public.project_images FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop old permissive policies and create new secure ones for studio_data
DROP POLICY IF EXISTS "Anyone can delete studio data" ON public.studio_data;
DROP POLICY IF EXISTS "Anyone can insert studio data" ON public.studio_data;
DROP POLICY IF EXISTS "Anyone can update studio data" ON public.studio_data;
DROP POLICY IF EXISTS "Anyone can view studio data" ON public.studio_data;

CREATE POLICY "Anyone can view studio data"
ON public.studio_data FOR SELECT
USING (true);

CREATE POLICY "Admins can insert studio data"
ON public.studio_data FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update studio data"
ON public.studio_data FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete studio data"
ON public.studio_data FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));