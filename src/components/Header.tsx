import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container-studio flex justify-end items-center py-6">
          <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-caption font-medium hover:bg-transparent hover:text-primary">
            MENU
          </Button>

          {isMenuOpen && (
            <nav className="fixed inset-0 bg-background/30 backdrop-blur-md flex items-center justify-center z-40">
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-8 right-8 text-2xl hover:text-studio-gray-medium transition-colors"
              >
                ×
              </button>
              <div className="text-center space-y-8 mt-20">
                <div className="space-y-8">
                  <a href="#studio" className="block text-title hover:text-studio-gray-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Studio
                  </a>
                  <div className="relative group">
                    <a href="#works" className="block text-title hover:text-studio-gray-medium transition-colors cursor-pointer">
                      Works
                    </a>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-8 bg-white/90 backdrop-blur-sm rounded-lg p-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      <a href="#studio" className="block text-sm hover:text-studio-gray-medium transition-colors">Studio</a>
                      <a href="#works" className="block text-sm hover:text-studio-gray-medium transition-colors">Works</a>
                      <button 
                        onClick={() => {
                          setIsMediaModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="block text-sm hover:text-studio-gray-medium transition-colors text-left w-full"
                      >
                        Media
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsMediaModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="block text-title hover:text-studio-gray-medium transition-colors"
                  >
                    Media
                  </button>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      <Dialog open={isMediaModalOpen} onOpenChange={setIsMediaModalOpen}>
        <DialogContent className="max-w-[80vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Awards & Recognition</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg">2024 International Architecture Award</h3>
              <p className="text-sm text-muted-foreground">Best Residential Design - Modern Villa Project</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg">2023 Design Excellence Prize</h3>
              <p className="text-sm text-muted-foreground">Outstanding Commercial Space - Urban Office Complex</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg">2022 Sustainability Award</h3>
              <p className="text-sm text-muted-foreground">Eco-Friendly Design - Green Building Initiative</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg">2021 Innovation in Architecture</h3>
              <p className="text-sm text-muted-foreground">Creative Use of Materials - Mixed-Use Development</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">2020 Young Architect Award</h3>
              <p className="text-sm text-muted-foreground">Emerging Talent Recognition - Residential Series</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};