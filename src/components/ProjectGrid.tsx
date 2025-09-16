import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const projects = [
  {
    id: 1,
    title: "一室亦园 One Room One Garden",
    location: "New York, USA",
    image: project1,
  },
  {
    id: 2,
    title: "Residential Complex",
    location: "Barcelona, Spain",
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
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};