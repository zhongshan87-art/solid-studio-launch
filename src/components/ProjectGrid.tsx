import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const projects = [
  {
    id: 1,
    title: "一室亦园 One Room One Garden",
    location: "南京 Nanjing",
    image: project1,
  },
  {
    id: 2,
    title: "金塘水獭馆 Otter Exhibition",
    location: "浙江 Zhejiang",
    image: project2,
  },
  {
    id: 3,
    title: "Art Museum",
    location: "Tokyo, Japan",
    image: project3,
  }
];

export const ProjectGrid = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Sample project images (using the same image for demo purposes)
  const projectImages = [
    project1, project2, project3, project1, project2
  ];

  return (
    <section id="works" className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project, index) => (
            <article key={project.id} className="group cursor-pointer">
              <div className={`overflow-hidden ${
                index === 0 ? 'aspect-[4/3]' : 
                index === 1 ? 'aspect-[3/4]' : 
                'aspect-square'
              }`}>
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onClick={() => handleImageClick(project)}
                />
              </div>
              <div className="pt-3 pb-2">
                <h2 className="text-base font-medium text-foreground mb-1 leading-tight">
                  {project.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {project.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[90vw] max-w-none h-[90vh] max-h-none">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="flex-1 overflow-auto p-4">
              {/* Text section at the top */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">{selectedProject.title}</h3>
                <p className="text-lg text-studio-gray-medium mb-4">{selectedProject.location}</p>
                <div className="text-base leading-relaxed">
                  <p>This is a detailed description of the {selectedProject.title} project located in {selectedProject.location}. The project showcases innovative architectural design and sustainable building practices.</p>
                  <br />
                  <p><strong>Key Features:</strong></p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Modern architectural design</li>
                    <li>Sustainable materials</li>
                    <li>Integration with natural environment</li>
                    <li>Innovative spatial solutions</li>
                  </ul>
                </div>
              </div>
              
              {/* Images section - 5 images each 90% width */}
              <div className="flex flex-col items-center space-y-6">
                {projectImages.map((image, index) => (
                  <div key={index} className="w-[90%]">
                    <img 
                      src={image} 
                      alt={`${selectedProject.title} - Image ${index + 1}`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};