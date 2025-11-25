import { useState, useEffect } from 'react';
import { Project, ProjectData } from '@/types/project';
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import { getProjectsData, setProjectsData } from '@/lib/storage';

const STORAGE_KEY = 'lovable-projects-data';

const defaultProjects: Project[] = [
  {
    id: 2,
    title: "金塘水獭科普馆 Jintang Otter Center",
    location: "展览 Exhibition",
    mainImage: project2,
    images: [
      { id: '2-1763522475506', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "2", caption: "2.jpg" },
      { id: '2-1763522687393', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg" },
      { id: '2-1763522478189', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "3", caption: "3.jpg" },
      { id: '2-1763522480866', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "3a", caption: "3a.jpg" },
      { id: '2-1763522483741', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "4", caption: "4.jpg" },
      { id: '2-1763522486154', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5", caption: "5.jpg" },
      { id: '2-1763522489670', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "6", caption: "6.jpg" },
      { id: '2-1763522493392', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "7", caption: "7.jpg" },
      { id: '2-1763522496881', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "8", caption: "8.jpg" },
      { id: '2-1763522500105', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "9", caption: "9.jpg" },
      { id: '2-1763522503617', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "10", caption: "10.jpg" },
      { id: '2-1763522507620', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "11", caption: "11.jpg" },
      { id: '2-1763522546859', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "12", caption: "12.jpg" },
      { id: '2-1763522552345', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "13", caption: "13.jpg" },
      { id: '2-1763522555821', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "14", caption: "14.jpg" },
      { id: '2-1763522559482', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "15", caption: "15.jpg" },
      { id: '2-1763522564854', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "16", caption: "16.jpg" },
      { id: '2-1763522568855', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "17", caption: "17.jpg" },
      { id: '2-1763522573518', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "18", caption: "18.jpg" }
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
    mainImage: project1,
    images: [
      { id: '4-1763530214541', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "6", caption: "6.jpg" },
      { id: '4-1763529859576', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg" },
      { id: '4-1763529915136', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "2", caption: "2.jpg" },
      { id: '4-1763529946282', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "3", caption: "3.jpg" },
      { id: '4-1763529977835', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "4", caption: "4.jpg" },
      { id: '4-1763530023026', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5", caption: "5.jpg" },
      { id: '4-1763530265176', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "7", caption: "7.jpg" },
      { id: '4-1763530269048', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "8", caption: "8.jpg" },
      { id: '4-1763530274071', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "9", caption: "9.jpg" },
      { id: '4-1763530277880', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "10", caption: "10.jpg" },
      { id: '4-1763530280742', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "11", caption: "11.jpg" },
      { id: '4-1763530283902', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "12", caption: "12.jpg" },
      { id: '4-1763530287207', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "13", caption: "13.jpg" },
      { id: '4-1763530290798', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "14", caption: "14.jpg" }
    ],
    description: `青浦本土的圩田景观代表着江南地区生态、生产、生活的智慧。本案在三分荡的滨水空间，以圩田、水体、和江南建筑为主要线索，将建筑融于自然的环境基底，创造出具有江南园林特色的生态商业空间。漂浮的空中圩田创造出具有标识感的商业聚落，同时为社区提供了新颖的景观体验及多样的商业空间。创造具有青浦记忆的"聚落浮田"。

地点：上海青浦
完成时间：2024年8月`,
  },
  {
    id: 6,
    title: "探索山岭",
    location: "展览 Exhibition",
    mainImage: project3,
    images: [
      { id: '6-1763530495758', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg" },
      { id: '6-1763530500070', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "2", caption: "2.jpg" },
      { id: '6-1763530503758', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "3", caption: "3.jpg" },
      { id: '6-1763530508310', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "4", caption: "4.jpg" },
      { id: '6-1763530512918', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5", caption: "5.jpg" },
      { id: '6-1763530517990', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "6", caption: "6.jpg" },
      { id: '6-1763530522062', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "7", caption: "7.jpg" },
      { id: '6-1763530526758', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "8", caption: "8.jpg" },
      { id: '6-1763530531454', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "9", caption: "9.jpg" },
      { id: '6-1763530536990', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "10", caption: "10.jpg" },
      { id: '6-1763530540542', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "11", caption: "11.jpg" },
      { id: '6-1763530544838', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "12", caption: "12.jpg" },
      { id: '6-1763530548838', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "13", caption: "13.jpg" },
      { id: '6-1763530557990', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "14", caption: "14.jpg" },
      { id: '6-1763530562254', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "15", caption: "15.jpg" },
      { id: '6-1763530566422', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "16", caption: "16.jpg" },
      { id: '6-1763530571414', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "17", caption: "17.jpg" },
      { id: '6-1763530577054', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "18", caption: "18.jpg" },
      { id: '6-1763530580862', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "19", caption: "19.jpg" }
    ],
    description: `探索山岭展览以杭州的本土草木为媒介，传达生物多样性之美，唤起人对土地、气候、乡土的记忆。展览约200平方米，有丰富的视觉、听觉和触觉体验。馆藏包含展馆所在地寺坞岭的山体模型，百余种杭州本土植物滴胶标本，二十余幅本土植物博物画，以及丰富的在地自然风光和物种的图文、视频介绍。展览的视觉呈现清新自然，空间上围合有度、内外通透，让展厅外秀丽的自然风光也成为展览体验的一部分。

地点：浙江杭州
完成时间：2023年7月`,
  },
  {
    id: 3,
    title: "听，有嗡嗡声",
    location: "展览 Exhibition",
    mainImage: project4,
    images: [
      { id: '3-1763530663830', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg" },
      { id: '3-1763530668278', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "2", caption: "2.jpg" },
      { id: '3-1763530673094', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "3", caption: "3.jpg" },
      { id: '3-1763530676246', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "4", caption: "4.jpg" },
      { id: '3-1763530680622', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5", caption: "5.jpg" },
      { id: '3-1763530684574', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "6", caption: "6.jpg" },
      { id: '3-1763530688742', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "7", caption: "7.jpg" },
      { id: '3-1763530693102', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "8", caption: "8.jpg" },
      { id: '3-1763530696694', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "9", caption: "9.jpg" },
      { id: '3-1763530700942', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "10", caption: "10.jpg" },
      { id: '3-1763530704942', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "11", caption: "11.jpg" },
      { id: '3-1763530708262', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "12", caption: "12.jpg" },
      { id: '3-1763530711710', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "13", caption: "13.jpg" },
      { id: '3-1763530715086', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "14", caption: "14.jpg" },
      { id: '3-1763530718486', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "15", caption: "15.jpg" },
      { id: '3-1763530721670', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "16", caption: "16.jpg" },
      { id: '3-1763530724838', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "17", caption: "17.jpg" },
      { id: '3-1763530729542', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "18", caption: "18.jpg" },
      { id: '3-1763530733102', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "19", caption: "19.jpg" }
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
    mainImage: project1,
    images: [
      { id: '1-1763530787054', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg" },
      { id: '1-1763530792726', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "2", caption: "2.jpg" },
      { id: '1-1763530797886', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "3", caption: "3.jpg" },
      { id: '1-1763530805470', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "4", caption: "4.jpg" },
      { id: '1-1763530808542', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5", caption: "5.jpg" },
      { id: '1-1763530811702', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "6", caption: "6.jpg" },
      { id: '1-1763530814990', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "7", caption: "7.jpg" },
      { id: '1-1763530818558', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "8", caption: "8.jpg" },
      { id: '1-1763530821910', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "9", caption: "9.jpg" },
      { id: '1-1763530825358', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "10", caption: "10.jpg" },
      { id: '1-1763530828094', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "11", caption: "11.jpg" },
      { id: '1-1763530831142', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "12", caption: "12.jpg" },
      { id: '1-1763530834854', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "13", caption: "13.jpg" },
      { id: '1-1763530838414', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "14", caption: "14.jpg" },
      { id: '1-1763530841662', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "15", caption: "15.jpg" },
      { id: '1-1763530846054', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "16", caption: "16.jpg" },
      { id: '1-1763530849478', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "17", caption: "17.jpg" },
      { id: '1-1763530853190', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "18", caption: "18.jpg" },
      { id: '1-1763530858254', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "19", caption: "19.jpg" }
    ],
    description: `此次改造的公寓原是一个标准地产高效户型，三室两厅，满足一家三口忙碌的生活。如今业主夫妇即将退休，子女也不在家中长住，他们希望改造后的公寓更适合闲适的晚年生活。我们在设计时有意打破封闭的房间，将三室两厅变为一室一园，由原始的线性流线变为环形流线。起居空间界限被打破，走过曲折的廊道，内窗外窗的框景让视线丰富变幻。设计将功能与走道结合，使用起来有中式园林里的居游体验，让此住宅在后疫情时代变成最能遛弯的家！

地点：南京
完成时间：2021年11月`,
  },
  {
    id: 5,
    title: "食仓",
    location: "室内 Interior",
    mainImage: project2,
    images: [
      { id: '5-1763530902974', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg" },
      { id: '5-1763530905774', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "2", caption: "2.jpg" },
      { id: '5-1763530908590', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "3", caption: "3.jpg" },
      { id: '5-1763530911870', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "4", caption: "4.jpg" },
      { id: '5-1763530914974', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5", caption: "5.jpg" },
      { id: '5-1763530917934', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "6", caption: "6.jpg" },
      { id: '5-1763530921070', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "7", caption: "7.jpg" },
      { id: '5-1763530924462', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "8", caption: "8.jpg" },
      { id: '5-1763530927310', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "9", caption: "9.jpg" },
      { id: '5-1763530930062', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "10", caption: "10.jpg" },
      { id: '5-1763530933206', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "11", caption: "11.jpg" },
      { id: '5-1763530936174', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "12", caption: "12.jpg" },
      { id: '5-1763530939534', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "13", caption: "13.jpg" },
      { id: '5-1763530942638', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "14", caption: "14.jpg" },
      { id: '5-1763530946014', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "15", caption: "15.jpg" }
    ],
    description: `肉仙来是一家以东北熏酱为核心的创意餐厅，同时也是美食文化交流场所。在东北城市哈尔滨，厂区工人们下班后在户外吃熏酱、唠嗑，是最朴实的本地生活。设计概念"食仓"正是为了还原这份东北记忆。餐厅空间犹如工业货仓旁的食集，设计师在4.5m层高的空间里置入钢构货架系统，将明档、食物展示和仓储垂直整合，形成后厨与前场的互动界面。流动的室内外空间增强了公共性，户外轻盈棚架下食客往来，宛如东北早市般热闹。

地点：上海静安
完成时间：2025年2月`,
  },
  {
    id: 7,
    title: "幼儿园",
    location: "建筑 Architecture",
    mainImage: project3,
    images: [
      { id: '7-1763530980542', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg" }
    ],
    description: `幼儿园项目描述待补充。

地点：待定
完成时间：待定`,
  },
  {
    id: 8,
    title: "篱笆",
    location: "建筑 Architecture",
    mainImage: project4,
    images: [
      { id: '8-1763531000350', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg" }
    ],
    description: `篱笆项目描述待补充。

地点：待定
完成时间：待定`,
  },
  {
    id: 9,
    title: "手艺之家",
    location: "建筑 Architecture",
    mainImage: project1,
    images: [
      { id: '9-1763531018846', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg" }
    ],
    description: `手艺之家项目描述待补充。

地点：待定
完成时间：待定`,
  },
  {
    id: 10,
    title: "双棚",
    location: "建筑 Architecture",
    mainImage: project2,
    images: [
      { id: '10-1763531036622', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg" }
    ],
    description: `双棚项目描述待补充。

地点：待定
完成时间：待定`,
  },
  {
    id: 11,
    title: "柔和过渡",
    location: "室内 Interior",
    mainImage: project3,
    images: [
      { id: '11-1763531052454', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg" }
    ],
    description: `柔和过渡项目描述待补充。

地点：待定
完成时间：待定`,
  },
  {
    id: 12,
    title: "青松住宅",
    location: "建筑 Architecture",
    mainImage: project4,
    images: [
      { id: '12-1763531070046', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg" }
    ],
    description: `青松住宅项目描述待补充。

地点：待定
完成时间：待定`,
  },
  {
    id: 13,
    title: "光影梧桐",
    location: "室内 Interior",
    mainImage: project1,
    images: [
      { id: '13-1763531088430', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg" }
    ],
    description: `光影梧桐项目描述待补充。

地点：待定
完成时间：待定`,
  },
  {
    id: 14,
    title: "小花野美",
    location: "室内 Interior",
    mainImage: project2,
    images: [
      { id: '14-1763531105838', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg" }
    ],
    description: `小花野美项目描述待补充。

地点：待定
完成时间：待定`,
  },
  {
    id: 15,
    title: "风栖·雪筑",
    location: "室内 Interior",
    mainImage: project3,
    images: [
      { id: '15-1763531123998', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg" }
    ],
    description: `风栖·雪筑项目描述待补充。

地点：待定
完成时间：待定`,
  }
];

export const useProjectData = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const storedData = await getProjectsData();
        
        if (storedData && storedData.projects && storedData.projects.length > 0) {
          setProjects(storedData.projects);
        } else {
          setProjects(defaultProjects);
          await setProjectsData({ projects: defaultProjects, lastUpdated: new Date().toISOString() });
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects(defaultProjects);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const saveProjects = async (updatedProjects: Project[]) => {
    try {
      await setProjectsData({ projects: updatedProjects, lastUpdated: new Date().toISOString() });
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  };

  const updateProject = async (projectId: number, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project => 
      project.id === projectId ? { ...project, ...updates } : project
    );
    await saveProjects(updatedProjects);
  };

  const addImageToProject = async (
    projectId: number,
    imageUrl: string,
    alt: string,
    caption: string
  ) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const newImage = {
          id: `${projectId}-${Date.now()}`,
          url: imageUrl,
          alt,
          caption
        };
        return {
          ...project,
          images: [...project.images, newImage]
        };
      }
      return project;
    });
    await saveProjects(updatedProjects);
  };

  const removeImageFromProject = async (projectId: number, imageId: string) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          images: project.images.filter(img => img.id !== imageId)
        };
      }
      return project;
    });
    await saveProjects(updatedProjects);
  };

  const updateProjectDescription = async (projectId: number, description: string) => {
    await updateProject(projectId, { description });
  };

  const reorderProjectImages = async (projectId: number, newOrder: string[]) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        const reorderedImages = newOrder
          .map(id => project.images.find(img => img.id === id))
          .filter((img): img is NonNullable<typeof img> => img !== undefined);
        return {
          ...project,
          images: reorderedImages
        };
      }
      return project;
    });
    await saveProjects(updatedProjects);
  };

  const reorderProjects = async (newOrder: number[]) => {
    const reorderedProjects = newOrder
      .map(id => projects.find(p => p.id === id))
      .filter((p): p is Project => p !== undefined);
    await saveProjects(reorderedProjects);
  };

  return {
    projects,
    isLoading,
    updateProject,
    addImageToProject,
    removeImageFromProject,
    updateProjectDescription,
    reorderProjectImages,
    reorderProjects
  };
};
