import { removeBackground } from '@imgly/background-removal';

export type ProgressCallback = (key: string, current: number, total: number) => void;

export default class BackgroundRemover {
  /**
   * Removes the background from an image using @imgly/background-removal on the client side.
   * @param imageSource File object or URL string of the image
   * @param onProgress Optional callback reporting model download / inference progress
   * @returns Promise resolving to the blob URL of the image with background removed
   */
  static async removeBackground(
    imageSource: string | File,
    onProgress?: ProgressCallback
  ): Promise<string | null> {
    try {
      const blob = await removeBackground(imageSource, {
        progress: onProgress,
      });

      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Background removal error:', error);
      throw error;
    }
  }
}
