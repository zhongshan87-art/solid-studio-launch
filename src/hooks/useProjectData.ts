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
    description: "近30年来，水獭在全国数量急剧减少，被列为国家二级重点保护动物、濒危动物。金塘是浙江沿海水獭种群密度最高、分布最集中的区域，金塘水獭科普馆包含寻獭客厅（物种生境展示）、知獭实验室（科研工作）和水獭教室（社区活动），为公众提供深入了解水獭的窗口。\n\n展陈从水獭的栖息环境中提取线索。水獭伴水而居，参考的摄影资料中常见棕色的泥地、沙地、礁石，与水獭的皮毛色也很接近。寻獭客厅以棕色为主色调，使用了天然木材和泥土质感的地面及展示墙面，营造出水獭栖息地的氛围。寻獭客厅中设置了很多\"寻獭\"线索，例如通过岛屿模型旁的窥探镜可观察红外相机夜间捕捉的水獭活动影像；在地面上会惊喜的发现1:1转印的金塘本地水獭脚印；移动世界地图探究全球的十三种獭等等。\n知獭实验室重点展示金塘水獭保护的过程、研究和成果。公众可以透过玻璃看到科研人员在实验室里进行水獭粪便检测。此区域的展板和展示内容都可以灵活拆卸，方便后续更新最新的研究进展和社区活动发布。二楼的水獭教室包含古今水獭文化展示区、观影间和研学活动区域，是非常重要的文化交流空间。\n\n地点：浙江舟山\n完成时间：2025年4月",
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
      { id: '4-1763529951156', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "4", caption: "4.jpg" },
      { id: '4-1763530184184', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5", caption: "5.jpg" },
      { id: '4-1763530218178', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "7", caption: "7.jpg" },
      { id: '4-1763530225962', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "8", caption: "8.jpg" },
      { id: '4-1763530228896', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "9", caption: "9.jpg" },
      { id: '4-1763530231758', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "10", caption: "10.jpg" },
      { id: '4-1763530234777', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "11", caption: "11.jpg" }
    ],
    description: "青浦本土的圩田景观代表着江南地区生态、生产、生活的智慧。本案在三分荡的滨水空间，以圩田、水体、和江南建筑为主要线索，将建筑融于自然的环境基底，创造出具有江南园林特色的生态商业空间。漂浮的空中圩田创造出具有标识感的商业聚落，同时为社区提供了新颖的景观体验及多样的商业空间。创造具有青浦记忆的"聚落浮田"。\n\n地点：上海青浦\n完成时间：2024年8月",
  },
  {
    id: 6,
    title: "探索山岭 Explore the Mountain",
    location: "展览 Exhibition",
    mainImage: project3,
    images: [
      { id: '6-1763531748798', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "01_探索山岭展厅空间Explore the Mountain Exhibition Space©Wang Minjie", caption: "01_探索山岭展厅空间Explore the Mountain Exhibition Space©Wang Minjie.jpg", type: 'image' },
      { id: '6-1763531753311', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "04_山岭模型 Mountain model©Wang Minjie", caption: "04_山岭模型 Mountain model©Wang Minjie.jpg", type: 'image' },
      { id: '6-1763531756139', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "07_山岭模型和高低林立的展牌©Wang Minjie", caption: "07_山岭模型和高低林立的展牌©Wang Minjie.jpg", type: 'image' },
      { id: '6-1763531759678', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "12_样地四群落图Community succession illustration of plot 4©尺度森林S", caption: "12_样地四群落图Community succession illustration of plot 4©尺度森林S.F.A-s.jpg", type: 'image' },
      { id: '6-1763531763524', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "13_焕林新生展项 Rebirth-the return of native plants©Wang Minjie", caption: "13_焕林新生展项 Rebirth-the return of native plants©Wang Minjie.jpg", type: 'image' },
      { id: '6-1763531766834', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "16_可触摸植物标本台 Touchable plant specimens ©Wang Minjie", caption: "16_可触摸植物标本台 Touchable plant specimens ©Wang Minjie.jpg", type: 'image' },
      { id: '6-1763531769669', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "17_乡野草木Native wilderness space©Wang Minjie", caption: "17_乡野草木Native wilderness space©Wang Minjie.jpg", type: 'image' },
      { id: '6-1763531772416', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "19_滴胶标本和远处风光 Epoxy plant specimen and scenery©Wang Minjie", caption: "19_滴胶标本和远处风光 Epoxy plant specimen and scenery©Wang Minjie.jpg", type: 'image' },
      { id: '6-1763531774945', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "20_展厅空间exhibition space©Wang Minjie", caption: "20_展厅空间exhibition space©Wang Minjie.jpg", type: 'image' },
      { id: '6-1763531778012', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "21_野外探查Field exploration ©Wang Minjie", caption: "21_野外探查Field exploration ©Wang Minjie.jpg", type: 'image' }
    ],
    description: "探索山岭展览以杭州的本土草木为媒介，传达生物多样性之美，唤起人对土地、气候、乡土的记忆。展览约200平方米，有丰富的视觉、听觉和触觉体验。馆藏包含展馆所在地寺坞岭的山体模型，百余种杭州本土植物滴胶标本，二十余幅本土植物博物画，以及丰富的在地自然风光和物种的图文、视频介绍。展览的视觉呈现清新自然，空间上围合有度、内外通透，让展厅外秀丽的自然风光也成为展览体验的一部分。\n\n地点：浙江杭州\n完成时间：2023年7月",
  },
  {
    id: 3,
    title: "听有嗡嗡声 Listen, There is a Buzz",
    location: "展览 Exhibition",
    mainImage: project3,
    images: [
      { id: '3-1763530453172', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5", caption: "5.jpg" },
      { id: '3-1763530457877', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg" },
      { id: '3-1763530461045', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "2", caption: "2.jpg" },
      { id: '3-1763530465120', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "3", caption: "3.jpg" },
      { id: '3-1763530471234', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "4", caption: "4.jpg" },
      { id: '3-1763530474381', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "6", caption: "6.jpg" },
      { id: '3-1763530477603', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "7", caption: "7.jpg" },
      { id: '3-1763530480432', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "8", caption: "8.jpg" },
      { id: '3-1763530483022', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "9", caption: "9.jpg" },
      { id: '3-1763530486151', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "10", caption: "10.JPG" },
      { id: '3-1763530489103', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "11", caption: "11.jpg" },
      { id: '3-1763530492801', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "12", caption: "12.png" }
    ],
    description: "提到生物多样性，大型动物往往会最先得到人类的关注。喜好在夜间活动、体积又小的昆虫常容易被人忽略， 但传粉昆虫和植物的相互作用确是地球上生物多样性的最重要驱动因素。这些小小的不起眼的昆虫在植物间嗡嗡叫、扑腾、爬行，以富含蛋白质的花粉和高能量花蜜为食。它们会在移动时运输和沉积花粉，使植物受精并繁殖。如果传粉昆虫减少，开花植物无法繁殖，人类也将没有食物。\n\n"听，有嗡嗡声"将带你着眼于这些微小的个体，重新认识不可或缺的传粉昆虫和它们穿梭的野花秘境。\n\n地点：浙江杭州\n完成时间：2024年4月",
  },
  {
    id: 1,
    title: "一室亦园 One Room One Garden",
    location: "室内 Interior",
    mainImage: project1,
    images: [
      { id: '1-1763521985346', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "14_观景榻 Scenic seating deck ©尺度森林S", caption: "14_观景榻 Scenic seating deck ©尺度森林S.F.A.jpg" },
      { id: '1-1763521973162', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "01_层叠的木空间 Layered wooden space ©Luz Images", caption: "01_层叠的木空间 Layered wooden space ©Luz Images.jpg" },
      { id: '1-1763521979537', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "03_院落般的客厅 yard like living room ©尺度森林S", caption: "03_院落般的客厅 yard like living room ©尺度森林S.F.A.jpg" },
      { id: '1-1763521982554', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "07_木质廊洞看向玄关 view to entry from the wooden portal ©Luz Images", caption: "07_木质廊洞看向玄关 view to entry from the wooden portal ©Luz Images.jpg" },
      { id: '1-1763521989125', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "16_餐桌北望 look north from the dining table ©Luz Images", caption: "16_餐桌北望 look north from the dining table ©Luz Images.jpg" },
      { id: '1-1763521992310', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "18_次卫一角 corner at the guest bathroom ©Luz Images", caption: "18_次卫一角 corner at the guest bathroom ©Luz Images.jpg" },
      { id: '1-1763521995358', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "21_厨房kitchen©尺度森林S", caption: "21_厨房kitchen©尺度森林S.F.A.jpg" },
      { id: '1-1763521998345', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "22_橱柜kitchen cabinet details ©Luz Images", caption: "22_橱柜kitchen cabinet details ©Luz Images.jpg" },
      { id: '1-1763522000823', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "24_旧木地板再创造reinterpretation of the old wood flooring ©尺度森林S", caption: "24_旧木地板再创造reinterpretation of the old wood flooring ©尺度森林S.F.A.jpg" },
      { id: '1-1763522003784', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "25_新旧平面对比 renovation before and after ©尺度森林S", caption: "25_新旧平面对比 renovation before and after ©尺度森林S.F.A.jpg" }
    ],
    description: "此次改造的公寓原是一个标准地产高效户型，三室两厅，满足一家三口忙碌的生活。如今业主夫妇即将退休，子女也不在家中长住，他们希望改造后的公寓更适合闲适的晚年生活。我们在设计时有意打破封闭的房间，将三室两厅变为一室一园，由原始的线性流线变为环形流线。起居空间界限被打破，走过曲折的廊道，内窗外窗的框景让视线丰富变幻。设计将功能与走道结合，使用起来有中式园林里的居游体验，让此住宅在后疫情时代变成最能遛弯的家！\n\n地点：南京\n完成时间：2021年11月",
  },
  {
    id: 5,
    title: "食仓 The Gourmet Depot",
    location: "室内 Interior",
    mainImage: project2,
    images: [
      { id: '5-1763531173815', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg", type: 'image' },
      { id: '5-1763531401309', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "2", caption: "2.jpg", type: 'image' },
      { id: '5-1763531409852', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "3", caption: "3.jpg", type: 'image' },
      { id: '5-1763531413214', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "4", caption: "4.jpg", type: 'image' },
      { id: '5-1763531416475', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5", caption: "5.jpg", type: 'image' },
      { id: '5-1763531419725', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "6", caption: "6.jpg", type: 'image' },
      { id: '5-1763531422944', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "7", caption: "7.jpg", type: 'image' },
      { id: '5-1763531426411', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "8", caption: "8.jpg", type: 'image' },
      { id: '5-1763531429972', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "9", caption: "9.jpg", type: 'image' },
      { id: '5-1763531433490', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "10", caption: "10.jpg", type: 'image' },
      { id: '5-1763531442600', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "12", caption: "12.jpg", type: 'image' }
    ],
    description: "肉仙来是一家以东北熏酱为核心的创意餐厅，同时也是美食文化交流场所。在东北城市哈尔滨，厂区工人们下班后在户外吃熏酱、唠嗑，是最朴实的本地生活。设计概念\"食仓\"正是为了还原这份东北记忆。餐厅空间犹如工业货仓旁的食集，设计师在4.5m层高的空间里置入钢构货架系统，将明档、食物展示和仓储垂直整合，形成后厨与前场的互动界面。流动的室内外空间增强了公共性，户外轻盈棚架下食客往来，宛如东北早市般热闹。\n\n地点：上海静安\n完成时间：2025年2月",
  },
  {
    id: 7,
    title: "幼儿园 Kindergarten",
    location: "建筑 Architecture",
    mainImage: project1,
    images: [
      { id: '7-1763532253223', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "IMG_4043", caption: "IMG_4043.JPG", type: 'image' },
      { id: '7-1763532234962', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "diagram 2", caption: "diagram 2.png", type: 'image' },
      { id: '7-1763532243835', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "Lobby2-new", caption: "Lobby2-new.jpg", type: 'image' },
      { id: '7-1763532247595', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "Lobby1-no toy", caption: "Lobby1-no toy.jpg", type: 'image' },
      { id: '7-1763532256561', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "Lobby4", caption: "Lobby4.jpeg", type: 'image' },
      { id: '7-1763532259239', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "Lobby6", caption: "Lobby6.jpeg", type: 'image' },
      { id: '7-1763532267984', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "diagram 3", caption: "diagram 3.jpg", type: 'image' }
    ],
    description: "4700平方米建筑面积，12个班级的私立幼儿园。设计通过统一的色彩视觉营造温馨舒适的园所场景。室内通过一系列"框景"柜子，在幼儿园大厅创造出捉迷藏的空间氛围。\n\n地点：福建福清\n完成时间：2018年5月",
  },
  {
    id: 8,
    title: "篱笆 Liba",
    location: "家具 Furniture",
    mainImage: project2,
    images: [
      { id: '8-1763532548492', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "2", caption: "2.JPG", type: 'image' },
      { id: '8-1763532544336', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.JPG", type: 'image' },
      { id: '8-1763532550970', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "3", caption: "3.jpg", type: 'image' },
      { id: '8-1763532554125', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "4", caption: "4.JPG", type: 'image' },
      { id: '8-1763532557301', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5", caption: "5.JPG", type: 'image' },
      { id: '8-1763532560210', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "6", caption: "6.JPG", type: 'image' },
      { id: '8-1763532562859', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "7", caption: "7.jpg", type: 'image' },
      { id: '8-1763532566167', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "8", caption: "8.jpg", type: 'image' }
    ],
    description: "该沙发靠背灵感来源于院子中的篱笆，传统的沙发背较为笨重，我们希望用柔和、轻便的材料传达出自然的美感。靠背的木圈采用枫木皮冷弯技术，十分轻便，易于调整其摆放位置， 并且可以垂直和水平使用，适合多元化的使用场景。\n\n完成时间：2021年11月",
  },
  {
    id: 9,
    title: "手艺之家 House of Crafts",
    location: "展览 Exhibition",
    mainImage: project3,
    images: [
      { id: '9-1763532946410', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1 拷贝", caption: "1 拷贝.jpg", type: 'image' },
      { id: '9-1763532950590', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1a 拷贝", caption: "1a 拷贝.jpg", type: 'image' },
      { id: '9-1763532953648', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "2 拷贝", caption: "2 拷贝.jpg", type: 'image' },
      { id: '9-1763532956305', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "3 拷贝", caption: "3 拷贝.jpg", type: 'image' },
      { id: '9-1763532959316', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "4 拷贝", caption: "4 拷贝.jpg", type: 'image' },
      { id: '9-1763532961998', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5 拷贝", caption: "5 拷贝.jpg", type: 'image' },
      { id: '9-1763532964717', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "6 拷贝", caption: "6 拷贝.jpg", type: 'image' },
      { id: '9-1763532967547', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "7 拷贝", caption: "7 拷贝.jpg", type: 'image' },
      { id: '9-1763532970703', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "8 拷贝", caption: "8 拷贝.jpg", type: 'image' }
    ],
    description: "手艺之家是上海当代艺术博物馆于"新文化制作人第一季-手艺再兴"项目期间发起的平行计划，展示不同门类的中国手工艺以及相关的书籍、文献资料。展厅以灵动自由的形态唤起人们对手艺有机形态的直观感受，回应手艺的温度；弧形边界形成的流动感再造小屋、村巷的场所感，回应手艺的尺度；塑造有机的、流动的、可漫游的手艺家园。\n\n竞赛\n完成时间：2022年3月",
  },
  {
    id: 10,
    title: "双棚 Double Sheds",
    location: "室内 Interior",
    mainImage: project1,
    images: [
      { id: '10-1763533182742', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "3", caption: "3.jpg", type: 'image' },
      { id: '10-1763533170001', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg", type: 'image' },
      { id: '10-1763533175251', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1a", caption: "1a.jpg", type: 'image' },
      { id: '10-1763533179315', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "2", caption: "2.jpg", type: 'image' },
      { id: '10-1763533185964', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "4", caption: "4.jpg", type: 'image' },
      { id: '10-1763533189612', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5", caption: "5.JPG", type: 'image' },
      { id: '10-1763533192128', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "6", caption: "6.JPG", type: 'image' },
      { id: '10-1763533194457', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "7", caption: "7.jpg", type: 'image' }
    ],
    description: "棚是菜场商贩的标志性空间形式，棚虽是轻盈的，却形成庇护感；棚下暖光虽然微弱，也为来往的人们提供慰藉。"双棚"是这家紧临菜市场的熏酱小吃店的核心空间。小吃店外立面的铁皮棚为食客们形成庇护场所，店内的侗布灯笼棚透着微光如夜晚的星空一般唤起食客们的市井记忆。尺度森林S.F.A通过不锈钢，镀锌铁皮、手工侗布、暖光灯泡、桦木多层板等日常材料的演绎。希望食客们在此处享用美食的同时，想起记忆中"夜色下的小吃摊"。\n\n地点：上海静安\n完成时间：2022年11月",
  },
  {
    id: 11,
    title: "柔和过渡 Soft Transitions",
    location: "室内 Interior",
    mainImage: project2,
    images: [
      { id: '11-1763533406190', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "2", caption: "2.jpg", type: 'image' },
      { id: '11-1763533402392', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg", type: 'image' },
      { id: '11-1763533428860', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "9", caption: "9.jpg", type: 'image' },
      { id: '11-1763533409652', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "3", caption: "3.jpg", type: 'image' },
      { id: '11-1763533412762', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "4", caption: "4.jpg", type: 'image' },
      { id: '11-1763533415772', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5", caption: "5.jpg", type: 'image' },
      { id: '11-1763533418330', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "6", caption: "6.jpg", type: 'image' },
      { id: '11-1763533421301', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "7", caption: "7.jpg", type: 'image' },
      { id: '11-1763533426095', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "8", caption: "8.jpg", type: 'image' }
    ],
    description: "尝试在不搬离的情况下重塑起居空间，不拆除原有硬装，我们只添加柜子与帘子这两大家具来为生活建立必要的秩序和创造额外的趣味，使得日常平淡的居住场所获得丰富的景观性。三面半透帘子的引入将起居空间包裹，每面帘子后面都透着不一样的"景"，西面是户外城市街区风景，南面帘子后是工作场景，而北面则是餐厅餐桌的景。拉上纱帘可以迅速把工作桌这样非常容易凌乱的区域消隐或者说是给场景添上一层柔和"滤镜"， 几面景在同一款"滤镜"下也变得和谐。\n\n地点：上海长宁\n完成时间：2023年8月\n",
  },
  {
    id: 12,
    title: "青松住宅 Pine Resi",
    location: "室内 Interior",
    mainImage: project3,
    images: [
      { id: '12-1763533668423', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg", type: 'image' },
      { id: '12-1763533672423', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "2", caption: "2.jpg", type: 'image' },
      { id: '12-1763533675729', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "3", caption: "3.jpg", type: 'image' },
      { id: '12-1763533678844', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "4", caption: "4.jpg", type: 'image' },
      { id: '12-1763533682232', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5", caption: "5.jpg", type: 'image' },
      { id: '12-1763533686052', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5a", caption: "5a.jpg", type: 'image' },
      { id: '12-1763533689235', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "6", caption: "6.jpg", type: 'image' },
      { id: '12-1763533692419', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "7", caption: "7.jpg", type: 'image' },
      { id: '12-1763533695137', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "8", caption: "8.jpg", type: 'image' },
      { id: '12-1763533698935', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "9", caption: "9.jpg", type: 'image' }
    ],
    description: "初次探访基地，窗外的青松给所有人留下了映象，在静安区建筑密度如此高的地段，凝视着窗外这颗青松能感知到"心远地自偏"。室内的材料也延续"雪落青松"展开。公区明亮，如雪后的白净，墙裙的白色大理石在客厅里延伸，壁炉的火焰在白色石材中轻盈舞动。书房和卧室犹如松树杆的深沉褐色，创造静谧沉浸的休体验。这次的设计目标是为业主在繁忙的都市生活中打造一个宁静，治愈，滋养的居住空间。希望我们都能在忙碌的城市里享受到"心远地自偏"的愉悦。\n\n地点：上海静安\n完成时间：2023年11月",
  },
  {
    id: 13,
    title: "光影梧桐 ",
    location: "建筑 Architecture",
    mainImage: project1,
    images: [
      { id: '13-1763533931417', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.png", type: 'image' },
      { id: '13-1763533937322', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "2", caption: "2.jpg", type: 'image' },
      { id: '13-1763533940731', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "3", caption: "3.jpg", type: 'image' },
      { id: '13-1763533943661', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "4", caption: "4.jpg", type: 'image' },
      { id: '13-1763533947533', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5", caption: "5.jpg", type: 'image' },
      { id: '13-1763534003864', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "6", caption: "6.jpg", type: 'image' }
    ],
    description: "项目位于上海市长宁区江苏路地铁站。"第三层车站"是希望把车站的城市层作为一个整体的空间系统去考虑，研究怎样让这些公共空间被合理有效的利用起来，并能够很好的接入到周边的社区当中。 愚园路斑驳的梧桐树影给了我们很深的印象，所以我们用一片梧桐叶的意向串联街角空间。在不同主题的公共空间当中， 植入光影装置和艺术盒子，希望用这种当下的文化语言去实时呈现包罗万象又充满活力的愚园路文化。\n\n竞赛\n地点：上海长宁\n完成时间：2023年12月",
  },
  {
    id: 14,
    title: "小花野美 Small Flower, Wild Beauty",
    location: "装置 Installation",
    mainImage: project2,
    images: [
      { id: '14-1763534196694', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "2", caption: "2.JPG", type: 'image' },
      { id: '14-1763534200727', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "1", caption: "1.jpg", type: 'image' },
      { id: '14-1763534203390', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "3", caption: "3.JPG", type: 'image' },
      { id: '14-1763534206122', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "4", caption: "4.JPG", type: 'image' },
      { id: '14-1763534285456', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "5 拷贝", caption: "5 拷贝.jpg", type: 'image' },
      { id: '14-1763534288105', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "6 拷贝", caption: "6 拷贝.jpg", type: 'image' },
      { id: '14-1763534291446', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "7 拷贝", caption: "7 拷贝.jpg", type: 'image' }
    ],
    description: "小花野美是一个感知长三角本土野花的体验装置。充满体量感的色彩雕塑——花亭，用透明织物表达花朵轻盈柔软，层层包裹的状态。花亭邀请观众进入朦胧色彩之中，沉浸地欣赏本土野花影像。\n\n建成\n地点：上海黄浦\n完成时间：2024年6月",
  },
  {
    id: 15,
    title: "风栖·雪筑",
    location: "建筑 Architecture",
    mainImage: project3,
    images: [
      { id: '15-1763534782508', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "南方-1", caption: "南方-1.jpg", type: 'image' },
      { id: '15-1763534786382', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "南方-2", caption: "南方-2.jpg", type: 'image' },
      { id: '15-1763534800374', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "南方-6", caption: "南方-6.jpg", type: 'image' },
      { id: '15-1763534789279', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "南方-3", caption: "南方-3.jpg", type: 'image' },
      { id: '15-1763534792519', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "南方-4", caption: "南方-4.jpg", type: 'image' },
      { id: '15-1763534795746', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "南方-5", caption: "南方-5.jpg", type: 'image' },
      { id: '15-1763534816842', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "北方-1", caption: "北方-1.jpg", type: 'image' },
      { id: '15-1763534820014', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "北方-2", caption: "北方-2.jpg", type: 'image' },
      { id: '15-1763534831656', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "北方-6", caption: "北方-6.jpg", type: 'image' },
      { id: '15-1763534822610', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "北方-3", caption: "北方-3.jpg", type: 'image' },
      { id: '15-1763534825193', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "北方-4", caption: "北方-4.jpg", type: 'image' },
      { id: '15-1763534827991', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "北方-5", caption: "北方-5.jpg", type: 'image' },
      { id: '15-1763534834293', url: "[BASE64_IMAGE_PLACEHOLDER]", alt: "平面", caption: "平面.jpg", type: 'image' }
    ],
    description: "风栖雪筑创造了一套可适应不同气候的系统性木屋预制方案。设计用同一套预制建材系统来搭建针对湿热和干冷两种类型气候的房屋， 同时注重与自然连接的居住体验，为乡村文旅，自然保护地等场所提供有趣，美观，快速搭建，持久的居住和活动场所。让气候变成居住体验的一部分。\n\n竞赛\n完成时间：2025年8月",
  }
];

export const useProjectData = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Prefer IndexedDB (localforage)
        const storedDb = await getProjectsData();
        if (storedDb && Array.isArray(storedDb.projects) && storedDb.projects.length > 0) {
          setProjects(storedDb.projects);
          return;
        }

        // Migrate from localStorage if present
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data: ProjectData = JSON.parse(stored);
          setProjects(data.projects);
          // Migrate to IndexedDB for durability
          await setProjectsData(data);
        } else {
          setProjects(defaultProjects);
          await setProjectsData({
            projects: defaultProjects,
            lastUpdated: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
        setProjects(defaultProjects);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const saveProjects = async (updatedProjects: Project[]) => {
    let persisted = false;
    const data: ProjectData = {
      projects: updatedProjects,
      lastUpdated: new Date().toISOString(),
    };

    try {
      // Primary: IndexedDB via localforage (handles larger data than localStorage)
      await setProjectsData(data);
      persisted = true;
      console.log('Successfully saved projects to IndexedDB');
    } catch (error) {
      console.error('Failed to save to IndexedDB. Attempting localStorage fallback:', error);
      try {
        const dataString = JSON.stringify(data);
        const sizeInBytes = new Blob([dataString]).size;
        console.log('Saving projects data size:', (sizeInBytes / 1024 / 1024).toFixed(2), 'MB');

        if (sizeInBytes > 4.5 * 1024 * 1024) {
          console.warn('Data size approaching localStorage limit');
        }

        localStorage.setItem(STORAGE_KEY, dataString);
        persisted = true;
        console.log('Successfully saved projects to localStorage');
      } catch (lsError) {
        console.error('Failed to save projects to localStorage:', lsError);
        if (lsError instanceof Error && lsError.name === 'QuotaExceededError') {
          console.error('localStorage quota exceeded - using in-memory state only');
        }
      }
    } finally {
      // Always update in-memory state so UI reflects latest changes
      setProjects(updatedProjects);
      if (!persisted) {
        console.warn('Projects not persisted to durable storage. Changes will be lost on reload.');
      }
    }
  };

  const updateProject = (projectId: number, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    );
    saveProjects(updatedProjects);
  };

  const addImageToProject = (
    projectId: number, 
    image: { 
      url: string; 
      alt: string; 
      caption?: string;
      type?: 'image' | 'video';
      thumbnail?: string;
    }
  ) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      console.error('Project not found:', projectId);
      return undefined;
    }

    const newImage = {
      id: `${projectId}-${Date.now()}`,
      ...image,
      type: image.type || 'image',
    };

    console.log('Creating new media for project:', projectId, 'with ID:', newImage.id, 'type:', newImage.type);
    const updatedImages = [...project.images, newImage];
    console.log('Updated images count:', updatedImages.length);
    
    updateProject(projectId, { images: updatedImages });
    return newImage;
  };

  const removeImageFromProject = (projectId: number, imageId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedImages = project.images.filter(img => img.id !== imageId);
    updateProject(projectId, { images: updatedImages });
  };

  const updateProjectDescription = (projectId: number, description: string) => {
    updateProject(projectId, { description });
  };

  const reorderProjectImages = (projectId: number, newOrder: string[]) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const reorderedImages = newOrder
      .map(id => project.images.find(img => img.id === id))
      .filter((img): img is NonNullable<typeof img> => img !== undefined);

    updateProject(projectId, { images: reorderedImages });
  };

  const reorderProjects = (newOrder: number[]) => {
    const reorderedProjects = newOrder
      .map(id => projects.find(p => p.id === id))
      .filter((p): p is Project => p !== undefined);
    
    saveProjects(reorderedProjects);
  };

  return {
    projects,
    isLoading,
    updateProject,
    addImageToProject,
    removeImageFromProject,
    updateProjectDescription,
    reorderProjectImages,
    reorderProjects,
    saveProjects,
  };
};