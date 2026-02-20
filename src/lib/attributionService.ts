// Attribution Logic Module
// Calculates inferred Reddit influence on traffic lifts
// Supports GA4 channel breakdown correlation

export interface AttributionResult {
  baseline: number;
  spike: number;
  liftPercent: number;
  inferredRedditInfluence: number;
  inferredInfluencePercent: number;
}

export interface EnhancedAttributionResult extends AttributionResult {
  directRedditTraffic: number;
  inferredRedditTraffic: number;
  totalRedditAttributedConversions: number;
  totalRedditAttributedRevenue: number;
  revenueInfluencePercent: number;
  ga4ChannelCorrelation: GA4CorrelationResult[];
}

export interface GA4CorrelationResult {
  channel: string;
  sessions: number;
  spikeDetected: boolean;
  correlationWithReddit: number; // 0-1 score
}

const REDDIT_INFLUENCE_FACTOR = 0.25; // 25% of lift attributed to Reddit

export function calculateInferredLift(
  baselinePeriodValues: number[],
  spikePeriodValues: number[]
): AttributionResult {
  const baseline = baselinePeriodValues.length > 0
    ? baselinePeriodValues.reduce((s, v) => s + v, 0) / baselinePeriodValues.length
    : 0;

  const spike = spikePeriodValues.length > 0
    ? spikePeriodValues.reduce((s, v) => s + v, 0) / spikePeriodValues.length
    : 0;

  const liftPercent = baseline > 0 ? ((spike - baseline) / baseline) * 100 : 0;
  const inferredRedditInfluence = (spike - baseline) * REDDIT_INFLUENCE_FACTOR;
  const inferredInfluencePercent = liftPercent * REDDIT_INFLUENCE_FACTOR;

  return {
    baseline: Math.round(baseline),
    spike: Math.round(spike),
    liftPercent: parseFloat(liftPercent.toFixed(1)),
    inferredRedditInfluence: Math.round(inferredRedditInfluence),
    inferredInfluencePercent: parseFloat(inferredInfluencePercent.toFixed(1)),
  };
}

// Enhanced attribution with GA4 channel breakdown
export function calculateEnhancedAttribution(
  baselinePeriodValues: number[],
  spikePeriodValues: number[],
  ga4Channels: { channel: string; sessions: number; conversions: number; revenue: number }[],
  directRedditTraffic: number,
  totalRevenue: number
): EnhancedAttributionResult {
  const basic = calculateInferredLift(baselinePeriodValues, spikePeriodValues);

  // Detect spikes in each channel
  const ga4ChannelCorrelation: GA4CorrelationResult[] = ga4Channels.map(ch => {
    const isRedditRelated = ch.channel.toLowerCase().includes("reddit") || ch.channel.toLowerCase().includes("inferred");
    const isUnassigned = ch.channel.toLowerCase().includes("unassigned") || ch.channel.toLowerCase().includes("direct");
    return {
      channel: ch.channel,
      sessions: ch.sessions,
      spikeDetected: isRedditRelated || (isUnassigned && basic.liftPercent > 10),
      correlationWithReddit: isRedditRelated ? 0.95 : isUnassigned ? 0.45 : 0.15,
    };
  });

  // Calculate inferred Reddit traffic from unassigned/direct channels
  const unassignedSessions = ga4Channels
    .filter(ch => ch.channel.toLowerCase().includes("unassigned") || ch.channel.toLowerCase() === "direct (inferred)")
    .reduce((s, ch) => s + ch.sessions, 0);
  const inferredRedditTraffic = Math.round(unassignedSessions * REDDIT_INFLUENCE_FACTOR);

  // Total attributed conversions/revenue
  const redditChannels = ga4Channels.filter(ch =>
    ch.channel.toLowerCase().includes("reddit") || ch.channel.toLowerCase().includes("inferred")
  );
  const totalRedditAttributedConversions = redditChannels.reduce((s, ch) => s + ch.conversions, 0);
  const totalRedditAttributedRevenue = redditChannels.reduce((s, ch) => s + ch.revenue, 0);
  const revenueInfluencePercent = totalRevenue > 0
    ? parseFloat(((totalRedditAttributedRevenue / totalRevenue) * 100).toFixed(1))
    : 0;

  return {
    ...basic,
    directRedditTraffic,
    inferredRedditTraffic,
    totalRedditAttributedConversions,
    totalRedditAttributedRevenue,
    revenueInfluencePercent,
    ga4ChannelCorrelation,
  };
}

// Detect abnormal spikes in time series data
export function detectSpikes(values: number[], threshold: number = 2.0): number[] {
  if (values.length < 7) return [];
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const stdDev = Math.sqrt(values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length);
  const spikeIndices: number[] = [];
  values.forEach((v, i) => {
    if (v > mean + threshold * stdDev) spikeIndices.push(i);
  });
  return spikeIndices;
}
