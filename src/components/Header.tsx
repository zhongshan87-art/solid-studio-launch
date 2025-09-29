import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
export const Header = () => {
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [awards, setAwards] = useState("Outstanding Architecture Award 2023\nInnovative Design Recognition 2022\nSustainable Building Excellence 2023\nUrban Planning Achievement 2022");
  const [studioIntro, setStudioIntro] = useState("Our Studio\n\nFounded in 2010, our architectural studio specializes in innovative and sustainable design solutions. We believe in creating spaces that harmonize with their environment while pushing the boundaries of contemporary architecture.\n\nOur Philosophy:\n- Sustainable design practices\n- Integration with natural landscapes\n- User-centered spatial experiences\n- Innovative material applications\n\nServices:\n- Architectural Design\n- Interior Design\n- Urban Planning\n- Consultation Services");
  const [studioImage, setStudioImage] = useState("/src/assets/hero-architecture.jpg");

  // Toggle edit mode with Ctrl+E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        setIsEditMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  return <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container-studio flex justify-end items-center py-6 gap-8">
        <nav className="flex items-center gap-8">
          <a href="#works" className="text-caption font-medium hover:text-primary transition-colors">
            Works
          </a>
          <button className="text-caption font-medium hover:text-primary transition-colors" onClick={() => setIsMediaOpen(true)}>
            Media
          </button>
          <button className="text-caption font-medium hover:text-primary transition-colors" onClick={() => setIsStudioOpen(true)}>
            Studio
          </button>
        </nav>

        <Dialog open={isMediaOpen} onOpenChange={setIsMediaOpen}>
          <DialogContent className="w-[80vw] max-w-none h-[80vh] max-h-none">
            <DialogHeader>
              <DialogTitle>奖项和媒体 Awards & Media</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              {isEditMode ? <Textarea value={awards} onChange={e => setAwards(e.target.value)} className="min-h-[300px] text-base leading-relaxed resize-none m-4" placeholder="Awards and media..." /> : <div className="text-base leading-relaxed whitespace-pre-line p-4">
                  {awards}
                </div>}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isStudioOpen} onOpenChange={setIsStudioOpen}>
          <DialogContent className="w-[80vw] max-w-none h-[80vh] max-h-none">
            <DialogHeader>
              <DialogTitle>尺度森林S.F.A</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Left column - Display text */}
                <div className="flex flex-col gap-4">
                  {isEditMode ? <Textarea value={studioIntro} onChange={e => setStudioIntro(e.target.value)} className="min-h-[300px] text-sm leading-relaxed resize-none" placeholder="Studio introduction..." /> : <div className="text-sm leading-relaxed whitespace-pre-line">
                      {studioIntro}
                    </div>}
                </div>
                
                {/* Right column - Display image */}
                <div className="flex flex-col gap-4">
                  <div className="flex-1 rounded-md overflow-hidden">
                    <img src={studioImage} alt="Studio" className="w-full h-full object-cover" onError={e => {
                    e.currentTarget.src = '/placeholder.svg';
                  }} />
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>;
};