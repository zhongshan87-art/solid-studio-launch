export const About = () => {
  return (
    <section id="studio" className="section-padding bg-studio-gray-light">
      <div className="container-studio">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8">
              STUDIO
            </h2>
            
            <div className="space-y-6 text-lg leading-relaxed">
              <p>
                We are a multidisciplinary design studio focused on creating exceptional architectural experiences that push the boundaries of form, function, and sustainability.
              </p>
              
              <p>
                Our approach combines innovative design thinking with meticulous attention to detail, ensuring each project reflects our commitment to excellence and our clients' unique vision.
              </p>
              
              <p>
                Founded in 2018, we have worked with leading institutions, private clients, and cultural organizations worldwide to create spaces that inspire and endure.
              </p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-caption mb-3 text-studio-gray-medium">
                Services
              </h3>
              <ul className="space-y-2 text-lg">
                <li>Architecture & Planning</li>
                <li>Interior Design</li>
                <li>Urban Design</li>
                <li>Consultation</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-caption mb-3 text-studio-gray-medium">
                Recognition
              </h3>
              <ul className="space-y-2 text-lg">
                <li>AIA Gold Medal 2023</li>
                <li>Dezeen Awards Winner</li>
                <li>Architectural Review Future Projects</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};