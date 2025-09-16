import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const Header = () => {
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [awards, setAwards] = useState("Outstanding Architecture Award 2023\nInnovative Design Recognition 2022\nSustainable Building Excellence 2023\nUrban Planning Achievement 2022");
  const [studioIntro, setStudioIntro] = useState("Our Studio\n\nFounded in 2010, our architectural studio specializes in innovative and sustainable design solutions. We believe in creating spaces that harmonize with their environment while pushing the boundaries of contemporary architecture.\n\nOur Philosophy:\n- Sustainable design practices\n- Integration with natural landscapes\n- User-centered spatial experiences\n- Innovative material applications\n\nServices:\n- Architectural Design\n- Interior Design\n- Urban Planning\n- Consultation Services");
  const [studioImage, setStudioImage] = useState("/src/assets/hero-architecture.jpg");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container-studio flex justify-end items-center py-6 gap-8">
        <nav className="flex items-center gap-8">
          <a href="#works" className="text-caption font-medium hover:text-primary transition-colors">
            Works
          </a>
          <button 
            className="text-caption font-medium hover:text-primary transition-colors" 
            onClick={() => setIsMediaOpen(true)}
          >
            Media
          </button>
          <button 
            className="text-caption font-medium hover:text-primary transition-colors" 
            onClick={() => setIsStudioOpen(true)}
          >
            Studio
          </button>
        </nav>

        <Dialog open={isMediaOpen} onOpenChange={setIsMediaOpen}>
          <DialogContent className="w-[80vw] max-w-none h-[80vh] max-h-none">
            <DialogHeader>
              <DialogTitle>Awards & Recognition</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              <Textarea
                value={awards}
                onChange={(e) => setAwards(e.target.value)}
                className="min-h-[60vh] resize-none text-base leading-relaxed"
                placeholder="Enter awards and recognition..."
              />
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isStudioOpen} onOpenChange={setIsStudioOpen}>
          <DialogContent className="w-[80vw] max-w-none h-[80vh] max-h-none">
            <DialogHeader>
              <DialogTitle>Studio Introduction</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Left column - Editable text */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-semibold">Studio Text</h3>
                  <Textarea
                    value={studioIntro}
                    onChange={(e) => setStudioIntro(e.target.value)}
                    className="flex-1 min-h-[50vh] resize-none text-sm leading-relaxed"
                    placeholder="Enter studio introduction..."
                  />
                </div>
                
                {/* Right column - Editable image */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-semibold">Studio Image</h3>
                  <Input
                    value={studioImage}
                    onChange={(e) => setStudioImage(e.target.value)}
                    placeholder="Enter image URL..."
                    className="text-sm"
                  />
                  <div className="flex-1 border border-input rounded-md overflow-hidden bg-muted/20">
                    <img 
                      src={studioImage} 
                      alt="Studio" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};