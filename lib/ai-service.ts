import OpenAI from 'openai';
import { FeedbackAnalysis } from './types';
import crypto from 'crypto';

// Simple in-memory cache
const analysisCache = new Map<string, FeedbackAnalysis>();

export class AIService {
  private client: OpenAI | null = null;
  private mockMode: boolean = false;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    const hasApiKey = apiKey && apiKey.trim() !== '' && apiKey !== 'sk-your-api-key-here';
    
    if (!hasApiKey) {
      console.log('⚠️  OpenAI API key not configured. Running in MOCK mode.');
      this.mockMode = true;
    } else {
      // Allow browser environment for testing
      const isTest = process.env.NODE_ENV === 'test' || typeof window !== 'undefined';
      this.client = new OpenAI({ 
        apiKey: apiKey!,
        ...(isTest ? { dangerouslyAllowBrowser: true } : {})
      });
    }
  }

  async analyzeFeedback(text: string): Promise<FeedbackAnalysis> {
    // Check cache first
    const cacheKey = this.getCacheKey(text);
    const cached = analysisCache.get(cacheKey);
    if (cached) {
      console.log('📦 Cache hit for feedback analysis');
      return cached;
    }

    try {
      const startTime = Date.now();
      let analysis: FeedbackAnalysis;

      if (this.mockMode) {
        analysis = this.generateMockAnalysis(text);
      } else if (this.client) {
        try {
          analysis = await this.callOpenAI(text);
        } catch (apiError: any) {
          // Fallback to mock mode if API fails
          console.warn('⚠️  OpenAI API call failed, falling back to mock mode:', apiError.message);
          this.mockMode = true;
          analysis = this.generateMockAnalysis(text);
        }
      } else {
        throw new Error('AI service not properly initialized');
      }

      const duration = Date.now() - startTime;
      console.log(`🤖 AI analysis completed in ${duration}ms`);

      // Cache the result
      analysisCache.set(cacheKey, analysis);

      return analysis;
    } catch (error) {
      console.error('AI analysis error:', error);
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async callOpenAI(text: string): Promise<FeedbackAnalysis> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized');
    }

    const prompt = `You are a **product feedback analyst**. Your sole function is to analyze the following feedback, focusing only on the product and user experience.

**CRITICAL INSTRUCTION: Redact or anonymize all Personally Identifiable Information (PII)**—such as names, email addresses, phone numbers, location data, or account numbers—from the feedback before generating any output. The analysis should be about the **issue or feature**, not the individual user.

Analyze the following feedback and return **ONLY** a valid JSON object with these exact fields:
{
  "summary": "A brief one-sentence summary of the **core issue or request** from the feedback",
  "sentiment": "positive|neutral|negative",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "priority": "P0|P1|P2|P3",
  "nextAction": "A recommended next action, ensuring all PII is scrubbed or generalized"
}

Priority guidelines:
- P0: Critical issues requiring immediate attention (security, data loss, system down)
- P1: High-priority issues affecting many users
- P2: Medium-priority issues or feature requests
- P3: Low-priority suggestions or nice-to-haves

Tags should be short, relevant nouns (max 5).

Feedback: ${text}

Return ONLY the JSON object, no additional text.`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that returns only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    // Log any available metadata from the OpenAI response (avoid logging user content)
    try {
      const metadata = {
        id: (response as any).id,
        model: (response as any).model,
        object: (response as any).object,
        created: (response as any).created,
        usage: (response as any).usage,
        choices: (response as any).choices?.map((c: any) => ({
          index: c.index,
          finish_reason: c.finish_reason,
          // log message role but not the content to avoid duplicating the response body
          message_role: c.message?.role
        })),
        // include any vendor-specific metadata field if present
        metadata: (response as any).metadata
      };
      console.log('ℹ️ OpenAI response metadata:', metadata);
    } catch (logErr) {
      console.warn('Unable to log OpenAI metadata:', logErr);
    }

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse JSON response
    const parsed = JSON.parse(content);
    
    // Validate the structure
    this.validateAnalysis(parsed);
    
    return parsed as FeedbackAnalysis;
  }

  private validateAnalysis(analysis: any): asserts analysis is FeedbackAnalysis {
    if (!analysis.summary || typeof analysis.summary !== 'string') {
      throw new Error('Invalid analysis: missing or invalid summary');
    }
    if (!['positive', 'neutral', 'negative'].includes(analysis.sentiment)) {
      throw new Error('Invalid analysis: invalid sentiment');
    }
    if (!Array.isArray(analysis.tags)) {
      throw new Error('Invalid analysis: tags must be an array');
    }
    if (!['P0', 'P1', 'P2', 'P3'].includes(analysis.priority)) {
      throw new Error('Invalid analysis: invalid priority');
    }
    if (!analysis.nextAction || typeof analysis.nextAction !== 'string') {
      throw new Error('Invalid analysis: missing or invalid nextAction');
    }
  }

  private generateMockAnalysis(text: string): FeedbackAnalysis {
    // Deterministic mock based on text hash
    const hash = crypto.createHash('md5').update(text).digest('hex');
    const hashNum = parseInt(hash.substring(0, 8), 16);

    const sentiments: ('positive' | 'neutral' | 'negative')[] = ['positive', 'neutral', 'negative'];
    const priorities: ('P0' | 'P1' | 'P2' | 'P3')[] = ['P0', 'P1', 'P2', 'P3'];
    const allTags = ['usability', 'performance', 'bug', 'feature', 'ui', 'api', 'mobile', 'desktop', 'security', 'integration'];

    const sentiment = sentiments[hashNum % sentiments.length];
    const priority = priorities[hashNum % priorities.length];
    const selectedTags = allTags
      .sort(() => Math.random() - 0.5)
      .slice(0, 3 + (hashNum % 3));

    const summaries = [
      `User feedback regarding ${sentiment} experience with the product`,
      `Feedback about ${selectedTags[0]} and ${selectedTags[1]} aspects`,
      `User has concerns about ${priority} priority issues`,
    ];

    const nextActions = [
      'Review with product team',
      'Schedule user interview',
      'Add to sprint backlog',
      'Escalate to engineering',
      'Collect more data',
    ];

    return {
      summary: summaries[hashNum % summaries.length],
      sentiment,
      tags: selectedTags,
      priority,
      nextAction: nextActions[hashNum % nextActions.length],
    };
  }

  private getCacheKey(text: string): string {
    return crypto.createHash('md5').update(text.toLowerCase().trim()).digest('hex');
  }

  // Clear cache (useful for testing)
  clearCache(): void {
    analysisCache.clear();
  }
}

export const aiService = new AIService();

