import { supabase } from '@/integrations/supabase/client';

export async function uploadImage(file: File, folder: string = 'media'): Promise<string> {
  // Try uploading via Edge Function first (bypasses client-side environment restrictions)
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const { data, error } = await supabase.functions.invoke('upload-image', {
      body: formData,
    });

    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    
    return data.publicUrl;
  } catch (edgeFunctionError) {
    console.warn('Edge function upload failed, trying direct upload:', edgeFunctionError);
    
    // Fallback to direct upload (may work in production environment)
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return publicUrl;
  }
}
