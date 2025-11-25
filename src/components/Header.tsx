import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMediaData } from "@/hooks/useMediaData";
import { useStudioData } from "@/hooks/useStudioData";
import { MediaCardUpload } from "@/components/MediaCardUpload";
import { StudioImageUpload } from "@/components/StudioImageUpload";

export const Header = () => {
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const { cards, isLoading: mediaLoading, addCard, updateCard, deleteCard } = useMediaData();
  const { studio, isLoading: studioLoading, updateStudio } = useStudioData();

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

  const handleUpdateCardDescription = async (cardId: string, description: string) => {
    try {
      await updateCard(cardId, { description });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update card description",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await deleteCard(cardId);
      toast({
        title: "Success",
        description: "Card deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete card",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStudioIntro = async (intro: string) => {
    try {
      await updateStudio({ intro });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update studio information",
        variant: "destructive",
      });
    }
  };

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
              <div className="p-4">
                {isEditMode && (
                  <div className="mb-4">
                    <MediaCardUpload onAdd={addCard} />
                  </div>
                )}
                
                {mediaLoading ? (
                  <p className="text-center text-muted-foreground">Loading...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map((card) => (
                      <Card key={card.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="relative">
                            <img 
                              src={card.image} 
                              alt="Media card" 
                              className="w-full aspect-[3/4] object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                            
                            {isEditMode && (
                              <div className="absolute top-2 right-2">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteCard(card.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          <div className="p-4">
                            {isEditMode ? (
                              <Textarea
                                value={card.description}
                                onChange={(e) => handleUpdateCardDescription(card.id, e.target.value)}
                                className="min-h-[80px] text-sm resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
                                placeholder="Enter card description..."
                              />
                            ) : (
                              <p className="text-lg leading-relaxed whitespace-pre-line text-foreground font-bold">
                                {card.description}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
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
                  <div className="flex flex-col gap-4 items-center">
                    {isEditMode ? (
                      <Textarea 
                        value={studio.intro} 
                        onChange={e => handleUpdateStudioIntro(e.target.value)}
                        className="min-h-[300px] text-sm leading-relaxed resize-none w-[60%]" 
                        placeholder="Studio introduction..." 
                      />
                    ) : (
                      <div className="text-sm leading-relaxed w-[60%] space-y-4">
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
                    )}
                  </div>
                  
                  {/* Right column - Display image */}
                  <div className="flex flex-col gap-4">
                    {isEditMode && (
                      <StudioImageUpload 
                        onUpload={async (imageUrl) => {
                          await updateStudio({ image: imageUrl });
                        }}
                      />
                    )}
                    <div className="flex-1 rounded-md overflow-hidden">
                      <img 
                        src={studio.image} 
                        alt="Studio" 
                        className="w-full h-full object-cover" 
                        onError={e => {
                          e.currentTarget.src = '/placeholder.svg';
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
