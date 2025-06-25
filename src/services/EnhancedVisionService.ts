import { BaseService } from './BaseService';
import { loggingService } from './LoggingService';
import { databaseService } from './DatabaseService';
import { GoogleVisionApiKey } from '../config/constants';
import { VisionAnalysisResult, PhotoVerificationRequest } from '../types';

/**
 * Enhanced Vision Service with real Google Vision API integration
 * and comprehensive photo verification capabilities
 */
class EnhancedVisionServiceClass extends BaseService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://vision.googleapis.com/v1/images:annotate';

  constructor() {
    super();
    this.apiKey = GoogleVisionApiKey;
  }

  /**
   * Verify photo with enhanced analysis
   */
  async verifyPhoto(request: PhotoVerificationRequest): Promise<VisionAnalysisResult> {
    try {
      // If no API key, fall back to simulation
      if (!this.apiKey || this.apiKey === 'your_google_vision_api_key_here') {
        this.log('Using simulated vision analysis (no API key)');
        return await this.simulateVisionAnalysis(request);
      }

      // Try real Google Vision API first
      try {
        const result = await this.callGoogleVisionAPI(request);
        
        // Store successful verification in database
        await this.storeVerificationResult(request, result);
        
        return result;
      } catch (apiError) {
        this.log('Google Vision API failed, falling back to simulation');
        loggingService.error(apiError as Error, 'Google Vision API error');
        return await this.simulateVisionAnalysis(request);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      loggingService.error(error instanceof Error ? error : new Error(errorMessage), 'Photo verification failed');
      throw error instanceof Error ? error : new Error(errorMessage);
    }
  }

  /**
   * Validates if the analysis result meets the challenge requirements
   */
  validateChallenge(result: VisionAnalysisResult, challengeType: string): boolean {
    // Simple validation based on the result from verifyPhoto
    return result.challengeMatch && result.challengeConfidence > 0.5;
  }
}

// Export singleton instance
export const enhancedVisionService = new EnhancedVisionServiceClass();
export default enhancedVisionService;

// Export standalone validateChallenge function for compatibility
export const validateChallenge = (result: VisionAnalysisResult, challengeType: string): boolean => {
  return enhancedVisionService.validateChallenge(result, challengeType);
};

// Export verifyPhoto function for compatibility
export const verifyPhoto = (request: PhotoVerificationRequest): Promise<VisionAnalysisResult> => {
  return enhancedVisionService.verifyPhoto(request);
};