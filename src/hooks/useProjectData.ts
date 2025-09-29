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
  },
  {
    id: 2,
    title: "金塘水獭馆 Otter Exhibition",
    location: "浙江 Zhejiang",
    mainImage: project2,
    images: [
      { id: '2-1', url: project2, alt: "Otter Exhibition - Exterior" },
      { id: '2-2', url: project1, alt: "Otter Exhibition - Pool area" },
      { id: '2-3', url: project3, alt: "Otter Exhibition - Viewing area" },
    ],
  },
  {
    id: 3,
    title: "Art Museum",
    location: "Tokyo, Japan",
    mainImage: project3,
    images: [
      { id: '3-1', url: project3, alt: "Art Museum - Facade" },
      { id: '3-2', url: project1, alt: "Art Museum - Gallery space" },
      { id: '3-3', url: project2, alt: "Art Museum - Atrium" },
    ],
  },
  {
    id: 4,
    title: "城市更新项目 Urban Renewal",
    location: "北京 Beijing",
    mainImage: project1,
    images: [
      { id: '4-1', url: project1, alt: "Urban Renewal - Before" },
      { id: '4-2', url: project2, alt: "Urban Renewal - After" },
    ],
  },
  {
    id: 5,
    title: "文化中心 Cultural Center",
    location: "上海 Shanghai",
    mainImage: project2,
    images: [
      { id: '5-1', url: project2, alt: "Cultural Center - Main hall" },
      { id: '5-2', url: project3, alt: "Cultural Center - Performance space" },
    ],
  },
  {
    id: 6,
    title: "住宅综合体 Residential Complex",
    location: "深圳 Shenzhen",
    mainImage: project3,
    images: [
      { id: '6-1', url: project3, alt: "Residential Complex - Towers" },
      { id: '6-2', url: project1, alt: "Residential Complex - Courtyard" },
    ],
  },
  {
    id: 7,
    title: "商业广场 Commercial Plaza",
    location: "广州 Guangzhou",
    mainImage: project1,
    images: [
      { id: '7-1', url: project1, alt: "Commercial Plaza - Plaza view" },
    ],
  },
  {
    id: 8,
    title: "学校设计 School Design",
    location: "杭州 Hangzhou",
    mainImage: project2,
    images: [
      { id: '8-1', url: project2, alt: "School Design - Campus" },
    ],
  },
  {
    id: 9,
    title: "办公大楼 Office Building",
    location: "成都 Chengdu",
    mainImage: project3,
    images: [
      { id: '9-1', url: project3, alt: "Office Building - Exterior" },
    ],
  },
  {
    id: 10,
    title: "公园景观 Park Landscape",
    location: "武汉 Wuhan",
    mainImage: project1,
    images: [
      { id: '10-1', url: project1, alt: "Park Landscape - Overview" },
    ],
  },
  {
    id: 11,
    title: "酒店设计 Hotel Design",
    location: "西安 Xi'an",
    mainImage: project2,
    images: [
      { id: '11-1', url: project2, alt: "Hotel Design - Lobby" },
    ],
  },
  {
    id: 12,
    title: "体育馆 Sports Center",
    location: "重庆 Chongqing",
    mainImage: project3,
    images: [
      { id: '12-1', url: project3, alt: "Sports Center - Arena" },
    ],
  },
  {
    id: 13,
    title: "图书馆 Library",
    location: "天津 Tianjin",
    mainImage: project1,
    images: [
      { id: '13-1', url: project1, alt: "Library - Reading room" },
    ],
  },
  {
    id: 14,
    title: "医院建筑 Hospital Building",
    location: "南昌 Nanchang",
    mainImage: project2,
    images: [
      { id: '14-1', url: project2, alt: "Hospital Building - Main entrance" },
    ],
  },
  {
    id: 15,
    title: "交通枢纽 Transport Hub",
    location: "长沙 Changsha",
    mainImage: project3,
    images: [
      { id: '15-1', url: project3, alt: "Transport Hub - Terminal" },
    ],
  }
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
    try {
      const data: ProjectData = {
        projects: updatedProjects,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Failed to save projects:', error);
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
    if (!project) return;

    const newImage = {
      id: `${projectId}-${Date.now()}`,
      ...image,
    };

    const updatedImages = [...project.images, newImage];
    updateProject(projectId, { images: updatedImages });
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