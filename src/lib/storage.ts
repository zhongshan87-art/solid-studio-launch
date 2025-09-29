import localforage from 'localforage';
import type { ProjectData } from '@/types/project';

const store = localforage.createInstance({
  name: 'lovable',
  storeName: 'projects',
  description: 'Persistent storage for project data',
});

export async function getProjectsData(): Promise<ProjectData | null> {
  try {
    const data = await store.getItem<ProjectData>('projects-data');
    return data ?? null;
  } catch (e) {
    console.error('IndexedDB getProjectsData failed:', e);
    return null;
  }
}

export async function setProjectsData(data: ProjectData): Promise<void> {
  try {
    await store.setItem('projects-data', data);
  } catch (e) {
    console.error('IndexedDB setProjectsData failed:', e);
    throw e;
  }
}
