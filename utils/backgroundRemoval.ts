import { pipeline, env, RawImage } from '@xenova/transformers';

// Configuration for Client-side inference
env.allowLocalModels = false;
env.useBrowserCache = true;

export default class BackgroundRemover {
  static instance: any = null;

  static async getInstance() {
    if (!this.instance) {
      this.instance = await pipeline('image-segmentation', 'briaai/RMBG-1.4', {
        quantized: true,
      });
    }
    return this.instance;
  }

  static async removeBackground(imageSource: string | File): Promise<string | null> {
    try {
      const segmenter = await BackgroundRemover.getInstance();

      let input: any;
      if (imageSource instanceof File) {
        input = await RawImage.fromBlob(imageSource);
      } else if (typeof imageSource === 'string') {
        input = await RawImage.fromURL(imageSource);
      }

      // Run inference
      // result is usually array of { score: number, label: string, mask: RawImage }
      const result = await segmenter(input);

      // For briaai/RMBG-1.4 in image-segmentation pipeline, 
      // it typically processes the image and returns a mask or the processed image.
      // However, specifically with transformers.js image-segmentation, it returns a mask.
      // We need to verify the output format. 
      // Usually it's: [{ mask: RawImage, ... }]
      // But RMBG models are often treated as 'foreground' class segmentation.

      // Assuming result[0].mask is the foreground mask.
      if (result && result.length > 0 && result[0].mask) {
        const mask = result[0].mask;

        // Create a canvas to apply the mask
        const canvas = document.createElement('canvas');
        canvas.width = input.width;
        canvas.height = input.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not get canvas context");

        // Draw original image
        ctx.drawImage(input.toCanvas(), 0, 0);

        // Update composition operation to mask
        ctx.globalCompositeOperation = 'destination-in';

        // Draw mask
        ctx.drawImage(mask.toCanvas(), 0, 0);

        // Return as URL
        return canvas.toDataURL('image/png');
      }

      // If the model output is different (some custom models return the image directly in other pipelines),
      // we might need to adjust. But standard segmentation pipeline returns masks.
      // Fallback or error if structure is unexpected
      console.warn("Unexpected result format from segmenter:", result);
      return null;

    } catch (error) {
      console.error("Background removal service error:", error);
      throw error;
    }
  }
}
