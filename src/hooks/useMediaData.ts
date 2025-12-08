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
  const cards = defaultMediaCards;
  const isLoading = false;

  return {
    cards,
    isLoading
  };
}
