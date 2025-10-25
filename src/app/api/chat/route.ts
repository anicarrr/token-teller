import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { messages, fortune } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    // Build system prompt with fortune context
    const systemPrompt = `
      You are a BaZi fortune teller specializing in crypto portfolios. Respond in a mystical, insightful style based on the user's fortune reading.

      User's Fortune Reading: ${fortune}
      
      Use the fortune reading as context to provide personalized advice about their crypto future. Reference elements from their fortune when giving guidance and maintain the mystical, insightful tone throughout the conversation.
    `;

    const fullMessages = [{ role: 'system', content: systemPrompt }, ...messages];

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: fullMessages,
      max_completion_tokens: 300
    });

    const reply = response.choices[0]?.message?.content || 'No response generated.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
