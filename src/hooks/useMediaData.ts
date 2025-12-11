import ad100 from "@/assets/media/2022AD100.jpg";
import archiDaily from "@/assets/media/ArchiDaily.jpg";
import youfang2023 from "@/assets/media/youfang-2023.jpg";
import youfang2021 from "@/assets/media/youfang-2021.jpg";
import xiaohongshu2025 from "@/assets/media/xiaohongshu-2025.jpg";
import wudaxincheng2024_2 from "@/assets/media/2024-wudaxincheng-2.jpg";
import roca2024 from "@/assets/media/2024-roca.jpg";
import designShanghai2024 from "@/assets/media/2024-design-shanghai.jpg";
import xintiandi2024 from "@/assets/media/2024-xintiandi.jpg";

export interface MediaCard {
  id: string;
  image: string;
  description: string;
  sort_order?: number;
}

const defaultMediaCards: MediaCard[] = [
 
  {
    id: "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b",
    image: xiaohongshu2025,
    description: "InAward 小红书设计大赛 2025 获奖作品",
  },
  {
    id: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
    image: archiDaily,
    description: "ArchDaily Building of the Year 2024 Nominee",
  },
  {
    id: "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c",
    image: wudaxincheng2024_2,
    description: "2024 上海新城公共建筑及景观项目设计方案征集 三分荡国际生态湖岸公园滨水商业片区设计 优胜方案",
  },
  {
    id: "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
    image: youfang2023,
    description: "入选有方2023中国年轻建筑事务所榜单",
  },
  {
    id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    image: ad100,
    description: "2022AD100Y0UNG 中国最具影响力100个建筑和室内设计新锐",
  },
   {
    id: "a0b1c2d3-e4f5-4a6b-7c8d-9e0f1a2b3c4d",
    image: roca2024,
    description: "尺度森林创始合伙人顾嘉在Roca Shanghai Gallery分享自宅建造故事,
  },
  {
    id: "b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e",
    image: designShanghai2024,
    description: "受Burgeree邀请，尺度森林携手山与自然空间将寺坞岭的生态修复故事带来设计上海。",
  },
  {
    id: "c2d3e4f5-a6b7-4c8d-9e0f-1a2b3c4d5e6f",
    image: xintiandi2024,
    description: "在新天地设计节，尺度森林呈现小花野美艺术装置。",
  },
  {
    id: "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a",
    image: youfang2021,
    description: "入选有方2021中国年轻建筑事务所榜单",
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
