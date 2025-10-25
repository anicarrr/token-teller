import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class SupabaseStorageService {
  private static readonly BUCKET_NAME = 'assets';

  static async uploadImage(
    imageBase64: string, 
    fileName: string,
    contentType: string = 'image/png'
  ): Promise<string> {
    try {
      // Convert base64 to buffer
      const imageBuffer = Buffer.from(imageBase64, 'base64');
      
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const uniqueFileName = `public/${timestamp}-${fileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(uniqueFileName, imageBuffer, {
          contentType,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(uniqueFileName);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image to Supabase:', error);
      throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async deleteImage(fileName: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([fileName]);

      if (error) {
        console.error('Supabase delete error:', error);
        throw new Error(`Failed to delete image: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting image from Supabase:', error);
      throw new Error(`Image deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async listImages(folder: string = 'fortune-images'): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(folder);

      if (error) {
        console.error('Supabase list error:', error);
        throw new Error(`Failed to list images: ${error.message}`);
      }

      return data?.map(file => file.name) || [];
    } catch (error) {
      console.error('Error listing images from Supabase:', error);
      throw new Error(`Image listing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static generateFileName(prompt: string): string {
    // Create a safe filename from the prompt
    const safePrompt = prompt
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    return `${safePrompt}.png`;
  }
}