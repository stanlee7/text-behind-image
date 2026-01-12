
export default class BackgroundRemover {
  static async removeBackground(imageSource: string | File): Promise<string | null> {
    try {
      let file: File;

      if (typeof imageSource === 'string') {
        // If string (URL), convert to Blob/File (this case might be rare now if we pass File directly)
        const response = await fetch(imageSource);
        const blob = await response.blob();
        file = new File([blob], "image.png", { type: "image/png" });
      } else {
        file = imageSource;
      }

      const formData = new FormData();
      formData.append('file', file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log("BackgroundRemoval: Using API URL:", apiUrl);

      try {
        const response = await fetch(`${apiUrl}/remove-bg`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Backend error (${response.status}): ${response.statusText}. Check API URL: ${apiUrl}`);
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } catch (fetchError) {
        console.error("Background removal request failed:", fetchError);
        throw fetchError; // Re-throw to be caught by the caller
      }

    } catch (error) {
      console.error("Background removal service error:", error);
      return null;
    }
  }
}
