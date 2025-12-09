import { GoogleGenAI, Type } from "@google/genai";
import { PlatformMetric, StockData, UserProfile } from "../types";

// Ensure API Key is available
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to generate a realistic risk report
export const generateRiskReport = async (stockName: string, riskTolerance: string): Promise<string> => {
  if (!apiKey) return "API Key missing. Cannot generate report.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a concise, professional financial risk assessment report (approx 150 words) for the stock "${stockName}". 
      Consider a user with a "${riskTolerance}" risk tolerance. 
      Focus on market volatility, recent sentiment analysis, and potential downside risks. 
      Do not give financial advice, but assess the "noise" in community comments.`,
      config: {
        maxOutputTokens: 300,
        temperature: 0.7,
      }
    });
    return response.text || "Report generation failed.";
  } catch (error) {
    console.error("Gemini Text Error:", error);
    return "Unable to generate risk report at this time due to network or API issues.";
  }
};

// Main function to analyze stock with REAL data via Google Search
export const analyzeStockWithSearch = async (query: string, userProfile: UserProfile): Promise<StockData | null> => {
  if (!apiKey) return null;

  try {
    // We use a single prompt with tools to get data and analysis in one go (or two if needed, but here we try to parse text)
    // Note: When using tools, we cannot force JSON mode easily in the same turn for some models, 
    // so we will ask for a structured text format we can parse.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Perform a real-time analysis for stock: "${query}". 
      Use Google Search to find:
      1. The exact Stock Name and Symbol (e.g., 贵州茅台 600519).
      2. The latest PRICE and Change Percentage (e.g. +1.2%).
      3. Recent news summary (last 3-5 days).
      
      Then, simulate an analysis of 3 platforms (东方财富, 雪球, 同花顺) based on the *actual* news sentiment you found.
      
      Output the data in this STRICT format (do not use markdown code blocks, just plain text with delimiters):
      
      ||NAME||: [Stock Name]
      ||SYMBOL||: [Stock Symbol]
      ||PRICE||: [Price Number]
      ||CHANGE||: [Change Percent Number]
      ||NEWS||: [A 3 sentence summary of recent news/situation]
      ||RISK||: [Low/Medium/High based on volatility]
      
      Then for platforms, provide metrics (0-100) based on this logic:
      - "EastMoney" fits retail/hot money (High Impact).
      - "Xueqiu" fits value investors (High Wisdom).
      - "Tonghuashun" fits technical traders.
      
      Adjust 'MatchRate' based on User Profile: Capital=${userProfile.capital} (0=Low, 3=High), Risk=${userProfile.riskTolerance} (0=Low, 2=High).
      
      ||P1_NAME||: 东方财富
      ||P1_MATCH||: [0-100]
      ||P1_ACC||: [0-100]
      ||P1_WISDOM||: [0-100]
      ||P1_IMPACT||: [0-100]
      ||P1_FIT||: [0-100]
      ||P1_DESC||: [Reason]
      ||P1_SIG||: [Buy/Hold/Sell]
      
      ||P2_NAME||: 雪球
      ||P2_MATCH||: [0-100]
      ||P2_ACC||: [0-100]
      ||P2_WISDOM||: [0-100]
      ||P2_IMPACT||: [0-100]
      ||P2_FIT||: [0-100]
      ||P2_DESC||: [Reason]
      ||P2_SIG||: [Buy/Hold/Sell]
      
      ||P3_NAME||: 同花顺
      ||P3_MATCH||: [0-100]
      ||P3_ACC||: [0-100]
      ||P3_WISDOM||: [0-100]
      ||P3_IMPACT||: [0-100]
      ||P3_FIT||: [0-100]
      ||P3_DESC||: [Reason]
      ||P3_SIG||: [Buy/Hold/Sell]
      `,
      config: {
        tools: [{googleSearch: {}}],
        temperature: 0.5
      }
    });

    const text = response.text || "";
    
    // Extract Grounding Metadata (Sources)
    const groundingUrls = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || 'Source',
        uri: chunk.web?.uri || '#'
      }))
      .filter((u: any) => u.uri !== '#')
      .slice(0, 5) || [];

    // Parse logic
    const getValue = (key: string) => {
      const regex = new RegExp(`\\|\\|${key}\\|\\|:\\s*(.*)`);
      const match = text.match(regex);
      return match ? match[1].trim() : "";
    };

    const name = getValue("NAME") || query;
    const symbol = getValue("SYMBOL") || "UNKNOWN";
    const price = parseFloat(getValue("PRICE").replace(/[^0-9.-]/g, '')) || 100;
    const changePercent = parseFloat(getValue("CHANGE").replace('%', '')) || 0;
    const news = getValue("NEWS") || "暂无最新消息。";
    const riskLevel = (getValue("RISK") as 'Low'|'Medium'|'High') || 'Medium';

    const platforms: PlatformMetric[] = [1, 2, 3].map(i => ({
      id: `p-${i}`,
      name: getValue(`P${i}_NAME`),
      matchRate: parseInt(getValue(`P${i}_MATCH`)) || 80,
      accuracyScore: parseInt(getValue(`P${i}_ACC`)) || 80,
      communityWisdom: parseInt(getValue(`P${i}_WISDOM`)) || 80,
      marketImpact: parseInt(getValue(`P${i}_IMPACT`)) || 80,
      userFit: parseInt(getValue(`P${i}_FIT`)) || 80,
      description: getValue(`P${i}_DESC`) || "适合您的投资风格",
      recentSignal: (getValue(`P${i}_SIG`) as 'Buy'|'Hold'|'Sell') || 'Hold'
    }));

    // Generate specific risk report text separately if needed, or use the one from search context
    // For now we reuse the separate function for a dedicated report to ensure quality
    const detailedRiskReport = await generateRiskReport(name, userProfile.riskTolerance === 0 ? 'Conservative' : userProfile.riskTolerance === 1 ? 'Balanced' : 'Aggressive');
    
    // Generate Image
    const image = await generateStockIllustration(name);

    return {
      symbol,
      name,
      price,
      changePercent,
      riskLevel,
      riskReport: detailedRiskReport,
      platforms,
      generatedImage: image,
      recentSituation: news,
      groundingUrls
    };

  } catch (error) {
    console.error("Gemini Search Analysis Error:", error);
    return null;
  }
};


// Helper to generate illustrative image using Nano Banana
export const generateStockIllustration = async (stockName: string): Promise<string | undefined> => {
  if (!apiKey) return undefined;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{
          text: `A professional 3d render icon for finance app representing stock "${stockName}". 
          Minimalist, high tech, blue and gold, rising trend, reliable. White background. 
          Aspect ratio 16:9.`
        }]
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Gemini Image Error:", error);
    return undefined; // Fail silently to fallback
  }
  return undefined;
};
