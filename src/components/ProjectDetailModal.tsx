import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProjectImageManager } from "./ProjectImageManager";
import { ProjectMainImageUpload } from "./ProjectMainImageUpload";
import { Project } from "@/types/project";

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  isEditMode?: boolean;
  onEditModeChange?: (editMode: boolean) => void;
  onProjectUpdate?: (projectId: number, updates: Partial<Project>) => Promise<void>;
  onDescriptionUpdate?: (projectId: number, description: string) => void;
  onImageAdd?: (media: { url: string; alt: string; caption?: string; type: 'image' | 'video'; thumbnail?: string }) => void;
  onImageRemove?: (imageId: string) => void;
  onImageUpdate?: (imageId: string, updates: any) => void;
  onReorder?: (newOrder: string[]) => void;
  onMainImageUpdate?: (projectId: number, imageUrl: string) => void;
}

export const ProjectDetailModal = ({
  project,
  isOpen,
  onClose,
  isEditMode = false,
  onEditModeChange,
  onProjectUpdate,
  onDescriptionUpdate,
  onImageAdd,
  onImageRemove,
  onImageUpdate,
  onReorder,
  onMainImageUpdate,
}: ProjectDetailModalProps) => {
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectLocation, setProjectLocation] = useState<string>("");

  // Sync local state when project changes
  useEffect(() => {
    if (project) {
      const defaultDescription = `This is a detailed description of the ${project.title} project located in ${project.location}. The project showcases innovative architectural design and sustainable building practices.`;
      setProjectDescription(project.description || defaultDescription);
      setProjectTitle(project.title);
      setProjectLocation(project.location);
    }
  }, [project]);

  // Handle keyboard shortcuts for edit mode
  useEffect(() => {
    if (!isOpen || !onEditModeChange) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F2') {
        event.preventDefault();
        if (isEditMode && project) {
          // Save the description and title when exiting edit mode
          onDescriptionUpdate?.(project.id, projectDescription);
          if (projectTitle !== project.title) {
            onProjectUpdate?.(project.id, { title: projectTitle });
          }
          if (projectLocation !== project.location) {
            onProjectUpdate?.(project.id, { location: projectLocation });
          }
        }
        onEditModeChange(!isEditMode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isEditMode, project, projectDescription, projectTitle, projectLocation, onEditModeChange, onDescriptionUpdate, onProjectUpdate]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] max-w-none h-[90vh] max-h-none">
        <DialogHeader className="sr-only">
          <DialogTitle>项目详情</DialogTitle>
          <DialogDescription>查看与编辑项目信息与图片</DialogDescription>
        </DialogHeader>
        {project ? (
          <div className="flex-1 overflow-auto">
            {isEditMode ? (
              <div className="p-4">
                <div className="space-y-4 mb-6 pb-6 border-b">
                  <Input
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="text-2xl font-bold border-0 bg-transparent px-0 focus-visible:ring-0"
                    placeholder="Project title..."
                  />
                  <Input
                    value={projectLocation}
                    onChange={(e) => setProjectLocation(e.target.value)}
                    className="text-lg text-muted-foreground border-0 bg-transparent px-0 focus-visible:ring-0"
                    placeholder="Project location..."
                  />
                </div>

                {/* 主图管理区域 */}
                <div className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-medium text-sm">主图管理</h4>
                  
                  {/* Forest 页面主图 */}
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 overflow-hidden rounded border flex-shrink-0">
                      <img 
                        src={project.mainImage} 
                        alt="Forest 主图" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">Forest 页面主图</p>
                      {onMainImageUpdate && (
                        <ProjectMainImageUpload
                          projectId={project.id}
                          onImageUpdate={onMainImageUpdate}
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Works 页面主图 */}
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 overflow-hidden rounded border flex-shrink-0">
                      <img 
                        src={project.images[0]?.url || project.mainImage} 
                        alt="Works 主图" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">Works 页面主图 (第一张详情图)</p>
                      <p className="text-xs text-muted-foreground">在 Images 标签页中调整图片顺序或替换第一张图</p>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="p-4">
                    <div className="space-y-6">
                      <div className="text-base leading-relaxed w-full">
                        <Textarea
                          value={projectDescription}
                          onChange={(e) => setProjectDescription(e.target.value)}
                          className="min-h-[100px] mb-4 w-full"
                          placeholder="Enter project description..."
                        />
                      </div>

                      <div className="relative">
                        <Carousel
                          key={(project?.images || []).map((i) => i.id).join('|') || 'empty'}
                          className="w-full"
                        >
                          <CarouselContent>
                            {project.images.map((media) => (
                              <CarouselItem key={media.id}>
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
                                      <img
                                        src={media.url}
                                        alt={media.alt}
                                        className="max-h-[60vh] w-auto object-contain rounded-lg"
                                        onError={(e) => {
                                          console.error('Failed to load image:', media.url.substring(0, 50) + '...');
                                          e.currentTarget.src = '/placeholder.svg';
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="left-4 h-12 w-12 bg-background/80 hover:bg-background border-2 shadow-lg" />
                          <CarouselNext className="right-4 h-12 w-12 bg-background/80 hover:bg-background border-2 shadow-lg" />
                        </Carousel>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="images" className="p-4">
                    {onImageAdd && onImageRemove && onImageUpdate && onReorder && (
                      <ProjectImageManager
                        images={project.images}
                        onImageAdd={onImageAdd}
                        onImageRemove={onImageRemove}
                        onImageUpdate={onImageUpdate}
                        onReorder={onReorder}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="p-4">
                <div className="space-y-6">
                  <div className="text-slate-50">
                    <h3 className="text-2xl font-bold mb-4 text-slate-950">{project.title}</h3>
                    <p className="text-lg mb-4 bg-transparent text-slate-950">{project.location}</p>
                    <div className="text-base leading-relaxed w-full">
                      <p className="w-full break-words whitespace-pre-wrap text-slate-900">{projectDescription}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <Carousel
                      key={(project?.images || []).map((i) => i.id).join('|') || 'empty'}
                      className="w-full"
                    >
                      <CarouselContent>
                        {project.images.map((media) => (
                          <CarouselItem key={media.id}>
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
                                  <img
                                    src={media.url}
                                    alt={media.alt}
                                    className="max-h-[60vh] w-auto object-contain rounded-lg"
                                    onError={(e) => {
                                      console.error('Failed to load image:', media.url.substring(0, 50) + '...');
                                      e.currentTarget.src = '/placeholder.svg';
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-4 h-12 w-12 bg-background/80 hover:bg-background border-2 shadow-lg" />
                      <CarouselNext className="right-4 h-12 w-12 bg-background/80 hover:bg-background border-2 shadow-lg" />
                    </Carousel>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No project selected
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
