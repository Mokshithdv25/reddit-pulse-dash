// Data Service Abstraction Layer
// Currently returns mock data. Swap internals to Supabase later without touching components.

import { DateRange } from "@/components/dashboard/FilterBar";
import {
  mockKPIs,
  mockTimeSeriesData,
  mockOrganicMetrics,
  mockKarmaData,
  mockPostsPerWeek,
  mockTrafficData,
  mockOrganicKarmaKPIs,
  mockPostScores,
  mockTrafficAttribution,
  mockGoalCompletions,
  mockPaidKPIs,
  mockSpendConversions,
  mockWeeklySpend,
  mockCampaigns,
  mockBrandMentions,
  mockSentimentData,
  mockSubredditMentions,
  mockShareOfVoice,
  mockSOVTrend,
  mockAccountTable,
  mockAccounts,
  KPIData,
  TimeSeriesPoint,
  OrganicAccountMetrics,
  KarmaDataPoint,
  PostsPerWeekData,
  TrafficDataPoint,
  OrganicKarmaKPI,
  PostScoreData,
  TrafficAttributionData,
  GoalCompletionPoint,
  PaidKPIs,
  SpendConversionPoint,
  WeeklySpendData,
  CampaignData,
  BrandMentionPoint,
  SentimentPoint,
  SubredditMentions,
  ShareOfVoiceData,
  ShareOfVoiceTrend,
  AccountTableRow,
  Account,
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

const CLIENT_FACTORS: Record<string, number> = {
  "acme-corp": 1,
  "globex-inc": 0.72,
};

function factor(clientId: string): number {
  return CLIENT_FACTORS[clientId] ?? 1;
}

// Simulated async delay (remove when real API)
function delay<T>(data: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), 300));
}

// ─── Overview ────────────────────────────────────────────────────
export async function getOverview(clientId: string, _dateRange: DateRange): Promise<KPIData> {
  return delay(scaleKPIs(mockKPIs, factor(clientId)));
}

export async function getTimeSeries(clientId: string, _dateRange: DateRange): Promise<TimeSeriesPoint[]> {
  return delay(scaleSeries(mockTimeSeriesData, factor(clientId)));
}

// ─── Organic ─────────────────────────────────────────────────────
export async function getOrganicMetrics(clientId: string, _dateRange: DateRange): Promise<OrganicAccountMetrics[]> {
  return delay(scaleSeries(mockOrganicMetrics, factor(clientId)));
}

export async function getKarmaData(clientId: string, _dateRange: DateRange): Promise<KarmaDataPoint[]> {
  return delay(scaleSeries(mockKarmaData, factor(clientId)));
}

export async function getPostsPerWeek(clientId: string, _dateRange: DateRange): Promise<PostsPerWeekData[]> {
  return delay(scaleSeries(mockPostsPerWeek, factor(clientId)));
}

export async function getTrafficData(clientId: string, _dateRange: DateRange): Promise<TrafficDataPoint[]> {
  return delay(scaleSeries(mockTrafficData, factor(clientId)));
}

export async function getOrganicKarmaKPIs(clientId: string, _dateRange: DateRange): Promise<OrganicKarmaKPI[]> {
  return delay(scaleSeries(mockOrganicKarmaKPIs, factor(clientId)));
}

export async function getPostScores(clientId: string, _dateRange: DateRange): Promise<PostScoreData[]> {
  return delay(scaleSeries(mockPostScores, factor(clientId)));
}

export async function getTrafficAttribution(clientId: string, _dateRange: DateRange): Promise<TrafficAttributionData[]> {
  return delay(scaleSeries(mockTrafficAttribution, factor(clientId)));
}

export async function getGoalCompletions(clientId: string, _dateRange: DateRange): Promise<GoalCompletionPoint[]> {
  return delay(scaleSeries(mockGoalCompletions, factor(clientId)));
}

// ─── Paid ────────────────────────────────────────────────────────
export async function getPaidKPIs(clientId: string, _dateRange: DateRange): Promise<PaidKPIs> {
  const f = factor(clientId);
  const base = mockPaidKPIs;
  return delay({
    spend: Math.round(base.spend * f),
    budget: Math.round(base.budget * f),
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

export async function getSpendConversions(clientId: string, _dateRange: DateRange): Promise<SpendConversionPoint[]> {
  return delay(scaleSeries(mockSpendConversions, factor(clientId)));
}

export async function getWeeklySpend(clientId: string, _dateRange: DateRange): Promise<WeeklySpendData[]> {
  return delay(scaleSeries(mockWeeklySpend, factor(clientId)));
}

export async function getCampaigns(clientId: string, _dateRange: DateRange): Promise<CampaignData[]> {
  return delay(scaleSeries(mockCampaigns, factor(clientId)));
}

// ─── Brand ───────────────────────────────────────────────────────
export async function getBrandMentions(clientId: string, _dateRange: DateRange): Promise<BrandMentionPoint[]> {
  return delay(scaleSeries(mockBrandMentions, factor(clientId)));
}

export async function getSentimentData(clientId: string, _dateRange: DateRange): Promise<SentimentPoint[]> {
  return delay(scaleSeries(mockSentimentData, factor(clientId)));
}

export async function getSubredditMentions(clientId: string, _dateRange: DateRange): Promise<SubredditMentions[]> {
  return delay(scaleSeries(mockSubredditMentions, factor(clientId)));
}

export async function getShareOfVoice(clientId: string, _dateRange: DateRange): Promise<ShareOfVoiceData[]> {
  return delay(scaleSeries(mockShareOfVoice, factor(clientId)));
}

export async function getSOVTrend(clientId: string, _dateRange: DateRange): Promise<ShareOfVoiceTrend[]> {
  return delay(scaleSeries(mockSOVTrend, factor(clientId)));
}

// ─── Accounts ────────────────────────────────────────────────────
export async function getAccountTable(clientId: string, _dateRange: DateRange): Promise<AccountTableRow[]> {
  return delay(scaleSeries(mockAccountTable, factor(clientId)));
}

export async function getAccounts(_clientId: string): Promise<Account[]> {
  return delay(mockAccounts);
}
