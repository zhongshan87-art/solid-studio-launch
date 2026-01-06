import studioHeroImage from "@/assets/studio/studio-hero.jpg";

export interface StudioData {
  id?: string;
  introChinese: string;
  introEnglish: string;
  image: string;
}

const defaultStudioData: StudioData = {
  introChinese: "尺度森林S.F.A由顾嘉和钟山于2021在上海创立。工作室以自然、艺术、建筑为核心，探索从建筑、室内、展览到装置的多尺度空间实践。致力于创作在当代设计语境下，有温度且灵动的设计表达，让各种尺度的项目都能促进公众交流和对话，传递故事、美学和可持续性。",
  introEnglish: "Scale Forest Atelier (S.F.A) is a creative design agency founded in Shanghai by Gu Jia and Zhong Shan. With nature, art, and architecture as its core, the studio explores multi-scale design practices from architecture, interiors, exhibitions to installations. S.F.A is committed to creating designs that radiate warmth and vitality in contemporary context, ensuring that projects of all scales promote public engagement and conversation, while sharing stories, aesthetics, and sustainability.
Email: info@scalefa.com
小红书：尺度森林S.F.A",
  image: studioHeroImage,
};

export function useStudioData() {
  const studio = defaultStudioData;
  const isLoading = false;

  return {
    studio,
    isLoading,
  };
}
