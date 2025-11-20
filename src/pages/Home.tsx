import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useProjectData } from "@/hooks/useProjectData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Project } from "@/types/project";

const Home = () => {
  const { projects, isLoading } = useProjectData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Get varied height for each image
  const getImageHeight = (index: number) => {
    const heights = ['24vh', '34vh', '42vh', '30vh', '26vh', '36vh'];
    return heights[index % heights.length];
  };

  // Get alignment for each image
  const getImageAlignment = (index: number) => {
    const alignments = ['justify-start', 'justify-center', 'justify-end', 'justify-center', 'justify-start', 'justify-end'];
    return alignments[index % alignments.length];
  };

  // Get width for each image - some full width, some narrower
  const getImageWidth = (index: number) => {
    const widthPattern = index % 6;
    // Pattern: narrow, narrow, full, narrow, narrow, full
    if (widthPattern === 2 || widthPattern === 5) {
      return 'w-full';
    }
    return 'w-[70%] md:w-[60%]';
  };

  // Full width images should be centered
  const shouldCenter = (index: number) => {
    const widthPattern = index % 6;
    return widthPattern === 2 || widthPattern === 5;
  };

  // Auto-scroll effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isPaused) return;

    let animationFrameId: number;
    let lastTimestamp = 0;
    const scrollSpeed = 0.5; // pixels per frame

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
  }, [isPaused]);

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
      
      {/* Large title overlay */}
      <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
        <h1 className="text-[12vw] md:text-[10vw] font-bold tracking-tight text-foreground mix-blend-difference">
          FOREST DESIGN
        </h1>
      </div>

      {/* Auto-scrolling image container */}
      <div 
        ref={scrollContainerRef}
        className="fixed inset-0 overflow-y-scroll scrollbar-hide pt-16"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Duplicate projects for infinite scroll effect */}
        <div className="flex flex-col gap-8 px-4 md:px-8 lg:px-12 py-8">
          {[...projects, ...projects].map((project, index) => (
            <div
              key={`${project.id}-${index}`}
              className={`w-full flex ${shouldCenter(index) ? 'justify-center' : getImageAlignment(index)}`}
            >
              <div
                className={`${getImageWidth(index)} cursor-pointer group relative overflow-hidden`}
                style={{ height: getImageHeight(index) }}
                onClick={() => setSelectedProject(project)}
              >
                <img
                  src={project.mainImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              
              {/* Project info overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white px-8">
                  <h3 className="text-4xl md:text-5xl font-bold mb-4 leading-relaxed">
                    {project.title}
                  </h3>
                  <p className="text-xl md:text-2xl font-light" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                    {project.location}
                  </p>
                </div>
              </div>
              </div>
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
                <img
                  src={selectedProject.mainImage}
                  alt={selectedProject.title}
                  className="w-full rounded-lg"
                />
                
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
