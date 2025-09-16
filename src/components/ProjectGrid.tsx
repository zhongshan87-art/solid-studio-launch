import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const projects = [
  {
    id: 1,
    title: "Modern Office Complex",
    location: "San Francisco, USA",
    image: project1,
    description: "A contemporary workspace design focused on collaboration and natural light."
  },
  {
    id: 2,
    title: "Residential Villa",
    location: "Barcelona, Spain",
    image: project2,
    description: "Minimalist residential design that harmonizes with the natural landscape."
  },
  {
    id: 3,
    title: "Art Gallery",
    location: "Tokyo, Japan",
    image: project3,
    description: "A cultural space designed to showcase contemporary art in pure, geometric forms."
  }
];

export const ProjectGrid = () => {
  return (
    <section id="work" className="section-padding">
      <div className="container-studio">
        <h2 className="text-title mb-16">
          Selected Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {projects.map((project, index) => (
            <article key={project.id} className="group hover-lift cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden mb-6">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-subtitle font-medium">
                  {project.title}
                </h3>
                
                <p className="text-caption text-studio-gray-medium">
                  {project.location}
                </p>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};