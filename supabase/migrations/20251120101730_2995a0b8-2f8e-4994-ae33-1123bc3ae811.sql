-- 创建项目表
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  location text NOT NULL,
  main_image_url text NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 创建项目图片表
CREATE TABLE public.project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt text NOT NULL,
  caption text,
  type text NOT NULL DEFAULT 'image' CHECK (type IN ('image', 'video')),
  thumbnail text,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 创建索引以提高查询性能
CREATE INDEX idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX idx_projects_sort_order ON public.projects(sort_order);
CREATE INDEX idx_project_images_sort_order ON public.project_images(project_id, sort_order);

-- 启用 RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- 创建公开读取策略（任何人都可以查看项目）
CREATE POLICY "Anyone can view projects"
  ON public.projects
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view project images"
  ON public.project_images
  FOR SELECT
  USING (true);

-- 创建公开写入策略（暂时允许任何人编辑，后续可根据需求添加认证）
CREATE POLICY "Anyone can insert projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update projects"
  ON public.projects
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete projects"
  ON public.projects
  FOR DELETE
  USING (true);

CREATE POLICY "Anyone can insert project images"
  ON public.project_images
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update project images"
  ON public.project_images
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete project images"
  ON public.project_images
  FOR DELETE
  USING (true);

-- 创建更新时间戳触发器函数
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 projects 表添加触发器
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();