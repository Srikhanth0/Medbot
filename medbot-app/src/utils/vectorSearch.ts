import { AnimationData } from './LoadAnimations';

// Simple text embedding function using word frequency
function createEmbedding(text: string): Map<string, number> {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2);
  
  const embedding = new Map<string, number>();
  words.forEach(word => {
    embedding.set(word, (embedding.get(word) || 0) + 1);
  });
  
  return embedding;
}

// Calculate cosine similarity between two embeddings
function cosineSimilarity(embedding1: Map<string, number>, embedding2: Map<string, number>): number {
  const allWords = new Set([...embedding1.keys(), ...embedding2.keys()]);
  
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  allWords.forEach(word => {
    const val1 = embedding1.get(word) || 0;
    const val2 = embedding2.get(word) || 0;
    
    dotProduct += val1 * val2;
    magnitude1 += val1 * val1;
    magnitude2 += val2 * val2;
  });
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
}

// Vector search function
export function vectorSearch(
  userQuery: string, 
  animations: AnimationData[], 
  topK: number = 1
): AnimationData[] {
  const queryEmbedding = createEmbedding(userQuery);
  
  const similarities = animations.map(animation => {
    const descriptionEmbedding = createEmbedding(animation.description);
    const nameEmbedding = createEmbedding(animation.name);
    
    // Combine description and name similarity
    const descSimilarity = cosineSimilarity(queryEmbedding, descriptionEmbedding);
    const nameSimilarity = cosineSimilarity(queryEmbedding, nameEmbedding);
    
    // Weight description more heavily than name
    const combinedSimilarity = (descSimilarity * 0.7) + (nameSimilarity * 0.3);
    
    return {
      animation,
      similarity: combinedSimilarity
    };
  });
  
  // Sort by similarity and return top K results
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
    .map(item => item.animation);
} 