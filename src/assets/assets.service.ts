import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AssetsService {
  private readonly assetsPath = join(__dirname, 'images');

  /**
   * Converts an image file to Base64 string
   * @param filename - The name of the image file in the assets/images folder
   * @returns Base64 string of the image
   */
  getImageAsBase64(filename: string): string {
    try {
      const imagePath = join(this.assetsPath, filename);
      const imageBuffer = readFileSync(imagePath);
      const base64String = imageBuffer.toString('base64');
      
      // Determine file extension
      const extension = filename.split('.').pop()?.toLowerCase();
      const mimeType = this.getMimeType(extension);
      
      return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
      console.error(`Error reading image file ${filename}:`, error);
      return '';
    }
  }

  /**
   * Gets the logo as Base64 string
   * @returns Base64 string of the logo
   */
  getLogoAsBase64(): string {
    return this.getImageAsBase64('logo.png'); // Adjust filename as needed
  }

  /**
   * Determines MIME type based on file extension
   * @param extension - File extension
   * @returns MIME type string
   */
  private getMimeType(extension?: string): string {
    switch (extension) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'svg':
        return 'image/svg+xml';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/png';
    }
  }
}
