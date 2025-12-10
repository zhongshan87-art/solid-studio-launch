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
    <Card className="overflow-hidden w-full md:w-[80%] mx-auto rounded-none md:rounded-lg">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={card.image}
            alt="Media card"
            className="w-full aspect-[3/4] object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>

        <div className="p-2.5 md:p-3">
          <p className="text-base leading-relaxed whitespace-pre-line text-foreground font-bold">{card.description}</p>
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
    <header className="fixed top-0 left-0 right-0 z-30 bg-background shadow-sm">
      <div className="container-studio flex justify-end items-center py-6 gap-8">
        <nav className="flex items-center gap-8">
          <Link to="/" className="text-caption font-medium hover:text-primary transition-colors">
            Forest
          </Link>
          <Link to="/works" className="text-caption font-medium hover:text-primary transition-colors">
            Works
          </Link>
          <button
            className="text-caption font-medium hover:text-primary transition-colors"
            onClick={() => setIsMediaOpen(true)}
          >
            News
          </button>
          <button
            className="text-caption font-medium hover:text-primary transition-colors"
            onClick={() => setIsStudioOpen(true)}
          >
            Studio
          </button>
        </nav>

        <Dialog open={isMediaOpen} onOpenChange={setIsMediaOpen}>
          <DialogContent className="w-screen h-screen max-w-none max-h-none p-0 rounded-none">
            <DialogHeader className="pt-5 md:pt-4 px-2.5 md:px-4 pb-0">
              <DialogTitle>奖项和新闻 Awards & News</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto mt-[50px] md:mt-4">
              <div className="p-2.5 md:p-4">
                {mediaLoading ? (
                  <p className="text-center text-muted-foreground">Loading...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {cards.map((card) => (
                      <MediaCardItem key={card.id} card={card} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isStudioOpen} onOpenChange={setIsStudioOpen}>
          <DialogContent className="w-screen h-screen max-w-none max-h-none p-0 gap-0 rounded-none flex flex-col">
            <DialogHeader className="pt-2 md:pt-4 px-2.5 md:px-4 pb-0 shrink-0">
              <DialogTitle className="text-base md:text-lg">尺度森林S.F.A</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto p-2.5 md:p-4">
              {studioLoading ? (
                <p className="text-center text-muted-foreground">Loading...</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-6 lg:h-full">
                  {/* Left column - Display text */}
                  <div className="flex flex-col items-center lg:justify-center lg:h-full">
                    <div className="text-sm leading-relaxed w-full md:w-[60%] space-y-6 text-justify">
                      <p className="font-medium">{studio.introChinese}</p>
                      <p
                        className="font-light"
                        style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
                      >
                        {studio.introEnglish}
                      </p>
                    </div>
                  </div>

                  {/* Right column - Display image */}
                  <div className="flex flex-col gap-4">
                    <div className="flex-1 overflow-hidden rounded-none md:rounded-md">
                      <img
                        src={studio.image}
                        alt="Studio"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
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
