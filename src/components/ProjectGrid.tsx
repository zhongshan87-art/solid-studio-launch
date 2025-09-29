import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
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
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingImageText, setEditingImageText] = useState<string>("");

  // Sync selectedProject with updated projects data fully
  useEffect(() => {
    if (!selectedProject || projects.length === 0) return;
    const updated = projects.find(p => p.id === selectedProject.id);
    if (!updated) return;
    const imagesChanged = updated.images.length !== selectedProject.images.length || updated.images.some((img, idx) => img.id !== selectedProject.images[idx]?.id);
    const metaChanged = updated.title !== selectedProject.title || updated.location !== selectedProject.location || updated.description !== selectedProject.description;
    if (imagesChanged || metaChanged) {
      console.log('Detected project updates, syncing selectedProject.');
      setSelectedProject(updated);
      const defaultDescription = `This is a detailed description of the ${updated.title} project located in ${updated.location}. The project showcases innovative architectural design and sustainable building practices.`;
      setProjectDescription(updated.description || defaultDescription);
      setProjectTitle(updated.title);
      setProjectLocation(updated.location);
    }
  }, [projects, selectedProject]);

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
    // Find the most up-to-date project data from the projects array
    const currentProject = projects.find(p => p.id === project.id) || project;
    setSelectedProject(currentProject);
    const defaultDescription = `This is a detailed description of the ${currentProject.title} project located in ${currentProject.location}. The project showcases innovative architectural design and sustainable building practices.`;
    setProjectDescription(currentProject.description || defaultDescription);
    setProjectTitle(currentProject.title);
    setProjectLocation(currentProject.location);
    setIsModalOpen(true);
    // Reset edit mode when opening modal to prevent conflicts
    setIsEditMode(false);
    console.log('Opening modal for project:', currentProject.id, 'with', currentProject.images.length, 'images');
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
        // Persist and get the actual new image object (with final ID)
        const persistedImage = addImageToProject(selectedProject.id, image);
        if (!persistedImage) return;

        // Update local selected project to reflect persisted state
        const updatedProject = {
          ...selectedProject,
          images: [...selectedProject.images, persistedImage]
        };
        setSelectedProject(updatedProject);
        console.log('Successfully added image with ID:', persistedImage.id);
        console.log('Updated project now has', updatedProject.images.length, 'images');
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
          <DialogHeader className="sr-only">
            <DialogTitle>项目详情</DialogTitle>
            <DialogDescription>查看与编辑项目信息与图片</DialogDescription>
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedProject.images.map(image => (
                          <div key={image.id} className="bg-card rounded-lg border shadow-sm overflow-hidden">
                            <div className="aspect-[4/3] overflow-hidden">
                              <img 
                                src={image.url} 
                                alt={image.alt} 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                                onError={e => {
                                  console.error('Failed to load image:', image.url.substring(0, 50) + '...');
                                  e.currentTarget.src = '/placeholder.svg';
                                }} 
                              />
                            </div>
                            <div className="p-4">
                              {editingImageId === image.id ? (
                                <div className="space-y-2">
                                  <Textarea 
                                    value={editingImageText}
                                    onChange={(e) => setEditingImageText(e.target.value)}
                                    className="min-h-[80px] resize-none"
                                    placeholder="Enter text for this card..."
                                  />
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      onClick={() => {
                                        handleImageUpdate(image.id, { text: editingImageText });
                                        setEditingImageId(null);
                                        setEditingImageText("");
                                      }}
                                    >
                                      Save
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => {
                                        setEditingImageId(null);
                                        setEditingImageText("");
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {image.text || "Click edit to add text for this card..."}
                                  </p>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => {
                                      setEditingImageId(image.id);
                                      setEditingImageText(image.text || "");
                                    }}
                                  >
                                    Edit Text
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
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
                    
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedProject.images.map(image => (
                        <div key={image.id} className="bg-card rounded-lg border shadow-sm overflow-hidden">
                          <div className="aspect-[4/3] overflow-hidden">
                            <img 
                              src={image.url} 
                              alt={image.alt} 
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                              onError={e => {
                                console.error('Failed to load image:', image.url.substring(0, 50) + '...');
                                e.currentTarget.src = '/placeholder.svg';
                              }} 
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {image.text || "No description available."}
                            </p>
                          </div>
                        </div>
                      ))}
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