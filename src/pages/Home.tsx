import { useState, useEffect, useRef, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useProjectData } from "@/hooks/useProjectData";
import { Project } from "@/types/project";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";

// Generate random properties for each image
const generateRandomProps = (index: number) => {
  // Use seeded random for consistency on re-renders
  const seed = index * 12345;
  const random = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };
  
  // Random width between 40% and 90%
  const width = 40 + random(1) * 50;
  
  // Random horizontal alignment: 0 = left, 1 = center, 2 = right
  const alignment = Math.floor(random(2) * 3);
  
  return { width, alignment };
};

const Home = () => {
  const { projects, isLoading } = useProjectData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [imageOpacities, setImageOpacities] = useState<number[]>([]);

  // Generate random properties for all images
  const imageProps = useMemo(() => {
    const allProjects = [...projects, ...projects];
    return allProjects.map((_, index) => generateRandomProps(index));
  }, [projects]);

  // Update opacities based on scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateOpacities = () => {
      const containerRect = container.getBoundingClientRect();
      const containerHeight = containerRect.height;
      const newOpacities: number[] = [];

      imageRefs.current.forEach((ref) => {
        if (!ref) {
          newOpacities.push(0);
          return;
        }

        const rect = ref.getBoundingClientRect();
        const imageCenter = rect.top + rect.height / 2;
        const containerCenter = containerRect.top + containerHeight / 2;
        
        // Calculate distance from center as a ratio
        const distanceFromCenter = Math.abs(imageCenter - containerCenter);
        const maxDistance = containerHeight / 2 + rect.height / 2;
        
        // Calculate opacity: 1 at center, fading to 0.1 at edges
        const ratio = 1 - (distanceFromCenter / maxDistance);
        const opacity = Math.max(0.1, Math.min(1, ratio * 1.2));
        
        newOpacities.push(opacity);
      });

      setImageOpacities(newOpacities);
    };

    // Initial update
    updateOpacities();

    // Update on scroll
    container.addEventListener('scroll', updateOpacities);
    
    return () => {
      container.removeEventListener('scroll', updateOpacities);
    };
  }, [projects, isLoading]);

  // Auto-scroll effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isLoading) return;

    let animationFrameId: number;
    let lastTimestamp = 0;
    const scrollSpeed = 0.5;

    const scroll = (timestamp: number) => {
      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }

      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      container.scrollTop += scrollSpeed * (delta / 16);

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

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const getAlignmentClass = (alignment: number) => {
    switch (alignment) {
      case 0: return 'justify-start';
      case 1: return 'justify-center';
      case 2: return 'justify-end';
      default: return 'justify-center';
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

  const allProjects = [...projects, ...projects];

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <Header />

      {/* Auto-scrolling image container */}
      <div 
        ref={scrollContainerRef}
        className="fixed inset-0 overflow-y-scroll pt-16 px-4 lg:px-20"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', pointerEvents: 'none' }}
      >
        {/* Duplicate projects for infinite scroll effect */}
        <div className="flex flex-col gap-8 py-8" style={{ pointerEvents: 'auto' }}>
          {allProjects.map((project, index) => {
            const props = imageProps[index];
            return (
              <div
                key={`${project.id}-${index}`}
                ref={(el) => { imageRefs.current[index] = el; }}
                className={`w-full flex ${getAlignmentClass(props.alignment)} cursor-pointer transition-opacity duration-300`}
                style={{ 
                  opacity: imageOpacities[index] ?? 0.5,
                }}
                onClick={() => handleProjectClick(project)}
              >
                <div 
                  className="aspect-[4/3]"
                  style={{ width: `${props.width}%` }}
                >
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />

      {/* Project Detail Modal - view only */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
};

export default Home;
