import { supabase } from '@/integrations/supabase/client';
import type { Project, ProjectImage } from '@/types/project';

// 从云端数据库获取所有项目
export async function fetchProjectsFromDb(): Promise<Project[]> {
  try {
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (projectsError) {
      console.error('Failed to fetch projects:', projectsError);
      return [];
    }

    if (!projects || projects.length === 0) {
      return [];
    }

    // 获取所有项目的图片
    const { data: images, error: imagesError } = await supabase
      .from('project_images')
      .select('*')
      .order('sort_order', { ascending: true });

    if (imagesError) {
      console.error('Failed to fetch project images:', imagesError);
    }

    // 组装数据
    const imagesMap = new Map<string, ProjectImage[]>();
    (images || []).forEach((img) => {
      if (!imagesMap.has(img.project_id)) {
        imagesMap.set(img.project_id, []);
      }
      imagesMap.get(img.project_id)!.push({
        id: img.id,
        url: img.url,
        alt: img.alt,
        caption: img.caption || '',
        type: img.type as 'image' | 'video',
        thumbnail: img.thumbnail || undefined,
      });
    });

    return projects.map((p) => ({
      id: p.id,
      title: p.title,
      location: p.location,
      mainImage: p.main_image_url,
      description: p.description || '',
      images: imagesMap.get(p.id) || [],
      sortOrder: p.sort_order,
    }));
  } catch (error) {
    console.error('Exception while fetching projects:', error);
    return [];
  }
}

// 更新项目
export async function updateProjectInDb(projectId: string, updates: Partial<Project>): Promise<boolean> {
  try {
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.mainImage !== undefined) dbUpdates.main_image_url = updates.mainImage;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;

    const { error } = await supabase
      .from('projects')
      .update(dbUpdates)
      .eq('id', projectId);

    if (error) {
      console.error('Failed to update project:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Exception while updating project:', error);
    return false;
  }
}

// 添加图片到项目
export async function addImageToProjectInDb(
  projectId: string,
  imageUrl: string,
  alt: string,
  caption: string,
  type: 'image' | 'video' = 'image',
  thumbnail?: string
): Promise<string | null> {
  try {
    // 获取当前项目的图片数量，用于设置 sort_order
    const { count } = await supabase
      .from('project_images')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId);

    const { data, error } = await supabase
      .from('project_images')
      .insert({
        project_id: projectId,
        url: imageUrl,
        alt,
        caption,
        type,
        thumbnail,
        sort_order: count || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add image:', error);
      return null;
    }
    return data.id;
  } catch (error) {
    console.error('Exception while adding image:', error);
    return null;
  }
}

// 删除图片
export async function removeImageFromProjectInDb(imageId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('project_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      console.error('Failed to remove image:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Exception while removing image:', error);
    return false;
  }
}

// 更新项目描述
export async function updateProjectDescriptionInDb(projectId: string, description: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .update({ description })
      .eq('id', projectId);

    if (error) {
      console.error('Failed to update description:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Exception while updating description:', error);
    return false;
  }
}

// 重新排序图片
export async function reorderProjectImagesInDb(projectId: string, newOrder: string[]): Promise<boolean> {
  try {
    // 批量更新排序
    const updates = newOrder.map((imageId, index) =>
      supabase
        .from('project_images')
        .update({ sort_order: index })
        .eq('id', imageId)
        .eq('project_id', projectId)
    );

    await Promise.all(updates);
    return true;
  } catch (error) {
    console.error('Exception while reordering images:', error);
    return false;
  }
}

// 重新排序项目
export async function reorderProjectsInDb(newOrder: string[]): Promise<boolean> {
  try {
    const updates = newOrder.map((projectId, index) =>
      supabase
        .from('projects')
        .update({ sort_order: index })
        .eq('id', projectId)
    );

    await Promise.all(updates);
    return true;
  } catch (error) {
    console.error('Exception while reordering projects:', error);
    return false;
  }
}

// 创建新项目
export async function createProjectInDb(project: Omit<Project, 'id'>): Promise<string | null> {
  try {
    const { count } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: project.title,
        location: project.location,
        main_image_url: project.mainImage,
        description: project.description || '',
        sort_order: count || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create project:', error);
      return null;
    }

    // 如果有图片，也插入图片
    if (project.images && project.images.length > 0) {
      const imageInserts = project.images.map((img, index) => ({
        project_id: data.id,
        url: img.url,
        alt: img.alt,
        caption: img.caption || '',
        type: img.type || 'image',
        thumbnail: img.thumbnail,
        sort_order: index,
      }));

      const { error: imagesError } = await supabase
        .from('project_images')
        .insert(imageInserts);

      if (imagesError) {
        console.error('Failed to insert images:', imagesError);
      }
    }

    return data.id;
  } catch (error) {
    console.error('Exception while creating project:', error);
    return null;
  }
}
