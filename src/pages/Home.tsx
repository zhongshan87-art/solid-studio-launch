import { useState, useEffect, useRef } from "react";
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

  // Calculate opacity based on distance from viewport center
  const calculateOpacity = (element: HTMLElement): number => {
    const rect = element.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    
    const distance = Math.abs(elementCenter - viewportCenter);
    const maxDistance = window.innerHeight;
    
    // Closer to center = higher opacity, min 0.3
    const opacity = Math.max(0.3, 1 - (distance / maxDistance) * 0.9);
    return opacity;
  };

  // Auto-scroll effect with opacity updates
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let lastTimestamp = 0;
    const scrollSpeed = 0.5;

    const updateOpacities = () => {
      const images = container.querySelectorAll('[data-project-image]');
      images.forEach((img) => {
        const opacity = calculateOpacity(img as HTMLElement);
        (img as HTMLElement).style.opacity = String(opacity);
      });
    };

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

      // Update opacities based on scroll position
      updateOpacities();

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

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
        className="fixed inset-0 overflow-y-scroll pt-16 px-20"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', pointerEvents: 'none' }}
      >
        {/* Duplicate projects for infinite scroll effect */}
        <div className="flex flex-col" style={{ pointerEvents: 'auto' }}>
          {[...projects, ...projects].map((project, index) => (
            <div
              key={`${project.id}-${index}`}
              data-project-image
              className="w-full h-screen cursor-pointer relative transition-opacity duration-150"
              style={{ opacity: 0.3 }}
              onClick={() => handleProjectClick(project)}
            >
              <img
                src={project.mainImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
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
