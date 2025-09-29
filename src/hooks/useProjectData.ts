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
  {
    id: 2,
    title: "金塘水獭科普馆 Jintang Otter Center",
    location: "浙江 Zhejiang",
    mainImage: project2,
    images: [
      { id: '2-1', url: project2, alt: "Otter Exhibition - Exterior" },
      { id: '2-2', url: project1, alt: "Otter Exhibition - Pool area" },
      { id: '2-3', url: project3, alt: "Otter Exhibition - Viewing area" },
    ],
    description: "这是一个位于浙江金塘的水獭科普馆项目的详细描述。该项目展示了创新的建筑设计和可持续的建筑实践，致力于保护生态环境和野生动物栖息地。",
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
    description: "这是一个位于东京的艺术博物馆项目的详细描述。该项目展示了创新的建筑设计和可持续的建筑实践，为艺术品展示提供了理想的空间环境。",
  },
  {
    id: 4,
    title: "城市更新项目 Urban Renewal",
    location: "北京 Beijing",
    mainImage: project1,
    images: [
      { id: '4-1', url: project1, alt: "Urban Renewal - Before" },
      { id: '4-2', url: project2, alt: "Urban Renewal - After" },
      { id: '4-3', url: project3, alt: "Urban Renewal - Community space" },
    ],
    description: "这是一个位于北京的城市更新项目的详细描述。该项目展示了创新的建筑设计和可持续的建筑实践，通过改造提升了城市空间品质。",
  },
  {
    id: 5,
    title: "文化中心 Cultural Center",
    location: "上海 Shanghai",
    mainImage: project2,
    images: [
      { id: '5-1', url: project2, alt: "Cultural Center - Main hall" },
      { id: '5-2', url: project3, alt: "Cultural Center - Performance space" },
      { id: '5-3', url: project1, alt: "Cultural Center - Exhibition area" },
    ],
    description: "这是一个位于上海的文化中心项目的详细描述。该项目展示了创新的建筑设计和可持续的建筑实践，为社区文化活动提供了多功能空间。",
  },
  {
    id: 6,
    title: "住宅综合体 Residential Complex",
    location: "深圳 Shenzhen",
    mainImage: project3,
    images: [
      { id: '6-1', url: project3, alt: "Residential Complex - Towers" },
      { id: '6-2', url: project1, alt: "Residential Complex - Courtyard" },
      { id: '6-3', url: project2, alt: "Residential Complex - Amenities" },
    ],
    description: "这是一个位于深圳的住宅综合体项目的详细描述。该项目展示了创新的建筑设计和可持续的建筑实践，提供了高品质的居住环境。",
  },
  {
    id: 7,
    title: "商业广场 Commercial Plaza",
    location: "广州 Guangzhou",
    mainImage: project1,
    images: [
      { id: '7-1', url: project1, alt: "Commercial Plaza - Plaza view" },
      { id: '7-2', url: project2, alt: "Commercial Plaza - Shopping area" },
      { id: '7-3', url: project3, alt: "Commercial Plaza - Dining space" },
    ],
    description: "这是一个位于广州的商业广场项目的详细描述。该项目展示了创新的建筑设计和可持续的建筑实践，创造了充满活力的商业空间。",
  },
  {
    id: 8,
    title: "学校设计 School Design",
    location: "杭州 Hangzhou",
    mainImage: project2,
    images: [
      { id: '8-1', url: project2, alt: "School Design - Campus" },
      { id: '8-2', url: project3, alt: "School Design - Classroom building" },
      { id: '8-3', url: project1, alt: "School Design - Sports facilities" },
    ],
    description: "这是一个位于杭州的学校设计项目的详细描述。该项目展示了创新的建筑设计和可持续的建筑实践，为学生提供了优质的学习环境。",
  },
  {
    id: 9,
    title: "办公大楼 Office Building",
    location: "成都 Chengdu",
    mainImage: project3,
    images: [
      { id: '9-1', url: project3, alt: "Office Building - Exterior" },
      { id: '9-2', url: project1, alt: "Office Building - Lobby" },
      { id: '9-3', url: project2, alt: "Office Building - Office floors" },
    ],
    description: "这是一个位于成都的办公大楼项目的详细描述。该项目展示了创新的建筑设计和可持续的建筑实践，提供了现代化的办公空间。",
  },
  {
    id: 10,
    title: "公园景观 Park Landscape",
    location: "武汉 Wuhan",
    mainImage: project1,
    images: [
      { id: '10-1', url: project1, alt: "Park Landscape - Overview" },
      { id: '10-2', url: project2, alt: "Park Landscape - Walking paths" },
      { id: '10-3', url: project3, alt: "Park Landscape - Water features" },
    ],
    description: "这是一个位于武汉的公园景观项目的详细描述。该项目展示了创新的建筑设计和可持续的建筑实践，创造了优美的城市绿地空间。",
  },
  {
    id: 11,
    title: "酒店设计 Hotel Design",
    location: "西安 Xi'an",
    mainImage: project2,
    images: [
      { id: '11-1', url: project2, alt: "Hotel Design - Lobby" },
      { id: '11-2', url: project3, alt: "Hotel Design - Guest rooms" },
      { id: '11-3', url: project1, alt: "Hotel Design - Restaurant" },
    ],
    description: "这是一个位于西安的酒店设计项目的详细描述。该项目展示了创新的建筑设计和可持续的建筑实践，提供了舒适的住宿体验。",
  },
  {
    id: 12,
    title: "体育馆 Sports Center",
    location: "重庆 Chongqing",
    mainImage: project3,
    images: [
      { id: '12-1', url: project3, alt: "Sports Center - Arena" },
      { id: '12-2', url: project1, alt: "Sports Center - Training facilities" },
      { id: '12-3', url: project2, alt: "Sports Center - Spectator areas" },
    ],
    description: "这是一个位于重庆的体育馆项目的详细描述。该项目展示了创新的建筑设计和可持续的建筑实践，为体育活动提供了专业的场地设施。",
  },
  {
    id: 13,
    title: "图书馆 Library",
    location: "天津 Tianjin",
    mainImage: project1,
    images: [
      { id: '13-1', url: project1, alt: "Library - Reading room" },
      { id: '13-2', url: project2, alt: "Library - Book collections" },
      { id: '13-3', url: project3, alt: "Library - Study areas" },
    ],
    description: "这是一个位于天津的图书馆项目的详细描述。该项目展示了创新的建筑设计和可持续的建筑实践，为读者提供了安静舒适的阅读环境。",
  },
  {
    id: 14,
    title: "医院建筑 Hospital Building",
    location: "南昌 Nanchang",
    mainImage: project2,
    images: [
      { id: '14-1', url: project2, alt: "Hospital Building - Main entrance" },
      { id: '14-2', url: project3, alt: "Hospital Building - Patient rooms" },
      { id: '14-3', url: project1, alt: "Hospital Building - Medical facilities" },
    ],
    description: "这是一个位于南昌的医院建筑项目的详细描述。该项目展示了创新的建筑设计和可持续的建筑实践，为医疗服务提供了现代化的设施环境。",
  },
  {
    id: 15,
    title: "交通枢纽 Transport Hub",
    location: "长沙 Changsha",
    mainImage: project3,
    images: [
      { id: '15-1', url: project3, alt: "Transport Hub - Terminal" },
      { id: '15-2', url: project1, alt: "Transport Hub - Platforms" },
      { id: '15-3', url: project2, alt: "Transport Hub - Waiting areas" },
    ],
    description: "这是一个位于长沙的交通枢纽项目的详细描述。该项目展示了创新的建筑设计和可持续的建筑实践，提供了高效便捷的交通服务设施。",
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
      
      // Check localStorage space before saving
      const dataString = JSON.stringify(data);
      const sizeInBytes = new Blob([dataString]).size;
      console.log('Saving projects data size:', (sizeInBytes / 1024 / 1024).toFixed(2), 'MB');
      
      if (sizeInBytes > 4.5 * 1024 * 1024) { // 4.5MB limit for safety
        console.warn('Data size approaching localStorage limit');
      }
      
      localStorage.setItem(STORAGE_KEY, dataString);
      setProjects(updatedProjects);
      console.log('Successfully saved projects to localStorage');
    } catch (error) {
      console.error('Failed to save projects:', error);
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded - consider image compression');
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
      return;
    }

    const newImage = {
      id: `${projectId}-${Date.now()}`,
      ...image,
    };

    console.log('Creating new image for project:', projectId, 'with ID:', newImage.id);
    const updatedImages = [...project.images, newImage];
    console.log('Updated images count:', updatedImages.length);
    
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