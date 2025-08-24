 export interface AnimationData {
  file: string;
  name: string;
  description: string;
}

export async function loadAnimations(): Promise<AnimationData[]> {
  try {
    const res = await fetch('/Animation.json');
    if (!res.ok) {
      throw new Error(`Failed to load animations: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error loading animations:', error);
    return [];
  }
}