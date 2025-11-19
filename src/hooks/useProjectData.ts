import { useState, useEffect } from 'react';
import { Project, ProjectData } from '@/types/project';
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import { getProjectsData, setProjectsData } from '@/lib/storage';

const STORAGE_KEY = 'lovable-projects-data';

const defaultProjects: Project[] = [
  {
    id: 1,
    title: "一室亦园 One Room One Garden",
    location: "南京 Nanjing",
    mainImage: project1,
    images: [
      { id: '1-1', url: project1, alt: "One Room One Garden - Main view" },
      { id: '1-2', url: project2, alt: "One Room One Garden - Detail view" },
      { id: '1-3', url: project3, alt: "One Room One Garden - Interior" },
    ],
    description: "这是一个位于南京的一室亦园项目的详细描述。该项目展示了创新的建筑设计和可持续的建筑实践，将现代设计理念与传统园林文化完美融合。",
  },
  {
    id: 2,
    title: "山语禅居 Mountain Zen Residence",
    location: "杭州 Hangzhou",
    mainImage: project4,
    images: [
      { id: '2-1', url: project4, alt: "Mountain Zen Residence - Main view" },
      { id: '2-2', url: project1, alt: "Mountain Zen Residence - Detail view" },
      { id: '2-3', url: project2, alt: "Mountain Zen Residence - Interior" },
    ],
    description: "位于杭州的现代禅意建筑，融合自然山景与极简设计理念，营造宁静致远的居住空间。建筑采用清水混凝土与木质元素，体现东方美学的当代表达。",
  },
];

export const useProjectData = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Prefer IndexedDB (localforage)
        const storedDb = await getProjectsData();
        if (storedDb && Array.isArray(storedDb.projects) && storedDb.projects.length > 0) {
          setProjects(storedDb.projects);
          return;
        }

        // Migrate from localStorage if present
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data: ProjectData = JSON.parse(stored);
          setProjects(data.projects);
          // Migrate to IndexedDB for durability
          await setProjectsData(data);
        } else {
          setProjects(defaultProjects);
          await setProjectsData({
            projects: defaultProjects,
            lastUpdated: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
        setProjects(defaultProjects);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const saveProjects = async (updatedProjects: Project[]) => {
    let persisted = false;
    const data: ProjectData = {
      projects: updatedProjects,
      lastUpdated: new Date().toISOString(),
    };

    try {
      // Primary: IndexedDB via localforage (handles larger data than localStorage)
      await setProjectsData(data);
      persisted = true;
      console.log('Successfully saved projects to IndexedDB');
    } catch (error) {
      console.error('Failed to save to IndexedDB. Attempting localStorage fallback:', error);
      try {
        const dataString = JSON.stringify(data);
        const sizeInBytes = new Blob([dataString]).size;
        console.log('Saving projects data size:', (sizeInBytes / 1024 / 1024).toFixed(2), 'MB');

        if (sizeInBytes > 4.5 * 1024 * 1024) {
          console.warn('Data size approaching localStorage limit');
        }

        localStorage.setItem(STORAGE_KEY, dataString);
        persisted = true;
        console.log('Successfully saved projects to localStorage');
      } catch (lsError) {
        console.error('Failed to save projects to localStorage:', lsError);
        if (lsError instanceof Error && lsError.name === 'QuotaExceededError') {
          console.error('localStorage quota exceeded - using in-memory state only');
        }
      }
    } finally {
      // Always update in-memory state so UI reflects latest changes
      setProjects(updatedProjects);
      if (!persisted) {
        console.warn('Projects not persisted to durable storage. Changes will be lost on reload.');
      }
    }
  };

  const updateProject = (projectId: number, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    );
    saveProjects(updatedProjects);
  };

  const addImageToProject = (
    projectId: number, 
    image: { 
      url: string; 
      alt: string; 
      caption?: string;
      type?: 'image' | 'video';
      thumbnail?: string;
    }
  ) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      console.error('Project not found:', projectId);
      return undefined;
    }

    const newImage = {
      id: `${projectId}-${Date.now()}`,
      ...image,
      type: image.type || 'image',
    };

    console.log('Creating new media for project:', projectId, 'with ID:', newImage.id, 'type:', newImage.type);
    const updatedImages = [...project.images, newImage];
    console.log('Updated images count:', updatedImages.length);
    
    updateProject(projectId, { images: updatedImages });
    return newImage;
  };

  const removeImageFromProject = (projectId: number, imageId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedImages = project.images.filter(img => img.id !== imageId);
    updateProject(projectId, { images: updatedImages });
  };

  const updateProjectDescription = (projectId: number, description: string) => {
    updateProject(projectId, { description });
  };

  const reorderProjectImages = (projectId: number, newOrder: string[]) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const reorderedImages = newOrder
      .map(id => project.images.find(img => img.id === id))
      .filter((img): img is NonNullable<typeof img> => img !== undefined);

    updateProject(projectId, { images: reorderedImages });
  };

  const reorderProjects = (newOrder: number[]) => {
    const reorderedProjects = newOrder
      .map(id => projects.find(p => p.id === id))
      .filter((p): p is Project => p !== undefined);
    
    saveProjects(reorderedProjects);
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
    saveProjects,
  };
};