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
    <section id="works" className="py-0">
      <div className="space-y-0">
        {projects.map((project, index) => (
          <article key={project.id} className="group cursor-pointer">
            <div className="container-studio py-4 md:py-6">
              <div className={`grid items-center gap-4 md:gap-6 ${
                index % 2 === 0 
                  ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5' 
                  : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5'
              }`}>
                <div className={`${
                  index % 2 === 0 
                    ? 'order-2 md:order-1 md:col-span-2 lg:col-span-3' 
                    : 'order-2 md:order-2 md:col-span-2 lg:col-span-3'
                }`}>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tighter mb-2">
                    {project.title.toUpperCase()}
                  </h2>
                  <p className="text-sm md:text-base lg:text-lg text-studio-gray-medium">
                    {project.location}
                  </p>
                </div>
                
                <div className={`${
                  index % 2 === 0 
                    ? 'order-1 md:order-2 md:col-span-1 lg:col-span-2' 
                    : 'order-1 md:order-1 md:col-span-1 lg:col-span-2'
                }`}>
                  <div className="aspect-[3/2] md:aspect-[4/3] overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onClick={() => handleImageClick(project)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b border-studio-gray-light"></div>
          </article>
        ))}
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