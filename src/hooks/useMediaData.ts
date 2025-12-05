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

// Use stable UUIDs for default cards to avoid regeneration issues
const defaultMediaCards: MediaCard[] = [
  {
    id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    image: project1,
    description: "Innovative architectural design blending modern aesthetics with traditional elements."
  },
  {
    id: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
    image: project2,
    description: "Sustainable residential project featuring eco-friendly materials and natural lighting."
  },
  {
    id: "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
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

  // Helper to check if string is a valid UUID
  const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // Migrate cards with non-UUID IDs to proper UUIDs
  const migrateCards = (cards: MediaCard[]): MediaCard[] => {
    return cards.map(card => ({
      ...card,
      id: isValidUUID(card.id) ? card.id : crypto.randomUUID()
    }));
  };

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
          // Migrate old non-UUID IDs
          const migratedCards = migrateCards(localCards);
          setCards(migratedCards);
          await setMediaCards(migratedCards);
        } else {
          // Use default data
          setCards(defaultMediaCards);
        }
      }
    } catch (error) {
      console.error('Error loading media cards:', error);
      // Fallback to local storage on error
      const localCards = await getMediaCards();
      const migratedCards = migrateCards(localCards || defaultMediaCards);
      setCards(migratedCards);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCards = async (updatedCards: MediaCard[]) => {
    // Always save to local storage first
    await setMediaCards(updatedCards);
    setCards(updatedCards);
    
    // Try to save to Supabase (may fail due to RLS if not admin)
    try {
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
        
        if (error) {
          console.warn('Supabase save failed (may need admin role):', error.message);
        }
      }
    } catch (error) {
      console.warn('Error saving to Supabase:', error);
    }
  };

  const addCard = async (image: string, description: string) => {
    try {
      const newCard: MediaCard = {
        id: crypto.randomUUID(),
        image,
        description,
        sort_order: cards.length
      };
      
      const updatedCards = [...cards, newCard];
      await saveCards(updatedCards);
    } catch (error) {
      console.warn('Error adding card:', error);
      // Still try to update local state even if storage fails
      const newCard: MediaCard = {
        id: crypto.randomUUID(),
        image,
        description,
        sort_order: cards.length
      };
      setCards(prev => [...prev, newCard]);
    }
  };

  const updateCard = async (id: string, updates: Partial<MediaCard>) => {
    const updatedCards = cards.map(card =>
      card.id === id ? { ...card, ...updates } : card
    );
    await saveCards(updatedCards);
  };

  const deleteCard = async (id: string) => {
    // Update local state and storage first
    const updatedCards = cards.filter(card => card.id !== id);
    await setMediaCards(updatedCards);
    setCards(updatedCards);
    
    // Try to delete from Supabase (may fail due to RLS if not admin)
    try {
      const { error } = await supabase
        .from('media_cards')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.warn('Supabase delete failed (may need admin role):', error.message);
      }
    } catch (error) {
      console.warn('Error deleting from Supabase:', error);
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
