// Attribution Logic Placeholder Module
// Calculates inferred Reddit influence on traffic lifts

export interface AttributionResult {
  baseline: number;
  spike: number;
  liftPercent: number;
  inferredRedditInfluence: number;
  inferredInfluencePercent: number;
}

const REDDIT_INFLUENCE_FACTOR = 0.25; // 25% of lift attributed to Reddit

export function calculateInferredLift(
  baselinePeriodValues: number[],
  spikePeriodValues: number[]
): AttributionResult {
  const baseline =
    baselinePeriodValues.length > 0
      ? baselinePeriodValues.reduce((s, v) => s + v, 0) / baselinePeriodValues.length
      : 0;

  const spike =
    spikePeriodValues.length > 0
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
