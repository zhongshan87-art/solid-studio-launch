import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  url: string;
  error?: string;
}

export async function uploadMediaToSupabase(
  file: File,
  projectId: string
): Promise<UploadResult> {
  try {
    // 生成唯一文件名
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${projectId}/${timestamp}.${fileExt}`;
    
    // 上传到 Supabase Storage
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Upload error:', error);
      return { url: '', error: error.message };
    }
    
    // 获取公共 URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName);
    
    return { url: publicUrl };
  } catch (error) {
    console.error('Upload exception:', error);
    return { 
      url: '', 
      error: error instanceof Error ? error.message : 'Upload failed' 
    };
  }
}
