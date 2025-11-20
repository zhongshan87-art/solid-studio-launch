export interface ProjectImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  type?: 'image' | 'video';
  thumbnail?: string;
}

export interface Project {
  id: string;
  title: string;
  location: string;
  mainImage: string;
  images: ProjectImage[];
  description?: string;
  sortOrder?: number;
}

export interface ProjectData {
  projects: Project[];
  lastUpdated: string;
}