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
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Track screen size for responsive behavior
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        
        // Calculate opacity with smooth easing curve
        const ratio = Math.max(0, Math.min(1, 1 - (distanceFromCenter / maxDistance)));
        // Apply ease-in-out curve for smoother transition: 3x² - 2x³
        const easedRatio = ratio * ratio * (3 - 2 * ratio);
        // Map to opacity range 0.15 to 1 for gentler fade
        const opacity = 0.15 + easedRatio * 0.85;
        
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

  // Auto-scroll effect - only on desktop
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isLoading || !isDesktop) return;

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
  }, [isLoading, isDesktop]);

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

      {/* Floating subtitle below header title */}
      <div className="fixed top-[72px] left-0 z-20 px-4 md:px-[50px]">
        <p className="font-bold text-foreground text-lg md:text-xl">
          有温度且灵动的设计表达
        </p>
      </div>

      {/* Auto-scrolling image container */}
      <div 
        ref={scrollContainerRef}
        className="fixed inset-0 overflow-y-scroll pt-16 px-4 lg:px-20"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', pointerEvents: isDesktop ? 'none' : 'auto' }}
      >
        {/* Duplicate projects for infinite scroll effect */}
        <div className="flex flex-col gap-8 py-8" style={{ pointerEvents: 'auto' }}>
          {allProjects.map((project, index) => {
            const props = imageProps[index];
            return (
              <div
                key={`${project.id}-${index}`}
                ref={(el) => { imageRefs.current[index] = el; }}
                className={`w-full flex ${isDesktop ? (index === 0 ? 'justify-center' : getAlignmentClass(props.alignment)) : 'justify-center'} cursor-pointer`}
                style={{ 
                  opacity: imageOpacities[index] ?? 0.15,
                  transition: 'opacity 0.4s ease-out',
                }}
                onClick={() => handleProjectClick(project)}
              >
                <div 
                  className="aspect-[4/3]"
                  style={{ width: isDesktop ? `${props.width}%` : '100%' }}
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
