import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container-studio flex justify-between items-center py-6">
        <div className="text-title font-black tracking-tighter">
          STUDIO
        </div>
        
        <Button
          variant="ghost"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-caption font-medium hover:bg-transparent hover:text-primary"
        >
          MENU
        </Button>

        {isMenuOpen && (
          <nav className="fixed inset-0 bg-background/95 backdrop-blur-md flex items-center justify-center z-40">
            <div className="text-center space-y-8">
              <div className="space-y-6">
                <a href="#work" className="block text-title hover:text-studio-gray-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Work
                </a>
                <a href="#about" className="block text-title hover:text-studio-gray-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                  About
                </a>
                <a href="#contact" className="block text-title hover:text-studio-gray-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Contact
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