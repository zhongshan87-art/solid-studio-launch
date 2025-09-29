import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useProjectData } from "@/hooks/useProjectData";
import { ProjectImageManager } from "./ProjectImageManager";
import { Project } from "@/types/project";
export const ProjectGrid = () => {
  const {
    projects,
    isLoading,
    updateProjectDescription,
    addImageToProject,
    removeImageFromProject,
    updateProject
  } = useProjectData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectDescription, setProjectDescription] = useState<string>("");
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        if (isEditMode && selectedProject) {
          // Save the description when exiting edit mode
          updateProjectDescription(selectedProject.id, projectDescription);
        }
        setIsEditMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, selectedProject, projectDescription, updateProjectDescription]);
  const handleImageClick = (project: Project) => {
    setSelectedProject(project);
    const defaultDescription = `This is a detailed description of the ${project.title} project located in ${project.location}. The project showcases innovative architectural design and sustainable building practices.`;
    setProjectDescription(project.description || defaultDescription);
    setIsModalOpen(true);
  };
  const handleImageAdd = (image: {
    url: string;
    alt: string;
    caption?: string;
  }) => {
    if (selectedProject) {
      addImageToProject(selectedProject.id, image);
      // Update local selected project
      const updatedProject = {
        ...selectedProject,
        images: [...selectedProject.images, {
          id: `${selectedProject.id}-${Date.now()}`,
          ...image
        }]
      };
      setSelectedProject(updatedProject);
    }
  };
  const handleImageRemove = (imageId: string) => {
    if (selectedProject) {
      removeImageFromProject(selectedProject.id, imageId);
      // Update local selected project
      const updatedProject = {
        ...selectedProject,
        images: selectedProject.images.filter(img => img.id !== imageId)
      };
      setSelectedProject(updatedProject);
    }
  };
  const handleImageUpdate = (imageId: string, updates: any) => {
    if (selectedProject) {
      const updatedImages = selectedProject.images.map(img => img.id === imageId ? {
        ...img,
        ...updates
      } : img);
      const updatedProject = {
        ...selectedProject,
        images: updatedImages
      };
      updateProject(selectedProject.id, {
        images: updatedImages
      });
      setSelectedProject(updatedProject);
    }
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
                  <img src={project.mainImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onClick={() => handleImageClick(project)} />
                </div>
                <div className="p-6">
                  <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-foreground mb-2 leading-tight">
                    {project.title}
                  </h2>
                  <p className="text-base md:text-lg text-muted-foreground">
                    {project.location}
                  </p>
                </div>
              </article>;
        })}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[90vw] max-w-none h-[90vh] max-h-none">
          <DialogHeader>
            
          </DialogHeader>
          {selectedProject && <div className="flex-1 overflow-auto">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="p-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">{selectedProject.title}</h3>
                      <p className="text-lg text-muted-foreground mb-4">{selectedProject.location}</p>
                      <div className="text-base leading-relaxed w-full">
                        {isEditMode ? <Textarea value={projectDescription} onChange={e => setProjectDescription(e.target.value)} className="min-h-[100px] mb-4 w-full" placeholder="Enter project description..." /> : <p className="w-full break-words">{projectDescription}</p>}
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
                                {image.caption && <p className="text-sm text-muted-foreground text-center max-w-full">
                                    {image.caption}
                                  </p>}
                              </div>
                            </CarouselItem>)}
                        </CarouselContent>
                        <CarouselPrevious className="left-4 h-12 w-12 bg-background/80 hover:bg-background border-2 shadow-lg" />
                        <CarouselNext className="right-4 h-12 w-12 bg-background/80 hover:bg-background border-2 shadow-lg" />
                      </Carousel>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="images" className="p-4">
                  {isEditMode ? <ProjectImageManager images={selectedProject.images} onImageAdd={handleImageAdd} onImageRemove={handleImageRemove} onImageUpdate={handleImageUpdate} /> : <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Press Ctrl+E to enter edit mode and manage images
                      </p>
                      <Button onClick={() => setIsEditMode(true)}>
                        Enter Edit Mode
                      </Button>
                    </div>}
                </TabsContent>
              </Tabs>
            </div>}
        </DialogContent>
      </Dialog>
    </section>;
};