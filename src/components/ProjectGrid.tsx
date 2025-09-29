import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useProjectData } from "@/hooks/useProjectData";
import { Project } from "@/types/project";
export const ProjectGrid = () => {
  const {
    projects,
    isLoading
  } = useProjectData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };
  if (isLoading) {
    return <div className="py-8 text-center">Loading projects...</div>;
  }
  return <section id="works" className="py-8">
      <div className="w-full px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {projects.map((project, index) => {
          const isLastInRowMd = (index + 1) % 2 === 0;
          const isLastInRowLg = (index + 1) % 3 === 0;
          return <article key={project.id} className={`group cursor-pointer border-b border-gray-200 ${!isLastInRowMd ? 'md:border-r' : ''} ${!isLastInRowLg ? 'lg:border-r' : ''} md:[&:nth-child(even)]:border-r-0 lg:[&:nth-child(3n)]:border-r-0`}>
                <div className="w-full overflow-hidden aspect-[4/3]">
                  <img src={project.images[0]?.url || project.mainImage} alt={project.images[0]?.alt || project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onClick={() => handleImageClick(project)} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                  <p className="text-muted-foreground text-sm">{project.location}</p>
                </div>
              </article>;
        })}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[90vw] max-w-none h-[90vh] max-h-none">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title || "Project Details"}</DialogTitle>
          </DialogHeader>
          {selectedProject ? <div className="flex-1 overflow-auto">
              <div className="p-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">{selectedProject.title}</h3>
                    <p className="text-lg text-muted-foreground mb-4">{selectedProject.location}</p>
                    <div className="text-base leading-relaxed w-full">
                      <p className="w-full break-words whitespace-pre-wrap">{selectedProject.description || `This is a detailed description of the ${selectedProject.title} project located in ${selectedProject.location}. The project showcases innovative architectural design and sustainable building practices.`}</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {selectedProject.images.map(image => <CarouselItem key={image.id}>
                            <div className="flex flex-col items-center space-y-4">
                              <div className="w-full flex justify-center">
                                <img src={image.url} alt={image.alt} className="max-h-[60vh] w-auto object-contain rounded-lg" />
                              </div>
                              
                            </div>
                          </CarouselItem>)}
                      </CarouselContent>
                      <CarouselPrevious className="left-4 h-12 w-12 bg-background/80 hover:bg-background border-2 shadow-lg" />
                      <CarouselNext className="right-4 h-12 w-12 bg-background/80 hover:bg-background border-2 shadow-lg" />
                    </Carousel>
                  </div>
                </div>
              </div>
            </div> : <div className="flex-1 flex items-center justify-center text-muted-foreground">
                No project selected
              </div>}
        </DialogContent>
      </Dialog>
    </section>;
};