import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useProjectData } from "@/hooks/useProjectData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Project } from "@/types/project";
import { ProjectMainImageUpload } from "@/components/ProjectMainImageUpload";

const Home = () => {
  const { projects, isLoading, updateProject } = useProjectData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Edit mode keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setIsEditMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let lastTimestamp = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const scroll = (timestamp: number) => {
      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }

      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      container.scrollTop -= scrollSpeed * (delta / 16);

      // Reset to bottom when reaching top for infinite loop
      if (container.scrollTop <= 0) {
        container.scrollTop = container.scrollHeight - container.clientHeight;
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

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
      {isEditMode && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
          编辑模式 (Ctrl+E 退出)
        </div>
      )}

      {/* Auto-scrolling image container */}
      <div 
        ref={scrollContainerRef}
        className="fixed inset-0 overflow-y-scroll scrollbar-hide pt-16 px-20"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Duplicate projects for infinite scroll effect */}
        <div className="flex flex-col">
          {[...projects, ...projects].map((project, index) => (
            <div
              key={`${project.id}-${index}`}
              className="w-full h-screen cursor-pointer relative"
              onClick={() => setSelectedProject(project)}
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

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold leading-relaxed">
                  {selectedProject.title}
                </DialogTitle>
                <p className="text-muted-foreground font-light leading-relaxed" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                  {selectedProject.location}
                </p>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Main image */}
                <div className="relative group">
                  <img
                    src={selectedProject.mainImage}
                    alt={selectedProject.title}
                    className="w-full rounded-lg"
                  />
                  {isEditMode && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ProjectMainImageUpload
                        projectId={selectedProject.id}
                        onImageUpdate={async (projectId, imageUrl) => {
                          await updateProject(projectId, { mainImage: imageUrl });
                          // 更新 selectedProject 以反映新的主图
                          setSelectedProject(prev => prev ? { ...prev, mainImage: imageUrl } : null);
                        }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Description */}
                {selectedProject.description && (
                  <div className="prose max-w-none">
                    {selectedProject.description.split('\n\n').map((paragraph, index) => {
                      const hasChinese = /[\u4e00-\u9fa5]/.test(paragraph);
                      return (
                        <p 
                          key={index} 
                          className={`${hasChinese ? 'font-bold' : 'font-light'} leading-relaxed mb-4`}
                          style={hasChinese ? {} : { fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
                        >
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                )}
                
                {/* Additional images */}
                {selectedProject.images && selectedProject.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {selectedProject.images.map((image) => (
                      <div key={image.id} className="space-y-2">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full rounded-lg"
                        />
                        {image.caption && (
                          <p className="text-sm text-muted-foreground font-light leading-relaxed" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                            {image.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Home;
