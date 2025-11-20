-- 创建 project-images 存储桶
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
);

-- 允许所有人查看图片（公开读取）
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- 允许所有人上传图片（如果需要限制，可以添加 auth.uid() 验证）
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-images');