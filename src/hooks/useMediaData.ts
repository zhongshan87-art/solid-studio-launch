import ad100 from "@/assets/media/2022AD100.jpg";
import archiDaily from "@/assets/media/ArchiDaily.jpg";
import youfang2023 from "@/assets/media/youfang-2023.jpg";
import youfang2021 from "@/assets/media/youfang-2021.jpg";
import xiaohongshu2025 from "@/assets/media/xiaohongshu-2025.jpg";

export interface MediaCard {
  id: string;
  image: string;
  description: string;
  sort_order?: number;
}

const defaultMediaCards: MediaCard[] = [
  {
    id: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
    image: archiDaily,
    description: "ArchDaily Building of the Year 2024 Nominee",
  },
  {
    id: "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b",
    image: xiaohongshu2025,
    description: "InAward 小红书设计大赛 2025 获奖作品",
  },
  {
    id: "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
    image: youfang2023,
    description: "有方 2023 中国年轻建筑事务所",
  },
  {
    id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    image: ad100,
    description: "2022AD100Y0UNG 中国最具影响力100个建筑和室内设计新锐",
  },
  {
    id: "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a",
    image: youfang2021,
    description: "有方 2021 中国年轻建筑事务所",
  },
];

export function useMediaData() {
  const cards = defaultMediaCards;
  const isLoading = false;

  return {
    cards,
    isLoading,
  };
}
