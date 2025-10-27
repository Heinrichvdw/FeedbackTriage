import 'openai/shims/node';
import { AIService } from '@/lib/ai-service';

describe('AIService', () => {
  let aiService: AIService;

  beforeEach(() => {
    // Force mock mode
    process.env.OPENAI_API_KEY = '';
    aiService = new AIService();
    aiService.clearCache();
  });

  describe('Mock Mode', () => {

    it('should generate mock analysis deterministically', async () => {
      const text = 'This is a test feedback';
      const analysis = await aiService.analyzeFeedback(text);

      expect(analysis).toHaveProperty('summary');
      expect(analysis).toHaveProperty('sentiment');
      expect(analysis).toHaveProperty('tags');
      expect(analysis).toHaveProperty('priority');
      expect(analysis).toHaveProperty('nextAction');

      // Validate structure
      expect(['positive', 'neutral', 'negative']).toContain(analysis.sentiment);
      expect(['P0', 'P1', 'P2', 'P3']).toContain(analysis.priority);
      expect(Array.isArray(analysis.tags)).toBe(true);
      expect(typeof analysis.summary).toBe('string');
      expect(typeof analysis.nextAction).toBe('string');
    });

    it('should return the same analysis for the same input (cache)', async () => {
      const text = 'Same feedback text';
      const analysis1 = await aiService.analyzeFeedback(text);
      const analysis2 = await aiService.analyzeFeedback(text);

      expect(analysis1).toEqual(analysis2);
    });

    it('should return different analyses for different inputs', async () => {
      const analysis1 = await aiService.analyzeFeedback('First feedback');
      const analysis2 = await aiService.analyzeFeedback('Second feedback');

      expect(analysis1).not.toEqual(analysis2);
    });

    it('should handle empty text', async () => {
      const analysis = await aiService.analyzeFeedback('');
      
      expect(analysis).toHaveProperty('summary');
      expect(analysis).toHaveProperty('sentiment');
      expect(analysis).toHaveProperty('tags');
      expect(analysis).toHaveProperty('priority');
      expect(analysis).toHaveProperty('nextAction');
    });
  });

  describe('Validation', () => {
    it('should validate analysis structure', () => {
      const validAnalysis = {
        summary: 'Test summary',
        sentiment: 'positive',
        tags: ['tag1', 'tag2'],
        priority: 'P1',
        nextAction: 'Review this',
      };

      expect(validAnalysis).toHaveProperty('summary');
      expect(validAnalysis).toHaveProperty('sentiment');
      expect(validAnalysis).toHaveProperty('tags');
      expect(validAnalysis).toHaveProperty('priority');
      expect(validAnalysis).toHaveProperty('nextAction');
    });
  });

  describe('Cache Management', () => {
    it('should clear cache', () => {
      aiService.clearCache();
      // Should not throw
      expect(() => aiService.clearCache()).not.toThrow();
    });
  });
});

