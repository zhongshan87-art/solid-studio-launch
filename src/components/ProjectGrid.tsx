import { useState, useEffect } from "react";
import { useProjectData } from "@/hooks/useProjectData";
import { useMediaData } from "@/hooks/useMediaData";
import { useStudioData } from "@/hooks/useStudioData";
import { GlobalExporter } from "./GlobalExporter";
import { ProjectDetailModal } from "./ProjectDetailModal";
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

const SortableProjectCard = ({
  project,
  isGridEditMode,
  onClick
}: SortableProjectCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: project.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  return (
    <article ref={setNodeRef} style={style} className={`group cursor-pointer relative ${isGridEditMode ? 'ring-2 ring-primary/50' : ''}`}>
      {isGridEditMode && (
        <div {...attributes} {...listeners} className="absolute top-2 left-2 z-10 p-2 bg-background/80 rounded cursor-move hover:bg-background transition-colors">
          <GripVertical className="h-5 w-5 text-foreground" />
        </div>
      )}
      <div className="w-full overflow-hidden aspect-video">
        {project.images[0]?.type === 'video' && project.images[0]?.thumbnail ? (
          <div className="relative w-full h-full" onClick={isGridEditMode ? undefined : onClick}>
            <img src={project.images[0].thumbnail} alt={project.images[0].alt || project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                <div className="w-0 h-0 border-l-[20px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>
        ) : (
          <img src={project.images[0]?.url || project.mainImage} alt={project.images[0]?.alt || project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onClick={isGridEditMode ? undefined : onClick} />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 transition-colors group-hover:text-[hsl(0,0%,39%)]">{project.title}</h3>
        <p className="text-sm text-foreground transition-colors group-hover:text-[hsl(0,0%,39%)]">{project.location}</p>
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
    reorderProjects
  } = useProjectData();
  
  const { cards: mediaCards } = useMediaData();
  const { studio: studioData } = useStudioData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isGridEditMode, setIsGridEditMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Sync selectedProject with updated projects data
  useEffect(() => {
    if (!selectedProject || projects.length === 0) return;
    const updated = projects.find(p => p.id === selectedProject.id);
    if (updated) {
      setSelectedProject(updated);
    }
  }, [projects, selectedProject?.id]);

  // Handle grid edit mode keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        setIsGridEditMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleImageClick = (project: Project) => {
    const currentProject = projects.find(p => p.id === project.id) || project;
    setSelectedProject(currentProject);
    setIsModalOpen(true);
    setIsEditMode(false);
  };

  const handleImageAdd = (media: {
    url: string;
    alt: string;
    caption?: string;
    type: 'image' | 'video';
    thumbnail?: string;
  }) => {
    if (selectedProject) {
      addImageToProject(selectedProject.id, media.url, media.alt, media.caption || '');
    }
  };

  const handleImageRemove = (imageId: string) => {
    if (selectedProject) {
      removeImageFromProject(selectedProject.id, imageId);
    }
  };

  const handleImageUpdate = (imageId: string, updates: any) => {
    if (selectedProject) {
      const updatedImages = selectedProject.images.map(img =>
        img.id === imageId ? { ...img, ...updates } : img
      );
      updateProject(selectedProject.id, { images: updatedImages });
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
      const oldIndex = projects.findIndex(p => p.id === active.id);
      const newIndex = projects.findIndex(p => p.id === over.id);
      const newOrder = arrayMove(projects, oldIndex, newIndex).map(p => p.id);
      reorderProjects(newOrder);
    }
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading projects...</div>;
  }

  return (
    <section id="works" className="py-8">
      <div className="w-full px-[50px]">
        <div className="mb-6 flex justify-end">
          <GlobalExporter projects={projects} mediaCards={mediaCards} studioData={studioData} />
        </div>
        {isGridEditMode && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg text-center">
            <p className="text-sm font-medium">
              编辑模式 - 拖拽项目调整顺序，按 <kbd className="px-2 py-1 bg-background rounded text-xs">Ctrl+Shift+E</kbd> 退出
            </p>
          </div>
        )}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleProjectDragEnd}>
          <SortableContext items={projects.map(p => p.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[50px]">
              {projects.map(project => (
                <SortableProjectCard key={project.id} project={project} isGridEditMode={isGridEditMode} onClick={() => handleImageClick(project)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Project Detail Modal - shared component */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        onEditModeChange={setIsEditMode}
        onProjectUpdate={updateProject}
        onDescriptionUpdate={updateProjectDescription}
        onImageAdd={handleImageAdd}
        onImageRemove={handleImageRemove}
        onImageUpdate={handleImageUpdate}
        onReorder={handleReorder}
      />
    </section>
  );
};
