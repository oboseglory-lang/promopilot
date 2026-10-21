import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

interface GeneratePayload {
  mode: 'all' | 'caption' | 'ad' | 'poster' | 'whatsapp';
  businessName: string;
  industry: string;
  offer: string;
  targetAudience?: string;
  tone?: string;
  currencySymbol?: string;
  customDetails?: string;
}

app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const {
      mode = 'all',
      businessName,
      industry,
      offer,
      targetAudience = 'Local customers and regulars',
      tone = 'Energetic, urgent and engaging',
      currencySymbol = 'R',
      customDetails = '',
    }: GeneratePayload = req.body;

    if (!businessName || !offer) {
      return res.status(400).json({ error: 'Business name and offer are required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback high quality response if API key is not yet configured in environment
      return res.json(generateFallbackContent({
        mode,
        businessName,
        industry,
        offer,
        targetAudience,
        tone,
        currencySymbol,
        customDetails,
      }));
    }

    const systemPrompt = `You are PromoPilot's elite AI copywriter and marketing director specializing in hyper-effective content for small and local businesses (South Africa & global markets).
Your writing is punchy, high-converting, realistic, and formatted specifically for each channel.
Currency symbol to use when mentioning prices: "${currencySymbol}".
Tone: ${tone}.
Business: ${businessName} (Industry: ${industry}).
Primary Offer / Promotion: ${offer}.
Target Audience: ${targetAudience}.
Additional details: ${customDetails || 'None'}.

Strictly output valid JSON matching this schema:
{
  "caption": {
    "hook": "Eye-catching first line",
    "body": "Main social media caption with linebreaks, value points, call to action",
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"],
    "cta": "Clear call to action button/link copy",
    "suggestedPlatform": "Instagram & Facebook"
  },
  "ad": {
    "headline": "Punchy ad headline (under 40 chars)",
    "primaryText": "Persuasive ad copy optimized for Meta/Google Ads",
    "valueProps": ["Benefit 1", "Benefit 2", "Benefit 3"],
    "cta": "Claim Offer / Shop Now / Book Today"
  },
  "poster": {
    "badgeText": "e.g. LIMITED TIME OFFER or WEEKEND SPECIAL",
    "mainHeadline": "Bold visual headline for poster",
    "subHeadline": "Catchy supporting line",
    "highlightOffer": "Huge focal offer text (e.g. 50% OFF or BUY 1 GET 1)",
    "terms": "Short terms e.g. Valid until Sunday while stocks last. T&Cs apply.",
    "ctaText": "Visit Us Today / Scan to Book",
    "themeSuggestion": "Modern Gradient / Vibrant Pop / Luxury Minimal / Warm Rustic"
  },
  "whatsapp": {
    "message": "Formatted WhatsApp text with *bold* formatting, bullet points, friendly emojis, clear urgency, and a reply prompt.",
    "previewSnippet": "Short preview line for notification",
    "sendActionText": "Chat on WhatsApp"
  }
}
Do NOT include markdown code fences or backticks (e.g. do not output \`\`\`json). Output pure JSON only.`;

    const userPrompt = `Generate marketing content for ${businessName}.
Offer: ${offer}
Industry: ${industry}
Target Audience: ${targetAudience}
Requested Focus: ${mode.toUpperCase()} content.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      // Clean possible stray backticks
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Gemini generation error, falling back:', error);
    // Graceful fallback so user always gets content
    const fallback = generateFallbackContent(req.body);
    return res.json({
      success: true,
      fallbackUsed: true,
      data: fallback.data,
      note: 'Generated using local marketing engine',
    });
  }
});

function generateFallbackContent(params: GeneratePayload) {
  const {
    businessName,
    industry,
    offer,
    currencySymbol = 'R',
  } = params;

  return {
    success: true,
    data: {
      caption: {
        hook: `🚨 Attention ${industry || 'Valued'} lovers: Big news at ${businessName}!`,
        body: `We're turning up the excitement this week with our biggest deal yet! 🎉\n\n✨ ${offer}\n\nWhether you're treating yourself or picking up something special, there's never been a better time to visit ${businessName}.\n\n👇 Drop by today or send us a quick DM to claim yours before we sell out!`,
        hashtags: [
          `#${businessName.replace(/\s+/g, '')}`,
          `#Local${industry ? industry.replace(/\s+/g, '') : 'Business'}`,
          `#SpecialOffer`,
          `#DealsOfTheWeek`,
          `#SupportLocal`,
          `#SaveBig`
        ],
        cta: 'Click the link in bio or WhatsApp us directly to secure yours!',
        suggestedPlatform: 'Instagram, Facebook & TikTok',
      },
      ad: {
        headline: `${offer} | ${businessName}`,
        primaryText: `Stop paying full price! For a limited time only, enjoy ${offer} at ${businessName}. Top quality, friendly local service, and unmatched value. Claim your voucher before it expires.`,
        valueProps: [
          '⚡ Fast, friendly & local service',
          '🔥 Exclusive limited-time pricing',
          '💯 100% Satisfaction guaranteed',
        ],
        cta: 'Claim Voucher Now',
      },
      poster: {
        badgeText: '🔥 EXCLUSIVE DEAL',
        mainHeadline: `${businessName.toUpperCase()}`,
        subHeadline: `Special Promotion This Week`,
        highlightOffer: offer.toUpperCase(),
        terms: `Limited time promotion. Valid while stock lasts. T&Cs apply.`,
        ctaText: 'Visit In-Store / WhatsApp To Order',
        themeSuggestion: 'Modern Gradient',
      },
      whatsapp: {
        message: `👋 Hey there! Quick heads-up from *${businessName}*:\n\n🔥 *${offer}*\n\nWe wanted our VIP community to know first before we post to the general public.\n\n📍 Visit us today or reply *YES* right here to hold yours!\n\n_Offer valid while stocks last._`,
        previewSnippet: `🔥 Exclusive offer from ${businessName}: ${offer}`,
        sendActionText: 'Send via WhatsApp',
      },
    },
  };
}

// Development Vite integration vs Production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`PromoPilot server running on http://localhost:${PORT}`);
  });
}

startServer();
