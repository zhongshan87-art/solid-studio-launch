import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [awards, setAwards] = useState([
    "2024 Architecture Excellence Award",
    "2023 Design Innovation Prize",
    "2022 Urban Planning Recognition",
    "2021 Sustainable Building Award"
  ]);

  const handleAwardEdit = (index: number, newText: string) => {
    const updatedAwards = [...awards];
    updatedAwards[index] = newText;
    setAwards(updatedAwards);
  };

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
          <nav className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-40">
            <div className="text-center space-y-8 mt-16">
              <div className="space-y-8 bg-white/30 backdrop-blur-sm rounded-lg px-8 py-6">
                <a href="#studio" className="block text-title hover:text-studio-gray-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Studio
                </a>
                <a href="#works" className="block text-title hover:text-studio-gray-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Works
                </a>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="block text-title hover:text-studio-gray-medium transition-colors">
                      Media
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[80vw] max-h-[80vh] w-[80vw] h-[80vh] bg-white/95 backdrop-blur-sm overflow-auto">
                    <DialogHeader>
                      <DialogTitle className="text-title">Awards & Recognition</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {awards.map((award, index) => (
                        <div key={index} className="group">
                          <input
                            type="text"
                            value={award}
                            onChange={(e) => handleAwardEdit(index, e.target.value)}
                            className="w-full bg-transparent border-none text-body focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1"
                          />
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                <a href="#about" className="block text-title hover:text-studio-gray-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Studio
                </a>
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
      </div>
    </header>
  );
};