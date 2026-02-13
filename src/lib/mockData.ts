// Mock Data for Reddit Performance Console
// Structured to be replaced by real API data without component redesign

export interface Account {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface KPIData {
  totalTraffic: number;
  totalConversions: number;
  revenue: number;
  blendedROAS: number;
  karmaGrowth: number;
  previousPeriod: {
    totalTraffic: number;
    totalConversions: number;
    revenue: number;
    blendedROAS: number;
    karmaGrowth: number;
  };
}

export interface TimeSeriesPoint {
  date: string;
  activity: number;
  traffic: number;
  conversions: number;
}

export interface OrganicAccountMetrics {
  account: string;
  posts: number;
  avgPostScore: number;
  repliesPerPost: number;
  engagementRate: number;
}

export interface KarmaDataPoint {
  date: string;
  [account: string]: string | number;
}

export interface PostsPerWeekData {
  week: string;
  [account: string]: string | number;
}

export interface TrafficDataPoint {
  date: string;
  redditReferrals: number;
  directTrafficLift: number;
}

export interface CampaignData {
  campaignName: string;
  spend: number;
  ctr: number;
  conversions: number;
  cpa: number;
  roas: number;
  revenue: number;
}

export interface PaidKPIs {
  spend: number;
  budget: number;
  ctr: number;
  cpc: number;
  cpm: number;
  cpa: number;
  roas: number;
  impressions: number;
  totalConversions: number;
  totalRevenue: number;
}

export interface SpendConversionPoint {
  date: string;
  spend: number;
  budget: number;
  conversions: number;
  impressions: number;
}

export interface WeeklySpendData {
  week: string;
  spend: number;
  budget: number;
  pacing: number;
}

export interface BrandMentionPoint {
  date: string;
  mentions: number;
}

export interface SentimentPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface SubredditMentions {
  subreddit: string;
  mentions: number;
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
}

export interface AccountTableRow {
  accountName: string;
  postsPerWeek: number;
  karmaVelocity: number;
  engagementRate: number;
  attributedConversions: number;
  attributedRevenue: number;
  karmaTrend: number[];
}

// Competitive Share of Voice
export interface ShareOfVoiceData {
  brand: string;
  mentions: number;
  sharePercent: number;
  sentimentScore: number;
}

export const mockShareOfVoice: ShareOfVoiceData[] = [
  { brand: "Your Brand", mentions: 872, sharePercent: 38.2, sentimentScore: 72 },
  { brand: "Competitor A", mentions: 624, sharePercent: 27.3, sentimentScore: 61 },
  { brand: "Competitor B", mentions: 412, sharePercent: 18.0, sentimentScore: 55 },
  { brand: "Competitor C", mentions: 376, sharePercent: 16.5, sentimentScore: 48 },
];

export interface ShareOfVoiceTrend {
  date: string;
  "Your Brand": number;
  "Competitor A": number;
  "Competitor B": number;
  "Competitor C": number;
}

export const mockSOVTrend: ShareOfVoiceTrend[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split("T")[0],
    "Your Brand": Math.floor(25 + Math.random() * 12 + (i > 20 ? 5 : 0)),
    "Competitor A": Math.floor(18 + Math.random() * 10),
    "Competitor B": Math.floor(10 + Math.random() * 8),
    "Competitor C": Math.floor(8 + Math.random() * 7),
  };
});

// Mock Accounts
export const mockAccounts: Account[] = [
  { id: "1", name: "u/OfficialBrand" },
  { id: "2", name: "u/ProductUpdates" },
  { id: "3", name: "u/CommunityManager" },
  { id: "4", name: "u/TechSupport" },
];

// Overview KPIs
export const mockKPIs: KPIData = {
  totalTraffic: 127432,
  totalConversions: 3847,
  revenue: 284930,
  blendedROAS: 4.2,
  karmaGrowth: 15420,
  previousPeriod: {
    totalTraffic: 112340,
    totalConversions: 3421,
    revenue: 241200,
    blendedROAS: 3.8,
    karmaGrowth: 12800,
  },
};

// Time series for Overview chart
export const mockTimeSeriesData: TimeSeriesPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split("T")[0],
    activity: Math.floor(80 + Math.random() * 40 + i * 1.5),
    traffic: Math.floor(3500 + Math.random() * 1500 + i * 50),
    conversions: Math.floor(100 + Math.random() * 50 + i * 3),
  };
});

// Organic Tab Data
export const mockOrganicMetrics: OrganicAccountMetrics[] = [
  { account: "u/OfficialBrand", posts: 24, avgPostScore: 847, repliesPerPost: 32, engagementRate: 4.2 },
  { account: "u/ProductUpdates", posts: 18, avgPostScore: 623, repliesPerPost: 28, engagementRate: 3.8 },
  { account: "u/CommunityManager", posts: 45, avgPostScore: 412, repliesPerPost: 56, engagementRate: 5.1 },
  { account: "u/TechSupport", posts: 67, avgPostScore: 234, repliesPerPost: 42, engagementRate: 6.3 },
];

export const mockKarmaData: KarmaDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split("T")[0],
    "u/OfficialBrand": 45000 + i * 180 + Math.floor(Math.random() * 100),
    "u/ProductUpdates": 32000 + i * 120 + Math.floor(Math.random() * 80),
    "u/CommunityManager": 28000 + i * 200 + Math.floor(Math.random() * 120),
    "u/TechSupport": 18000 + i * 80 + Math.floor(Math.random() * 50),
  };
});

export const mockPostsPerWeek: PostsPerWeekData[] = [
  { week: "Week 1", "u/OfficialBrand": 5, "u/ProductUpdates": 4, "u/CommunityManager": 12, "u/TechSupport": 18 },
  { week: "Week 2", "u/OfficialBrand": 7, "u/ProductUpdates": 5, "u/CommunityManager": 10, "u/TechSupport": 15 },
  { week: "Week 3", "u/OfficialBrand": 6, "u/ProductUpdates": 4, "u/CommunityManager": 11, "u/TechSupport": 17 },
  { week: "Week 4", "u/OfficialBrand": 6, "u/ProductUpdates": 5, "u/CommunityManager": 12, "u/TechSupport": 17 },
];

export const mockTrafficData: TrafficDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split("T")[0],
    redditReferrals: Math.floor(2000 + Math.random() * 800 + i * 30),
    directTrafficLift: Math.floor(500 + Math.random() * 300 + i * 15),
  };
});

// Paid Ads Tab Data
export const mockPaidKPIs: PaidKPIs = {
  spend: 67840,
  budget: 85000,
  ctr: 2.34,
  cpc: 1.87,
  cpm: 12.40,
  cpa: 17.64,
  roas: 4.2,
  impressions: 5471000,
  totalConversions: 3847,
  totalRevenue: 284930,
};

export const mockSpendConversions: SpendConversionPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const dailyBudget = 2833;
  return {
    date: date.toISOString().split("T")[0],
    spend: Math.floor(1800 + Math.random() * 600 + (i % 7 === 0 ? 500 : 0)),
    budget: dailyBudget,
    conversions: Math.floor(90 + Math.random() * 40 + i * 1.5),
    impressions: Math.floor(150000 + Math.random() * 60000 + i * 3000),
  };
});

export const mockWeeklySpend: WeeklySpendData[] = [
  { week: "Week 1", spend: 15200, budget: 21250, pacing: 71.5 },
  { week: "Week 2", spend: 18400, budget: 21250, pacing: 86.6 },
  { week: "Week 3", spend: 17800, budget: 21250, pacing: 83.8 },
  { week: "Week 4", spend: 16440, budget: 21250, pacing: 77.4 },
];

export const mockCampaigns: CampaignData[] = [
  { campaignName: "Brand Awareness Q1", spend: 18500, ctr: 2.1, conversions: 847, cpa: 21.84, roas: 3.8, revenue: 70300 },
  { campaignName: "Product Launch Feb", spend: 24200, ctr: 2.8, conversions: 1423, cpa: 17.01, roas: 4.7, revenue: 113740 },
  { campaignName: "Retargeting - Engaged", spend: 12400, ctr: 3.2, conversions: 892, cpa: 13.90, roas: 5.2, revenue: 64480 },
  { campaignName: "Subreddit Targeting", spend: 8740, ctr: 1.9, conversions: 412, cpa: 21.21, roas: 3.4, revenue: 29716 },
  { campaignName: "Competitor Keywords", spend: 4000, ctr: 1.4, conversions: 273, cpa: 14.65, roas: 4.9, revenue: 19600 },
];

// Brand Monitoring Tab Data
export const mockBrandMentions: BrandMentionPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const spike = i === 18 || i === 19 ? 80 : 0;
  return {
    date: date.toISOString().split("T")[0],
    mentions: Math.floor(40 + Math.random() * 30 + spike),
  };
});

export const mockSentimentData: SentimentPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const negSpike = i >= 18 && i <= 20 ? 15 : 0;
  return {
    date: date.toISOString().split("T")[0],
    positive: Math.floor(25 + Math.random() * 10 - negSpike / 2),
    neutral: Math.floor(15 + Math.random() * 8),
    negative: Math.floor(5 + Math.random() * 5 + negSpike),
  };
});

export const mockSubredditMentions: SubredditMentions[] = [
  { subreddit: "r/technology", mentions: 342, positivePercent: 62, neutralPercent: 28, negativePercent: 10 },
  { subreddit: "r/startups", mentions: 187, positivePercent: 71, neutralPercent: 22, negativePercent: 7 },
  { subreddit: "r/SaaS", mentions: 156, positivePercent: 58, neutralPercent: 30, negativePercent: 12 },
  { subreddit: "r/marketing", mentions: 98, positivePercent: 45, neutralPercent: 35, negativePercent: 20 },
  { subreddit: "r/Entrepreneur", mentions: 89, positivePercent: 67, neutralPercent: 25, negativePercent: 8 },
];

// Organic Tab - Karma per account KPIs
export interface OrganicKarmaKPI {
  account: string;
  totalKarma: number;
  postKarma: number;
  commentKarma: number;
  karmaVelocity: number;
}

export const mockOrganicKarmaKPIs: OrganicKarmaKPI[] = [
  { account: "u/OfficialBrand", totalKarma: 50400, postKarma: 32100, commentKarma: 18300, karmaVelocity: 1260 },
  { account: "u/ProductUpdates", totalKarma: 35600, postKarma: 24800, commentKarma: 10800, karmaVelocity: 890 },
  { account: "u/CommunityManager", totalKarma: 34000, postKarma: 18200, commentKarma: 15800, karmaVelocity: 1450 },
  { account: "u/TechSupport", totalKarma: 20400, postKarma: 8600, commentKarma: 11800, karmaVelocity: 620 },
];

// Organic Tab - Post scores & upvotes
export interface PostScoreData {
  account: string;
  totalUpvotes: number;
  avgPostScore: number;
  topPostScore: number;
  upvoteRatio: number;
}

export const mockPostScores: PostScoreData[] = [
  { account: "u/OfficialBrand", totalUpvotes: 20328, avgPostScore: 847, topPostScore: 3420, upvoteRatio: 0.94 },
  { account: "u/ProductUpdates", totalUpvotes: 11214, avgPostScore: 623, topPostScore: 2180, upvoteRatio: 0.91 },
  { account: "u/CommunityManager", totalUpvotes: 18540, avgPostScore: 412, topPostScore: 1870, upvoteRatio: 0.88 },
  { account: "u/TechSupport", totalUpvotes: 15678, avgPostScore: 234, topPostScore: 980, upvoteRatio: 0.86 },
];

// Organic Tab - Traffic Attribution
export interface TrafficAttributionData {
  account: string;
  ga4Referrals: number;
  directTrafficLift: number;
  goalCompletions: number;
  attributedRevenue: number;
}

export const mockTrafficAttribution: TrafficAttributionData[] = [
  { account: "u/OfficialBrand", ga4Referrals: 42800, directTrafficLift: 12400, goalCompletions: 1847, attributedRevenue: 142300 },
  { account: "u/ProductUpdates", ga4Referrals: 31200, directTrafficLift: 8900, goalCompletions: 1123, attributedRevenue: 86200 },
  { account: "u/CommunityManager", ga4Referrals: 18600, directTrafficLift: 5200, goalCompletions: 612, attributedRevenue: 38900 },
  { account: "u/TechSupport", ga4Referrals: 9400, directTrafficLift: 3100, goalCompletions: 265, attributedRevenue: 17530 },
];

// Goal completions over time
export interface GoalCompletionPoint {
  date: string;
  goalCompletions: number;
  revenueAttributed: number;
}

export const mockGoalCompletions: GoalCompletionPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split("T")[0],
    goalCompletions: Math.floor(80 + Math.random() * 50 + i * 2),
    revenueAttributed: Math.floor(6000 + Math.random() * 3000 + i * 150),
  };
});

// Per-Account Tab Data
export const mockAccountTable: AccountTableRow[] = [
  {
    accountName: "u/OfficialBrand",
    postsPerWeek: 6.0,
    karmaVelocity: 1260,
    engagementRate: 4.2,
    attributedConversions: 1847,
    attributedRevenue: 142300,
    karmaTrend: [42, 45, 43, 48, 52, 55, 58, 61],
  },
  {
    accountName: "u/ProductUpdates",
    postsPerWeek: 4.5,
    karmaVelocity: 890,
    engagementRate: 3.8,
    attributedConversions: 1123,
    attributedRevenue: 86200,
    karmaTrend: [30, 32, 31, 34, 35, 38, 40, 42],
  },
  {
    accountName: "u/CommunityManager",
    postsPerWeek: 11.3,
    karmaVelocity: 1450,
    engagementRate: 5.1,
    attributedConversions: 612,
    attributedRevenue: 38900,
    karmaTrend: [25, 28, 32, 35, 38, 42, 45, 50],
  },
  {
    accountName: "u/TechSupport",
    postsPerWeek: 16.8,
    karmaVelocity: 620,
    engagementRate: 6.3,
    attributedConversions: 265,
    attributedRevenue: 17530,
    karmaTrend: [15, 16, 17, 17, 18, 19, 20, 21],
  },
];

// Helper function to calculate percentage change
export function calculateChange(current: number, previous: number): { value: number; isPositive: boolean } {
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(change),
    isPositive: change >= 0,
  };
}

// Helper to format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Helper to format numbers with K/M suffixes
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value.toLocaleString();
}

// Helper to format percentage
export function formatPercent(value: number): string {
  return value.toFixed(1) + "%";
}
