import { OCRResult } from '../types';

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

/**
 * OCR Service for scanning wine labels
 * Uploads image to backend which processes it using Google Vision API
 */
class OCRService {
  /**
   * Upload image to backend OCR endpoint
   * @param imageUri - Local URI of the captured image
   * @returns OCR result with extracted wine information
   */
  async scanLabel(imageUri: string): Promise<OCRResult> {
    try {
      // Create form data with image
      const formData = new FormData();

      // Extract filename from URI
      const filename = imageUri.split('/').pop() || 'label.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      // Append image to form data
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      // Send to backend OCR endpoint
      const response = await fetch(`${API_BASE_URL}/ocr/scan-label`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'OCR processing failed');
      }

      const result = await response.json();

      return {
        success: true,
        data: {
          wineName: result.wineName,
          producer: result.producer,
          vintage: result.vintage,
          region: result.region,
          grapeVarietals: result.grapeVarietals || [],
          alcoholPercentage: result.alcoholPercentage,
          address: result.address,
          rawText: result.rawText,
        },
      };
    } catch (error) {
      console.error('OCR scan error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to scan label',
      };
    }
  }

  /**
   * Parse extracted text to find wine information
   * This is a client-side fallback if the backend OCR fails
   * @param text - Raw text extracted from image
   * @returns Parsed wine information
   */
  parseWineInfo(text: string): OCRResult['data'] {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

    const result: OCRResult['data'] = {
      rawText: text,
    };

    // Extract vintage (4-digit year between 1900 and current year + 1)
    const vintageMatch = text.match(/\b(19\d{2}|20[0-2]\d)\b/);
    if (vintageMatch) {
      result.vintage = parseInt(vintageMatch[1], 10);
    }

    // Extract alcohol percentage (format: XX% or XX.X%)
    const alcoholMatch = text.match(/(\d{1,2}(?:\.\d)?)\s*%/);
    if (alcoholMatch) {
      result.alcoholPercentage = parseFloat(alcoholMatch[1]);
    }

    // Extract grape varietals (common ones)
    const grapeVarietals: string[] = [];
    const commonGrapes = [
      'chardonnay', 'pinot noir', 'pinot gris', 'riesling', 'cabernet sauvignon',
      'merlot', 'syrah', 'grenache', 'chenin blanc', 'sauvignon blanc',
      'gamay', 'cabernet franc', 'tempranillo', 'nebbiolo', 'sangiovese',
      'viognier', 'gewurztraminer', 'muscat', 'semillon', 'pinot blanc'
    ];

    const lowerText = text.toLowerCase();
    commonGrapes.forEach(grape => {
      if (lowerText.includes(grape)) {
        grapeVarietals.push(grape);
      }
    });

    if (grapeVarietals.length > 0) {
      result.grapeVarietals = grapeVarietals;
    }

    // First few lines often contain wine name and producer
    if (lines.length > 0) {
      result.wineName = lines[0];
    }
    if (lines.length > 1) {
      result.producer = lines[1];
    }

    return result;
  }

  /**
   * Upload photos for a check-in
   * @param photos - Array of local image URIs
   * @param checkInId - Optional check-in ID if uploading to existing check-in
   * @returns Array of uploaded photo URLs
   */
  async uploadPhotos(
    photos: string[],
    checkInId?: string
  ): Promise<string[]> {
    try {
      const uploadedUrls: string[] = [];

      for (const photoUri of photos) {
        const formData = new FormData();

        const filename = photoUri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('image', {
          uri: photoUri,
          name: filename,
          type,
        } as any);

        if (checkInId) {
          formData.append('checkInId', checkInId);
        }

        const response = await fetch(`${API_BASE_URL}/upload/photo`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!response.ok) {
          console.error('Failed to upload photo:', photoUri);
          continue;
        }

        const result = await response.json();
        if (result.url) {
          uploadedUrls.push(result.url);
        }
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Photo upload error:', error);
      return [];
    }
  }
}

export default new OCRService();
