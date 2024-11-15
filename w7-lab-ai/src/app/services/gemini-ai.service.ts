import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeminiAiService {
  private readonly MODEL_NAME = 'models/gemini-1.5-flash';

  async getImageAsBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to fetch the image');
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error('Failed to convert image to base64: ' + (error as Error).message);
    }
  }

  async generateRecipe(imageBase64: string, prompt: string): Promise<string> {
    try {
      const aiClient = new GoogleGenerativeAI(environment.googleApiKey);
      const response = await aiClient.generateText({
        model: this.MODEL_NAME,
        prompt: `${prompt}\nImage: ${imageBase64}`,
        temperature: 0.7,
        maxOutputTokens: 200,
      });
      return response.candidates?.[0]?.text || 'No response generated';
    } catch (error) {
      throw new Error('Failed to generate recipe: ' + (error as Error).message);
    }
  }
}
