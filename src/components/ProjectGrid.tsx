import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectLocation, setProjectLocation] = useState<string>("");

  // Sync local state when selectedProject changes
  useEffect(() => {
    if (selectedProject) {
      const defaultDescription = `This is a detailed description of the ${selectedProject.title} project located in ${selectedProject.location}. The project showcases innovative architectural design and sustainable building practices.`;
      setProjectDescription(selectedProject.description || defaultDescription);
      setProjectTitle(selectedProject.title);
      setProjectLocation(selectedProject.location);
    }
  }, [selectedProject]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        if (isEditMode && selectedProject) {
          // Save the description and title when exiting edit mode
          updateProjectDescription(selectedProject.id, projectDescription);
          if (projectTitle !== selectedProject.title) {
            updateProject(selectedProject.id, {
              title: projectTitle
            });
          }
          if (projectLocation !== selectedProject.location) {
            updateProject(selectedProject.id, {
              location: projectLocation
            });
          }
        }
        setIsEditMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, selectedProject, projectDescription, projectTitle, projectLocation, updateProjectDescription, updateProject]);
  const handleImageClick = (project: Project) => {
    setSelectedProject(project);
    const defaultDescription = `This is a detailed description of the ${project.title} project located in ${project.location}. The project showcases innovative architectural design and sustainable building practices.`;
    setProjectDescription(project.description || defaultDescription);
    setProjectTitle(project.title);
    setProjectLocation(project.location);
    setIsModalOpen(true);
    // Reset edit mode when opening modal to prevent conflicts
    setIsEditMode(false);
  };
  const handleImageAdd = (image: {
    url: string;
    alt: string;
    caption?: string;
  }) => {
    if (selectedProject) {
      console.log('Adding image to project:', selectedProject.id, { 
        imageSize: image.url.length, 
        alt: image.alt,
        caption: image.caption 
      });
      
      try {
        addImageToProject(selectedProject.id, image);
        // Update local selected project
        const newImageId = `${selectedProject.id}-${Date.now()}`;
        const updatedProject = {
          ...selectedProject,
          images: [...selectedProject.images, {
            id: newImageId,
            ...image
          }]
        };
        setSelectedProject(updatedProject);
        console.log('Successfully added image with ID:', newImageId);
      } catch (error) {
        console.error('Failed to add image:', error);
      }
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
            <DialogTitle>
              {selectedProject ? selectedProject.title : 'Project Details'}
            </DialogTitle>
          </DialogHeader>
          {selectedProject ? <div className="flex-1 overflow-auto">
              {isEditMode ? <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="p-4">
                    <div className="space-y-6">
                      <div>
                        <Input value={projectTitle} onChange={e => setProjectTitle(e.target.value)} className="text-2xl font-bold mb-4 border-0 bg-transparent px-0 focus-visible:ring-0" placeholder="Project title..." />
                        <Input value={projectLocation} onChange={e => setProjectLocation(e.target.value)} className="text-lg text-muted-foreground mb-4 border-0 bg-transparent px-0 focus-visible:ring-0" placeholder="Project location..." />
                        <div className="text-base leading-relaxed w-full">
                          <Textarea value={projectDescription} onChange={e => setProjectDescription(e.target.value)} className="min-h-[100px] mb-4 w-full" placeholder="Enter project description..." />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <Carousel className="w-full">
                          <CarouselContent>
                            {selectedProject.images.map(image => <CarouselItem key={image.id}>
                                <div className="flex flex-col items-center space-y-4">
                                  <div className="w-full flex justify-center">
                                   <img 
                                     src={image.url} 
                                     alt={image.alt} 
                                     className="max-h-[60vh] w-auto object-contain rounded-lg" 
                                     onError={(e) => {
                                       console.error('Failed to load image:', image.url.substring(0, 50) + '...');
                                       e.currentTarget.src = '/placeholder.svg';
                                     }}
                                   />
                                  </div>
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
                    <ProjectImageManager images={selectedProject.images} onImageAdd={handleImageAdd} onImageRemove={handleImageRemove} onImageUpdate={handleImageUpdate} />
                  </TabsContent>
                </Tabs> : <div className="p-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">{selectedProject.title}</h3>
                      <p className="text-lg text-muted-foreground mb-4">{selectedProject.location}</p>
                      <div className="text-base leading-relaxed w-full">
                        <p className="w-full break-words whitespace-pre-wrap">{projectDescription}</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {selectedProject.images.map(image => <CarouselItem key={image.id}>
                              <div className="flex flex-col items-center space-y-4">
                                <div className="w-full flex justify-center">
                                 <img 
                                   src={image.url} 
                                   alt={image.alt} 
                                   className="max-h-[60vh] w-auto object-contain rounded-lg" 
                                   onError={(e) => {
                                     console.error('Failed to load image:', image.url.substring(0, 50) + '...');
                                     e.currentTarget.src = '/placeholder.svg';
                                   }}
                                 />
                                </div>
                                
                              </div>
                            </CarouselItem>)}
                        </CarouselContent>
                        <CarouselPrevious className="left-4 h-12 w-12 bg-background/80 hover:bg-background border-2 shadow-lg" />
                        <CarouselNext className="right-4 h-12 w-12 bg-background/80 hover:bg-background border-2 shadow-lg" />
                      </Carousel>
                    </div>
                  </div>
                </div>}
            </div> : <div className="flex-1 flex items-center justify-center text-muted-foreground">
                No project selected
              </div>}
        </DialogContent>
      </Dialog>
    </section>;
};