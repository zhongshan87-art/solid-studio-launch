import { Project } from '@/types/project';

// 金塘水獭科普馆图片
import jintangOtter1 from '@/assets/jintang-otter/1.jpg';
import jintangOtter2 from '@/assets/jintang-otter/2.jpg';
import jintangOtter3 from '@/assets/jintang-otter/3.jpg';
import jintangOtter3a from '@/assets/jintang-otter/3a.jpg';
import jintangOtter4 from '@/assets/jintang-otter/4.jpg';
import jintangOtter5 from '@/assets/jintang-otter/5.jpg';
import jintangOtter6 from '@/assets/jintang-otter/6.jpg';
import jintangOtter7 from '@/assets/jintang-otter/7.jpg';
import jintangOtter8 from '@/assets/jintang-otter/8.jpg';
import jintangOtter9 from '@/assets/jintang-otter/9.jpg';

const defaultProjects: Project[] = [
  {
    id: 2,
    title: "金塘水獭科普馆 Jintang Otter Center",
    location: "展览 Exhibition",
    mainImage: jintangOtter4,
    images: [
      { id: '2-1', url: jintangOtter1, alt: "寻獭客厅展示", caption: "灵动的獭-投影展示" },
      { id: '2-2', url: jintangOtter2, alt: "展厅全景", caption: "寻獭客厅全景" },
      { id: '2-3', url: jintangOtter3, alt: "鸟类标本展示", caption: "獭与鸟的邻里" },
      { id: '2-4', url: jintangOtter3a, alt: "岛屿模型与窥探镜", caption: "金塘岛屿沙盘模型" },
      { id: '2-5', url: jintangOtter4, alt: "展厅中央全景", caption: "寻獭客厅中央展区" },
      { id: '2-6', url: jintangOtter5, alt: "水獭科普与投影", caption: "水獭物种介绍" },
      { id: '2-7', url: jintangOtter6, alt: "世界水獭地图", caption: "全球水獭分布地图" },
      { id: '2-8', url: jintangOtter7, alt: "獭与鸟的邻里展柜", caption: "獭与鸟的邻里展示" },
      { id: '2-9', url: jintangOtter8, alt: "金塘水獭往事导览台", caption: "金塘水獭往事" },
      { id: '2-10', url: jintangOtter9, alt: "水獭脚印地砖", caption: "有獭来过" }
    ],
    description: `近30年来，水獭在全国数量急剧减少，被列为国家二级重点保护动物、濒危动物。金塘是浙江沿海水獭种群密度最高、分布最集中的区域，金塘水獭科普馆包含寻獭客厅（物种生境展示）、知獭实验室（科研工作）和水獭教室（社区活动），为公众提供深入了解水獭的窗口。

展陈从水獭的栖息环境中提取线索。水獭伴水而居，参考的摄影资料中常见棕色的泥地、沙地、礁石，与水獭的皮毛色也很接近。寻獭客厅以棕色为主色调，使用了天然木材和泥土质感的地面及展示墙面，营造出水獭栖息地的氛围。寻獭客厅中设置了很多"寻獭"线索，例如通过岛屿模型旁的窥探镜可观察红外相机夜间捕捉的水獭活动影像；在地面上会惊喜的发现1:1转印的金塘本地水獭脚印；移动世界地图探究全球的十三种獭等等。
知獭实验室重点展示金塘水獭保护的过程、研究和成果。公众可以透过玻璃看到科研人员在实验室里进行水獭粪便检测。此区域的展板和展示内容都可以灵活拆卸，方便后续更新最新的研究进展和社区活动发布。二楼的水獭教室包含古今水獭文化展示区、观影间和研学活动区域，是非常重要的文化交流空间。

地点：浙江舟山
完成时间：2025年4月`,
  },
  {
    id: 4,
    title: "聚落浮田.圩水相依",
    location: "建筑 Architecture",
    mainImage: "/images/projects/futian/main.jpg",
    images: [
      { id: '4-1', url: "/images/projects/futian/1.jpg", alt: "浮田建筑外观", caption: "聚落浮田" },
      { id: '4-2', url: "/images/projects/futian/2.jpg", alt: "圩田景观", caption: "圩水相依" }
    ],
    description: `青浦本土的圩田景观代表着江南地区生态、生产、生活的智慧。本案在三分荡的滨水空间，以圩田、水体、和江南建筑为主要线索，将建筑融于自然的环境基底，创造出具有江南园林特色的生态商业空间。漂浮的空中圩田创造出具有标识感的商业聚落，同时为社区提供了新颖的景观体验及多样的商业空间。创造具有青浦记忆的"聚落浮田"。

地点：上海青浦
完成时间：2024年8月`,
  },
  {
    id: 6,
    title: "探索山岭",
    location: "展览 Exhibition",
    mainImage: "/images/projects/mountain/main.jpg",
    images: [
      { id: '6-1', url: "/images/projects/mountain/1.jpg", alt: "山岭展览空间", caption: "探索山岭" },
      { id: '6-2', url: "/images/projects/mountain/2.jpg", alt: "植物标本展示", caption: "本土植物博物" }
    ],
    description: `探索山岭展览以杭州的本土草木为媒介，传达生物多样性之美，唤起人对土地、气候、乡土的记忆。展览约200平方米，有丰富的视觉、听觉和触觉体验。馆藏包含展馆所在地寺坞岭的山体模型，百余种杭州本土植物滴胶标本，二十余幅本土植物博物画，以及丰富的在地自然风光和物种的图文、视频介绍。展览的视觉呈现清新自然，空间上围合有度、内外通透，让展厅外秀丽的自然风光也成为展览体验的一部分。

地点：浙江杭州
完成时间：2023年7月`,
  },
  {
    id: 3,
    title: "听，有嗡嗡声",
    location: "展览 Exhibition",
    mainImage: "/images/projects/buzzing/main.jpg",
    images: [
      { id: '3-1', url: "/images/projects/buzzing/1.jpg", alt: "传粉昆虫展览", caption: "听，有嗡嗡声" },
      { id: '3-2', url: "/images/projects/buzzing/2.jpg", alt: "昆虫与野花", caption: "传粉者的秘境" }
    ],
    description: `提到生物多样性，大型动物往往会最先得到人类的关注。喜好在夜间活动、体积又小的昆虫常容易被人忽略， 但传粉昆虫和植物的相互作用确是地球上生物多样性的最重要驱动因素。这些小小的不起眼的昆虫在植物间嗡嗡叫、扑腾、爬行，以富含蛋白质的花粉和高能量花蜜为食。它们会在移动时运输和沉积花粉，使植物受精并繁殖。如果传粉昆虫减少，开花植物无法繁殖，人类也将没有食物。

"听，有嗡嗡声"将带你着眼于这些微小的个体，重新认识不可或缺的传粉昆虫和它们穿梭的野花秘境。

地点：浙江杭州
完成时间：2024年4月`,
  },
  {
    id: 1,
    title: "一室亦园",
    location: "室内 Interior",
    mainImage: "/images/projects/yishi-yiyuan/main.jpg",
    images: [
      { id: '1-1', url: "/images/projects/yishi-yiyuan/1.jpg", alt: "一室亦园室内", caption: "一室亦园" },
      { id: '1-2', url: "/images/projects/yishi-yiyuan/2.jpg", alt: "园林式廊道", caption: "环形流线空间" }
    ],
    description: `此次改造的公寓原是一个标准地产高效户型，三室两厅，满足一家三口忙碌的生活。如今业主夫妇即将退休，子女也不在家中长住，他们希望改造后的公寓更适合闲适的晚年生活。我们在设计时有意打破封闭的房间，将三室两厅变为一室一园，由原始的线性流线变为环形流线。起居空间界限被打破，走过曲折的廊道，内窗外窗的框景让视线丰富变幻。设计将功能与走道结合，使用起来有中式园林里的居游体验，让此住宅在后疫情时代变成最能遛弯的家！

地点：南京
完成时间：2021年11月`,
  },
  {
    id: 5,
    title: "食仓",
    location: "室内 Interior",
    mainImage: "/images/projects/shicang/main.jpg",
    images: [
      { id: '5-1', url: "/images/projects/shicang/1.jpg", alt: "食仓餐厅", caption: "食仓" },
      { id: '5-2', url: "/images/projects/shicang/2.jpg", alt: "钢构货架系统", caption: "工业食集空间" }
    ],
    description: `肉仙来是一家以东北熏酱为核心的创意餐厅，同时也是美食文化交流场所。在东北城市哈尔滨，厂区工人们下班后在户外吃熏酱、唠嗑，是最朴实的本地生活。设计概念"食仓"正是为了还原这份东北记忆。餐厅空间犹如工业货仓旁的食集，设计师在4.5m层高的空间里置入钢构货架系统，将明档、食物展示和仓储垂直整合，形成后厨与前场的互动界面。流动的室内外空间增强了公共性，户外轻盈棚架下食客往来，宛如东北早市般热闹。

地点：上海静安
完成时间：2025年2月`,
  },
  {
    id: 7,
    title: "幼儿园",
    location: "建筑 Architecture",
    mainImage: "/images/projects/kindergarten/main.jpg",
    images: [
      { id: '7-1', url: "/images/projects/kindergarten/1.jpg", alt: "幼儿园建筑", caption: "幼儿园" }
    ],
    description: `幼儿园项目描述待补充。

地点：待定
完成时间：待定`,
  },
  {
    id: 8,
    title: "篱笆",
    location: "建筑 Architecture",
    mainImage: "/images/projects/liba/main.jpg",
    images: [
      { id: '8-1', url: "/images/projects/liba/1.jpg", alt: "篱笆建筑", caption: "篱笆" }
    ],
    description: `篱笆项目描述待补充。

地点：待定
完成时间：待定`,
  },
  {
    id: 9,
    title: "手艺之家",
    location: "建筑 Architecture",
    mainImage: "/images/projects/shouyi/main.jpg",
    images: [
      { id: '9-1', url: "/images/projects/shouyi/1.jpg", alt: "手艺之家", caption: "手艺之家" }
    ],
    description: `手艺之家项目描述待补充。

地点：待定
完成时间：待定`,
  },
  {
    id: 10,
    title: "双棚",
    location: "建筑 Architecture",
    mainImage: "/images/projects/shuangpeng/main.jpg",
    images: [
      { id: '10-1', url: "/images/projects/shuangpeng/1.jpg", alt: "双棚建筑", caption: "双棚" }
    ],
    description: `双棚项目描述待补充。

地点：待定
完成时间：待定`,
  },
  {
    id: 11,
    title: "柔和过渡",
    location: "室内 Interior",
    mainImage: "/images/projects/rouhe/main.jpg",
    images: [
      { id: '11-1', url: "/images/projects/rouhe/1.jpg", alt: "柔和过渡室内", caption: "柔和过渡" }
    ],
    description: `柔和过渡项目描述待补充。

地点：待定
完成时间：待定`,
  },
  {
    id: 12,
    title: "青松住宅",
    location: "建筑 Architecture",
    mainImage: "/images/projects/qingsong/main.jpg",
    images: [
      { id: '12-1', url: "/images/projects/qingsong/1.jpg", alt: "青松住宅", caption: "青松住宅" }
    ],
    description: `青松住宅项目描述待补充。

地点：待定
完成时间：待定`,
  },
  {
    id: 13,
    title: "光影梧桐",
    location: "室内 Interior",
    mainImage: "/images/projects/guangying/main.jpg",
    images: [
      { id: '13-1', url: "/images/projects/guangying/1.jpg", alt: "光影梧桐室内", caption: "光影梧桐" }
    ],
    description: `光影梧桐项目描述待补充。

地点：待定
完成时间：待定`,
  },
  {
    id: 14,
    title: "小花野美",
    location: "室内 Interior",
    mainImage: "/images/projects/xiaohua/main.jpg",
    images: [
      { id: '14-1', url: "/images/projects/xiaohua/1.jpg", alt: "小花野美室内", caption: "小花野美" }
    ],
    description: `小花野美项目描述待补充。

地点：待定
完成时间：待定`,
  },
  {
    id: 15,
    title: "风栖·雪筑",
    location: "室内 Interior",
    mainImage: "/images/projects/fengqi/main.jpg",
    images: [
      { id: '15-1', url: "/images/projects/fengqi/1.jpg", alt: "风栖·雪筑室内", caption: "风栖·雪筑" }
    ],
    description: `风栖·雪筑项目描述待补充。

地点：待定
完成时间：待定`,
  }
];

export const useProjectData = () => {
  const projects = defaultProjects;
  const isLoading = false;

  return {
    projects,
    isLoading
  };
};
