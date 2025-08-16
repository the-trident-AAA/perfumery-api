import { Injectable } from '@nestjs/common';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AssetsService {
  private readonly assetsPath = this.getAssetsPath();

  /**
   * Gets the correct assets path for both development and production
   * @returns Path to the assets directory
   */
  private getAssetsPath(): string {
    // Try multiple possible paths
    const possiblePaths = [
      join(__dirname, 'images'), // Production: dist/assets/images
      join(__dirname, '..', 'assets', 'images'), // Development: src/assets/images
      join(process.cwd(), 'src', 'assets', 'images'), // Alternative development path
      join(process.cwd(), 'dist', 'assets', 'images'), // Alternative production path
    ];

    for (const path of possiblePaths) {
      if (existsSync(path)) {
        return path;
      }
    }

    // Fallback to development path
    return join(__dirname, '..', 'assets', 'images');
  }

  /**
   * Converts an image file to Base64 string
   * @param filename - The name of the image file in the assets/images folder
   * @returns Base64 string of the image
   */
  getImageAsBase64(filename: string): string {
    try {
      const imagePath = join(this.assetsPath, filename);
      
      // Check if file exists
      if (!existsSync(imagePath)) {
        console.error(`Image file not found: ${imagePath}`);
        console.log(`Available paths checked: ${this.assetsPath}`);
        return '';
      }
      
      const imageBuffer = readFileSync(imagePath);
      const base64String = imageBuffer.toString('base64');
      
      // Determine file extension
      const extension = filename.split('.').pop()?.toLowerCase();
      const mimeType = this.getMimeType(extension);
      
      return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
      console.error(`Error reading image file ${filename}:`, error);
      console.log(`Assets path: ${this.assetsPath}`);
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
   * Gets the logo URL for email templates
   * @returns URL string of the logo
   */
  getLogoUrl(): string {
    // Use your server's URL - replace with your actual domain
    const baseUrl = process.env.API_URL || 'http://localhost:4000';
    return `${baseUrl}/assets/images/logo.png`;
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
