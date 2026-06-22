import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { estimateText, region } = body;

    if (!estimateText) {
      return NextResponse.json(
        { error: "Estimate text is missing." },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a strict, expert construction estimator. 
    Audit the provided contractor quote for a project in ${region || 'the US'}. 
    Identify any hidden fees, unnecessary 'fluff' line items, or prices that exceed standard market rates. 
    Format your response cleanly.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: estimateText }
      ],
      temperature: 0.2,
    });

    const auditResult = response.choices[0].message.content;

    return NextResponse.json({ success: true, audit: auditResult });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process the estimate." },
      { status: 500 }
    );
  }
}
