import heroImage from "@/assets/hero-architecture.jpg";

export const Hero = () => {
  return (
    <section className="min-h-screen relative flex items-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      <div className="container-studio relative z-10">
        <div className="max-w-5xl">
          <h1 className="text-hero text-white mb-6">
            DESIGN
            <br />
            STUDIO
          </h1>
          <p className="text-subtitle text-white/90 max-w-lg">
            Creating spaces that inspire through innovative architecture and thoughtful design
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 text-caption text-white/80 hidden md:block">
        Scroll to explore
      </div>
    </section>
  );
};