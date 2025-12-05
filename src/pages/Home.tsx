import { useState, useEffect, useRef, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useProjectData } from "@/hooks/useProjectData";
import { Project } from "@/types/project";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
  const { projects, isLoading, updateProject, updateProjectDescription, addImageToProject, removeImageFromProject, reorderProjectImages } = useProjectData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = useAuth();

  // Generate random layout positions for images (memoized to stay consistent)
  const imageLayouts = useMemo(() => {
    if (projects.length === 0) return [];
    
    // Create layouts for doubled projects (for infinite scroll)
    const allProjects = [...projects, ...projects];
    const layouts: { scale: number; offsetX: number; marginTop: number; side: 'left' | 'right' }[] = [];
    
    allProjects.forEach((_, index) => {
      const scale = 0.3 + Math.random() * 0.4; // 30-70% scale
      const side = Math.random() > 0.5 ? 'left' : 'right';
      const offsetX = Math.random() * 15; // 0-15% offset from edge
      const marginTop = 50 + Math.random() * 150; // Random vertical spacing
      
      layouts.push({ scale, offsetX, marginTop, side });
    });
    
    return layouts;
  }, [projects.length]);

  // Calculate total content height for plant drawings
  const totalContentHeight = useMemo(() => {
    if (imageLayouts.length === 0) return 5000;
    return imageLayouts.reduce((acc, layout) => acc + layout.marginTop + 400 * layout.scale, 0) * 2;
  }, [imageLayouts]);

  // Auto-scroll effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isLoading) return;

    let animationFrameId: number;
    let lastTimestamp = 0;
    const scrollSpeed = 0.3; // Slower scroll for appreciation

    const scroll = (timestamp: number) => {
      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }

      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      container.scrollTop += scrollSpeed * (delta / 16);

      // Reset to top when reaching bottom for infinite loop
      if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
        container.scrollTop = 0;
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isLoading]);

  // Sync selectedProject with projects updates
  useEffect(() => {
    if (!selectedProject || projects.length === 0) return;
    const updated = projects.find(p => p.id === selectedProject.id);
    if (updated) {
      setSelectedProject(updated);
    }
  }, [projects, selectedProject?.id]);

  const handleProjectClick = (project: Project) => {
    const currentProject = projects.find(p => p.id === project.id) || project;
    setSelectedProject(currentProject);
    setIsModalOpen(true);
    setIsEditMode(false);
  };

  const handleImageAdd = (media: { url: string; alt: string; caption?: string; type: 'image' | 'video'; thumbnail?: string }) => {
    if (selectedProject) {
      addImageToProject(selectedProject.id, media.url, media.alt, media.caption || '');
    }
  };

  const handleImageRemove = (imageId: string) => {
    if (selectedProject) {
      removeImageFromProject(selectedProject.id, imageId);
    }
  };

  const handleImageUpdate = (imageId: string, updates: any) => {
    if (selectedProject) {
      const updatedImages = selectedProject.images.map(img =>
        img.id === imageId ? { ...img, ...updates } : img
      );
      updateProject(selectedProject.id, { images: updatedImages });
    }
  };

  const handleReorder = (newOrder: string[]) => {
    if (selectedProject) {
      reorderProjectImages(selectedProject.id, newOrder);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <Header />
      
      {/* Edit mode indicator */}
      {isAdmin && isEditMode && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
          编辑模式 (Admin)
        </div>
      )}

      {/* Auto-scrolling image container */}
      <div 
        ref={scrollContainerRef}
        className="fixed inset-0 overflow-y-scroll pt-20"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', pointerEvents: 'none' }}
      >
        {/* Scattered images layout like solidobjectives.com */}
        <div className="relative px-8 md:px-16 lg:px-24" style={{ pointerEvents: 'auto', minHeight: totalContentHeight }}>
          {[...projects, ...projects].map((project, index) => {
            const layout = imageLayouts[index];
            if (!layout) return null;
            
            const width = layout.scale * 100;
            const isLeft = layout.side === 'left';
            
            return (
              <div
                key={`${project.id}-${index}`}
                className="relative cursor-pointer transition-opacity duration-300 hover:opacity-90"
                style={{
                  width: `${width}%`,
                  maxWidth: '70vw',
                  minWidth: '200px',
                  marginTop: `${layout.marginTop}px`,
                  marginLeft: isLeft ? `${layout.offsetX}%` : 'auto',
                  marginRight: isLeft ? 'auto' : `${layout.offsetX}%`,
                }}
                onClick={() => handleProjectClick(project)}
              >
                <img
                  src={project.mainImage}
                  alt={project.title}
                  className="w-full h-auto object-cover"
                  style={{
                    aspectRatio: 'auto',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <Footer />

      {/* Project Detail Modal - shared component */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isAdmin ? isEditMode : false}
        onEditModeChange={isAdmin ? setIsEditMode : undefined}
        onProjectUpdate={updateProject}
        onDescriptionUpdate={updateProjectDescription}
        onImageAdd={handleImageAdd}
        onImageRemove={handleImageRemove}
        onImageUpdate={handleImageUpdate}
        onReorder={handleReorder}
      />
    </main>
  );
};

export default Home;
