import { useEffect, useState } from "react";
import type { Project, ProjectData, ProjectImage } from "@/types/project";
import { getProjectsData, setProjectsData } from "@/lib/storage";

// 最小化 defaultProjects，实际数据已保存在浏览器 IndexedDB
const defaultProjects: Project[] = [];

function sanitizeImage(project: Project, image: ProjectImage): ProjectImage {
  // 把占位符 URL 替换为 mainImage，实现"固化"
  if (image.url === "[BASE64_IMAGE_PLACEHOLDER]" && project.mainImage) {
    return {
      ...image,
      url: project.mainImage,
    };
  }
  return image;
}

function sanitizeProject(project: Project): Project {
  let images = project.images || [];

  // 如果没有图片但有主图，用主图生成一张图片
  if ((!images || images.length === 0) && project.mainImage) {
    images = [
      {
        id: `${project.id}-main`,
        url: project.mainImage,
        alt: project.title,
        caption: project.title,
        type: "image",
      },
    ];
  }

  // 处理占位符 URL
  const sanitizedImages = images.map((img) => sanitizeImage(project, img));

  // 确保 mainImage 存在
  let mainImage = project.mainImage;
  if (!mainImage && sanitizedImages[0]?.url) {
    mainImage = sanitizedImages[0].url;
  }

  return {
    ...project,
    mainImage,
    images: sanitizedImages,
  };
}

function sanitizeProjectsData(data: ProjectData | null, fallbackProjects: Project[]): ProjectData {
  const sourceProjects = data?.projects && data.projects.length > 0 ? data.projects : fallbackProjects;

  const sanitizedProjects = (sourceProjects || []).map((p) => sanitizeProject(p));

  return {
    projects: sanitizedProjects,
    lastUpdated: data?.lastUpdated ?? new Date().toISOString(),
  };
}

export function useProjectData() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const stored = await getProjectsData();
        const sanitized = sanitizeProjectsData(stored, defaultProjects);

        if (!isMounted) return;

        setProjects(sanitized.projects);

        // 重新保存清洗后的数据，确保之后始终是"固化"的数据
        await setProjectsData(sanitized);
      } catch (error) {
        console.error("Failed to load project data", error);
        if (!isMounted) return;
        const fallback = sanitizeProjectsData(null, defaultProjects);
        setProjects(fallback.projects);
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

  const saveProjects = async (updated: Project[]) => {
    setProjects(updated);
    const payload: ProjectData = {
      projects: updated.map((p) => sanitizeProject(p)),
      lastUpdated: new Date().toISOString(),
    };
    try {
      await setProjectsData(payload);
    } catch (error) {
      console.error("Failed to save project data", error);
    }
  };

  const updateProject = async (projectId: number, updates: Partial<Project>) => {
    const updated = projects.map((p) =>
      p.id === projectId ? sanitizeProject({ ...p, ...updates }) : p,
    );
    await saveProjects(updated);
  };

  const addImageToProject = async (
    projectId: number,
    imageUrl: string,
    alt: string,
    caption: string,
    type: ProjectImage["type"] = "image",
    thumbnail?: string,
  ) => {
    const updated = projects.map((p) => {
      if (p.id !== projectId) return p;
      const newImage: ProjectImage = {
        id: `${projectId}-${Date.now()}`,
        url: imageUrl,
        alt,
        caption,
        type,
        thumbnail,
      };
      return sanitizeProject({ ...p, images: [...(p.images || []), newImage] });
    });
    await saveProjects(updated);
  };

  const removeImageFromProject = async (projectId: number, imageId: string) => {
    const updated = projects.map((p) => {
      if (p.id !== projectId) return p;
      const filtered = (p.images || []).filter((img) => img.id !== imageId);
      return sanitizeProject({ ...p, images: filtered });
    });
    await saveProjects(updated);
  };

  const updateProjectDescription = async (projectId: number, description: string) => {
    const updated = projects.map((p) =>
      p.id === projectId ? sanitizeProject({ ...p, description }) : p,
    );
    await saveProjects(updated);
  };

  const reorderProjectImages = async (projectId: number, newOrder: string[]) => {
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

      return sanitizeProject({ ...p, images: reordered });
    });
    await saveProjects(updated);
  };

  const reorderProjects = async (newOrder: number[]) => {
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

    await saveProjects(reordered);
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
