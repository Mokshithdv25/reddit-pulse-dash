// Data Service Abstraction Layer
// Supabase-backed where available, mock fallback elsewhere.

import { DateRange } from "@/components/dashboard/FilterBar";
import { supabase } from "@/lib/supabaseClient";
import {
  mockKPIs, mockTimeSeriesData, mockOrganicMetrics, mockKarmaData, mockPostsPerWeek,
  mockTrafficData, mockOrganicKarmaKPIs, mockPostScores, mockTrafficAttribution,
  mockGoalCompletions, mockPaidKPIs, mockSpendConversions, mockWeeklySpend, mockCampaigns,
  mockBrandMentions, mockSentimentData, mockSubredditMentions, mockShareOfVoice, mockSOVTrend,
  mockAccountTable, mockAccounts, mockSubredditKPIs, mockSubredditGrowth, mockSubredditPosts,
  mockSEOGEOKPIs, mockLLMReferrals, mockSearchVisibility, mockCreatives,
  mockTopOrganicPosts, mockTopPositiveMentions, mockTopNegativeMentions,
  mockOrganicSubredditBreakdown, mockEnhancedAttribution,
  KPIData, TimeSeriesPoint, OrganicAccountMetrics, KarmaDataPoint, PostsPerWeekData,
  TrafficDataPoint, OrganicKarmaKPI, PostScoreData, TrafficAttributionData, GoalCompletionPoint,
  PaidKPIs, SpendConversionPoint, WeeklySpendData, CampaignData, BrandMentionPoint,
  SentimentPoint, SubredditMentions, ShareOfVoiceData, ShareOfVoiceTrend, AccountTableRow, Account,
  SubredditKPIs, SubredditGrowthPoint, SubredditPostData,
  SEOGEOKPIs, LLMReferralPoint, SearchVisibilityPoint,
  CreativeData, TopOrganicPost, TopBrandMention, OrganicSubredditBreakdown, EnhancedAttributionData,
} from "@/lib/mockData";

// Slight data variations for second client
function scaleKPIs(kpis: KPIData, factor: number): KPIData {
  return {
    totalTraffic: Math.round(kpis.totalTraffic * factor),
    totalConversions: Math.round(kpis.totalConversions * factor),
    revenue: Math.round(kpis.revenue * factor),
    blendedROAS: parseFloat((kpis.blendedROAS * (factor > 1 ? 0.9 : 1.1)).toFixed(1)),
    karmaGrowth: Math.round(kpis.karmaGrowth * factor),
    previousPeriod: {
      totalTraffic: Math.round(kpis.previousPeriod.totalTraffic * factor),
      totalConversions: Math.round(kpis.previousPeriod.totalConversions * factor),
      revenue: Math.round(kpis.previousPeriod.revenue * factor),
      blendedROAS: parseFloat((kpis.previousPeriod.blendedROAS * (factor > 1 ? 0.9 : 1.1)).toFixed(1)),
      karmaGrowth: Math.round(kpis.previousPeriod.karmaGrowth * factor),
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function scaleSeries<T>(data: T[], numericFactor: number): T[] {
  return data.map((point) => {
    const scaled = { ...(point as any) };
    for (const key in scaled) {
      if (typeof scaled[key] === "number") {
        scaled[key] = Math.round(scaled[key] * numericFactor);
      }
    }
    return scaled as T;
  });
}

const CLIENT_FACTORS: Record<string, number> = { "acme-corp": 1, "globex-inc": 0.72 };
function factor(clientId: string): number { return CLIENT_FACTORS[clientId] ?? 1; }
function delay<T>(data: T): Promise<T> { return new Promise((resolve) => setTimeout(() => resolve(data), 300)); }

// ─── Overview (LIVE — Supabase) ─────────────────────────────────
export async function getOverview(clientId: string, _dateRange: DateRange): Promise<KPIData> {
  const { data, error } = await supabase
    .from('overview_snapshots')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    console.error('Supabase getOverview error:', error);
    // Fallback to mock so dashboard doesn't break
    return delay(scaleKPIs(mockKPIs, factor(clientId)));
  }

  return {
    totalTraffic: data.total_traffic,
    totalConversions: data.total_conversions,
    revenue: Number(data.revenue),
    blendedROAS: Number(data.blended_roas),
    karmaGrowth: data.karma_growth,
    previousPeriod: {
      totalTraffic: 0,
      totalConversions: 0,
      revenue: 0,
      blendedROAS: 0,
      karmaGrowth: 0,
    },
  };
}
export async function getTimeSeries(clientId: string, _dateRange: DateRange): Promise<TimeSeriesPoint[]> { return delay(scaleSeries(mockTimeSeriesData, factor(clientId))); }

// ─── Organic ─────────────────────────────────────────────────────
export async function getOrganicMetrics(clientId: string, _dateRange: DateRange): Promise<OrganicAccountMetrics[]> { return delay(scaleSeries(mockOrganicMetrics, factor(clientId))); }
export async function getKarmaData(clientId: string, _dateRange: DateRange): Promise<KarmaDataPoint[]> { return delay(scaleSeries(mockKarmaData, factor(clientId))); }
export async function getPostsPerWeek(clientId: string, _dateRange: DateRange): Promise<PostsPerWeekData[]> { return delay(scaleSeries(mockPostsPerWeek, factor(clientId))); }
export async function getTrafficData(clientId: string, _dateRange: DateRange): Promise<TrafficDataPoint[]> { return delay(scaleSeries(mockTrafficData, factor(clientId))); }
export async function getOrganicKarmaKPIs(clientId: string, _dateRange: DateRange): Promise<OrganicKarmaKPI[]> { return delay(scaleSeries(mockOrganicKarmaKPIs, factor(clientId))); }
export async function getPostScores(clientId: string, _dateRange: DateRange): Promise<PostScoreData[]> { return delay(scaleSeries(mockPostScores, factor(clientId))); }
export async function getTrafficAttribution(clientId: string, _dateRange: DateRange): Promise<TrafficAttributionData[]> { return delay(scaleSeries(mockTrafficAttribution, factor(clientId))); }
export async function getGoalCompletions(clientId: string, _dateRange: DateRange): Promise<GoalCompletionPoint[]> { return delay(scaleSeries(mockGoalCompletions, factor(clientId))); }
export async function getTopOrganicPosts(clientId: string, _dateRange: DateRange): Promise<TopOrganicPost[]> { return delay(scaleSeries(mockTopOrganicPosts, factor(clientId))); }
export async function getOrganicSubredditBreakdown(clientId: string, _dateRange: DateRange): Promise<OrganicSubredditBreakdown[]> { return delay(scaleSeries(mockOrganicSubredditBreakdown, factor(clientId))); }

// ─── Paid ────────────────────────────────────────────────────────
export async function getPaidKPIs(clientId: string, _dateRange: DateRange): Promise<PaidKPIs> {
  const f = factor(clientId);
  const base = mockPaidKPIs;
  return delay({
    spend: Math.round(base.spend * f), budget: Math.round(base.budget * f),
    ctr: parseFloat((base.ctr * (f > 1 ? 0.95 : 1.05)).toFixed(2)),
    cpc: parseFloat((base.cpc * (f > 1 ? 1.1 : 0.9)).toFixed(2)),
    cpm: parseFloat((base.cpm * f).toFixed(2)),
    cpa: parseFloat((base.cpa * (f > 1 ? 1.05 : 0.95)).toFixed(2)),
    roas: parseFloat((base.roas * (f > 1 ? 0.9 : 1.1)).toFixed(1)),
    impressions: Math.round(base.impressions * f),
    totalConversions: Math.round(base.totalConversions * f),
    totalRevenue: Math.round(base.totalRevenue * f),
  });
}
export async function getSpendConversions(clientId: string, _dateRange: DateRange): Promise<SpendConversionPoint[]> { return delay(scaleSeries(mockSpendConversions, factor(clientId))); }
export async function getWeeklySpend(clientId: string, _dateRange: DateRange): Promise<WeeklySpendData[]> { return delay(scaleSeries(mockWeeklySpend, factor(clientId))); }
export async function getCampaigns(clientId: string, _dateRange: DateRange): Promise<CampaignData[]> { return delay(scaleSeries(mockCampaigns, factor(clientId))); }
export async function getCreatives(clientId: string, _dateRange: DateRange): Promise<CreativeData[]> { return delay(scaleSeries(mockCreatives, factor(clientId))); }

// ─── Brand ───────────────────────────────────────────────────────
export async function getBrandMentions(clientId: string, _dateRange: DateRange): Promise<BrandMentionPoint[]> { return delay(scaleSeries(mockBrandMentions, factor(clientId))); }
export async function getSentimentData(clientId: string, _dateRange: DateRange): Promise<SentimentPoint[]> { return delay(scaleSeries(mockSentimentData, factor(clientId))); }
export async function getSubredditMentions(clientId: string, _dateRange: DateRange): Promise<SubredditMentions[]> { return delay(scaleSeries(mockSubredditMentions, factor(clientId))); }
export async function getShareOfVoice(clientId: string, _dateRange: DateRange): Promise<ShareOfVoiceData[]> { return delay(scaleSeries(mockShareOfVoice, factor(clientId))); }
export async function getSOVTrend(clientId: string, _dateRange: DateRange): Promise<ShareOfVoiceTrend[]> { return delay(scaleSeries(mockSOVTrend, factor(clientId))); }
export async function getTopPositiveMentions(clientId: string, _dateRange: DateRange): Promise<TopBrandMention[]> { return delay(mockTopPositiveMentions); }
export async function getTopNegativeMentions(clientId: string, _dateRange: DateRange): Promise<TopBrandMention[]> { return delay(mockTopNegativeMentions); }

// ─── Accounts ────────────────────────────────────────────────────
export async function getAccountTable(clientId: string, _dateRange: DateRange): Promise<AccountTableRow[]> { return delay(scaleSeries(mockAccountTable, factor(clientId))); }
export async function getAccounts(_clientId: string): Promise<Account[]> { return delay(mockAccounts); }

// ─── Subreddit ───────────────────────────────────────────────────
export async function getSubredditKPIs(clientId: string, _dateRange: DateRange): Promise<SubredditKPIs> {
  const f = factor(clientId);
  const base = mockSubredditKPIs;
  return delay({
    followers: Math.round(base.followers * f), followerGrowth: Math.round(base.followerGrowth * f),
    totalImpressions: Math.round(base.totalImpressions * f), totalEngagement: Math.round(base.totalEngagement * f),
    postingFrequency: parseFloat((base.postingFrequency * (f > 1 ? 0.9 : 1.1)).toFixed(1)),
    trafficFromSubreddit: Math.round(base.trafficFromSubreddit * f),
    conversions: Math.round(base.conversions * f), revenue: Math.round(base.revenue * f),
    previousPeriod: {
      followers: Math.round(base.previousPeriod.followers * f),
      totalImpressions: Math.round(base.previousPeriod.totalImpressions * f),
      totalEngagement: Math.round(base.previousPeriod.totalEngagement * f),
      trafficFromSubreddit: Math.round(base.previousPeriod.trafficFromSubreddit * f),
      conversions: Math.round(base.previousPeriod.conversions * f),
      revenue: Math.round(base.previousPeriod.revenue * f),
    },
  });
}
export async function getSubredditGrowth(clientId: string, _dateRange: DateRange): Promise<SubredditGrowthPoint[]> { return delay(scaleSeries(mockSubredditGrowth, factor(clientId))); }
export async function getSubredditTopPosts(clientId: string, _dateRange: DateRange): Promise<SubredditPostData[]> { return delay(scaleSeries(mockSubredditPosts, factor(clientId))); }

// ─── SEO / GEO ───────────────────────────────────────────────────
export async function getSEOGEOKPIs(clientId: string, _dateRange: DateRange): Promise<SEOGEOKPIs> {
  const f = factor(clientId);
  const base = mockSEOGEOKPIs;
  return delay({
    llmReferralTraffic: Math.round(base.llmReferralTraffic * f),
    redditVisibilityIndex: Math.round(base.redditVisibilityIndex * (f > 1 ? 0.95 : 1.05)),
    searchVisibilityScore: Math.round(base.searchVisibilityScore * (f > 1 ? 0.95 : 1.05)),
    totalLLMSessions: Math.round(base.totalLLMSessions * f),
    previousPeriod: {
      llmReferralTraffic: Math.round(base.previousPeriod.llmReferralTraffic * f),
      redditVisibilityIndex: Math.round(base.previousPeriod.redditVisibilityIndex * (f > 1 ? 0.95 : 1.05)),
      searchVisibilityScore: Math.round(base.previousPeriod.searchVisibilityScore * (f > 1 ? 0.95 : 1.05)),
      totalLLMSessions: Math.round(base.previousPeriod.totalLLMSessions * f),
    },
  });
}
export async function getLLMReferrals(clientId: string, _dateRange: DateRange): Promise<LLMReferralPoint[]> { return delay(scaleSeries(mockLLMReferrals, factor(clientId))); }
export async function getSearchVisibility(clientId: string, _dateRange: DateRange): Promise<SearchVisibilityPoint[]> { return delay(scaleSeries(mockSearchVisibility, factor(clientId))); }

// ─── Enhanced Attribution ────────────────────────────────────────
export async function getEnhancedAttribution(clientId: string, _dateRange: DateRange): Promise<EnhancedAttributionData> {
  const f = factor(clientId);
  const base = mockEnhancedAttribution;
  return delay({
    directRedditTraffic: Math.round(base.directRedditTraffic * f),
    inferredRedditTraffic: Math.round(base.inferredRedditTraffic * f),
    totalAttributedConversions: Math.round(base.totalAttributedConversions * f),
    totalAttributedRevenue: Math.round(base.totalAttributedRevenue * f),
    revenueInfluencePercent: parseFloat((base.revenueInfluencePercent * (f > 1 ? 0.95 : 1.05)).toFixed(1)),
    ga4Channels: base.ga4Channels.map(ch => ({
      channel: ch.channel,
      sessions: Math.round(ch.sessions * f),
      conversions: Math.round(ch.conversions * f),
      revenue: Math.round(ch.revenue * f),
    })),
  });
}
