import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getMediaCards, setMediaCards } from '@/lib/storage';
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

export interface MediaCard {
  id: string;
  image: string;
  description: string;
  sort_order?: number;
}

const defaultMediaCards: MediaCard[] = [
  {
    id: "1",
    image: project1,
    description: "Innovative architectural design blending modern aesthetics with traditional elements."
  },
  {
    id: "2",
    image: project2,
    description: "Sustainable residential project featuring eco-friendly materials and natural lighting."
  },
  {
    id: "3",
    image: project3,
    description: "Contemporary urban development integrating green spaces and community areas."
  }
];

export function useMediaData() {
  const [cards, setCards] = useState<MediaCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMediaCards();
  }, []);

  const loadMediaCards = async () => {
    try {
      // Try to load from Supabase first
      const { data, error } = await supabase
        .from('media_cards')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedCards = data.map(card => ({
          id: card.id,
          image: card.image,
          description: card.description,
          sort_order: card.sort_order || 0
        }));
        setCards(formattedCards);
        await setMediaCards(formattedCards);
      } else {
        // Fallback to local storage
        const localCards = await getMediaCards();
        if (localCards && localCards.length > 0) {
          setCards(localCards);
        } else {
          // Use default data
          setCards(defaultMediaCards);
          await saveCards(defaultMediaCards);
        }
      }
    } catch (error) {
      console.error('Error loading media cards:', error);
      // Fallback to local storage on error
      const localCards = await getMediaCards();
      setCards(localCards || defaultMediaCards);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCards = async (updatedCards: MediaCard[]) => {
    try {
      // Save to local storage
      await setMediaCards(updatedCards);
      
      // Save to Supabase
      for (let i = 0; i < updatedCards.length; i++) {
        const card = updatedCards[i];
        const { error } = await supabase
          .from('media_cards')
          .upsert({
            id: card.id,
            image: card.image,
            description: card.description,
            sort_order: i
          });
        
        if (error) throw error;
      }
      
      setCards(updatedCards);
    } catch (error) {
      console.error('Error saving media cards:', error);
      throw error;
    }
  };

  const addCard = async (image: string, description: string) => {
    const newCard: MediaCard = {
      id: crypto.randomUUID(),
      image,
      description,
      sort_order: cards.length
    };
    
    const updatedCards = [...cards, newCard];
    await saveCards(updatedCards);
  };

  const updateCard = async (id: string, updates: Partial<MediaCard>) => {
    const updatedCards = cards.map(card =>
      card.id === id ? { ...card, ...updates } : card
    );
    await saveCards(updatedCards);
  };

  const deleteCard = async (id: string) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('media_cards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      const updatedCards = cards.filter(card => card.id !== id);
      await saveCards(updatedCards);
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  };

  const reorderCards = async (newOrder: string[]) => {
    const reorderedCards = newOrder.map(id => 
      cards.find(card => card.id === id)!
    ).filter(Boolean);
    await saveCards(reorderedCards);
  };

  return {
    cards,
    isLoading,
    addCard,
    updateCard,
    deleteCard,
    reorderCards
  };
}
