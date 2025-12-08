import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaData } from "@/hooks/useMediaData";
import { useStudioData } from "@/hooks/useStudioData";

interface MediaCardItemProps {
  card: { id: string; image: string; description: string };
}

const MediaCardItem = ({ card }: MediaCardItemProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <img 
            src={card.image} 
            alt="Media card" 
            className="w-full aspect-[3/4] object-cover" 
            onError={e => { e.currentTarget.src = '/placeholder.svg'; }} 
          />
        </div>
        
        <div className="p-4">
          <p className="text-lg leading-relaxed whitespace-pre-line text-foreground font-bold">
            {card.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const Header = () => {
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const { cards, isLoading: mediaLoading } = useMediaData();
  const { studio, isLoading: studioLoading } = useStudioData();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm">
      <div className="container-studio flex justify-end items-center py-6 gap-8">
        <nav className="flex items-center gap-8">
          <Link to="/" className="text-caption font-medium hover:text-primary transition-colors">
            Forest
          </Link>
          <Link to="/works" className="text-caption font-medium hover:text-primary transition-colors">
            Works
          </Link>
          <button className="text-caption font-medium hover:text-primary transition-colors" onClick={() => setIsMediaOpen(true)}>
            News
          </button>
          <button className="text-caption font-medium hover:text-primary transition-colors" onClick={() => setIsStudioOpen(true)}>
            Studio
          </button>
        </nav>

        <Dialog open={isMediaOpen} onOpenChange={setIsMediaOpen}>
          <DialogContent className="w-[80vw] max-w-none h-[80vh] max-h-none">
            <DialogHeader>
              <DialogTitle>奖项和新闻 Awards & News</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              <div className="p-4">
                {mediaLoading ? (
                  <p className="text-center text-muted-foreground">Loading...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map(card => (
                      <MediaCardItem key={card.id} card={card} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isStudioOpen} onOpenChange={setIsStudioOpen}>
          <DialogContent className="w-[80vw] max-w-none h-[80vh] max-h-none">
            <DialogHeader>
              <DialogTitle>尺度森林S.F.A</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto p-4">
              {studioLoading ? (
                <p className="text-center text-muted-foreground">Loading...</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  {/* Left column - Display text */}
                  <div className="flex flex-col gap-4 items-center justify-center h-full">
                    <div className="text-sm leading-relaxed w-[60%] space-y-4 text-justify">
                      {studio.intro.split('\n\n').map((paragraph, index) => {
                        const hasChinese = /[\u4e00-\u9fa5]/.test(paragraph);
                        return (
                          <p 
                            key={index} 
                            className={hasChinese ? 'font-bold' : 'font-light'} 
                            style={hasChinese ? {} : { fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
                          >
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Right column - Display image */}
                  <div className="flex flex-col gap-4">
                    <div className="flex-1 rounded-md overflow-hidden">
                      <img 
                        src={studio.image} 
                        alt="Studio" 
                        className="w-full h-full object-cover" 
                        onError={e => { e.currentTarget.src = '/placeholder.svg'; }} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};
