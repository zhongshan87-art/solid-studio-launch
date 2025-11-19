import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getMediaCards as getMediaCardsStore, setMediaCards as setMediaCardsStore, getStudioData as getStudioDataStore, setStudioData as setStudioDataStore } from "@/lib/storage";
import heroImage from "@/assets/hero-architecture.jpg";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

interface MediaCard {
  id: string;
  image: string;
  text: string;
  objectFit?: 'cover' | 'contain' | 'fill';
}
export const Header = () => {
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Initialize media cards from IndexedDB with fallback to localStorage
  const [mediaCards, setMediaCards] = useState<MediaCard[]>([]);
  
  const [studioIntro, setStudioIntro] = useState("");
  const [studioImage, setStudioImage] = useState(heroImage);
  const [uploading, setUploading] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const fileInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});

  // Load data from IndexedDB on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load media cards
        let cards = await getMediaCardsStore();
        if (!cards || cards.length === 0) {
          // Try localStorage fallback
          const saved = localStorage.getItem('mediaCards');
          if (saved) {
            try {
              cards = JSON.parse(saved);
              // Migrate to IndexedDB
              if (cards && cards.length > 0) {
                await setMediaCardsStore(cards);
                localStorage.removeItem('mediaCards');
              }
            } catch (e) {
              console.error('Failed to parse saved media cards:', e);
            }
          }
        }
        
        if (!cards || cards.length === 0) {
          // Use default data
          cards = [
            {
              id: "1",
              image: project1,
              text: "Outstanding Architecture Award 2023\nRecognized for innovative sustainable design practices and exceptional integration with natural landscapes.",
              objectFit: 'cover' as const
            },
            {
              id: "2", 
              image: project2,
              text: "Innovative Design Recognition 2022\nAwarded for pushing boundaries in contemporary architecture while maintaining user-centered spatial experiences.",
              objectFit: 'cover' as const
            },
            {
              id: "3",
              image: project3, 
              text: "Sustainable Building Excellence 2023\nHonored for pioneering sustainable building practices and innovative material applications.",
              objectFit: 'cover' as const
            }
          ];
          // Save default data to IndexedDB
          await setMediaCardsStore(cards);
        }
        setMediaCards(cards);

        // Load studio data
        let studioData = await getStudioDataStore();
        if (!studioData) {
          // Try localStorage fallback
          const savedIntro = localStorage.getItem('studioIntro');
          const savedImage = localStorage.getItem('studioImage');
          
          const defaultIntro = "Our Studio\n\nFounded in 2010, our architectural studio specializes in innovative and sustainable design solutions. We believe in creating spaces that harmonize with their environment while pushing the boundaries of contemporary architecture.\n\nOur Philosophy:\n- Sustainable design practices\n- Integration with natural landscapes\n- User-centered spatial experiences\n- Innovative material applications\n\nServices:\n- Architectural Design\n- Interior Design\n- Urban Planning\n- Consultation Services";
          let intro = defaultIntro;
          if (savedIntro) {
            try {
              intro = JSON.parse(savedIntro);
            } catch {
              intro = savedIntro;
            }
          }
          const image = savedImage || heroImage;
          
          studioData = { intro, image };
          // Migrate to IndexedDB
          await setStudioDataStore(studioData);
          localStorage.removeItem('studioIntro');
          localStorage.removeItem('studioImage');
        }
        
        setStudioIntro(studioData.intro);
        setStudioImage(studioData.image);
        
      } catch (error) {
        console.error('Failed to load data:', error);
        // Use defaults on error
        setStudioIntro("Our Studio\n\nFounded in 2010, our architectural studio specializes in innovative and sustainable design solutions. We believe in creating spaces that harmonize with their environment while pushing the boundaries of contemporary architecture.\n\nOur Philosophy:\n- Sustainable design practices\n- Integration with natural landscapes\n- User-centered spatial experiences\n- Innovative material applications\n\nServices:\n- Architectural Design\n- Interior Design\n- Urban Planning\n- Consultation Services");
      }
    };

    loadData();
  }, []);

  // Save media cards to IndexedDB
  useEffect(() => {
    (async () => {
      try {
        await setMediaCardsStore(mediaCards);
      } catch (error) {
        console.error('Failed to save media cards:', error);
        toast({
          title: "Save failed",
          description: "Failed to save media cards.",
          variant: "destructive",
        });
      }
    })();
  }, [mediaCards]);

  // Save studio data to IndexedDB
  useEffect(() => {
    if (studioIntro !== "" || studioImage !== "") {
      (async () => {
        try {
          await setStudioDataStore({ intro: studioIntro, image: studioImage });
        } catch (error) {
          console.error('Failed to save studio data:', error);
          toast({
            title: "Save failed", 
            description: "Failed to save studio information.",
            variant: "destructive",
          });
        }
      })();
    }
  }, [studioIntro, studioImage]);

  // Handle file upload for media cards
  const handleCardImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, cardId: string) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      // Convert file to base64 data URL for persistence
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        
        // Update the specific card
        setMediaCards(prev => prev.map(card => 
          card.id === cardId ? { ...card, image: imageUrl } : card
        ));
      };
      reader.readAsDataURL(file);

      toast({
        title: "Image uploaded",
        description: "Card image has been updated.",
      });

      // Reset input
      if (fileInputRefs.current[cardId]) {
        fileInputRefs.current[cardId]!.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Add new media card
  const addMediaCard = () => {
    const newCard: MediaCard = {
      id: Date.now().toString(),
      image: "/placeholder.svg",
      text: "New card description...",
      objectFit: 'cover'
    };
    setMediaCards(prev => [...prev, newCard]);
  };

  // Remove media card
  const removeMediaCard = (cardId: string) => {
    setMediaCards(prev => prev.filter(card => card.id !== cardId));
  };

  // Update card text
  const updateCardText = (cardId: string, text: string) => {
    setMediaCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, text } : card
    ));
  };

  // Update card object fit
  const updateCardObjectFit = (cardId: string, objectFit: 'cover' | 'contain' | 'fill') => {
    setMediaCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, objectFit } : card
    ));
  };

  // Handle studio file upload
  const handleStudioFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      // Convert file to base64 data URL for persistence
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setStudioImage(imageUrl);
      };
      reader.readAsDataURL(file);

      toast({
        title: "Image uploaded",
        description: "Studio image has been updated.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

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
                    <Button onClick={addMediaCard} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Card
                    </Button>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mediaCards.map((card) => (
                    <Card key={card.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative">
                          <img 
                            src={card.image} 
                            alt="Media card" 
                            className={`w-full aspect-[3/4] object-${card.objectFit || 'cover'}`}
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                          
                          {isEditMode && (
                            <div className="absolute top-2 left-2 right-2 flex flex-col gap-2">
                              <div className="flex gap-2 justify-end">
                                <input
                                  ref={(el) => fileInputRefs.current[card.id] = el}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleCardImageUpload(e, card.id)}
                                  className="hidden"
                                />
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => fileInputRefs.current[card.id]?.click()}
                                  disabled={uploading}
                                  className="h-8 w-8 p-0"
                                >
                                  <Upload className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeMediaCard(card.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <Select
                                value={card.objectFit || 'cover'}
                                onValueChange={(value: 'cover' | 'contain' | 'fill') => updateCardObjectFit(card.id, value)}
                              >
                                <SelectTrigger className="w-24 h-6 text-xs bg-white/90">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cover">裁切</SelectItem>
                                  <SelectItem value="contain">适应</SelectItem>
                                  <SelectItem value="fill">拉伸</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4">
                          {isEditMode ? (
                            <Textarea
                              value={card.text}
                              onChange={(e) => updateCardText(card.id, e.target.value)}
                              className="min-h-[80px] text-sm resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
                              placeholder="Enter card description..."
                            />
                          ) : (
                            <p className="text-lg leading-relaxed whitespace-pre-line text-foreground font-bold">
                              {card.text}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Left column - Display text */}
                <div className="flex flex-col gap-4 items-center">
                  {isEditMode ? <Textarea value={studioIntro} onChange={e => setStudioIntro(e.target.value)} className="min-h-[300px] text-sm leading-relaxed resize-none w-[60%]" placeholder="Studio introduction..." /> : <div className="text-sm leading-relaxed w-[60%] space-y-4">
                      {studioIntro.split('\n\n').map((paragraph, index) => {
                        // Check if paragraph contains Chinese characters
                        const hasChinese = /[\u4e00-\u9fa5]/.test(paragraph);
                        return (
                          <p key={index} className={hasChinese ? 'font-bold' : 'font-light'} style={hasChinese ? {} : { fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>}
                </div>
                
                {/* Right column - Display image */}
                <div className="flex flex-col gap-4">
                  {isEditMode && (
                    <div className="flex flex-col gap-2">
                      <Input 
                        value={studioImage} 
                        onChange={e => setStudioImage(e.target.value)} 
                        placeholder="Image URL..." 
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleStudioFileUpload}
                          className="hidden"
                          id="studio-file-input"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('studio-file-input')?.click()}
                          disabled={uploading}
                          className="flex-1"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploading ? "Uploading..." : "Upload Image"}
                        </Button>
                      </div>
                    </div>
                  )}
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