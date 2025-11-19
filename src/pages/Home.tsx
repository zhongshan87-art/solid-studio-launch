import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useProjectData } from "@/hooks/useProjectData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Project } from "@/types/project";

const Home = () => {
  const { projects, isLoading } = useProjectData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Define card size patterns (循环: 大-中-小-横向-中-大...)
  const getSizeClass = (index: number) => {
    const pattern = index % 6;
    switch (pattern) {
      case 0:
        return "col-span-2 row-span-2"; // 大卡片
      case 1:
        return "col-span-1 row-span-1"; // 中卡片
      case 2:
        return "col-span-1 row-span-1"; // 小卡片
      case 3:
        return "col-span-2 row-span-1"; // 横向卡片
      case 4:
        return "col-span-1 row-span-1"; // 中卡片
      case 5:
        return "col-span-2 row-span-2"; // 大卡片
      default:
        return "col-span-1 row-span-1";
    }
  };

  const getHeightClass = (index: number) => {
    const pattern = index % 6;
    switch (pattern) {
      case 0:
      case 5:
        return "h-[800px]"; // 大卡片
      case 3:
        return "h-[500px]"; // 横向卡片
      case 1:
      case 4:
        return "h-[600px]"; // 中卡片
      case 2:
        return "h-[400px]"; // 小卡片
      default:
        return "h-[600px]";
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
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Main content area with vertical scrolling */}
      <div className="pt-24 pb-16 px-4 md:px-8 lg:px-12">
        {/* Grid layout for project cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min max-w-[1600px] mx-auto">
          {projects.map((project, index) => {
            const sizeClass = getSizeClass(index);
            const heightClass = getHeightClass(index);
            
            return (
              <div
                key={project.id}
                className={`${sizeClass} ${heightClass} group cursor-pointer overflow-hidden rounded-lg`}
                onClick={() => setSelectedProject(project)}
              >
                {/* Image container */}
                <div className="relative w-full h-full overflow-hidden bg-muted">
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Text overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-title font-bold mb-2 leading-relaxed">
                        {project.title}
                      </h3>
                      <p className="text-caption font-light leading-relaxed" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                        {project.location}
                      </p>
                      {project.description && (
                        <p className="text-sm mt-2 font-light leading-relaxed line-clamp-2" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                          {project.description.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
