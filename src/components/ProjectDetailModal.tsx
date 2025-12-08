import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Project } from "@/types/project";

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailModal = ({
  project,
  isOpen,
  onClose,
}: ProjectDetailModalProps) => {
  const [projectDescription, setProjectDescription] = useState<string>("");

  // Sync local state when project changes
  useEffect(() => {
    if (project) {
      const defaultDescription = `This is a detailed description of the ${project.title} project located in ${project.location}. The project showcases innovative architectural design and sustainable building practices.`;
      setProjectDescription(project.description || defaultDescription);
    }
  }, [project]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] max-w-none h-[90vh] max-h-none">
        <DialogHeader className="sr-only">
          <DialogTitle>项目详情</DialogTitle>
          <DialogDescription>查看项目信息与图片</DialogDescription>
        </DialogHeader>
        {project ? (
          <div className="flex-1 overflow-auto">
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
