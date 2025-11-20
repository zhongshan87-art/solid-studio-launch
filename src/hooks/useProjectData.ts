import { useEffect, useState } from "react";
import type { Project, ProjectData, ProjectImage } from "@/types/project";
import { getProjectsData, setProjectsData } from "@/lib/storage";
import {
  fetchProjectsFromDb,
  updateProjectInDb,
  addImageToProjectInDb,
  removeImageFromProjectInDb,
  updateProjectDescriptionInDb,
  reorderProjectImagesInDb,
  reorderProjectsInDb,
} from "@/lib/projectsDb";

export function useProjectData() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        // 优先从云端数据库获取
        const cloudProjects = await fetchProjectsFromDb();
        
        if (!isMounted) return;

        if (cloudProjects.length > 0) {
          // 云端有数据，使用云端数据
          setProjects(cloudProjects);
          
          // 同步到本地缓存
          const cacheData: ProjectData = {
            projects: cloudProjects,
            lastUpdated: new Date().toISOString(),
          };
          await setProjectsData(cacheData);
        } else {
          // 云端没有数据，尝试从本地缓存获取
          const cached = await getProjectsData();
          if (cached && cached.projects.length > 0) {
            setProjects(cached.projects);
          } else {
            // 本地也没有，设置为空
            setProjects([]);
          }
        }
      } catch (error) {
        console.error("Failed to load project data", error);
        if (!isMounted) return;
        
        // 出错时尝试从缓存加载
        try {
          const cached = await getProjectsData();
          if (cached && cached.projects.length > 0) {
            setProjects(cached.projects);
          } else {
            setProjects([]);
          }
        } catch (cacheError) {
          console.error("Failed to load cached data", cacheError);
          setProjects([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  // 保存到本地缓存
  const saveToCache = async (updated: Project[]) => {
    const payload: ProjectData = {
      projects: updated,
      lastUpdated: new Date().toISOString(),
    };
    try {
      await setProjectsData(payload);
    } catch (error) {
      console.error("Failed to save to cache", error);
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    // 更新云端
    const success = await updateProjectInDb(projectId, updates);
    if (!success) {
      console.error("Failed to update project in cloud");
      return;
    }

    // 更新本地状态
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, ...updates } : p
    );
    setProjects(updated);
    await saveToCache(updated);
  };

  const addImageToProject = async (
    projectId: string,
    imageUrl: string,
    alt: string,
    caption: string,
    type: ProjectImage["type"] = "image",
    thumbnail?: string,
  ) => {
    // 添加到云端
    const imageId = await addImageToProjectInDb(projectId, imageUrl, alt, caption, type, thumbnail);
    if (!imageId) {
      console.error("Failed to add image to cloud");
      return;
    }

    // 更新本地状态
    const updated = projects.map((p) => {
      if (p.id !== projectId) return p;
      const newImage: ProjectImage = {
        id: imageId,
        url: imageUrl,
        alt,
        caption,
        type,
        thumbnail,
      };
      return { ...p, images: [...(p.images || []), newImage] };
    });
    setProjects(updated);
    await saveToCache(updated);
  };

  const removeImageFromProject = async (projectId: string, imageId: string) => {
    // 从云端删除
    const success = await removeImageFromProjectInDb(imageId);
    if (!success) {
      console.error("Failed to remove image from cloud");
      return;
    }

    // 更新本地状态
    const updated = projects.map((p) => {
      if (p.id !== projectId) return p;
      const filtered = (p.images || []).filter((img) => img.id !== imageId);
      return { ...p, images: filtered };
    });
    setProjects(updated);
    await saveToCache(updated);
  };

  const updateProjectDescription = async (projectId: string, description: string) => {
    // 更新云端
    const success = await updateProjectDescriptionInDb(projectId, description);
    if (!success) {
      console.error("Failed to update description in cloud");
      return;
    }

    // 更新本地状态
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, description } : p
    );
    setProjects(updated);
    await saveToCache(updated);
  };

  const reorderProjectImages = async (projectId: string, newOrder: string[]) => {
    // 更新云端
    const success = await reorderProjectImagesInDb(projectId, newOrder);
    if (!success) {
      console.error("Failed to reorder images in cloud");
      return;
    }

    // 更新本地状态
    const updated = projects.map((p) => {
      if (p.id !== projectId) return p;
      const imageMap = new Map((p.images || []).map((img) => [img.id, img] as const));
      const reordered: ProjectImage[] = [];

      newOrder.forEach((id) => {
        const img = imageMap.get(id);
        if (img) reordered.push(img);
      });

      // 把遗漏的图片也补上
      (p.images || []).forEach((img) => {
        if (!newOrder.includes(img.id)) reordered.push(img);
      });

      return { ...p, images: reordered };
    });
    setProjects(updated);
    await saveToCache(updated);
  };

  const reorderProjects = async (newOrder: string[]) => {
    // 更新云端
    const success = await reorderProjectsInDb(newOrder);
    if (!success) {
      console.error("Failed to reorder projects in cloud");
      return;
    }

    // 更新本地状态
    const projectMap = new Map(projects.map((p) => [p.id, p] as const));
    const reordered: Project[] = [];

    newOrder.forEach((id) => {
      const p = projectMap.get(id);
      if (p) reordered.push(p);
    });

    // 把遗漏的项目也补上
    projects.forEach((p) => {
      if (!newOrder.includes(p.id)) reordered.push(p);
    });

    setProjects(reordered);
    await saveToCache(reordered);
  };

  return {
    projects,
    isLoading,
    updateProject,
    addImageToProject,
    removeImageFromProject,
    updateProjectDescription,
    reorderProjectImages,
    reorderProjects,
  } as const;
}
