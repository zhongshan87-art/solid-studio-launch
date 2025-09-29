import localforage from 'localforage';
import type { ProjectData } from '@/types/project';

// Media cards storage
const mediaStore = localforage.createInstance({
  name: 'lovable',
  storeName: 'media',
  description: 'Storage for media cards and studio data',
});

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

// Media cards functions
export async function getMediaCards(): Promise<any[] | null> {
  try {
    const data = await mediaStore.getItem<any[]>('mediaCards');
    return data ?? null;
  } catch (e) {
    console.error('IndexedDB getMediaCards failed:', e);
    return null;
  }
}

export async function setMediaCards(cards: any[]): Promise<void> {
  try {
    await mediaStore.setItem('mediaCards', cards);
  } catch (e) {
    console.error('IndexedDB setMediaCards failed:', e);
    throw e;
  }
}

export async function getStudioData(): Promise<{ intro: string; image: string } | null> {
  try {
    const data = await mediaStore.getItem<{ intro: string; image: string }>('studioData');
    return data ?? null;
  } catch (e) {
    console.error('IndexedDB getStudioData failed:', e);
    return null;
  }
}

export async function setStudioData(data: { intro: string; image: string }): Promise<void> {
  try {
    await mediaStore.setItem('studioData', data);
  } catch (e) {
    console.error('IndexedDB setStudioData failed:', e);
    throw e;
  }
}
