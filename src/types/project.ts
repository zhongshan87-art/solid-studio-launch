export interface ProjectImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  text?: string; // Card text content
}

export interface Project {
  id: number;
  title: string;
  location: string;
  mainImage: string;
  images: ProjectImage[];
  description?: string;
}

export interface ProjectData {
  projects: Project[];
  lastUpdated: string;
}