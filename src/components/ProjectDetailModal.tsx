import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  useEffect(() => {
    if (project) {
      const defaultDescription = `This is a detailed description of the ${project.title} project located in ${project.location}. The project showcases innovative architectural design and sustainable building practices.`;
      setProjectDescription(project.description || defaultDescription);
    }
  }, [project]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] max-w-none h-[90vh] max-h-none p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>项目详情</DialogTitle>
          <DialogDescription>查看项目信息与图片</DialogDescription>
        </DialogHeader>
        {project ? (
          <ScrollArea className="h-full w-full">
            <div className="p-6 md:p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-foreground">{project.title}</h3>
                <p className="text-lg mb-4 text-muted-foreground">{project.location}</p>
                <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">{projectDescription}</p>
              </div>

              <div className="space-y-6">
                {project.images.map((media) => (
                  <div key={media.id} className="w-full">
                    {media.type === 'video' ? (
                      <video
                        src={media.url}
                        controls
                        className="w-full rounded-lg"
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
                        className="w-full object-contain rounded-lg"
                        onError={(e) => {
                          console.error('Failed to load image:', media.url.substring(0, 50) + '...');
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No project selected
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
