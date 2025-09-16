import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [awards, setAwards] = useState("Outstanding Architecture Award 2023\nInnovative Design Recognition 2022\nSustainable Building Excellence 2023\nUrban Planning Achievement 2022");
  const [studioIntro, setStudioIntro] = useState("Our Studio\n\nFounded in 2010, our architectural studio specializes in innovative and sustainable design solutions. We believe in creating spaces that harmonize with their environment while pushing the boundaries of contemporary architecture.\n\nOur Philosophy:\n- Sustainable design practices\n- Integration with natural landscapes\n- User-centered spatial experiences\n- Innovative material applications\n\nServices:\n- Architectural Design\n- Interior Design\n- Urban Planning\n- Consultation Services");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container-studio flex justify-end items-center py-6">
        <Button
          variant="ghost"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-caption font-medium hover:bg-transparent hover:text-primary"
        >
          MENU
        </Button>

        {isMenuOpen && (
          <nav className="fixed inset-0 bg-background/95 backdrop-blur-md flex items-center justify-center z-40">
            <div className="text-center space-y-8 mt-20 bg-white/90 rounded-lg p-8">
              <div className="space-y-8">
                <a href="#works" className="block text-title hover:text-studio-gray-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Works
                </a>
                <button 
                  className="block text-title hover:text-studio-gray-medium transition-colors" 
                  onClick={() => {
                    setIsMediaOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Media
                </button>
                <button 
                  className="block text-title hover:text-studio-gray-medium transition-colors" 
                  onClick={() => {
                    setIsStudioOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Studio
                </button>
              </div>
              <Button
                variant="ghost"
                onClick={() => setIsMenuOpen(false)}
                className="text-caption font-medium"
              >
                CLOSE
              </Button>
            </div>
          </nav>
        )}

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
            <div className="flex-1 overflow-auto">
              <Textarea
                value={studioIntro}
                onChange={(e) => setStudioIntro(e.target.value)}
                className="min-h-[60vh] resize-none text-base leading-relaxed"
                placeholder="Enter studio introduction..."
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};