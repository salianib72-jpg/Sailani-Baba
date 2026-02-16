
export interface VideoData {
  originalTitle: string;
  optimizedTitle: string;
  description: string;
  hashtags: string[];
  viralityScore: number;
  viralityAnalysis: string;
  thumbnailUrl?: string;
}

export interface GenerationStatus {
  loading: boolean;
  message: string;
  error?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  coins: number;
  popular?: boolean;
}
