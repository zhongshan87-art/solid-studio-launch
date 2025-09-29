import { useState, useEffect } from 'react';
import { Project, ProjectData } from '@/types/project';
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

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
];

export const useProjectData = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data: ProjectData = JSON.parse(stored);
          setProjects(data.projects);
        } else {
          setProjects(defaultProjects);
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

  const saveProjects = (updatedProjects: Project[]) => {
    let persisted = false;
    try {
      const data: ProjectData = {
        projects: updatedProjects,
        lastUpdated: new Date().toISOString(),
      };
      
      // Check localStorage space before saving
      const dataString = JSON.stringify(data);
      const sizeInBytes = new Blob([dataString]).size;
      console.log('Saving projects data size:', (sizeInBytes / 1024 / 1024).toFixed(2), 'MB');
      
      if (sizeInBytes > 4.5 * 1024 * 1024) { // 4.5MB limit for safety
        console.warn('Data size approaching localStorage limit');
      }
      
      localStorage.setItem(STORAGE_KEY, dataString);
      persisted = true;
      console.log('Successfully saved projects to localStorage');
    } catch (error) {
      console.error('Failed to save projects:', error);
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded - using in-memory state only');
      }
    } finally {
      // Always update in-memory state so UI reflects latest changes
      setProjects(updatedProjects);
      if (!persisted) {
        console.warn('Projects not persisted to localStorage. Changes will be lost on reload.');
      }
    }
  };

  const updateProject = (projectId: number, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    );
    saveProjects(updatedProjects);
  };

  const addImageToProject = (projectId: number, image: { url: string; alt: string; caption?: string }) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      console.error('Project not found:', projectId);
      return undefined;
    }

    const newImage = {
      id: `${projectId}-${Date.now()}`,
      ...image,
    };

    console.log('Creating new image for project:', projectId, 'with ID:', newImage.id);
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

  return {
    projects,
    isLoading,
    updateProject,
    addImageToProject,
    removeImageFromProject,
    updateProjectDescription,
    saveProjects,
  };
};