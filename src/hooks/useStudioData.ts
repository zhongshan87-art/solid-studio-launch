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
  const studio = defaultStudioData;
  const isLoading = false;

  return {
    studio,
    isLoading
  };
}
