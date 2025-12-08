import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Project } from '@/types/project';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface MediaCard {
  id: string;
  image: string;
  description: string;
  sort_order?: number;
}

interface StudioData {
  id?: string;
  introChinese: string;
  introEnglish: string;
  image: string;
}

interface GlobalExporterProps {
  projects: Project[];
  mediaCards: MediaCard[];
  studioData: StudioData;
  className?: string;
}

export const GlobalExporter: React.FC<GlobalExporterProps> = ({ 
  projects, 
  mediaCards, 
  studioData, 
  className 
}) => {
  const [exporting, setExporting] = useState(false);

  const downloadImage = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download: ${url}`);
    }
    return response.blob();
  };

  const generateProjectDataCode = (projects: Project[]): string => {
    const updatedProjects = projects.map((project) => {
      const projectSlug = project.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      return {
        ...project,
        mainImage: `/images/projects/${projectSlug}/main.jpg`,
        images: project.images.map((img, imgIndex) => ({
          ...img,
          url: `/images/projects/${projectSlug}/${imgIndex + 1}.jpg`
        }))
      };
    });

    return `import { useState, useEffect } from 'react';
import { Project, ProjectData } from '@/types/project';
import { getProjectsData, setProjectsData } from '@/lib/storage';

const defaultProjects: Project[] = ${JSON.stringify(updatedProjects, null, 2)};

export const useProjectData = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const storedData = await getProjectsData();
        
        if (storedData && storedData.projects && storedData.projects.length > 0) {
          setProjects(storedData.projects);
        } else {
          setProjects(defaultProjects);
          await setProjectsData({ projects: defaultProjects, lastUpdated: new Date().toISOString() });
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects(defaultProjects);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const saveProjects = async (updatedProjects: Project[]) => {
    try {
      await setProjectsData({ projects: updatedProjects, lastUpdated: new Date().toISOString() });
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  };

  const updateProject = async (projectId: number, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project => 
      project.id === projectId ? { ...project, ...updates } : project
    );
    await saveProjects(updatedProjects);
  };

  const addImageToProject = async (
    projectId: number,
    imageUrl: string,
    alt: string,
    caption: string
  ) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const newImage = {
          id: \`\${projectId}-\${Date.now()}\`,
          url: imageUrl,
          alt,
          caption
        };
        return {
          ...project,
          images: [...project.images, newImage]
        };
      }
      return project;
    });
    await saveProjects(updatedProjects);
  };

  const removeImageFromProject = async (projectId: number, imageId: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          images: project.images.filter(img => img.id !== imageId)
        };
      }
      return project;
    });
    await saveProjects(updatedProjects);
  };

  const updateProjectDescription = async (projectId: number, description: string) => {
    await updateProject(projectId, { description });
  };

  const reorderProjectImages = async (projectId: number, newOrder: string[]) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const reorderedImages = newOrder
          .map(id => project.images.find(img => img.id === id))
          .filter((img): img is NonNullable<typeof img> => img !== undefined);
        return {
          ...project,
          images: reorderedImages
        };
      }
      return project;
    });
    await saveProjects(updatedProjects);
  };

  const reorderProjects = async (newOrder: number[]) => {
    const reorderedProjects = newOrder
      .map(id => projects.find(p => p.id === id))
      .filter((p): p is Project => p !== undefined);
    await saveProjects(reorderedProjects);
  };

  return {
    projects,
    isLoading,
    updateProject,
    addImageToProject,
    removeImageFromProject,
    updateProjectDescription,
    reorderProjectImages,
    reorderProjects
  };
};`;
  };

  const generateMediaDataCode = (mediaCards: MediaCard[]): string => {
    const updatedCards = mediaCards.map((card, index) => ({
      ...card,
      image: `/images/media/${index + 1}.jpg`
    }));

    return `import { useState, useEffect } from 'react';
import { getMediaCards, setMediaCards } from '@/lib/storage';

export interface MediaCard {
  id: string;
  image: string;
  description: string;
  sort_order?: number;
}

const defaultMediaCards: MediaCard[] = ${JSON.stringify(updatedCards, null, 2)};

export function useMediaData() {
  const [cards, setCards] = useState<MediaCard[]>(defaultMediaCards);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMediaCards();
  }, []);

  const loadMediaCards = async () => {
    try {
      const localData = await getMediaCards();
      if (localData && localData.length > 0) {
        setCards(localData);
      } else {
        await saveCards(defaultMediaCards);
      }
    } catch (error) {
      console.error('Error loading media cards:', error);
      setCards(defaultMediaCards);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCards = async (updatedCards: MediaCard[]) => {
    try {
      await setMediaCards(updatedCards);
      setCards(updatedCards);
    } catch (error) {
      console.error('Error saving media cards:', error);
      throw error;
    }
  };

  const addCard = async (image: string, description: string) => {
    const newCard: MediaCard = {
      id: Date.now().toString(),
      image,
      description,
      sort_order: cards.length
    };
    await saveCards([...cards, newCard]);
  };

  const updateCard = async (id: string, updates: Partial<MediaCard>) => {
    const updatedCards = cards.map(card =>
      card.id === id ? { ...card, ...updates } : card
    );
    await saveCards(updatedCards);
  };

  const deleteCard = async (id: string) => {
    const updatedCards = cards.filter(card => card.id !== id);
    await saveCards(updatedCards);
  };

  const reorderCards = async (newOrder: string[]) => {
    const reorderedCards = newOrder
      .map(id => cards.find(c => c.id === id))
      .filter((c): c is MediaCard => c !== undefined)
      .map((card, index) => ({ ...card, sort_order: index }));
    await saveCards(reorderedCards);
  };

  return {
    cards,
    isLoading,
    addCard,
    updateCard,
    deleteCard,
    reorderCards
  };
}`;
  };

  const generateStudioDataCode = (studioData: StudioData): string => {
    const updatedStudio = {
      ...studioData,
      image: '/images/studio/intro.jpg'
    };

    return `import { useState, useEffect } from 'react';
import { getStudioData, setStudioData } from '@/lib/storage';

export interface StudioData {
  id?: string;
  introChinese: string;
  introEnglish: string;
  image: string;
}

const defaultStudioData: StudioData = ${JSON.stringify(updatedStudio, null, 2)};

export function useStudioData() {
  const [studio, setStudio] = useState<StudioData>(defaultStudioData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudioData();
  }, []);

  const loadStudioData = async () => {
    try {
      const localData = await getStudioData();
      if (localData) {
        setStudio(localData);
      } else {
        await saveStudio(defaultStudioData);
      }
    } catch (error) {
      console.error('Error loading studio data:', error);
      setStudio(defaultStudioData);
    } finally {
      setIsLoading(false);
    }
  };

  const saveStudio = async (updatedStudio: StudioData) => {
    try {
      await setStudioData(updatedStudio);
      setStudio(updatedStudio);
    } catch (error) {
      console.error('Error saving studio data:', error);
      throw error;
    }
  };

  const updateStudio = async (updates: Partial<StudioData>) => {
    const updatedStudio = { ...studio, ...updates };
    await saveStudio(updatedStudio);
  };

  return {
    studio,
    isLoading,
    updateStudio
  };
}`;
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const zip = new JSZip();
      
      // Calculate total images
      const projectImageCount = projects.reduce((sum, p) => sum + p.images.length + 1, 0);
      const mediaImageCount = mediaCards.length;
      const studioImageCount = 1;
      const totalImages = projectImageCount + mediaImageCount + studioImageCount;
      let downloadedCount = 0;

      // Create folder structure
      const imagesFolder = zip.folder('public/images');
      if (!imagesFolder) throw new Error('Failed to create images folder');

      // Export project images
      const projectsFolder = imagesFolder.folder('projects');
      if (projectsFolder) {
        for (let i = 0; i < projects.length; i++) {
          const project = projects[i];
          const projectSlug = project.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
          
          const projectFolder = projectsFolder.folder(projectSlug);
          if (!projectFolder) continue;

          try {
            const mainImageBlob = await downloadImage(project.mainImage);
            projectFolder.file('main.jpg', mainImageBlob);
            downloadedCount++;
            
            toast({
              title: "下载进度",
              description: `已下载 ${downloadedCount}/${totalImages} 张图片`,
            });
          } catch (error) {
            console.error(`Failed to download main image for ${project.title}:`, error);
          }

          for (let j = 0; j < project.images.length; j++) {
            try {
              const imageBlob = await downloadImage(project.images[j].url);
              projectFolder.file(`${j + 1}.jpg`, imageBlob);
              downloadedCount++;
              
              toast({
                title: "下载进度",
                description: `已下载 ${downloadedCount}/${totalImages} 张图片`,
              });
            } catch (error) {
              console.error(`Failed to download image ${j} for ${project.title}:`, error);
            }
          }
        }
      }

      // Export media images
      const mediaFolder = imagesFolder.folder('media');
      if (mediaFolder) {
        for (let i = 0; i < mediaCards.length; i++) {
          try {
            const imageBlob = await downloadImage(mediaCards[i].image);
            mediaFolder.file(`${i + 1}.jpg`, imageBlob);
            downloadedCount++;
            
            toast({
              title: "下载进度",
              description: `已下载 ${downloadedCount}/${totalImages} 张图片`,
            });
          } catch (error) {
            console.error(`Failed to download media card ${i}:`, error);
          }
        }
      }

      // Export studio image
      const studioFolder = imagesFolder.folder('studio');
      if (studioFolder) {
        try {
          const imageBlob = await downloadImage(studioData.image);
          studioFolder.file('intro.jpg', imageBlob);
          downloadedCount++;
          
          toast({
            title: "下载进度",
            description: `已下载 ${downloadedCount}/${totalImages} 张图片`,
          });
        } catch (error) {
          console.error('Failed to download studio image:', error);
        }
      }

      // Generate updated hook files
      const projectDataCode = generateProjectDataCode(projects);
      const mediaDataCode = generateMediaDataCode(mediaCards);
      const studioDataCode = generateStudioDataCode(studioData);

      zip.file('src/hooks/useProjectData.ts', projectDataCode);
      zip.file('src/hooks/useMediaData.ts', mediaDataCode);
      zip.file('src/hooks/useStudioData.ts', studioDataCode);

      // Create README
      const readmeContent = `# 项目完整导出说明

## 导出内容

本ZIP文件包含：

### 1. 图片文件夹 (\`public/images/\`)

所有图片已从云端下载到本地，按类型组织：

- **projects/** - Works/Forest 页面的项目图片
  - 每个项目有独立文件夹（按项目名称命名）
  - 包含主图 (main.jpg) 和详情图 (1.jpg, 2.jpg, ...)
  
- **media/** - Media 页面的媒体卡片图片
  - 按顺序编号 (1.jpg, 2.jpg, 3.jpg, ...)
  
- **studio/** - Studio 页面的介绍图片
  - intro.jpg - Studio 介绍图片

### 2. 更新后的 Hooks 文件 (\`src/hooks/\`)

三个更新后的数据管理 hooks，所有图片URL已更新为本地路径：

- **useProjectData.ts** - 项目数据管理
- **useMediaData.ts** - 媒体卡片数据管理
- **useStudioData.ts** - Studio 数据管理

## 使用步骤

1. **解压文件**
   - 解压此ZIP文件到临时目录

2. **复制图片文件**
   - 将 \`public/images/\` 文件夹复制到你的项目根目录
   - 确保目录结构完整保留

3. **替换 Hooks 文件**
   - 用解压出的三个 hooks 文件替换项目中的对应文件：
     - \`src/hooks/useProjectData.ts\`
     - \`src/hooks/useMediaData.ts\`
     - \`src/hooks/useStudioData.ts\`

4. **运行项目**
   - 运行 \`npm install\` 确保依赖完整
   - 运行 \`npm run dev\` 启动项目
   - 所有图片现在从本地加载

## 文件统计

- 项目数量: ${projects.length}
- 项目图片总数: ${projectImageCount}
- 媒体卡片数量: ${mediaCards.length}
- Studio 图片: ${studioImageCount}
- **总图片数**: ${totalImages}

## 注意事项

⚠️ **重要提示**

- 确保项目根目录下已有 \`public\` 文件夹
- 替换 hooks 文件前请备份原始文件
- 本地图片模式下，上传功能将被禁用
- 如需继续使用云端编辑，请保留原始代码和 Supabase 配置

## 本地开发优势

✅ 无需网络连接即可查看图片
✅ 加载速度更快
✅ 完全掌控图片资源
✅ 便于版本控制和部署

## 恢复云端模式

如需恢复云端编辑功能：

1. 恢复原始的三个 hooks 文件
2. 确保 Supabase 配置正确
3. 重新运行项目

---

导出时间：${new Date().toLocaleString('zh-CN')}
项目类型：Lovable 建筑展示项目
导出版本：完整版（包含所有页面数据）
`;

      zip.file('README.md', readmeContent);

      // Generate and download ZIP
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `lovable-complete-export-${Date.now()}.zip`);

      toast({
        title: "导出成功！",
        description: `已导出 ${downloadedCount} 张图片和所有配置文件`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "导出失败",
        description: error instanceof Error ? error.message : "导出过程中出现错误",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={exporting}
      className={className}
      variant="outline"
    >
      <Download className="w-4 h-4 mr-2" />
      {exporting ? '导出中...' : '导出为本地项目'}
    </Button>
  );
};