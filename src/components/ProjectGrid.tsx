import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
  const [editedProject, setEditedProject] = useState<any>(null);

  const handleImageClick = (project: any) => {
    setSelectedProject(project);
    setEditedProject({
      ...project,
      description: `Project Description for ${project.title}\n\nThis is a detailed description of the ${project.title} project located in ${project.location}. The project showcases innovative architectural design and sustainable building practices.\n\nKey Features:\n- Modern architectural design\n- Sustainable materials\n- Integration with natural environment\n- Innovative spatial solutions`
    });
    setIsModalOpen(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedProject(prev => ({
          ...prev,
          image: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <section id="works" className="py-0">
      <div className="space-y-0">
        {projects.map((project, index) => (
          <article key={project.id} className="group cursor-pointer border-b border-studio-gray-light">
            <div className="container-studio py-16 md:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1">
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4">
                    {project.title.toUpperCase()}
                  </h2>
                  <p className="text-xl md:text-2xl text-studio-gray-medium">
                    {project.location}
                  </p>
                </div>
                
                <div className="order-1 lg:order-2">
                  <div className="aspect-[4/3] overflow-hidden">
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
          </article>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[90vw] max-w-none h-[90vh] max-h-none">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          {editedProject && (
            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project-title">Project Title</Label>
                    <Input
                      id="project-title"
                      value={editedProject.title}
                      onChange={(e) => setEditedProject(prev => ({ ...prev, title: e.target.value }))}
                      className="text-lg font-semibold"
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-location">Location</Label>
                    <Input
                      id="project-location"
                      value={editedProject.location}
                      onChange={(e) => setEditedProject(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      value={editedProject.description}
                      onChange={(e) => setEditedProject(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[300px] resize-none"
                      placeholder="Enter project description..."
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project-image">Project Image</Label>
                    <Input
                      id="project-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mb-4"
                    />
                  </div>
                  <div className="aspect-[4/3] overflow-hidden rounded-lg border">
                    <img 
                      src={editedProject.image} 
                      alt={editedProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};