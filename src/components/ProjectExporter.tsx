import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Project } from '@/types/project';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ProjectExporterProps {
  projects: Project[];
  className?: string;
}

export const ProjectExporter: React.FC<ProjectExporterProps> = ({ projects, className }) => {
  const [exporting, setExporting] = useState(false);

  const downloadImage = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download: ${url}`);
    }
    return response.blob();
  };

  const getLocalPath = (url: string, projectIndex: number, imageIndex: number): string => {
    const project = projects[projectIndex];
    const projectSlug = project.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    const ext = url.split('.').pop()?.split('?')[0] || 'jpg';
    const fileName = imageIndex === -1 ? 'main' : (imageIndex + 1).toString();
    
    return `/images/projects/${projectSlug}/${fileName}.${ext}`;
  };

  const generateUpdatedProjectData = (projects: Project[]): string => {
    const updatedProjects = projects.map((project, projectIndex) => {
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

const STORAGE_KEY = 'lovable-projects-data';

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

  const handleExport = async () => {
    setExporting(true);
    try {
      const zip = new JSZip();
      const imageFolder = zip.folder('public/images/projects');
      
      if (!imageFolder) {
        throw new Error('Failed to create image folder');
      }

      let downloadedCount = 0;
      const totalImages = projects.reduce((sum, p) => sum + p.images.length + 1, 0);

      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const projectSlug = project.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        
        const projectFolder = imageFolder.folder(projectSlug);
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

      const updatedCode = generateUpdatedProjectData(projects);
      zip.file('src/hooks/useProjectData.ts', updatedCode);

      const readmeContent = `# 项目导出说明

## 导出内容

本ZIP文件包含：

1. **图片文件夹** (\`public/images/projects/\`)
   - 所有项目的图片已从云端下载到本地
   - 按项目名称组织的文件夹结构
   - 每个项目包含主图 (main.jpg) 和详情图 (1.jpg, 2.jpg, ...)

2. **更新后的代码** (\`src/hooks/useProjectData.ts\`)
   - 已将所有图片URL更新为本地路径
   - 可以直接替换项目中的对应文件

## 使用步骤

1. 解压此ZIP文件
2. 将 \`public/images/projects/\` 文件夹复制到你的项目根目录
3. 用解压出的 \`src/hooks/useProjectData.ts\` 替换项目中的同名文件
4. 运行项目即可使用本地图片

## 注意事项

- 确保项目根目录下已有 \`public\` 文件夹
- 如需继续使用云端编辑，请保留原始代码备份
- 本地图片模式不支持实时上传，需要手动管理图片文件

导出时间：${new Date().toLocaleString('zh-CN')}
`;

      zip.file('README.md', readmeContent);

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `lovable-project-export-${Date.now()}.zip`);

      toast({
        title: "导出成功",
        description: `已导出 ${downloadedCount} 张图片和更新后的代码`,
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
