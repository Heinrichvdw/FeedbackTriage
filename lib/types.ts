export interface FeedbackAnalysis {
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  tags: string[];
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  nextAction: string;
}

export interface Feedback {
  id: number;
  text: string;
  email?: string;
  createdAt: Date;
  analysis: FeedbackAnalysis;
}

export interface CreateFeedbackInput {
  text: string;
  email?: string;
}

export interface FeedbackFilters {
  sentiment?: 'positive' | 'neutral' | 'negative';
  tag?: string;
  page?: number;
  pageSize?: number;
}

