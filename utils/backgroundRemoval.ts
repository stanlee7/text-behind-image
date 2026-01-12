import { removeBackground } from '@imgly/background-removal';

export default class BackgroundRemover {
  /**
   * Removes the background from an image using @imgly/background-removal on the client side.
   * @param imageSource File object or URL string of the image
   * @returns Promise resolving to the blob URL of the image with background removed
   */
  static async removeBackground(imageSource: string | File): Promise<string | null> {
    try {
      // The library accepts Blob, File, or URL string directly.
      // It returns a Blob.
      const blob = await removeBackground(imageSource);

      // Create a local URL for the blob
      const url = URL.createObjectURL(blob);
      return url;
    } catch (error) {
      console.error("Background removal error:", error);
      throw error;
    }
  }
}
