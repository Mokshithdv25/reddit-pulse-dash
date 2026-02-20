import { useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExecutiveSummaryProps {
  tabKey: string;
  dateRange: string;
  clientId: string;
  summaryData?: Record<string, number | string>;
}

// Mock executive summary generator — structured for future LLM API integration
function generateMockSummary(tabKey: string, _dateRange: string, _data?: Record<string, number | string>): string {
  const summaries: Record<string, string> = {
    overview: "Reddit-driven traffic increased 13.4% period-over-period, with 2 viral posts in r/technology contributing 38% of total referral sessions. Conversion rate improved from 2.8% to 3.0%, driving an additional $43.7K in attributed revenue. Inferred Reddit influence accounts for 34.2% of total revenue growth.",
    organic: "Organic engagement across 4 accounts generated 2.3M total impressions with a blended 4.8% engagement rate. Top-performing content in r/technology and r/startups drove 78% of all organic traffic. u/CommunityManager leads in engagement velocity while u/OfficialBrand drives highest revenue attribution.",
    paid: "Paid campaigns are pacing at 79.8% of budget with ROAS at 4.2x. Product Launch Feb campaign is the top performer at 4.7x ROAS. Video creatives outperform static images by 62% on CTR. Recommend reallocating 15% of Brand Awareness budget to Retargeting for improved CPA.",
    brand: "Brand sentiment holds at 58% positive across 1,847 total mentions. Mention spike on Feb 2-3 was driven by a viral r/technology thread. Negative sentiment in r/marketing (20%) warrants attention — primarily pricing-related concerns. Share of voice leads competitors at 38.2%.",
    subreddit: "Client subreddit grew by 1,840 followers (+8.1%) this period. Top post 'How we reduced latency by 40%' generated 156K impressions. Subreddit traffic contributed 34.2K sessions resulting in 1,247 conversions and $98.4K revenue. Posting frequency of 4.2/week is optimal.",
    accounts: "Four active accounts collectively generated 2.34M impressions and $284.9K in attributed revenue. u/OfficialBrand leads in revenue contribution (50%) while u/CommunityManager shows the fastest growth trajectory with +22% karma velocity. All accounts show positive delta vs previous period.",
    seogeo: "LLM referral traffic is growing at 29.6% period-over-period, with ChatGPT driving 43% of AI-referred sessions. Reddit content visibility index reached 72/100, indicating strong presence in AI-generated search results. This emerging channel represents a significant growth opportunity.",
  };
  return summaries[tabKey] || "Executive summary will be generated based on the selected data range and tab context.";
}

export function ExecutiveSummary({ tabKey, dateRange, clientId, summaryData }: ExecutiveSummaryProps) {
  const [summary, setSummary] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    setSummary(generateMockSummary(tabKey, dateRange, summaryData));
    setLastUpdated(new Date());
  }, [tabKey, dateRange, clientId, summaryData]);

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => {
      setSummary(generateMockSummary(tabKey, dateRange, summaryData));
      setLastUpdated(new Date());
      setRegenerating(false);
    }, 800);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <h4 className="text-sm font-semibold text-foreground">Executive Summary</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            Updated: {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleRegenerate} disabled={regenerating}>
            <RefreshCw className={`h-3 w-3 ${regenerating ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{summary}</p>
    </div>
  );
}
