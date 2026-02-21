// Mock Data for Reddit Growth Intelligence System
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
  impressions: number;
  trafficContribution: number;
  deltaConversions: number;
  deltaRevenue: number;
}

export interface ShareOfVoiceData {
  brand: string;
  mentions: number;
  sharePercent: number;
  sentimentScore: number;
}

export interface ShareOfVoiceTrend {
  date: string;
  "Your Brand": number;
  "Competitor A": number;
  "Competitor B": number;
  "Competitor C": number;
}

export interface OrganicKarmaKPI {
  account: string;
  totalKarma: number;
  postKarma: number;
  commentKarma: number;
  karmaVelocity: number;
}

export interface PostScoreData {
  account: string;
  totalUpvotes: number;
  avgPostScore: number;
  topPostScore: number;
  upvoteRatio: number;
}

export interface TrafficAttributionData {
  account: string;
  ga4Referrals: number;
  directTrafficLift: number;
  goalCompletions: number;
  attributedRevenue: number;
}

export interface GoalCompletionPoint {
  date: string;
  goalCompletions: number;
  revenueAttributed: number;
}

// ─── New: Subreddit Tab ──────────────────────────────────────────
export interface SubredditKPIs {
  followers: number;
  followerGrowth: number;
  totalImpressions: number;
  totalEngagement: number;
  postingFrequency: number;
  trafficFromSubreddit: number;
  conversions: number;
  revenue: number;
  previousPeriod: {
    followers: number;
    totalImpressions: number;
    totalEngagement: number;
    trafficFromSubreddit: number;
    conversions: number;
    revenue: number;
  };
}

export interface SubredditGrowthPoint {
  date: string;
  followers: number;
  impressions: number;
  upvotes: number;
  comments: number;
}

export interface SubredditPostData {
  title: string;
  date: string;
  impressions: number;
  upvotes: number;
  comments: number;
  ctr: number;
  traffic: number;
}

// ─── New: SEO / GEO Tab ─────────────────────────────────────────
export interface SEOGEOKPIs {
  llmReferralTraffic: number;
  redditVisibilityIndex: number;
  searchVisibilityScore: number;
  totalLLMSessions: number;
  previousPeriod: {
    llmReferralTraffic: number;
    redditVisibilityIndex: number;
    searchVisibilityScore: number;
    totalLLMSessions: number;
  };
}

export interface LLMReferralPoint {
  date: string;
  chatgpt: number;
  perplexity: number;
  gemini: number;
  other: number;
}

export interface SearchVisibilityPoint {
  date: string;
  redditVisibility: number;
  searchVisibility: number;
}

// ─── New: Creative Intelligence ──────────────────────────────────
export interface CreativeData {
  creativeName: string;
  format: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpa: number;
  conversions: number;
  roas: number;
  spend: number;
  revenue: number;
}

// ─── New: Top Content / Mentions ─────────────────────────────────
export interface TopOrganicPost {
  title: string;
  subreddit: string;
  account: string;
  impressions: number;
  upvotes: number;
  comments: number;
  engagementRate: number;
  trafficDriven: number;
}

export interface TopBrandMention {
  excerpt: string;
  subreddit: string;
  sentiment: "positive" | "negative" | "neutral";
  upvotes: number;
  comments: number;
  date: string;
}

// ─── New: Organic Subreddit Breakdown ────────────────────────────
export interface OrganicSubredditBreakdown {
  subreddit: string;
  impressions: number;
  engagement: number;
  engagementRate: number;
  trafficDriven: number;
  posts: number;
}

// ─── New: Enhanced Attribution ───────────────────────────────────
export interface EnhancedAttributionData {
  directRedditTraffic: number;
  inferredRedditTraffic: number;
  totalAttributedConversions: number;
  totalAttributedRevenue: number;
  revenueInfluencePercent: number;
  ga4Channels: GA4ChannelBreakdown[];
}

export interface GA4ChannelBreakdown {
  channel: string;
  sessions: number;
  conversions: number;
  revenue: number;
}

// ════════════════════════════════════════════════════════════════
// MOCK DATA
// ════════════════════════════════════════════════════════════════

export const mockShareOfVoice: ShareOfVoiceData[] = [
  { brand: "Your Brand", mentions: 872, sharePercent: 38.2, sentimentScore: 72 },
  { brand: "Competitor A", mentions: 624, sharePercent: 27.3, sentimentScore: 61 },
  { brand: "Competitor B", mentions: 412, sharePercent: 18.0, sentimentScore: 55 },
  { brand: "Competitor C", mentions: 376, sharePercent: 16.5, sentimentScore: 48 },
];

export const mockSOVTrend: ShareOfVoiceTrend[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(); date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split("T")[0],
    "Your Brand": Math.floor(25 + Math.random() * 12 + (i > 20 ? 5 : 0)),
    "Competitor A": Math.floor(18 + Math.random() * 10),
    "Competitor B": Math.floor(10 + Math.random() * 8),
    "Competitor C": Math.floor(8 + Math.random() * 7),
  };
});

export const mockAccounts: Account[] = [
  { id: "1", name: "u/OfficialBrand" },
  { id: "2", name: "u/ProductUpdates" },
  { id: "3", name: "u/CommunityManager" },
  { id: "4", name: "u/TechSupport" },
];

export const mockKPIs: KPIData = {
  totalTraffic: 127432, totalConversions: 3847, revenue: 284930, blendedROAS: 4.2, karmaGrowth: 15420,
  previousPeriod: { totalTraffic: 112340, totalConversions: 3421, revenue: 241200, blendedROAS: 3.8, karmaGrowth: 12800 },
};

export const mockTimeSeriesData: TimeSeriesPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(); date.setDate(date.getDate() - (29 - i));
  return { date: date.toISOString().split("T")[0], activity: Math.floor(80 + Math.random() * 40 + i * 1.5), traffic: Math.floor(3500 + Math.random() * 1500 + i * 50), conversions: Math.floor(100 + Math.random() * 50 + i * 3) };
});

export const mockOrganicMetrics: OrganicAccountMetrics[] = [
  { account: "u/OfficialBrand", posts: 24, avgPostScore: 847, repliesPerPost: 32, engagementRate: 4.2 },
  { account: "u/ProductUpdates", posts: 18, avgPostScore: 623, repliesPerPost: 28, engagementRate: 3.8 },
  { account: "u/CommunityManager", posts: 45, avgPostScore: 412, repliesPerPost: 56, engagementRate: 5.1 },
  { account: "u/TechSupport", posts: 67, avgPostScore: 234, repliesPerPost: 42, engagementRate: 6.3 },
];

export const mockKarmaData: KarmaDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(); date.setDate(date.getDate() - (29 - i));
  return { date: date.toISOString().split("T")[0], "u/OfficialBrand": 45000 + i * 180 + Math.floor(Math.random() * 100), "u/ProductUpdates": 32000 + i * 120 + Math.floor(Math.random() * 80), "u/CommunityManager": 28000 + i * 200 + Math.floor(Math.random() * 120), "u/TechSupport": 18000 + i * 80 + Math.floor(Math.random() * 50) };
});

export const mockPostsPerWeek: PostsPerWeekData[] = [
  { week: "Week 1", "u/OfficialBrand": 5, "u/ProductUpdates": 4, "u/CommunityManager": 12, "u/TechSupport": 18 },
  { week: "Week 2", "u/OfficialBrand": 7, "u/ProductUpdates": 5, "u/CommunityManager": 10, "u/TechSupport": 15 },
  { week: "Week 3", "u/OfficialBrand": 6, "u/ProductUpdates": 4, "u/CommunityManager": 11, "u/TechSupport": 17 },
  { week: "Week 4", "u/OfficialBrand": 6, "u/ProductUpdates": 5, "u/CommunityManager": 12, "u/TechSupport": 17 },
];

export const mockTrafficData: TrafficDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(); date.setDate(date.getDate() - (29 - i));
  return { date: date.toISOString().split("T")[0], redditReferrals: Math.floor(2000 + Math.random() * 800 + i * 30), directTrafficLift: Math.floor(500 + Math.random() * 300 + i * 15) };
});

export const mockPaidKPIs: PaidKPIs = {
  spend: 67840, budget: 85000, ctr: 2.34, cpc: 1.87, cpm: 12.40, cpa: 17.64, roas: 4.2, impressions: 5471000, totalConversions: 3847, totalRevenue: 284930,
};

export const mockSpendConversions: SpendConversionPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(); date.setDate(date.getDate() - (29 - i));
  return { date: date.toISOString().split("T")[0], spend: Math.floor(1800 + Math.random() * 600 + (i % 7 === 0 ? 500 : 0)), budget: 2833, conversions: Math.floor(90 + Math.random() * 40 + i * 1.5), impressions: Math.floor(150000 + Math.random() * 60000 + i * 3000) };
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

export const mockBrandMentions: BrandMentionPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(); date.setDate(date.getDate() - (29 - i));
  const spike = i === 18 || i === 19 ? 80 : 0;
  return { date: date.toISOString().split("T")[0], mentions: Math.floor(40 + Math.random() * 30 + spike) };
});

export const mockSentimentData: SentimentPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(); date.setDate(date.getDate() - (29 - i));
  const negSpike = i >= 18 && i <= 20 ? 15 : 0;
  return { date: date.toISOString().split("T")[0], positive: Math.floor(25 + Math.random() * 10 - negSpike / 2), neutral: Math.floor(15 + Math.random() * 8), negative: Math.floor(5 + Math.random() * 5 + negSpike) };
});

export const mockSubredditMentions: SubredditMentions[] = [
  { subreddit: "r/technology", mentions: 342, positivePercent: 62, neutralPercent: 28, negativePercent: 10 },
  { subreddit: "r/startups", mentions: 187, positivePercent: 71, neutralPercent: 22, negativePercent: 7 },
  { subreddit: "r/SaaS", mentions: 156, positivePercent: 58, neutralPercent: 30, negativePercent: 12 },
  { subreddit: "r/marketing", mentions: 98, positivePercent: 45, neutralPercent: 35, negativePercent: 20 },
  { subreddit: "r/Entrepreneur", mentions: 89, positivePercent: 67, neutralPercent: 25, negativePercent: 8 },
];

export const mockOrganicKarmaKPIs: OrganicKarmaKPI[] = [
  { account: "u/OfficialBrand", totalKarma: 50400, postKarma: 32100, commentKarma: 18300, karmaVelocity: 1260 },
  { account: "u/ProductUpdates", totalKarma: 35600, postKarma: 24800, commentKarma: 10800, karmaVelocity: 890 },
  { account: "u/CommunityManager", totalKarma: 34000, postKarma: 18200, commentKarma: 15800, karmaVelocity: 1450 },
  { account: "u/TechSupport", totalKarma: 20400, postKarma: 8600, commentKarma: 11800, karmaVelocity: 620 },
];

export const mockPostScores: PostScoreData[] = [
  { account: "u/OfficialBrand", totalUpvotes: 20328, avgPostScore: 847, topPostScore: 3420, upvoteRatio: 0.94 },
  { account: "u/ProductUpdates", totalUpvotes: 11214, avgPostScore: 623, topPostScore: 2180, upvoteRatio: 0.91 },
  { account: "u/CommunityManager", totalUpvotes: 18540, avgPostScore: 412, topPostScore: 1870, upvoteRatio: 0.88 },
  { account: "u/TechSupport", totalUpvotes: 15678, avgPostScore: 234, topPostScore: 980, upvoteRatio: 0.86 },
];

export const mockTrafficAttribution: TrafficAttributionData[] = [
  { account: "u/OfficialBrand", ga4Referrals: 42800, directTrafficLift: 12400, goalCompletions: 1847, attributedRevenue: 142300 },
  { account: "u/ProductUpdates", ga4Referrals: 31200, directTrafficLift: 8900, goalCompletions: 1123, attributedRevenue: 86200 },
  { account: "u/CommunityManager", ga4Referrals: 18600, directTrafficLift: 5200, goalCompletions: 612, attributedRevenue: 38900 },
  { account: "u/TechSupport", ga4Referrals: 9400, directTrafficLift: 3100, goalCompletions: 265, attributedRevenue: 17530 },
];

export const mockGoalCompletions: GoalCompletionPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(); date.setDate(date.getDate() - (29 - i));
  return { date: date.toISOString().split("T")[0], goalCompletions: Math.floor(80 + Math.random() * 50 + i * 2), revenueAttributed: Math.floor(6000 + Math.random() * 3000 + i * 150) };
});

export const mockAccountTable: AccountTableRow[] = [
  { accountName: "u/OfficialBrand", postsPerWeek: 6.0, karmaVelocity: 1260, engagementRate: 4.2, attributedConversions: 1847, attributedRevenue: 142300, karmaTrend: [42, 45, 43, 48, 52, 55, 58, 61], impressions: 892000, trafficContribution: 42800, deltaConversions: 12.4, deltaRevenue: 18.1 },
  { accountName: "u/ProductUpdates", postsPerWeek: 4.5, karmaVelocity: 890, engagementRate: 3.8, attributedConversions: 1123, attributedRevenue: 86200, karmaTrend: [30, 32, 31, 34, 35, 38, 40, 42], impressions: 654000, trafficContribution: 31200, deltaConversions: 8.2, deltaRevenue: 11.3 },
  { accountName: "u/CommunityManager", postsPerWeek: 11.3, karmaVelocity: 1450, engagementRate: 5.1, attributedConversions: 612, attributedRevenue: 38900, karmaTrend: [25, 28, 32, 35, 38, 42, 45, 50], impressions: 478000, trafficContribution: 18600, deltaConversions: -3.1, deltaRevenue: -1.8 },
  { accountName: "u/TechSupport", postsPerWeek: 16.8, karmaVelocity: 620, engagementRate: 6.3, attributedConversions: 265, attributedRevenue: 17530, karmaTrend: [15, 16, 17, 17, 18, 19, 20, 21], impressions: 312000, trafficContribution: 9400, deltaConversions: 5.6, deltaRevenue: 7.2 },
];

// ─── Subreddit Tab Mock Data ─────────────────────────────────────
export const mockSubredditKPIs: SubredditKPIs = {
  followers: 24680, followerGrowth: 1840, totalImpressions: 1240000, totalEngagement: 48200,
  postingFrequency: 4.2, trafficFromSubreddit: 34200, conversions: 1247, revenue: 98400,
  previousPeriod: { followers: 22840, totalImpressions: 1080000, totalEngagement: 41300, trafficFromSubreddit: 28900, conversions: 1082, revenue: 84200 },
};

export const mockSubredditGrowth: SubredditGrowthPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(); date.setDate(date.getDate() - (29 - i));
  return { date: date.toISOString().split("T")[0], followers: 22840 + i * 62 + Math.floor(Math.random() * 30), impressions: Math.floor(35000 + Math.random() * 15000 + i * 800), upvotes: Math.floor(800 + Math.random() * 400 + i * 20), comments: Math.floor(200 + Math.random() * 100 + i * 8) };
});

export const mockSubredditPosts: SubredditPostData[] = [
  { title: "Official Product Roadmap Q1 2026", date: "2026-02-10", impressions: 124000, upvotes: 2340, comments: 456, ctr: 3.2, traffic: 3968 },
  { title: "Community AMA: Engineering Team", date: "2026-02-05", impressions: 98000, upvotes: 1890, comments: 672, ctr: 2.8, traffic: 2744 },
  { title: "Feature Release: AI Integration", date: "2026-01-28", impressions: 87000, upvotes: 1560, comments: 342, ctr: 3.5, traffic: 3045 },
  { title: "Monthly Community Roundup", date: "2026-01-22", impressions: 64000, upvotes: 980, comments: 234, ctr: 2.1, traffic: 1344 },
  { title: "How we reduced latency by 40%", date: "2026-01-15", impressions: 156000, upvotes: 3420, comments: 890, ctr: 4.1, traffic: 6396 },
  { title: "User Spotlight: Top Contributors", date: "2026-01-10", impressions: 42000, upvotes: 720, comments: 156, ctr: 1.8, traffic: 756 },
  { title: "Bug Bounty Results December", date: "2026-01-05", impressions: 38000, upvotes: 540, comments: 98, ctr: 1.4, traffic: 532 },
  { title: "2025 Year in Review", date: "2025-12-28", impressions: 210000, upvotes: 4200, comments: 1240, ctr: 3.8, traffic: 7980 },
];

// ─── SEO / GEO Tab Mock Data ────────────────────────────────────
export const mockSEOGEOKPIs: SEOGEOKPIs = {
  llmReferralTraffic: 18400, redditVisibilityIndex: 72, searchVisibilityScore: 64, totalLLMSessions: 42800,
  previousPeriod: { llmReferralTraffic: 14200, redditVisibilityIndex: 65, searchVisibilityScore: 58, totalLLMSessions: 34600 },
};

export const mockLLMReferrals: LLMReferralPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(); date.setDate(date.getDate() - (29 - i));
  return { date: date.toISOString().split("T")[0], chatgpt: Math.floor(180 + Math.random() * 80 + i * 5), perplexity: Math.floor(120 + Math.random() * 60 + i * 4), gemini: Math.floor(80 + Math.random() * 40 + i * 3), other: Math.floor(40 + Math.random() * 20 + i * 1) };
});

export const mockSearchVisibility: SearchVisibilityPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(); date.setDate(date.getDate() - (29 - i));
  return { date: date.toISOString().split("T")[0], redditVisibility: Math.floor(55 + Math.random() * 10 + i * 0.5), searchVisibility: Math.floor(48 + Math.random() * 8 + i * 0.4) };
});

// ─── Creative Intelligence Mock Data ─────────────────────────────
export const mockCreatives: CreativeData[] = [
  { creativeName: "Video: Product Demo 30s", format: "Video", impressions: 1240000, clicks: 34720, ctr: 2.8, cpc: 1.42, cpa: 14.20, conversions: 892, roas: 5.8, spend: 12670, revenue: 73460 },
  { creativeName: "Carousel: Feature Highlights", format: "Carousel", impressions: 890000, clicks: 22250, ctr: 2.5, cpc: 1.78, cpa: 16.80, conversions: 624, roas: 4.6, spend: 10483, revenue: 48212 },
  { creativeName: "Static: Brand Awareness", format: "Image", impressions: 1560000, clicks: 28080, ctr: 1.8, cpc: 2.12, cpa: 22.40, conversions: 478, roas: 3.2, spend: 10710, revenue: 34272 },
  { creativeName: "Video: Customer Testimonial", format: "Video", impressions: 680000, clicks: 20400, ctr: 3.0, cpc: 1.34, cpa: 12.60, conversions: 542, roas: 6.1, spend: 6829, revenue: 41662 },
  { creativeName: "GIF: Quick Tips Series", format: "GIF", impressions: 420000, clicks: 10080, ctr: 2.4, cpc: 1.56, cpa: 18.90, conversions: 312, roas: 3.9, spend: 5899, revenue: 23006 },
  { creativeName: "Static: Discount Promo", format: "Image", impressions: 980000, clicks: 14700, ctr: 1.5, cpc: 2.48, cpa: 28.40, conversions: 198, roas: 2.4, spend: 5625, revenue: 13500 },
];

// ─── Top Content Mock Data ───────────────────────────────────────
export const mockTopOrganicPosts: TopOrganicPost[] = [
  { title: "How we scaled our infrastructure to handle 10M requests", subreddit: "r/technology", account: "u/OfficialBrand", impressions: 342000, upvotes: 3420, comments: 456, engagementRate: 8.2, trafficDriven: 12400 },
  { title: "AMA: Our engineering team answers your questions", subreddit: "r/startups", account: "u/CommunityManager", impressions: 287000, upvotes: 2890, comments: 1240, engagementRate: 12.4, trafficDriven: 8900 },
  { title: "Why we open-sourced our analytics engine", subreddit: "r/programming", account: "u/OfficialBrand", impressions: 256000, upvotes: 2560, comments: 342, engagementRate: 6.8, trafficDriven: 7200 },
  { title: "Product update: AI-powered insights now live", subreddit: "r/SaaS", account: "u/ProductUpdates", impressions: 198000, upvotes: 1980, comments: 267, engagementRate: 5.4, trafficDriven: 5800 },
  { title: "Behind the scenes of our latest feature", subreddit: "r/technology", account: "u/ProductUpdates", impressions: 176000, upvotes: 1760, comments: 198, engagementRate: 4.8, trafficDriven: 4200 },
  { title: "Community spotlight: Best user projects", subreddit: "r/webdev", account: "u/CommunityManager", impressions: 154000, upvotes: 1540, comments: 312, engagementRate: 7.2, trafficDriven: 3600 },
  { title: "Tips for optimizing your workflow", subreddit: "r/productivity", account: "u/TechSupport", impressions: 142000, upvotes: 1420, comments: 189, engagementRate: 5.1, trafficDriven: 3100 },
  { title: "Our journey from 0 to 1M users", subreddit: "r/Entrepreneur", account: "u/OfficialBrand", impressions: 134000, upvotes: 1340, comments: 456, engagementRate: 9.4, trafficDriven: 4800 },
  { title: "Deep dive: How we handle data privacy", subreddit: "r/privacy", account: "u/OfficialBrand", impressions: 128000, upvotes: 1280, comments: 234, engagementRate: 6.2, trafficDriven: 2900 },
  { title: "New integration: Connect with your favorite tools", subreddit: "r/SaaS", account: "u/ProductUpdates", impressions: 112000, upvotes: 1120, comments: 156, engagementRate: 4.6, trafficDriven: 2400 },
  { title: "How to get the most out of our API", subreddit: "r/webdev", account: "u/TechSupport", impressions: 98000, upvotes: 980, comments: 342, engagementRate: 8.8, trafficDriven: 2100 },
  { title: "Customer success story: Growing 3x in 6 months", subreddit: "r/startups", account: "u/OfficialBrand", impressions: 92000, upvotes: 920, comments: 178, engagementRate: 5.6, trafficDriven: 1800 },
  { title: "Our approach to sustainable tech", subreddit: "r/technology", account: "u/CommunityManager", impressions: 86000, upvotes: 860, comments: 134, engagementRate: 4.2, trafficDriven: 1600 },
  { title: "Quick fix guide for common issues", subreddit: "r/techsupport", account: "u/TechSupport", impressions: 78000, upvotes: 780, comments: 456, engagementRate: 11.2, trafficDriven: 1400 },
  { title: "What's next: Our 2026 vision", subreddit: "r/Entrepreneur", account: "u/OfficialBrand", impressions: 74000, upvotes: 740, comments: 198, engagementRate: 6.8, trafficDriven: 1200 },
  { title: "Monthly metrics: January recap", subreddit: "r/SaaS", account: "u/ProductUpdates", impressions: 68000, upvotes: 680, comments: 112, engagementRate: 3.8, trafficDriven: 980 },
  { title: "Developer tools we can't live without", subreddit: "r/programming", account: "u/TechSupport", impressions: 64000, upvotes: 640, comments: 234, engagementRate: 7.4, trafficDriven: 860 },
  { title: "Building in public: Lessons learned", subreddit: "r/startups", account: "u/CommunityManager", impressions: 58000, upvotes: 580, comments: 167, engagementRate: 6.2, trafficDriven: 740 },
  { title: "Security update: What you need to know", subreddit: "r/netsec", account: "u/OfficialBrand", impressions: 52000, upvotes: 520, comments: 98, engagementRate: 4.4, trafficDriven: 620 },
  { title: "Community poll results: Feature priorities", subreddit: "r/SaaS", account: "u/CommunityManager", impressions: 48000, upvotes: 480, comments: 256, engagementRate: 9.8, trafficDriven: 540 },
];

export const mockTopPositiveMentions: TopBrandMention[] = [
  { excerpt: "Just switched to their platform and it's been a game changer for our team. The onboarding was seamless.", subreddit: "r/SaaS", sentiment: "positive", upvotes: 342, comments: 45, date: "2026-02-08" },
  { excerpt: "Their customer support is genuinely the best I've experienced. They resolved my issue in 10 minutes.", subreddit: "r/technology", sentiment: "positive", upvotes: 267, comments: 32, date: "2026-02-06" },
  { excerpt: "The new AI features are impressive. Finally a company that delivers on their roadmap promises.", subreddit: "r/startups", sentiment: "positive", upvotes: 198, comments: 28, date: "2026-02-04" },
  { excerpt: "Been using them for 6 months. ROI is clear and measurable. Highly recommend for mid-size teams.", subreddit: "r/Entrepreneur", sentiment: "positive", upvotes: 156, comments: 19, date: "2026-02-01" },
  { excerpt: "Their open-source contributions are solid. Good to see a company giving back to the community.", subreddit: "r/programming", sentiment: "positive", upvotes: 134, comments: 22, date: "2026-01-28" },
];

export const mockTopNegativeMentions: TopBrandMention[] = [
  { excerpt: "Pricing increased 40% with no new features to justify it. Feeling squeezed as a small team.", subreddit: "r/SaaS", sentiment: "negative", upvotes: 198, comments: 67, date: "2026-02-09" },
  { excerpt: "API rate limits are frustrating. We hit the cap daily and there's no enterprise tier available.", subreddit: "r/webdev", sentiment: "negative", upvotes: 156, comments: 43, date: "2026-02-07" },
  { excerpt: "Documentation is outdated. Spent 3 hours debugging something that was a known issue.", subreddit: "r/programming", sentiment: "negative", upvotes: 134, comments: 38, date: "2026-02-03" },
  { excerpt: "Mobile app is laggy and crashes frequently. Desktop experience is great but mobile needs work.", subreddit: "r/technology", sentiment: "negative", upvotes: 98, comments: 24, date: "2026-01-30" },
  { excerpt: "Migrating away from their platform is nearly impossible. Data export is limited and poorly documented.", subreddit: "r/startups", sentiment: "negative", upvotes: 87, comments: 31, date: "2026-01-26" },
];

// ─── Organic Subreddit Breakdown ─────────────────────────────────
export const mockOrganicSubredditBreakdown: OrganicSubredditBreakdown[] = [
  { subreddit: "r/technology", impressions: 542000, engagement: 18400, engagementRate: 3.4, trafficDriven: 24800, posts: 18 },
  { subreddit: "r/startups", impressions: 387000, engagement: 14200, engagementRate: 3.7, trafficDriven: 16400, posts: 14 },
  { subreddit: "r/SaaS", impressions: 298000, engagement: 10800, engagementRate: 3.6, trafficDriven: 12200, posts: 12 },
  { subreddit: "r/programming", impressions: 256000, engagement: 9800, engagementRate: 3.8, trafficDriven: 8400, posts: 8 },
  { subreddit: "r/webdev", impressions: 212000, engagement: 8200, engagementRate: 3.9, trafficDriven: 7200, posts: 10 },
  { subreddit: "r/Entrepreneur", impressions: 186000, engagement: 7400, engagementRate: 4.0, trafficDriven: 6800, posts: 9 },
  { subreddit: "r/productivity", impressions: 142000, engagement: 5200, engagementRate: 3.7, trafficDriven: 4200, posts: 7 },
  { subreddit: "r/privacy", impressions: 128000, engagement: 4600, engagementRate: 3.6, trafficDriven: 3800, posts: 5 },
  { subreddit: "r/netsec", impressions: 98000, engagement: 3400, engagementRate: 3.5, trafficDriven: 2800, posts: 4 },
  { subreddit: "r/techsupport", impressions: 78000, engagement: 4200, engagementRate: 5.4, trafficDriven: 2200, posts: 6 },
];

// ─── Enhanced Attribution Mock Data ──────────────────────────────
export const mockEnhancedAttribution: EnhancedAttributionData = {
  directRedditTraffic: 42800,
  inferredRedditTraffic: 18400,
  totalAttributedConversions: 3847,
  totalAttributedRevenue: 284930,
  revenueInfluencePercent: 34.2,
  ga4Channels: [
    { channel: "Reddit Referral", sessions: 42800, conversions: 2184, revenue: 168420 },
    { channel: "Direct (Inferred)", sessions: 18400, conversions: 892, revenue: 64200 },
    { channel: "Unassigned", sessions: 34200, conversions: 482, revenue: 32800 },
    { channel: "Organic Search", sessions: 128000, conversions: 3420, revenue: 248000 },
    { channel: "Social (Other)", sessions: 24600, conversions: 612, revenue: 42300 },
  ],
};

// ════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════

export function calculateChange(current: number, previous: number): { value: number; isPositive: boolean } {
  const change = ((current - previous) / previous) * 100;
  return { value: Math.abs(change), isPositive: change >= 0 };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number): string {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
  if (value >= 1000) return (value / 1000).toFixed(1) + "K";
  return value.toLocaleString();
}

export function formatPercent(value: number): string {
  return value.toFixed(1) + "%";
}
