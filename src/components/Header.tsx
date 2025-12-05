import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, LogOut, ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useMediaData } from "@/hooks/useMediaData";
import { useStudioData } from "@/hooks/useStudioData";
import { MediaCardUpload } from "@/components/MediaCardUpload";
import { StudioImageUpload } from "@/components/StudioImageUpload";
import { useAuth } from "@/hooks/useAuth";

interface MediaCardItemProps {
  card: { id: string; image: string; description: string };
  isEditMode: boolean;
  onUpdateDescription: (cardId: string, description: string) => void;
  onUpdateImage: (cardId: string, imageUrl: string) => void;
  onDelete: (cardId: string) => void;
}

const MediaCardItem = ({ card, isEditMode, onUpdateDescription, onUpdateImage, onDelete }: MediaCardItemProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `media-${card.id}-${Date.now()}.${fileExt}`;
      const filePath = `media/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      onUpdateImage(card.id, publicUrl);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
          
          {isEditMode && (
            <div className="absolute top-2 right-2 flex gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="h-8 w-8 p-0"
              >
                <ImagePlus className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => onDelete(card.id)} 
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
              onChange={e => onUpdateDescription(card.id, e.target.value)} 
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
  );
};

export const Header = () => {
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const {
    cards,
    isLoading: mediaLoading,
    addCard,
    updateCard,
    deleteCard
  } = useMediaData();
  const {
    studio,
    isLoading: studioLoading,
    updateStudio
  } = useStudioData();
  const {
    user,
    isAdmin,
    signOut
  } = useAuth();

  // Edit mode state - requires F2 toggle and admin status
  const [isEditModeActive, setIsEditModeActive] = useState(false);
  const isEditMode = isEditModeActive;

  // F2 keyboard shortcut for News and Studio modals
  useEffect(() => {
    if (!isMediaOpen && !isStudioOpen) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F2') {
        event.preventDefault();
        setIsEditModeActive(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMediaOpen, isStudioOpen]);

  // Reset edit mode when both modals are closed
  useEffect(() => {
    if (!isMediaOpen && !isStudioOpen) {
      setIsEditModeActive(false);
    }
  }, [isMediaOpen, isStudioOpen]);
  const handleUpdateCardDescription = async (cardId: string, description: string) => {
    try {
      await updateCard(cardId, {
        description
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update card description",
        variant: "destructive"
      });
    }
  };
  const handleDeleteCard = async (cardId: string) => {
    try {
      await deleteCard(cardId);
      toast({
        title: "Success",
        description: "Card deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete card",
        variant: "destructive"
      });
    }
  };
  const handleUpdateStudioIntro = async (intro: string) => {
    try {
      await updateStudio({
        intro
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update studio information",
        variant: "destructive"
      });
    }
  };
  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully"
    });
  };
  return <header className="fixed top-0 left-0 right-0 z-50 bg-background shadow-sm">
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
          
          {/* Auth button */}
          {user ? <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              {isAdmin && <span className="text-xs text-primary">(Admin)</span>}
            </Button> : <Link to="/auth">
              
            </Link>}
        </nav>

        <Dialog open={isMediaOpen} onOpenChange={setIsMediaOpen}>
          <DialogContent className="w-[80vw] max-w-none h-[80vh] max-h-none">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <DialogTitle>奖项和新闻 Awards & News</DialogTitle>
                {isEditMode && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    编辑模式
                  </span>
                )}
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              <div className="p-4">
                {isEditMode && <div className="mb-4">
                    <MediaCardUpload onAdd={addCard} />
                  </div>}
                
                {mediaLoading ? <p className="text-center text-muted-foreground">Loading...</p> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map(card => <MediaCardItem 
                        key={card.id} 
                        card={card} 
                        isEditMode={isEditMode} 
                        onUpdateDescription={handleUpdateCardDescription}
                        onUpdateImage={(cardId, imageUrl) => updateCard(cardId, { image: imageUrl })}
                        onDelete={handleDeleteCard}
                      />)}
                  </div>}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isStudioOpen} onOpenChange={setIsStudioOpen}>
          <DialogContent className="w-[80vw] max-w-none h-[80vh] max-h-none">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <DialogTitle>尺度森林S.F.A</DialogTitle>
                {isEditMode && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    编辑模式
                  </span>
                )}
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-auto p-4">
              {studioLoading ? <p className="text-center text-muted-foreground">Loading...</p> : <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  {/* Left column - Display text */}
                  <div className="flex flex-col gap-4 items-center justify-center h-full">
                    {isEditMode ? <Textarea value={studio.intro} onChange={e => handleUpdateStudioIntro(e.target.value)} className="min-h-[300px] text-sm leading-relaxed resize-none w-[60%]" placeholder="Studio introduction..." /> : <div className="text-sm leading-relaxed w-[60%] space-y-4 text-justify">
                        {studio.intro.split('\n\n').map((paragraph, index) => {
                    const hasChinese = /[\u4e00-\u9fa5]/.test(paragraph);
                    return <p key={index} className={hasChinese ? 'font-bold' : 'font-light'} style={hasChinese ? {} : {
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                    }}>
                              {paragraph}
                            </p>;
                  })}
                      </div>}
                  </div>
                  
                  {/* Right column - Display image */}
                  <div className="flex flex-col gap-4">
                    {isEditMode && <StudioImageUpload onUpload={async imageUrl => {
                  await updateStudio({
                    image: imageUrl
                  });
                }} />}
                    <div className="flex-1 rounded-md overflow-hidden">
                      <img src={studio.image} alt="Studio" className="w-full h-full object-cover" onError={e => {
                    e.currentTarget.src = '/placeholder.svg';
                  }} />
                    </div>
                  </div>
                </div>}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>;
};