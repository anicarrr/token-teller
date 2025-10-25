import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { BalanceService, TokenBalance } from '@/lib/balanceService'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { address, chainIds, birthDate } = await request.json()

    if (!address || !chainIds) {
      return NextResponse.json({ error: 'Address and chainIds are required' }, { status: 400 })
    }

    // Fetch balances using the service
    const { balances, totalUsdValue } = await BalanceService.fetchBalances(address, chainIds)

    // Build prompt for OpenAI
    const tokenSummary = balances
      .map((b: TokenBalance) => `${b.symbol} (${b.chainName}): ${parseFloat(b.balance).toFixed(4)} ($${b.usdValue.toFixed(2)})`)
      .join(', ')
    
    // Build birth date context if provided
    let birthDateContext = '';
    if (birthDate) {
      const birth = new Date(birthDate);
      const year = birth.getFullYear();
      const month = birth.getMonth() + 1;
      const day = birth.getDate();
      const hour = birth.getHours();
      const minute = birth.getMinutes();
      
      // Calculate Chinese zodiac year
      const chineseZodiacAnimals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
      const zodiacIndex = (year - 4) % 12;
      const zodiacAnimal = chineseZodiacAnimals[zodiacIndex];
      
      // Calculate Five Elements cycle
      const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
      const elementIndex = Math.floor(((year - 4) % 60) / 12);
      const element = elements[elementIndex];
      
      birthDateContext = `
      Birth Information:
      - Date: ${birth.toDateString()}
      - Time: ${hour !== 12 || minute !== 0 ? birth.toLocaleTimeString() : 'Time not specified'}
      - Chinese Zodiac: ${element} ${zodiacAnimal}
      - Birth Year Element: ${element}
      `;
    }

    const prompt = `
      Based on the user's crypto portfolio and birth information, generate a personalized fortune in the style of BaZi (Chinese Four Pillars of Destiny). Interpret their token holdings as elements of their financial destiny and incorporate their birth date astrology.

      Portfolio: ${tokenSummary}
      Total Portfolio Value: $${totalUsdValue.toFixed(2)}
      
      ${birthDateContext}

      ${birthDate ?
        'Use the birth date information to provide deeper BaZi insights, connecting their zodiac animal and birth element to their crypto portfolio. Explain how their birth chart influences their financial fortune and trading luck.' :
        'Generate a general BaZi-style fortune based on their portfolio.'
      }

      Provide a creative, positive, and insightful fortune, including advice on their crypto future. Keep it engaging and metaphysics-inspired.
    `

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    })

    const fortune = response.choices[0]?.message?.content || 'No fortune generated.'

    return NextResponse.json({ fortune, balances, totalUsdValue })
  } catch (error) {
    console.error('Error generating fortune:', error)
    
    // Handle specific error types
    if (error instanceof Error && error.message === 'Invalid address format') {
      return NextResponse.json({
        error: 'Invalid address format'
      }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}