-- Create media_cards table
CREATE TABLE public.media_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.media_cards ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Anyone can view media cards" 
ON public.media_cards 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert media cards" 
ON public.media_cards 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update media cards" 
ON public.media_cards 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete media cards" 
ON public.media_cards 
FOR DELETE 
USING (true);

-- Create trigger for timestamps
CREATE TRIGGER update_media_cards_updated_at
BEFORE UPDATE ON public.media_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create studio_data table
CREATE TABLE public.studio_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intro TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.studio_data ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Anyone can view studio data" 
ON public.studio_data 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert studio data" 
ON public.studio_data 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update studio data" 
ON public.studio_data 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete studio data" 
ON public.studio_data 
FOR DELETE 
USING (true);

-- Create trigger for timestamps
CREATE TRIGGER update_studio_data_updated_at
BEFORE UPDATE ON public.studio_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();