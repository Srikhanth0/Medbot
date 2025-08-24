import { AnimationData } from './LoadAnimations';

export function buildGeminiPrompt(animationData: AnimationData[], userInput: string): string {
  return `You are an animation assistant. Based on the following available animations, choose the one that best matches the user's request. 

Return only the "file" field of the most relevant animation. Do not include any other text or explanation.

Available Animations:
${JSON.stringify(animationData, null, 2)}

User request: "${userInput}"

Response (file name only):`;
}

export function buildStructuredGeminiPrompt(
  userInput: string, 
  matchedAnimation: AnimationData
): string {
  return `You are a fitness assistant. Given the user's input and the matched animation from the database, respond in two sentences or less. End with the animation file name in quotes.

User: ${userInput}
Matched animation description: ${matchedAnimation.description}
Animation file: "${matchedAnimation.file}"

Response:`;
}