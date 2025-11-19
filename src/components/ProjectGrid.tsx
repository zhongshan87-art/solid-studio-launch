import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useProjectData } from "@/hooks/useProjectData";
import { ProjectImageManager } from "./ProjectImageManager";
import { Project } from "@/types/project";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from "lucide-react";
interface SortableProjectCardProps {
  project: Project;
  isGridEditMode: boolean;
  onClick: () => void;
}

const SortableProjectCard = ({ project, isGridEditMode, onClick }: SortableProjectCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <article 
      ref={setNodeRef} 
      style={style} 
      className={`group cursor-pointer relative ${isGridEditMode ? 'ring-2 ring-primary/50' : ''}`}
    >
      {isGridEditMode && (
        <div 
          {...attributes} 
          {...listeners}
          className="absolute top-2 left-2 z-10 p-2 bg-background/80 rounded cursor-move hover:bg-background transition-colors"
        >
          <GripVertical className="h-5 w-5 text-foreground" />
        </div>
      )}
      <div className="w-full overflow-hidden aspect-square">
        {project.images[0]?.type === 'video' && project.images[0]?.thumbnail ? (
          <div className="relative w-full h-full" onClick={isGridEditMode ? undefined : onClick}>
            <img 
              src={project.images[0].thumbnail} 
              alt={project.images[0].alt || project.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>
        ) : (
          <img 
            src={project.images[0]?.url || project.mainImage} 
            alt={project.images[0]?.alt || project.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            onClick={isGridEditMode ? undefined : onClick}
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
        <p className="text-sm text-slate-50">{project.location}</p>
      </div>
    </article>
  );
};

export const ProjectGrid = () => {
  const {
    projects,
    isLoading,
    updateProjectDescription,
    addImageToProject,
    removeImageFromProject,
    updateProject,
    reorderProjectImages,
    reorderProjects,
  } = useProjectData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isGridEditMode, setIsGridEditMode] = useState(false);
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectLocation, setProjectLocation] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      // Ctrl+E for project detail edit mode
      if (event.ctrlKey && event.key === 'e' && !event.shiftKey) {
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
      // Ctrl+Shift+E for grid edit mode
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        setIsGridEditMode(prev => !prev);
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
  const handleImageAdd = (media: {
    url: string;
    alt: string;
    caption?: string;
    type: 'image' | 'video';
    thumbnail?: string;
  }) => {
    if (selectedProject) {
      const mediaSize = Math.round(media.url.length * 0.75);
      console.info('Adding media to project:', selectedProject.id, { 
        mediaSize, 
        alt: media.alt, 
        caption: media.caption,
        type: media.type,
      });
      
      addImageToProject(selectedProject.id, media.url, media.alt, media.caption || '');
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

  const handleReorder = (newOrder: string[]) => {
    if (selectedProject) {
      reorderProjectImages(selectedProject.id, newOrder);
    }
  };

  const handleProjectDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);

      const newOrder = arrayMove(projects, oldIndex, newIndex).map(p => p.id);
      reorderProjects(newOrder);
    }
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading projects...</div>;
  }

  return <section id="works" className="py-8">
      <div className="w-full px-0">
        {isGridEditMode && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-center">
            <p className="text-sm font-medium">
              编辑模式 - 拖拽项目调整顺序，按 <kbd className="px-2 py-1 bg-background rounded text-xs">Ctrl+Shift+E</kbd> 退出
            </p>
          </div>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleProjectDragEnd}
        >
          <SortableContext
            items={projects.map(p => p.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px]">
              {projects.map((project) => (
                <SortableProjectCard
                  key={project.id}
                  project={project}
                  isGridEditMode={isGridEditMode}
                  onClick={() => handleImageClick(project)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[90vw] max-w-none h-[90vh] max-h-none">
          <DialogHeader className="sr-only">
            <DialogTitle>项目详情</DialogTitle>
            <DialogDescription>查看与编辑项目信息与图片</DialogDescription>
          </DialogHeader>
          {selectedProject ? <div className="flex-1 overflow-auto">
              {isEditMode ? <div className="p-4">
                  <div className="space-y-4 mb-6 pb-6 border-b">
                    <Input value={projectTitle} onChange={e => setProjectTitle(e.target.value)} className="text-2xl font-bold border-0 bg-transparent px-0 focus-visible:ring-0" placeholder="Project title..." />
                    <Input value={projectLocation} onChange={e => setProjectLocation(e.target.value)} className="text-lg text-muted-foreground border-0 bg-transparent px-0 focus-visible:ring-0" placeholder="Project location..." />
                  </div>
                  
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="images">Images</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="content" className="p-4">
                      <div className="space-y-6">
                        <div className="text-base leading-relaxed w-full">
                          <Textarea value={projectDescription} onChange={e => setProjectDescription(e.target.value)} className="min-h-[100px] mb-4 w-full" placeholder="Enter project description..." />
                        </div>
                        
                        <div className="relative">
                           <Carousel key={(selectedProject?.images || []).map(i => i.id).join('|') || 'empty'} className="w-full">
                            <CarouselContent>
                                {selectedProject.images.map(media => <CarouselItem key={media.id}>
                                  <div className="flex flex-col items-center space-y-4">
                                    <div className="w-full flex justify-center">
                                      {media.type === 'video' ? (
                                        <video 
                                          src={media.url} 
                                          controls 
                                          className="max-h-[60vh] w-auto rounded-lg"
                                          onError={(e) => {
                                            console.error('Failed to load video:', media.url.substring(0, 50) + '...');
                                          }}
                                        >
                                          Your browser does not support the video tag.
                                        </video>
                                      ) : (
                                        <img src={media.url} alt={media.alt} className="max-h-[60vh] w-auto object-contain rounded-lg" onError={e => {
                                          console.error('Failed to load image:', media.url.substring(0, 50) + '...');
                                          e.currentTarget.src = '/placeholder.svg';
                                        }} />
                                      )}
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
                      <ProjectImageManager 
                        images={selectedProject.images} 
                        onImageAdd={handleImageAdd} 
                        onImageRemove={handleImageRemove} 
                        onImageUpdate={handleImageUpdate}
                        onReorder={handleReorder}
                      />
                    </TabsContent>
                  </Tabs>
                </div> : <div className="p-4">
                  <div className="space-y-6">
                    <div className="text-slate-50">
                      <h3 className="text-2xl font-bold mb-4">{selectedProject.title}</h3>
                      <p className="text-lg mb-4 text-slate-50">{selectedProject.location}</p>
                      <div className="text-base leading-relaxed w-full">
                        <p className="w-full break-words whitespace-pre-wrap">{projectDescription}</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Carousel key={(selectedProject?.images || []).map(i => i.id).join('|') || 'empty'} className="w-full">
                        <CarouselContent>
                          {selectedProject.images.map(media => <CarouselItem key={media.id}>
                              <div className="flex flex-col items-center space-y-4">
                                <div className="w-full flex justify-center">
                                  {media.type === 'video' ? (
                                    <video 
                                      src={media.url} 
                                      controls 
                                      className="max-h-[60vh] w-auto rounded-lg"
                                      onError={(e) => {
                                        console.error('Failed to load video:', media.url.substring(0, 50) + '...');
                                      }}
                                    >
                                      Your browser does not support the video tag.
                                    </video>
                                  ) : (
                                    <img src={media.url} alt={media.alt} className="max-h-[60vh] w-auto object-contain rounded-lg" onError={e => {
                                      console.error('Failed to load image:', media.url.substring(0, 50) + '...');
                                      e.currentTarget.src = '/placeholder.svg';
                                    }} />
                                  )}
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
