import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const projects = [
  {
    id: 1,
    title: "一室亦园 One Room One Garden",
    location: "南京 Nanjing",
    image: project1,
  },
  {
    id: 2,
    title: "金塘水獭馆 Otter Exhibition",
    location: "浙江 Zhejiang",
    image: project2,
  },
  {
    id: 3,
    title: "Art Museum",
    location: "Tokyo, Japan",
    image: project3,
  },
  {
    id: 4,
    title: "城市更新项目 Urban Renewal",
    location: "北京 Beijing",
    image: project1,
  },
  {
    id: 5,
    title: "文化中心 Cultural Center",
    location: "上海 Shanghai",
    image: project2,
  },
  {
    id: 6,
    title: "住宅综合体 Residential Complex",
    location: "深圳 Shenzhen",
    image: project3,
  },
  {
    id: 7,
    title: "商业广场 Commercial Plaza",
    location: "广州 Guangzhou",
    image: project1,
  },
  {
    id: 8,
    title: "学校设计 School Design",
    location: "杭州 Hangzhou",
    image: project2,
  },
  {
    id: 9,
    title: "办公大楼 Office Building",
    location: "成都 Chengdu",
    image: project3,
  },
  {
    id: 10,
    title: "公园景观 Park Landscape",
    location: "武汉 Wuhan",
    image: project1,
  },
  {
    id: 11,
    title: "酒店设计 Hotel Design",
    location: "西安 Xi'an",
    image: project2,
  },
  {
    id: 12,
    title: "体育馆 Sports Center",
    location: "重庆 Chongqing",
    image: project3,
  },
  {
    id: 13,
    title: "图书馆 Library",
    location: "天津 Tianjin",
    image: project1,
  },
  {
    id: 14,
    title: "医院建筑 Hospital Building",
    location: "南昌 Nanchang",
    image: project2,
  },
  {
    id: 15,
    title: "交通枢纽 Transport Hub",
    location: "长沙 Changsha",
    image: project3,
  }
];

export const ProjectGrid = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Sample project images (using the same image for demo purposes)
  const projectImages = [
    project1, project2, project3, project1, project2
  ];

  return (
    <section id="works" className="py-8">
      <div className="w-full px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {projects.map((project, index) => {
            const isLastInRowMd = (index + 1) % 2 === 0;
            const isLastInRowLg = (index + 1) % 3 === 0;
            
            return (
              <article 
                key={project.id} 
                className={`group cursor-pointer border-b border-gray-200 ${
                  !isLastInRowMd ? 'md:border-r' : ''
                } ${
                  !isLastInRowLg ? 'lg:border-r' : ''
                } md:[&:nth-child(even)]:border-r-0 lg:[&:nth-child(3n)]:border-r-0`}
              >
                <div className="w-full overflow-hidden aspect-[4/3]">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onClick={() => handleImageClick(project)}
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-foreground mb-2 leading-tight">
                    {project.title}
                  </h2>
                  <p className="text-base md:text-lg text-muted-foreground">
                    {project.location}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[90vw] max-w-none h-[90vh] max-h-none">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="flex-1 overflow-auto p-4">
              {/* Text section at the top */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">{selectedProject.title}</h3>
                <p className="text-lg text-studio-gray-medium mb-4">{selectedProject.location}</p>
                <div className="text-base leading-relaxed">
                  <p>This is a detailed description of the {selectedProject.title} project located in {selectedProject.location}. The project showcases innovative architectural design and sustainable building practices.</p>
                  <br />
                  <p><strong>Key Features:</strong></p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Modern architectural design</li>
                    <li>Sustainable materials</li>
                    <li>Integration with natural environment</li>
                    <li>Innovative spatial solutions</li>
                  </ul>
                </div>
              </div>
              
              {/* Images section - 5 images each 90% width */}
              <div className="flex flex-col items-center space-y-6">
                {projectImages.map((image, index) => (
                  <div key={index} className="w-[90%]">
                    <img 
                      src={image} 
                      alt={`${selectedProject.title} - Image ${index + 1}`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};