export interface UserProfile {
  name: string;
  capital: number; // 0: <10w, 1: 10-50w, 2: 50-200w, 3: >200w
  riskTolerance: number; // 0: Conservative, 1: Balanced, 2: Aggressive
  experience: number; // Years
}

export interface PlatformMetric {
  id: string;
  name: string; // e.g., 'EastMoney', 'Xueqiu'
  matchRate: number; // 0-100
  accuracyScore: number; // Prediction accuracy based on algorithm
  communityWisdom: number; // Crowd wisdom density
  marketImpact: number; // Market transmission power
  userFit: number; // Personal fit
  description: string;
  recentSignal: 'Buy' | 'Hold' | 'Sell';
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskReport: string; // AI Generated
  platforms: PlatformMetric[];
  generatedImage?: string; // Base64 image
  recentSituation: string; // Summary of recent news
  groundingUrls: Array<{title: string, uri: string}>; // Sources
}

export enum AppView {
  LOGIN,
  PROFILE,
  DASHBOARD,
  PLATFORM_DETAIL
}

export interface KLineData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
}