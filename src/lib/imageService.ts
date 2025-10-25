import { GoogleGenAI } from '@google/genai';

export class ImageService {
  private static readonly API_KEY = process.env.GOOGLE_IMAGEN_API_KEY;

  static async generateImage(prompt: string): Promise<string> {
    if (!this.API_KEY) {
      throw new Error('Google Imagen API key not configured');
    }

    try {
      // Initialize the Google Generative AI client
      const genAI = new GoogleGenAI({ apiKey: this.API_KEY });

      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: prompt
      });

      console.log('Image response:', response.candidates?.[0]?.content);

      const imageData = response.candidates?.[0]?.content?.parts?.[1];

      if (!imageData || !('inlineData' in imageData) || !imageData.inlineData) {
        throw new Error('No image data received from Imagen API');
      }

      // Return the base64 encoded image data
      return imageData.inlineData.data!;
    } catch (error) {
      console.error('Error generating image with official library:', error);
      throw error;
    }
  }
}
