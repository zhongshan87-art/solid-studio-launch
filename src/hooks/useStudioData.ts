import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStudioData, setStudioData } from '@/lib/storage';
import heroImage from "@/assets/hero-architecture.jpg";

export interface StudioData {
  id?: string;
  intro: string;
  image: string;
}

const defaultStudioData: StudioData = {
  intro: "Our Studio\n\nFounded in 2010, our architectural studio specializes in innovative and sustainable design solutions. We believe in creating spaces that harmonize with their environment while pushing the boundaries of contemporary architecture.\n\nOur Philosophy:\n- Sustainable design practices\n- Integration with natural landscapes\n- User-centered spatial experiences\n- Innovative material applications\n\nServices:\n- Architectural Design\n- Interior Design\n- Urban Planning\n- Consultation Services",
  image: heroImage
};

export function useStudioData() {
  const [studio, setStudio] = useState<StudioData>(defaultStudioData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudioData();
  }, []);

  const loadStudioData = async () => {
    try {
      // Try to load from Supabase first
      const { data, error } = await supabase
        .from('studio_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const studioData = {
          id: data.id,
          intro: data.intro,
          image: data.image
        };
        setStudio(studioData);
        await setStudioData(studioData);
      } else {
        // Fallback to local storage
        const localData = await getStudioData();
        if (localData) {
          setStudio(localData);
        } else {
          // Use default data and save it
          await saveStudio(defaultStudioData);
        }
      }
    } catch (error) {
      console.error('Error loading studio data:', error);
      // Fallback to local storage on error
      const localData = await getStudioData();
      setStudio(localData || defaultStudioData);
    } finally {
      setIsLoading(false);
    }
  };

  const saveStudio = async (updatedStudio: StudioData) => {
    try {
      // Save to local storage
      await setStudioData(updatedStudio);
      
      // Save to Supabase
      if (updatedStudio.id) {
        // Update existing
        const { error } = await supabase
          .from('studio_data')
          .update({
            intro: updatedStudio.intro,
            image: updatedStudio.image
          })
          .eq('id', updatedStudio.id);
        
        if (error) throw error;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('studio_data')
          .insert({
            intro: updatedStudio.intro,
            image: updatedStudio.image
          })
          .select()
          .single();
        
        if (error) throw error;
        
        updatedStudio.id = data.id;
      }
      
      setStudio(updatedStudio);
    } catch (error) {
      console.error('Error saving studio data:', error);
      throw error;
    }
  };

  const updateStudio = async (updates: Partial<StudioData>) => {
    const updatedStudio = { ...studio, ...updates };
    await saveStudio(updatedStudio);
  };

  return {
    studio,
    isLoading,
    updateStudio
  };
}
