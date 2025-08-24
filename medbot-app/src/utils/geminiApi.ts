// Gemini API utility functions for MEDBOT app

const GEMINI_API_BASE_URL = 'http://localhost:3001';

export interface GeminiResponse {
  reply: string;
  error?: string;
}

export interface HealthResponse {
  status: string;
  message: string;
}

/**
 * Check if the Gemini API server is running
 */
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${GEMINI_API_BASE_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

/**
 * Send a message to Gemini AI and get a response
 */
export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const response = await fetch(`${GEMINI_API_BASE_URL}/api/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data.reply || 'No response from AI';
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to get response from AI. Please try again.');
  }
};

/**
 * Send a health-related message to Gemini with context
 */
export const askHealthQuestion = async (question: string): Promise<string> => {
  const healthContext = `You are a medical AI assistant. Please provide helpful, informative responses about health topics. Always remind users to consult healthcare professionals for medical advice. User question: ${question}`;
  
  return sendMessageToGemini(healthContext);
};

/**
 * Get AI assistance for exercise recommendations
 */
export const getExerciseAdvice = async (userInfo: string): Promise<string> => {
  const exercisePrompt = `As a fitness AI assistant, provide personalized exercise recommendations based on this user information: ${userInfo}. Include safety tips and remind users to consult professionals if needed.`;
  
  return sendMessageToGemini(exercisePrompt);
};

/**
 * Get AI assistance for nutrition advice
 */
export const getNutritionAdvice = async (dietaryInfo: string): Promise<string> => {
  const nutritionPrompt = `As a nutrition AI assistant, provide helpful dietary advice based on this information: ${dietaryInfo}. Include general recommendations and remind users to consult nutritionists for personalized advice.`;
  
  return sendMessageToGemini(nutritionPrompt);
};

/**
 * Get AI assistance for mental health support
 */
export const getMentalHealthSupport = async (concern: string): Promise<string> => {
  const mentalHealthPrompt = `As a mental health AI assistant, provide supportive and helpful responses for this concern: ${concern}. Always encourage professional help when appropriate and provide general wellness tips.`;
  
  return sendMessageToGemini(mentalHealthPrompt);
}; 