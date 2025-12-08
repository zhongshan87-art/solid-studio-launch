import { useState } from "react";
import { useProjectData } from "@/hooks/useProjectData";
import { useMediaData } from "@/hooks/useMediaData";
import { useStudioData } from "@/hooks/useStudioData";
import { GlobalExporter } from "./GlobalExporter";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  return (
    <article className="group cursor-pointer" onClick={onClick}>
      <div className="w-full overflow-hidden aspect-video">
        {project.images[0]?.type === 'video' && project.images[0]?.thumbnail ? (
          <div className="relative w-full h-full">
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
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 transition-colors group-hover:text-[hsl(0,0%,39%)]">
          {project.title}
        </h3>
        <p className="text-sm text-foreground transition-colors group-hover:text-[hsl(0,0%,39%)]">
          {project.location}
        </p>
      </div>
    </article>
  );
};

export const ProjectGrid = () => {
  const { projects, isLoading } = useProjectData();
  const { cards: mediaCards } = useMediaData();
  const { studio: studioData } = useStudioData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[50px]">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => handleImageClick(project)} 
            />
          ))}
        </div>
      </div>

      {/* Project Detail Modal - view only */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
