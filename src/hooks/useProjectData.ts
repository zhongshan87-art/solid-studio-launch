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
  {
    id: 3,
    title: "云栖书院 Cloud Valley Academy",
    location: "苏州 Suzhou",
    mainImage: project2,
    images: [
      { id: '3-1', url: project2, alt: "Cloud Valley Academy - Main view" },
      { id: '3-2', url: project3, alt: "Cloud Valley Academy - Garden" },
      { id: '3-3', url: project4, alt: "Cloud Valley Academy - Interior" },
    ],
    description: "坐落于苏州园林之中的现代书院，延续江南传统建筑的韵味，采用白墙黛瓦与现代玻璃幕墙相结合，创造出静谧优雅的学习空间。",
  },
  {
    id: 4,
    title: "竹影艺术馆 Bamboo Shadow Art Gallery",
    location: "成都 Chengdu",
    mainImage: project3,
    images: [
      { id: '4-1', url: project3, alt: "Bamboo Shadow Art Gallery - Main view" },
      { id: '4-2', url: project4, alt: "Bamboo Shadow Art Gallery - Exhibition hall" },
      { id: '4-3', url: project1, alt: "Bamboo Shadow Art Gallery - Courtyard" },
    ],
    description: "以竹为主题的当代艺术馆，建筑立面采用竹编纹理的铝板幕墙，与周围竹林形成和谐对话，内部空间灵活多变，适应不同类型的艺术展览。",
  },
  {
    id: 5,
    title: "水岸茶室 Waterfront Tea House",
    location: "西湖 West Lake",
    mainImage: project1,
    images: [
      { id: '5-1', url: project1, alt: "Waterfront Tea House - Main view" },
      { id: '5-2', url: project2, alt: "Waterfront Tea House - Terrace" },
      { id: '5-3', url: project3, alt: "Waterfront Tea House - Interior" },
    ],
    description: "位于西湖湖畔的精致茶室，建筑采用悬挑设计，使室内空间悬浮于水面之上，大面积落地窗将湖光山色纳入室内，营造诗意栖居的品茗空间。",
  },
  {
    id: 6,
    title: "古韵新生 Heritage Reborn",
    location: "北京 Beijing",
    mainImage: project4,
    images: [
      { id: '6-1', url: project4, alt: "Heritage Reborn - Main view" },
      { id: '6-2', url: project1, alt: "Heritage Reborn - Courtyard" },
      { id: '6-3', url: project2, alt: "Heritage Reborn - Detail" },
    ],
    description: "老北京四合院的当代改造项目，保留传统院落格局和木结构框架，植入现代化设施和环保技术，实现历史建筑的可持续更新。",
  },
  {
    id: 7,
    title: "光影剧场 Light & Shadow Theater",
    location: "上海 Shanghai",
    mainImage: project2,
    images: [
      { id: '7-1', url: project2, alt: "Light & Shadow Theater - Main view" },
      { id: '7-2', url: project3, alt: "Light & Shadow Theater - Auditorium" },
      { id: '7-3', url: project4, alt: "Light & Shadow Theater - Facade" },
    ],
    description: "融合传统戏曲元素的现代剧场建筑，外立面采用参数化设计的金属格栅，随日光变化产生丰富的光影效果，内部采用世界级声学设计。",
  },
  {
    id: 8,
    title: "松石居 Pine & Stone Pavilion",
    location: "黄山 Huangshan",
    mainImage: project3,
    images: [
      { id: '8-1', url: project3, alt: "Pine & Stone Pavilion - Main view" },
      { id: '8-2', url: project4, alt: "Pine & Stone Pavilion - Observation deck" },
      { id: '8-3', url: project1, alt: "Pine & Stone Pavilion - Interior" },
    ],
    description: "坐落于黄山脚下的观景建筑，采用轻盈的钢木结构悬挑于山崖之上，最大限度减少对自然环境的干扰，为游客提供360度全景观赏体验。",
  },
  {
    id: 9,
    title: "城市绿洲 Urban Oasis",
    location: "深圳 Shenzhen",
    mainImage: project1,
    images: [
      { id: '9-1', url: project1, alt: "Urban Oasis - Main view" },
      { id: '9-2', url: project2, alt: "Urban Oasis - Green terrace" },
      { id: '9-3', url: project3, alt: "Urban Oasis - Common area" },
    ],
    description: "高密度城市中心的立体绿化建筑，每层都设置退台花园，形成垂直森林效果，采用智能灌溉系统和雨水收集系统，打造可持续的城市生态空间。",
  },
  {
    id: 10,
    title: "江南小筑 Jiangnan Dwelling",
    location: "无锡 Wuxi",
    mainImage: project4,
    images: [
      { id: '10-1', url: project4, alt: "Jiangnan Dwelling - Main view" },
      { id: '10-2', url: project1, alt: "Jiangnan Dwelling - Water courtyard" },
      { id: '10-3', url: project2, alt: "Jiangnan Dwelling - Living room" },
    ],
    description: "传承江南民居精髓的现代住宅，采用传统的粉墙黛瓦、小桥流水布局，融入现代舒适的居住功能，展现新时代的江南生活美学。",
  },
  {
    id: 11,
    title: "山间工作室 Mountain Studio",
    location: "莫干山 Moganshan",
    mainImage: project2,
    images: [
      { id: '11-1', url: project2, alt: "Mountain Studio - Main view" },
      { id: '11-2', url: project3, alt: "Mountain Studio - Workspace" },
      { id: '11-3', url: project4, alt: "Mountain Studio - Terrace" },
    ],
    description: "隐匿于莫干山竹林中的建筑工作室，采用全玻璃幕墙设计，将自然景观引入室内，为建筑师提供灵感充沛的创作环境。",
  },
  {
    id: 12,
    title: "禅意会所 Zen Retreat Center",
    location: "九华山 Jiuhuashan",
    mainImage: project3,
    images: [
      { id: '12-1', url: project3, alt: "Zen Retreat Center - Main view" },
      { id: '12-2', url: project4, alt: "Zen Retreat Center - Meditation hall" },
      { id: '12-3', url: project1, alt: "Zen Retreat Center - Garden" },
    ],
    description: "佛教圣地中的现代禅修空间，建筑采用极简设计语言，以清水混凝土、木材和石材为主要材料，创造宁静祥和的修行环境。",
  },
  {
    id: 13,
    title: "滨海图书馆 Coastal Library",
    location: "青岛 Qingdao",
    mainImage: project1,
    images: [
      { id: '13-1', url: project1, alt: "Coastal Library - Main view" },
      { id: '13-2', url: project2, alt: "Coastal Library - Reading area" },
      { id: '13-3', url: project3, alt: "Coastal Library - Ocean view" },
    ],
    description: "面向大海的公共图书馆，建筑形态如同海浪般起伏，巨大的玻璃幕墙将海景引入阅读空间，打造独特的滨海文化地标。",
  },
  {
    id: 14,
    title: "桃源民宿 Peach Blossom Inn",
    location: "婺源 Wuyuan",
    mainImage: project4,
    images: [
      { id: '14-1', url: project4, alt: "Peach Blossom Inn - Main view" },
      { id: '14-2', url: project1, alt: "Peach Blossom Inn - Guest room" },
      { id: '14-3', url: project2, alt: "Peach Blossom Inn - Courtyard" },
    ],
    description: "坐落于徽州古村落中的精品民宿，保留传统徽派建筑的马头墙和木雕元素，内部空间进行现代化改造，提供舒适的乡村度假体验。",
  },
  {
    id: 15,
    title: "未来美术馆 Future Art Museum",
    location: "广州 Guangzhou",
    mainImage: project2,
    images: [
      { id: '15-1', url: project2, alt: "Future Art Museum - Main view" },
      { id: '15-2', url: project3, alt: "Future Art Museum - Exhibition hall" },
      { id: '15-3', url: project4, alt: "Future Art Museum - Atrium" },
    ],
    description: "采用参数化设计的当代艺术博物馆，有机流动的建筑形态突破传统空间限制，配备智能照明和气候控制系统，为当代艺术提供理想的展示平台。",
  },
  {
    id: 16,
    title: "湖心亭 Lake Pavilion",
    location: "扬州 Yangzhou",
    mainImage: project3,
    images: [
      { id: '16-1', url: project3, alt: "Lake Pavilion - Main view" },
      { id: '16-2', url: project1, alt: "Lake Pavilion - Bridge view" },
      { id: '16-3', url: project2, alt: "Lake Pavilion - Interior" },
    ],
    description: "扬州瘦西湖畔的新建景观建筑，采用传统亭台楼阁的空间布局，结合现代建造工艺，通过曲折的游廊与湖岸相连，呈现江南园林的诗意画境。",
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